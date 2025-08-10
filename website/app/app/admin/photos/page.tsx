'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Copy, ExternalLink, Plus, Trash2, Image as ImageIcon, Download, Eye, RefreshCw, ChevronDown, ChevronRight, Folder, FolderOpen } from 'lucide-react'
import { toast } from 'sonner'

type Photo = {
  id: string
  title?: string
  description?: string
  url: string
  thumbnailUrl?: string
  width?: number
  height?: number
  albumId: string
}

type SharedAlbum = {
  id: string
  title: string
  shareUrl: string
  description?: string
  isPublic: boolean
  photos?: Photo[]
}

export default function PhotosManagerPage() {
  const { data: session, status } = useSession()

  if (status === 'loading') return null
  if (!session) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-2xl mx-auto py-16 text-center text-white">
          <Card className="bg-white/15 backdrop-blur-sm border-white/30 shadow-lg">
            <CardContent className="p-8">
              <h1 className="text-2xl font-bold mb-2 text-white drop-shadow-md">Admin: Photos</h1>
              <p className="text-white/90 font-medium">Please log in with your AAA-SJ account to access this page.</p>
              <div className="mt-6">
                <Link href="/">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-md">Back to Home</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return <PhotosManager />
}

function PhotosManager() {
  const [albums, setAlbums] = useState<SharedAlbum[]>([])
  const [loading, setLoading] = useState(false)
  const [newAlbum, setNewAlbum] = useState({
    title: '',
    shareUrl: '',
    description: '',
    isPublic: false,
    fetchPhotos: false
  })
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set())
  const [expandedAlbums, setExpandedAlbums] = useState<Set<string>>(new Set())
  const [refreshingAlbums, setRefreshingAlbums] = useState<Set<string>>(new Set())

  const fetchAlbums = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/photos/albums')
      if (!res.ok) throw new Error('Failed to load albums')
      const data = await res.json()
      setAlbums(data.albums || [])
    } catch (e) {
      console.error('Failed to load albums:', e)
      toast.error('Failed to load albums')
    } finally {
      setLoading(false)
    }
  }

  const addAlbum = async () => {
    if (!newAlbum.title.trim() || !newAlbum.shareUrl.trim()) {
      toast.error('Please fill in both title and share URL')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/photos/albums', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAlbum)
      })

      if (!res.ok) throw new Error('Failed to add album')
      
      const data = await res.json()
      setAlbums([...albums, data.album])
      setNewAlbum({ title: '', shareUrl: '', description: '', isPublic: false, fetchPhotos: false })
      toast.success('Album added successfully!')
    } catch (e) {
      console.error('Failed to add album:', e)
      toast.error('Failed to add album')
    } finally {
      setLoading(false)
    }
  }

  const fetchPhotosForAlbum = async (albumId: string) => {
    setRefreshingAlbums(prev => new Set(prev).add(albumId))
    try {
      const res = await fetch('/api/photos/albums', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ albumId, action: 'fetchPhotos' })
      })

      if (!res.ok) throw new Error('Failed to fetch photos')
      
      const data = await res.json()
      setAlbums(albums.map(a => a.id === albumId ? data.album : a))
      
      // Clear any selected photos from this album since they might have changed
      const updatedAlbum = data.album
      if (updatedAlbum.photos) {
        const newSelected = new Set(selectedPhotos)
        updatedAlbum.photos.forEach((photo: Photo) => {
          newSelected.delete(photo.id)
        })
        setSelectedPhotos(newSelected)
      }
      
      // Auto-expand the album when photos are fetched
      setExpandedAlbums(prev => new Set(prev).add(albumId))
      
      toast.success(`Refreshed ${data.album.photos?.length || 0} photos`)
    } catch (e) {
      console.error('Failed to fetch photos:', e)
      toast.error('Failed to fetch photos')
    } finally {
      setRefreshingAlbums(prev => {
        const newSet = new Set(prev)
        newSet.delete(albumId)
        return newSet
      })
    }
  }

  const debugAlbum = async (albumId: string) => {
    const album = albums.find(a => a.id === albumId)
    if (!album) return

    try {
      const res = await fetch('/api/photos/debug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shareUrl: album.shareUrl })
      })

      if (!res.ok) throw new Error('Failed to debug album')
      
      const data = await res.json()
      console.log('Debug results:', data)
      
      // Show debug info in a toast
      const photoCount = data.patterns.reduce((sum: number, p: any) => sum + p.matches, 0)
      toast.success(`Debug: Found ${photoCount} potential photos across ${data.patterns.length} patterns`)
      
      // Also log to console for detailed inspection
      console.log('Detailed debug info:', JSON.stringify(data, null, 2))
    } catch (e) {
      console.error('Failed to debug album:', e)
      toast.error('Failed to debug album')
    }
  }

  const deleteAlbum = async (id: string) => {
    if (!confirm('Are you sure you want to delete this album?')) return

    setLoading(true)
    try {
      const res = await fetch(`/api/photos/albums?id=${id}`, {
        method: 'DELETE'
      })

      if (!res.ok) throw new Error('Failed to delete album')
      
      setAlbums(albums.filter(a => a.id !== id))
      setExpandedAlbums(prev => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
      toast.success('Album deleted')
    } catch (e) {
      console.error('Failed to delete album:', e)
      toast.error('Failed to delete album')
    } finally {
      setLoading(false)
    }
  }

  const copyPhotoUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    toast.success('Photo URL copied to clipboard!')
  }

  const copyShareUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    toast.success('Share URL copied to clipboard!')
  }

  const openAlbum = (url: string) => {
    window.open(url, '_blank', 'noreferrer')
  }

  const openPhoto = (url: string) => {
    window.open(url, '_blank', 'noreferrer')
  }

  const togglePhotoSelection = (photoId: string) => {
    const newSelected = new Set(selectedPhotos)
    if (newSelected.has(photoId)) {
      newSelected.delete(photoId)
    } else {
      newSelected.add(photoId)
    }
    setSelectedPhotos(newSelected)
  }

  const copySelectedPhotoUrls = () => {
    const selectedUrls = albums
      .flatMap(album => album.photos || [])
      .filter(photo => selectedPhotos.has(photo.id))
      .map(photo => photo.url)
      .join('\n')
    
    if (selectedUrls) {
      navigator.clipboard.writeText(selectedUrls)
      toast.success(`Copied ${selectedPhotos.size} photo URLs to clipboard!`)
    }
  }

  const clearSelection = () => {
    setSelectedPhotos(new Set())
  }

  const toggleAlbumExpansion = (albumId: string) => {
    setExpandedAlbums(prev => {
      const newSet = new Set(prev)
      if (newSet.has(albumId)) {
        newSet.delete(albumId)
      } else {
        newSet.add(albumId)
      }
      return newSet
    })
  }

  useEffect(() => {
    fetchAlbums()
  }, [])

  return (
    <div className="min-h-screen pt-20 px-4 text-white">
      <div className="max-w-7xl mx-auto py-12">
        <h1 className="text-3xl font-bold mb-6 text-white drop-shadow-lg">Photos Manager</h1>
        <p className="mb-6 text-white/90 font-medium">Manage shared Google Photos albums and individual photos for the website</p>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white/15 backdrop-blur-sm border-white/30 shadow-lg">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4 text-white drop-shadow-md">Add Shared Album</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1 text-white">Album Title *</label>
                  <Input 
                    value={newAlbum.title} 
                    onChange={(e) => setNewAlbum({...newAlbum, title: e.target.value})} 
                    placeholder="e.g., 2024 AAPI Festival" 
                    className="bg-white/95 text-black font-medium border-white/30 focus:border-white/50" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-white">Google Photos Share URL *</label>
                  <Input 
                    value={newAlbum.shareUrl} 
                    onChange={(e) => setNewAlbum({...newAlbum, shareUrl: e.target.value})} 
                    placeholder="https://photos.app.goo.gl/..." 
                    className="bg-white/95 text-black font-medium border-white/30 focus:border-white/50" 
                  />
                  <p className="text-xs text-white/80 mt-1 font-medium">
                    Get this from Google Photos: Share album → Copy link
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-white">Description (optional)</label>
                  <Textarea 
                    value={newAlbum.description} 
                    onChange={(e) => setNewAlbum({...newAlbum, description: e.target.value})} 
                    placeholder="Brief description of the album" 
                    className="bg-white/95 text-black font-medium border-white/30 focus:border-white/50" 
                    rows={2}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="isPublic"
                    checked={newAlbum.isPublic} 
                    onChange={(e) => setNewAlbum({...newAlbum, isPublic: e.target.checked})} 
                    className="rounded border-white/30 focus:ring-white/50"
                  />
                  <label htmlFor="isPublic" className="text-sm text-white font-medium">Show on public website</label>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="fetchPhotos"
                    checked={newAlbum.fetchPhotos} 
                    onChange={(e) => setNewAlbum({...newAlbum, fetchPhotos: e.target.checked})} 
                    className="rounded border-white/30 focus:ring-white/50"
                  />
                  <label htmlFor="fetchPhotos" className="text-sm text-white font-medium">Fetch photos from album</label>
                </div>
                <Button 
                  onClick={addAlbum}
                  disabled={loading}
                  className="bg-orange-500 hover:bg-orange-600 text-white w-full font-semibold shadow-md"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {loading ? 'Adding...' : 'Add Album'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/15 backdrop-blur-sm border-white/30 shadow-lg">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4 text-white drop-shadow-md">Instructions</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <h3 className="font-bold text-white mb-1">1. Create a Google Photos Album</h3>
                  <p className="text-white/90 font-medium">Upload photos to Google Photos and create an album</p>
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">2. Share the Album</h3>
                  <p className="text-white/90 font-medium">In Google Photos: Select album → Share → Create link → Copy link</p>
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">3. Add to Website</h3>
                  <p className="text-white/90 font-medium">Paste the share URL above and add a title</p>
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">4. Fetch Photos (Optional)</h3>
                  <p className="text-white/90 font-medium">Check "Fetch photos" to extract individual photo URLs</p>
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">5. Select & Copy Photos</h3>
                  <p className="text-white/90 font-medium">Click photos to select them, then copy URLs for use on other pages</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Selection Actions */}
        {selectedPhotos.size > 0 && (
          <Card className="bg-blue-500/20 backdrop-blur-sm border-blue-400/30 shadow-lg mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-white font-semibold">
                    {selectedPhotos.size} photo{selectedPhotos.size !== 1 ? 's' : ''} selected
                  </span>
                  <Button
                    size="sm"
                    onClick={copySelectedPhotoUrls}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy URLs
                  </Button>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={clearSelection}
                  className="text-white border-white/30 hover:bg-white/20"
                >
                  Clear Selection
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {albums.map((album) => {
            const isExpanded = expandedAlbums.has(album.id)
            const isRefreshing = refreshingAlbums.has(album.id)
            const hasPhotos = album.photos && album.photos.length > 0
            
            return (
              <Card key={album.id} className="bg-white/15 backdrop-blur-sm border-white/30 shadow-lg">
                <CardContent className="p-6">
                  {/* Album Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <button
                          onClick={() => toggleAlbumExpansion(album.id)}
                          className="flex items-center gap-2 text-white hover:text-white/80 transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-5 h-5" />
                          ) : (
                            <ChevronRight className="w-5 h-5" />
                          )}
                          {isExpanded ? (
                            <FolderOpen className="w-5 h-5 text-blue-400" />
                          ) : (
                            <Folder className="w-5 h-5 text-blue-400" />
                          )}
                          <h3 className="text-xl font-bold text-white drop-shadow-sm">{album.title}</h3>
                        </button>
                        {album.isPublic && (
                          <Badge variant="secondary" className="bg-green-500/30 text-green-100 font-semibold text-xs border border-green-400/30">
                            Public
                          </Badge>
                        )}
                        {hasPhotos && (
                          <Badge variant="secondary" className="bg-blue-500/30 text-blue-100 font-semibold text-xs border border-blue-400/30">
                            {album.photos!.length} photos
                          </Badge>
                        )}
                        {album.photos && album.photos.length >= 30 && (
                          <Badge variant="secondary" className="bg-orange-500/30 text-orange-100 font-semibold text-xs border border-orange-400/30">
                            Large Album
                          </Badge>
                        )}
                      </div>
                      {album.description && (
                        <p className="text-white/90 text-sm mb-2 font-medium ml-7">{album.description}</p>
                      )}
                      <div className="flex items-center gap-2 ml-7">
                        <p className="text-xs text-white/70 font-mono break-all">{album.shareUrl}</p>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => copyShareUrl(album.shareUrl)}
                          className="bg-blue-600 hover:bg-blue-700 text-white border-blue-500 hover:border-blue-600 font-medium shadow-md"
                          title="Copy album link"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => openAlbum(album.shareUrl)}
                        className="bg-white hover:bg-gray-50 text-gray-800 border-gray-300 hover:border-gray-400 font-medium shadow-sm"
                        title="Open in Google Photos"
                      >
                        <ExternalLink className="w-4 h-4 text-gray-700" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => fetchPhotosForAlbum(album.id)}
                        disabled={isRefreshing}
                        className="text-blue-300 border-blue-400/30 hover:bg-blue-400/20 font-medium"
                        title={hasPhotos ? "Refresh photos" : "Fetch photos"}
                      >
                        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => debugAlbum(album.id)}
                        className="text-purple-300 border-purple-400/30 hover:bg-purple-400/20 font-medium"
                        title="Debug photo extraction patterns"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => deleteAlbum(album.id)}
                        disabled={loading}
                        className="text-red-300 border-red-400/30 hover:bg-red-400/20 font-medium"
                        title="Delete album"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Photos Grid - Only show when expanded */}
                  {isExpanded && hasPhotos && (
                    <div className="mt-6 ml-7">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-lg font-semibold text-white">Photos ({album.photos!.length})</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-white/60">Click photos to select them</span>
                          {isRefreshing && (
                            <div className="flex items-center gap-1 text-blue-300 text-xs">
                              <RefreshCw className="w-3 h-3 animate-spin" />
                              <span>Refreshing...</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-white/80 mb-3">Click photos to select them, then copy URLs for use on other pages</p>
                      {album.photos && album.photos.length >= 30 && (
                        <div className="mb-3 p-3 bg-orange-500/20 border border-orange-400/30 rounded-lg">
                          <p className="text-orange-100 text-sm font-medium">
                            <span className="font-bold">Large Album Notice:</span> Google Photos loads photos dynamically as you scroll. 
                            This extraction shows the initially loaded photos ({album.photos.length}). 
                            The actual album may contain many more photos that are loaded on-demand.
                          </p>
                        </div>
                      )}
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {album.photos!.map((photo) => {
                          const isSelected = selectedPhotos.has(photo.id)
                          return (
                            <div 
                              key={photo.id} 
                              className={`group relative bg-white/10 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                                isSelected 
                                  ? 'border-blue-400 bg-blue-500/20' 
                                  : 'border-white/20 hover:border-white/40'
                              }`}
                              onClick={() => togglePhotoSelection(photo.id)}
                            >
                              <img 
                                src={photo.thumbnailUrl || photo.url} 
                                alt={photo.title || 'Photo'} 
                                className="w-full h-24 object-cover"
                              />
                              <div className={`absolute inset-0 transition-opacity flex items-center justify-center gap-1 ${
                                isSelected ? 'bg-blue-500/60 opacity-100' : 'bg-black/60 opacity-0 group-hover:opacity-100'
                              }`}>
                                {isSelected ? (
                                  <div className="text-white text-xs font-bold">SELECTED</div>
                                ) : (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        copyPhotoUrl(photo.url)
                                      }}
                                      className="bg-gray-800 hover:bg-gray-700 text-white border-gray-600 hover:border-gray-500 text-xs p-1 shadow-lg"
                                    >
                                      <Copy className="w-3 h-3 text-white" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        openPhoto(photo.url)
                                      }}
                                      className="bg-gray-800 hover:bg-gray-700 text-white border-gray-600 hover:border-gray-500 text-xs p-1 shadow-lg"
                                    >
                                      <Eye className="w-3 h-3 text-white" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Empty state when expanded but no photos */}
                  {isExpanded && !hasPhotos && (
                    <div className="mt-6 ml-7 text-center py-8">
                      <ImageIcon className="w-12 h-12 text-white/50 mx-auto mb-3" />
                      <p className="text-white/80 font-medium">No photos in this album</p>
                      <p className="text-white/60 text-sm mt-1">Click the refresh button to fetch photos from Google Photos</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {albums.length === 0 && !loading && (
          <Card className="bg-white/15 backdrop-blur-sm border-white/30 shadow-lg">
            <CardContent className="p-6">
              <p className="text-white/90 text-center py-8 font-medium">No albums added yet. Add your first shared album above.</p>
            </CardContent>
          </Card>
        )}

        {albums.length > 0 && (
          <Card className="bg-white/15 backdrop-blur-sm border-white/30 shadow-lg mt-6">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4 text-white drop-shadow-md">Photo Integration Examples</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-white mb-2">Individual Photo Usage</h3>
                  <p className="text-white/90 text-sm mb-2 font-medium">Use individual photo URLs on other pages:</p>
                  <code className="block bg-black/40 p-2 rounded text-sm font-mono text-white/90 border border-white/20">
                    &lt;img src="[PHOTO_URL]" alt="Event Photo" className="w-full h-64 object-cover" /&gt;
                  </code>
                </div>
                <div>
                  <h3 className="font-bold text-white mb-2">Photo Gallery Component</h3>
                  <p className="text-white/90 text-sm mb-2 font-medium">Create a photo gallery with multiple photos:</p>
                  <code className="block bg-black/40 p-2 rounded text-sm font-mono text-white/90 border border-white/20">
                    &lt;div className="grid grid-cols-3 gap-4"&gt;<br/>
                    &nbsp;&nbsp;&lt;img src="[PHOTO_URL_1]" alt="Photo 1" /&gt;<br/>
                    &nbsp;&nbsp;&lt;img src="[PHOTO_URL_2]" alt="Photo 2" /&gt;<br/>
                    &nbsp;&nbsp;&lt;img src="[PHOTO_URL_3]" alt="Photo 3" /&gt;<br/>
                    &lt;/div&gt;
                  </code>
                </div>
                <div>
                  <h3 className="font-bold text-white mb-2">Direct Album Link</h3>
                  <p className="text-white/90 text-sm mb-2 font-medium">Link to the full album:</p>
                  <code className="block bg-black/40 p-2 rounded text-sm font-mono text-white/90 border border-white/20">
                    &lt;a href="[SHARE_URL]" target="_blank"&gt;View All Photos&lt;/a&gt;
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}


