# Placeholder Assets

Replace these files 1:1 with your real assets. Keep the same filenames, or update
the `src` references in `index.html` and `js/main.js`.

## Images

| Placeholder file           | Section          | Dimensions     | What to replace with                        |
|---------------------------|------------------|----------------|---------------------------------------------|
| `hero-placeholder.jpg`    | Hero (§4.1)      | 1920 × 900     | Full-width hero photo/render of your product |
| `thumb-1-placeholder.jpg` | Hero thumbs      | 400 × 300      | Alternate angle 1                            |
| `thumb-2-placeholder.jpg` | Hero thumbs      | 400 × 300      | Alternate angle 2                            |
| `thumb-3-placeholder.jpg` | Hero thumbs      | 400 × 300      | Alternate angle 3                            |
| `software-screenshot-placeholder.png` | Software (§4.2) | 800 × 500 | Screenshot of companion app              |
| `pcb-annotated-placeholder.jpg` | PCB (§4.4)  | 1200 × 800     | Annotated close-up of your PCB               |

> **Currently**: All images are loaded via `https://picsum.photos/seed/<name>/<w>/<h>`
> URLs in `index.html`, so no local image files exist. To use local images, download
> or create your real assets, place them here, and update the `src` attributes.

## 3D Models

| Placeholder model           | Section           | What to replace with                      |
|-----------------------------|-------------------|-------------------------------------------|
| `assembled-placeholder.glb` | Design (§4.3)    | Your assembled product model               |
| `exploded-placeholder.glb`  | Design (§4.3)    | Your exploded/internals model              |
| `pcb-placeholder.glb`       | PCB (§4.4)       | Your PCB/circuit board model               |

> **Currently**: Models are loaded via CDN URLs from Google's model-viewer sample set:
> - Assembled: `https://modelviewer.dev/shared-assets/models/Astronaut.glb`
> - Exploded: `https://modelviewer.dev/shared-assets/models/RobotExpressive.glb`
> - PCB: `https://modelviewer.dev/shared-assets/models/Horse.glb`
>
> To use local models, export your `.glb` files, place them in this folder, and update
> the `src` URLs in `js/main.js` (the `PLACEHOLDER_MODELS` object).

## Quick swap checklist
1. Export your real assets
2. Place them in this folder (or `/assets/user/`)
3. Update paths in `js/main.js` → `PLACEHOLDER_MODELS` and `FALLBACK_IMAGES`
4. Update `<img src="...">` in `index.html` for images
5. Done — no other code changes needed
