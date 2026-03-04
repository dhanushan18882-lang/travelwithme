# Public images for TravelWithMe

Place your real destination photos in this folder and keep the filenames listed below (or update `components/Destinations.tsx` to use your chosen names/paths).

Recommended filenames (already provided as placeholders):

- `sigiriya.jpg` (placeholder: `sigiriya.svg`)
- `ella.jpg` (placeholder: `ella.svg`)
- `jaffna.jpg` (placeholder: `jaffna.svg`)
- `kandy.jpg` (placeholder: `kandy.svg`)
- `galle-fort.jpg` (placeholder: `galle-fort.svg`)
- `nuwara-eliya.jpg` (placeholder: `nuwara-eliya.svg`)
- `yala-national-park.jpg` (placeholder: `yala-national-park.svg`)
- `mirissa.jpg` (placeholder: `mirissa.svg`)

How to use these images in the app:

1. Replace the `.svg` placeholders below with real `.jpg` (or `.png`) files using the same filenames.
2. To make the site load these images, update the `image` fields in `components/Destinations.tsx` to use the public paths, for example:

```ts
// example snippet for components/Destinations.tsx
const destinations = [
  { id: 1, name: 'Sigiriya', image: '/images/sigiriya.jpg', description: 'Ancient rock fortress.', category: 'Heritage' },
  { id: 2, name: 'Ella', image: '/images/ella.jpg', description: 'Scenic hills & tea.', category: 'Nature' },
  // ... and so on
];
```

3. Restart the dev server (or Vite will hot-reload automatically) and visit `http://localhost:3000/`.

Notes:
- Vite serves files from `public/` at the site root, so `/images/...` maps to `public/images/...`.
- Optimize photos for the web (resize/ compress) for best performance.
