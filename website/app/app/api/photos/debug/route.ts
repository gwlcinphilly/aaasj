import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { shareUrl } = body

    if (!shareUrl) {
      return new Response('Missing shareUrl', { status: 400 })
    }

    console.log('Debug: Fetching photos from:', shareUrl)
    
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
      console.log('Debug: Share URL detected, actual URL after redirect:', actualUrl)
      console.log('Debug: Embed URL:', embedUrl)
    } else if (shareUrl.includes('photos.google.com')) {
      // This is already a direct Google Photos URL
      actualUrl = shareUrl
      console.log('Debug: Direct Google Photos URL detected:', actualUrl)
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
          console.log('Debug: Using embed URL, HTML length:', html.length)
        }
      } catch (e) {
        console.log('Debug: Embed URL failed, trying actual URL')
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
          console.log('Debug: Using actual URL, HTML length:', html.length)
        } else {
          return new Response(JSON.stringify({
            error: 'Failed to fetch actual URL',
            status: actualResponse.status,
            statusText: actualResponse.statusText,
            actualUrl
          }), { status: 500 })
        }
      } catch (e) {
        return new Response(JSON.stringify({
          error: 'Failed to fetch any URL',
          message: e instanceof Error ? e.message : String(e),
          actualUrl
        }), { status: 500 })
      }
    }
    
    // Look for various patterns
    const patterns = [
      /https:\/\/lh3\.googleusercontent\.com\/[a-zA-Z0-9_-]+=w\d+-h\d+-c/g,
      /https:\/\/lh3\.googleusercontent\.com\/[a-zA-Z0-9_-]+=w\d+-h\d+-no/g,
      /https:\/\/lh3\.googleusercontent\.com\/[a-zA-Z0-9_-]+=s\d+-p-no/g,
      /https:\/\/lh3\.googleusercontent\.com\/[a-zA-Z0-9_-]+=s\d+-no/g,
      /https:\/\/lh3\.googleusercontent\.com\/[a-zA-Z0-9_-]+(?!\?|=)/g,
      /data-src="(https:\/\/lh3\.googleusercontent\.com\/[^"]+)"/g,
      /src="(https:\/\/lh3\.googleusercontent\.com\/[^"]+)"/g,
      /background-image:\s*url\(['"]?(https:\/\/lh3\.googleusercontent\.com\/[^'"]+)['"]?\)/g
    ]
    
    const results: any = {
      shareUrl,
      actualUrl,
      embedUrl,
      source,
      htmlLength: html.length,
      patterns: []
    }
    
    patterns.forEach((pattern, index) => {
      const matches = html.match(pattern) || []
      results.patterns.push({
        pattern: pattern.source,
        matches: matches.length,
        urls: matches.slice(0, 10) // Show first 10 matches
      })
    })
    
    // Look for JSON data
    const jsonMatches = html.match(/<script[^>]*>.*?(\{.*?"photos".*?\}).*?<\/script>/gs)
    results.jsonMatches = jsonMatches ? jsonMatches.length : 0
    
    // Look for any Google Photos URLs
    const allMatches = html.match(/https:\/\/lh3\.googleusercontent\.com\/[a-zA-Z0-9_-]+/g) || []
    results.allGoogleUrls = allMatches.length
    
    return new Response(JSON.stringify(results, null, 2), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Failed to debug photo extraction',
      message: error instanceof Error ? error.message : String(error)
    }), { status: 500 })
  }
}
