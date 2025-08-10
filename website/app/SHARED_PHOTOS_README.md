# Shared Photos System

This system allows you to display Google Photos albums on your website without requiring OAuth API access. It uses shared album links instead of the Google Photos API.

## How It Works

1. **Create a Google Photos Album**: Upload photos to Google Photos and create an album
2. **Share the Album**: In Google Photos, select the album → Share → Create link → Copy the link
3. **Add to Website**: Use the admin interface to add the shared album link
4. **Display on Website**: The photos appear on your public website

## Admin Interface

Visit `/admin/photos` to manage shared albums:

- **Add Album**: Enter the album title and Google Photos share URL
- **Set Public**: Check "Show on public website" to display on the homepage
- **Manage**: Copy links, open albums, or delete albums

## Public Display

Public albums automatically appear on the homepage in the "Community Photos" section. Users can click to view the full album in Google Photos.

## Benefits

- ✅ No OAuth API setup required
- ✅ No Google Cloud project configuration needed
- ✅ Simple shared links work immediately
- ✅ Photos stay in Google Photos (no local storage)
- ✅ Easy to manage and update
- ✅ Works with any Google Photos album

## Example Usage

1. Create an album in Google Photos called "2024 AAPI Festival"
2. Share it and get a link like: `https://photos.app.goo.gl/abc123...`
3. In admin: Add title "2024 AAPI Festival", paste the share URL, check "Public"
4. The album appears on the homepage automatically

## Technical Details

- Albums are stored in `app/data/shared-albums.json`
- Admin interface at `/admin/photos`
- Public display component: `components/shared-photos.tsx`
- API endpoints: `/api/photos/albums`

## Alternative Integration Options

You can also:

1. **Direct Link**: `<a href="[SHARE_URL]" target="_blank">View Photos</a>`
2. **Embed Album**: `<iframe src="[SHARE_URL]/embed" width="100%" height="400"></iframe>`
3. **Custom Component**: Create your own React component to display photos

This approach completely bypasses the OAuth scope issues you were experiencing with the Google Photos API.
