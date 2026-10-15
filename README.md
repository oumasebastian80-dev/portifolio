# SebastianTech Portfolio

React + Vite portfolio: hero, work, skills and contact, with a Three.js scene, a 3D logo and scroll-driven transitions.

## Run
```bash
npm install
npm run dev      # development
npm run build    # production build in dist/
```
Needs Node.js 20.19+ or 22.12+.

## Personalize (src/data/siteConfig.js)
Set `email`, `phone`, `linkedin` and check each project demo link. Leave an optional URL empty to hide it.

## Add screenshots and videos
1. Copy files into `public/media/` (16:9 works best; images under ~400 KB, MP4 videos under ~10 MB).
2. List them on the project in `siteConfig.js`:
```js
media: [
  { type: 'image', src: '/media/store-home.jpg', alt: 'Store home page' },
  { type: 'video', src: '/media/store-demo.mp4', poster: '/media/store-demo.jpg' },
],
```
With one item it is shown directly; with several, small thumbnails switch between them. Until media is added, a mock preview is shown.

## Deploy
Static site: build command `npm install && npm run build`, publish directory `dist` (Render, Vercel, Netlify).
