'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Image as ImageIcon, Eye } from 'lucide-react'

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

export default function SharedPhotos() {
  const [albums, setAlbums] = useState<SharedAlbum[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAlbum, setSelectedAlbum] = useState<SharedAlbum | null>(null)

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const res = await fetch('/api/photos/albums')
        if (res.ok) {
          const data = await res.json()
          const publicAlbums = (data.albums || []).filter((album: SharedAlbum) => album.isPublic)
          setAlbums(publicAlbums)
        }
      } catch (e) {
        console.error('Failed to load albums:', e)
      } finally {
        setLoading(false)
      }
    }

    fetchAlbums()
  }, [])

  if (loading) {
    return (
      <div className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center text-white font-medium">Loading photos...</div>
        </div>
      </div>
    )
  }

  if (albums.length === 0) {
    return null // Don't show anything if no public albums
  }

  return (
    <section className="py-16 bg-gradient-to-b from-blue-900/50 to-blue-800/50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">
            Community <span className="gradient-text">Photos</span>
          </h2>
          <p className="text-xl text-white font-medium max-w-2xl mx-auto drop-shadow-md">
            Relive our community events and celebrations through shared photos
          </p>
        </div>

        {/* Album Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {albums.map((album) => (
            <Card key={album.id} className="bg-white/15 backdrop-blur-sm border-white/30 hover:bg-white/20 transition-colors shadow-lg cursor-pointer" onClick={() => setSelectedAlbum(album)}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-white text-lg font-bold line-clamp-2 drop-shadow-md">
                    {album.title}
                  </CardTitle>
                  <div className="flex gap-1">
                    <Badge variant="secondary" className="bg-green-500/30 text-green-100 font-semibold text-xs border border-green-400/30">
                      Photos
                    </Badge>
                    {album.photos && album.photos.length > 0 && (
                      <Badge variant="secondary" className="bg-blue-500/30 text-blue-100 font-semibold text-xs border border-blue-400/30">
                        {album.photos.length}
                      </Badge>
                    )}
                  </div>
                </div>
                {album.description && (
                  <p className="text-white/90 text-sm line-clamp-2 font-medium">
                    {album.description}
                  </p>
                )}
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white/80 text-sm font-medium">
                    <ImageIcon className="w-4 h-4" />
                    <span>Google Photos Album</span>
                  </div>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(album.shareUrl, '_blank', 'noreferrer')
                    }}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-md"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Photo Gallery Modal */}
        {selectedAlbum && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white/15 backdrop-blur-md border border-white/30 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white drop-shadow-md">{selectedAlbum.title}</h3>
                    {selectedAlbum.description && (
                      <p className="text-white/90 font-medium mt-1">{selectedAlbum.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => window.open(selectedAlbum.shareUrl, '_blank', 'noreferrer')}
                      className="bg-orange-500 hover:bg-orange-600 text-white font-semibold"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      View Full Album
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedAlbum(null)}
                      className="text-white border-white/30 hover:bg-white/20"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                {selectedAlbum.photos && selectedAlbum.photos.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {selectedAlbum.photos.map((photo) => (
                      <div key={photo.id} className="group relative bg-white/10 rounded-lg overflow-hidden border border-white/20">
                        <img 
                          src={photo.thumbnailUrl || photo.url} 
                          alt={photo.title || 'Photo'} 
                          className="w-full h-32 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(photo.url, '_blank', 'noreferrer')}
                            className="text-white border-white/30 hover:bg-white/20"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ImageIcon className="w-16 h-16 text-white/50 mx-auto mb-4" />
                    <p className="text-white/80 font-medium">No photos available in this album</p>
                    <p className="text-white/60 text-sm mt-2">Click "View Full Album" to see all photos in Google Photos</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="text-center mt-8">
          <p className="text-white/80 text-sm font-medium">
            Want to share your photos? Contact us to add your album to our community gallery.
          </p>
        </div>
      </div>
    </section>
  )
}
