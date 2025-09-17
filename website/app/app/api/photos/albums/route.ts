import { NextRequest } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { requireAuth, optionalAuth } from '@/lib/api-auth'

const ALBUMS_FILE = path.join(process.cwd(), 'app', 'data', 'shared-albums.json')

type SharedAlbum = {
  id: string
  title: string
  shareUrl: string
  description?: string
  isPublic: boolean
  photos?: Photo[]
}

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

async function ensureDataDir() {
  const dataDir = path.dirname(ALBUMS_FILE)
  try {
    await fs.mkdir(dataDir, { recursive: true })
  } catch {}
}

async function readAlbums(): Promise<SharedAlbum[]> {
  try {
    await ensureDataDir()
    const data = await fs.readFile(ALBUMS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function writeAlbums(albums: SharedAlbum[]) {
  await ensureDataDir()
  await fs.writeFile(ALBUMS_FILE, JSON.stringify(albums, null, 2))
}

// Function to extract photos from a shared album URL
async function fetchPhotosFromAlbum(shareUrl: string): Promise<Photo[]> {
  try {
    console.log('Fetching photos from:', shareUrl)
    
    // Determine if this is a share URL or direct Google Photos URL
    let actualUrl = shareUrl
    let embedUrl = ''
    
    if (shareUrl.includes('photos.app.goo.gl')) {
      // This is a share URL, follow the redirect
      const redirectResponse = await fetch(shareUrl, {
        redirect: 'follow',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      })
      
      actualUrl = redirectResponse.url
      embedUrl = shareUrl.replace('/share/', '/embed/')
      console.log('Share URL detected, actual URL after redirect:', actualUrl)
      console.log('Embed URL:', embedUrl)
    } else if (shareUrl.includes('photos.google.com')) {
      // This is already a direct Google Photos URL
      actualUrl = shareUrl
      console.log('Direct Google Photos URL detected:', actualUrl)
    }
    
    // Try to fetch the page content
    let html = ''
    let source = ''
    
    // First try the embed URL if available
    if (embedUrl) {
      try {
        const embedResponse = await fetch(embedUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        })
        
        if (embedResponse.ok) {
          html = await embedResponse.text()
          source = 'embed'
          console.log('Using embed URL, HTML length:', html.length)
        }
      } catch (e) {
        console.log('Embed URL failed, trying actual URL')
      }
    }
    
    // If embed failed or not available, try the actual URL
    if (!html) {
      try {
        const actualResponse = await fetch(actualUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        })
        
        if (actualResponse.ok) {
          html = await actualResponse.text()
          source = 'actual'
          console.log('Using actual URL, HTML length:', html.length)
        } else {
          console.error('Failed to fetch actual URL:', actualResponse.status, actualResponse.statusText)
        }
      } catch (e) {
        console.log('Actual URL also failed:', e)
      }
    }
    
    if (!html) {
      console.error('Failed to fetch any page')
      return []
    }
    
    // Extract photo data from the page
    const photos: Photo[] = []
    const seenUrls = new Set<string>()
    
    // Method 1: Extract all img src URLs and process them properly
    console.log('Extracting photos from img src attributes...')
    const imgPattern = /<img[^>]*src=["'](https:\/\/lh3\.googleusercontent\.com\/[^"']+)["'][^>]*>/g
    const imgMatches = html.match(imgPattern) || []
    console.log(`Found ${imgMatches.length} img tags with Google Photos URLs`)
    
    // Process all img matches (no limit for large albums)
    imgMatches.forEach((imgTag, index) => {
      const urlMatch = imgTag.match(/src=["'](https:\/\/lh3\.googleusercontent\.com\/[^"']+)["']/)
      if (urlMatch) {
        const url = urlMatch[1]
        
        // Skip avatar/icon URLs (they have =s32-p-no pattern)
        if (url.includes('=s32-p-no')) {
          console.log('Skipping avatar URL:', url)
          return
        }
        
        console.log(`Processing img URL ${index + 1}:`, url)
        
        // Extract the photo ID from the URL
        const photoIdMatch = url.match(/\/pw\/([^=]+)/)
        if (photoIdMatch) {
          const photoId = photoIdMatch[1]
          console.log(`Extracted photo ID: ${photoId}`)
          
          if (!seenUrls.has(photoId)) {
            seenUrls.add(photoId)
            
            // Create proper thumbnail and viewer URLs using the full photo ID
            const baseUrl = `https://lh3.googleusercontent.com/pw/${photoId}`
            const thumbnailUrl = `${baseUrl}=w300-h300-c`
            const viewerUrl = `${baseUrl}=w1200-h800-c`
            
            console.log(`Adding photo ${photos.length + 1}:`, {
              id: photoId,
              thumbnailUrl,
              viewerUrl
            })
            
            photos.push({
              id: `photo_${Date.now()}_${photos.length}`,
              url: viewerUrl,
              thumbnailUrl: thumbnailUrl,
              albumId: shareUrl,
              width: 800,
              height: 600
            })
          } else {
            console.log(`Skipping duplicate photo ID: ${photoId}`)
          }
        } else {
          console.log(`Could not extract photo ID from URL: ${url}`)
        }
      }
    })
    
    // Method 2: Look for photo data in script tags (ALWAYS run this for large albums)
    console.log('Looking for photo data in script tags...')
    const scriptPattern = /<script[^>]*>.*?(\{.*?"photos".*?\}).*?<\/script>/gs
    const scriptMatches = html.match(scriptPattern) || []
    console.log(`Found ${scriptMatches.length} script tags with potential photo data`)
    
    let totalPhotoCount = 0
    let albumMetadata: any = null
    
    for (const scriptMatch of scriptMatches) {
      try {
        // Extract JSON from script tag
        const jsonMatch = scriptMatch.match(/\{.*?"photos".*?\}/s)
        if (jsonMatch) {
          const jsonStr = jsonMatch[0]
          console.log('Found JSON data:', jsonStr.substring(0, 200) + '...')
          
          const data = JSON.parse(jsonStr)
          
          // Look for album metadata with total photo count
          if (data.album && data.album.mediaItemsCount) {
            totalPhotoCount = data.album.mediaItemsCount
            albumMetadata = data.album
            console.log(`Found album metadata: ${totalPhotoCount} total photos`)
          }
          
          // Look for pagination data
          if (data.pagination && data.pagination.totalItems) {
            totalPhotoCount = data.pagination.totalItems
            console.log(`Found pagination data: ${totalPhotoCount} total photos`)
          }
          
          if (data.photos && Array.isArray(data.photos)) {
            console.log(`Found ${data.photos.length} photos in JSON data`)
            
            // Process ALL photos from JSON (no limit for large albums)
            data.photos.forEach((photo: any, index: number) => {
              if (photo.url && photo.url.startsWith('https://lh3.googleusercontent.com/')) {
                const baseUrl = photo.url.replace(/=w\d+-h\d+-c.*$/, '').replace(/=s\d+.*$/, '')
                
                if (!seenUrls.has(baseUrl)) {
                  seenUrls.add(baseUrl)
                  
                  // Create proper thumbnail and viewer URLs
                  const thumbnailUrl = `${baseUrl}=w300-h300-c`
                  const viewerUrl = `${baseUrl}=w1200-h800-c`
                  
                  photos.push({
                    id: `photo_${Date.now()}_${photos.length}`,
                    url: viewerUrl,
                    thumbnailUrl: thumbnailUrl,
                    albumId: shareUrl,
                    width: photo.width || 800,
                    height: photo.height || 600
                  })
                }
              }
            })
          }
        }
      } catch (e) {
        console.log('Failed to parse script JSON:', e)
      }
    }
    
    // Method 3: Look for additional photo URLs in the HTML (only if we need more)
    if (photos.length < totalPhotoCount && photos.length < 100) {
      console.log('Looking for additional photo URLs in HTML...')
      
      // Look for URLs with various size parameters
      const photoUrlPatterns = [
        /https:\/\/lh3\.googleusercontent\.com\/[a-zA-Z0-9_-]+=w\d+-h\d+-c/g,
        /https:\/\/lh3\.googleusercontent\.com\/[a-zA-Z0-9_-]+=w\d+-h\d+-no/g,
        /https:\/\/lh3\.googleusercontent\.com\/[a-zA-Z0-9_-]+=s\d+-p-no/g,
        /https:\/\/lh3\.googleusercontent\.com\/[a-zA-Z0-9_-]+=s\d+-no/g
      ]
      
      for (const pattern of photoUrlPatterns) {
        const photoMatches = html.match(pattern) || []
        console.log(`Pattern ${pattern.source} found ${photoMatches.length} matches`)
        
        if (photoMatches.length > 0) {
          photoMatches.forEach((url, index) => {
            // Extract the photo ID from the URL
            const photoIdMatch = url.match(/\/pw\/([^=]+)/)
            if (photoIdMatch) {
              const photoId = photoIdMatch[1]
              
              if (!seenUrls.has(photoId)) {
                seenUrls.add(photoId)
                
                // Create proper thumbnail and viewer URLs using the full photo ID
                const baseUrl = `https://lh3.googleusercontent.com/pw/${photoId}`
                const thumbnailUrl = `${baseUrl}=w300-h300-c`
                const viewerUrl = `${baseUrl}=w1200-h800-c`
                
                photos.push({
                  id: `photo_${Date.now()}_${photos.length}`,
                  url: viewerUrl,
                  thumbnailUrl: thumbnailUrl,
                  albumId: shareUrl,
                  width: 800,
                  height: 600
                })
              }
            }
          })
        }
      }
    }
    
    // Method 4: Look for album metadata in other script tags
    if (totalPhotoCount === 0) {
      console.log('Looking for album metadata in other script tags...')
      const metadataPattern = /<script[^>]*>.*?(\{.*?"mediaItemsCount".*?\}).*?<\/script>/gs
      const metadataMatches = html.match(metadataPattern) || []
      
      for (const metadataMatch of metadataMatches) {
        try {
          const jsonMatch = metadataMatch.match(/\{.*?"mediaItemsCount".*?\}/s)
          if (jsonMatch) {
            const data = JSON.parse(jsonMatch[0])
            if (data.mediaItemsCount) {
              totalPhotoCount = data.mediaItemsCount
              console.log(`Found mediaItemsCount: ${totalPhotoCount} total photos`)
            }
          }
        } catch (e) {
          console.log('Failed to parse metadata JSON:', e)
        }
      }
    }
    
    console.log(`Final result: ${photos.length} unique photos extracted from album`)
    if (totalPhotoCount > 0) {
      console.log(`Album metadata indicates ${totalPhotoCount} total photos`)
      if (photos.length < totalPhotoCount) {
        console.log(`Note: Extracted ${photos.length}/${totalPhotoCount} photos. Google Photos loads photos dynamically.`)
      } else {
        console.log(`Successfully extracted all ${totalPhotoCount} photos!`)
      }
    }
    if (photos.length > 0) {
      console.log('Photo URLs:', photos.map(p => p.url))
      console.log('Thumbnail URLs:', photos.map(p => p.thumbnailUrl))
    }
    
    return photos
  } catch (error) {
    console.error('Failed to fetch photos from album:', error)
    return []
  }
}

export const GET = optionalAuth(async (req: NextRequest, user) => {
  try {
    const albums = await readAlbums()
    return Response.json({ albums })
  } catch (error) {
    return new Response('Failed to load albums', { status: 500 })
  }
})

export const POST = requireAuth(async (req: NextRequest, user) => {
  try {
    const body = await req.json()
    const { title, shareUrl, description, isPublic, fetchPhotos = false } = body

    if (!title?.trim() || !shareUrl?.trim()) {
      return new Response('Missing required fields', { status: 400 })
    }

    const albums = await readAlbums()
    const newAlbum: SharedAlbum = {
      id: Date.now().toString(),
      title: title.trim(),
      shareUrl: shareUrl.trim(),
      description: description?.trim() || undefined,
      isPublic: Boolean(isPublic),
      photos: []
    }

    // Optionally fetch photos from the album
    if (fetchPhotos) {
      newAlbum.photos = await fetchPhotosFromAlbum(shareUrl)
    }

    albums.push(newAlbum)
    await writeAlbums(albums)

    return Response.json({ album: newAlbum })
  } catch (error) {
    return new Response('Failed to create album', { status: 500 })
  }
})

export const PUT = requireAuth(async (req: NextRequest, user) => {
  try {
    const body = await req.json()
    const { albumId, action, photoId } = body

    if (!albumId) {
      return new Response('Missing albumId', { status: 400 })
    }

          // Load current albums
      const albums = await readAlbums()
      const albumIndex = albums.findIndex((a: SharedAlbum) => a.id === albumId)

      if (albumIndex === -1) {
        return new Response('Album not found', { status: 404 })
      }

      const album = albums[albumIndex]

      if (action === 'fetchPhotos') {
        console.log(`Fetching photos for album: ${album.title}`)
        
        // Clear existing photos before fetching new ones
        album.photos = []
        console.log('Cleared existing photos')
        
        // Fetch new photos
        const photos = await fetchPhotosFromAlbum(album.shareUrl)
        album.photos = photos
        
        console.log(`Fetched ${photos.length} photos for album: ${album.title}`)
        
        // Save updated albums
        await writeAlbums(albums)
        
        return new Response(JSON.stringify({ album }), {
          headers: { 'Content-Type': 'application/json' }
        })
      } else if (action === 'removePhoto' && photoId) {
        // Remove specific photo
        if (album.photos) {
          album.photos = album.photos.filter((p: Photo) => p.id !== photoId)
          await writeAlbums(albums)
        }
        
        return new Response(JSON.stringify({ album }), {
          headers: { 'Content-Type': 'application/json' }
        })
      } else {
        return new Response('Invalid action', { status: 400 })
      }
  } catch (error) {
    console.error('PUT /api/photos/albums error:', error)
    return new Response('Internal server error', { status: 500 })
  }
})

export const DELETE = requireAuth(async (req: NextRequest, user) => {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return new Response('Missing album ID', { status: 400 })
    }

    const albums = await readAlbums()
    const filtered = albums.filter(album => album.id !== id)
    
    if (filtered.length === albums.length) {
      return new Response('Album not found', { status: 404 })
    }

    await writeAlbums(filtered)
    return new Response(null, { status: 204 })
  } catch (error) {
    return new Response('Failed to delete album', { status: 500 })
  }
})
