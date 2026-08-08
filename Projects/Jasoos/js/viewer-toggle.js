/**
 * viewer-toggle.js
 * Shared logic for assembled↔exploded model toggle.
 * Used by the industrial design section.
 */

/**
 * Initialize a viewer toggle system for a given section.
 * @param {Object} config
 * @param {HTMLElement} config.container - The viewer container element
 * @param {HTMLElement} config.primaryViewer - The primary model-viewer element
 * @param {HTMLElement} config.overlayViewer - The overlay model-viewer element (for crossfade)
 * @param {string} config.assembledSrc - URL/path to assembled .glb
 * @param {string} config.explodedSrc - URL/path to exploded .glb
 * @param {string} config.fallbackImage - URL/path to fallback static image
 * @param {HTMLElement} [config.loadingIndicator] - Optional loading spinner element
 */
export function createViewerToggle(config) {
    const {
        container,
        primaryViewer,
        overlayViewer,
        assembledSrc,
        explodedSrc,
        fallbackImage,
        loadingIndicator
    } = config;

    let currentModel = 'assembled'; // 'assembled' | 'exploded'
    let isTransitioning = false;

    /**
     * Toggle between assembled and exploded models with crossfade.
     */
    function toggleModel(targetModel) {
        if (isTransitioning) return;
        if (targetModel === currentModel) return;

        isTransitioning = true;
        const newSrc = targetModel === 'assembled' ? assembledSrc : explodedSrc;

        // Show loading
        if (loadingIndicator) loadingIndicator.classList.add('active');

        // Preload the new model in the overlay viewer
        overlayViewer.src = newSrc;

        const onLoad = () => {
            overlayViewer.removeEventListener('load', onLoad);

            // Apply wider orbit for exploded model (camera pull-back per §2f)
            if (targetModel === 'exploded') {
                overlayViewer.cameraOrbit = '-15deg 75deg 145%';
            }

            // Crossfade: show overlay, hide primary
            overlayViewer.classList.add('visible');
            primaryViewer.classList.add('hidden');

            // After transition, swap roles — timeout matches --reveal-duration: 0.7s
            setTimeout(() => {
                primaryViewer.src = newSrc;

                const onPrimaryLoad = () => {
                    primaryViewer.removeEventListener('load', onPrimaryLoad);
                    primaryViewer.classList.remove('hidden');
                    overlayViewer.classList.remove('visible');
                    overlayViewer.src = '';
                    currentModel = targetModel;
                    isTransitioning = false;
                    if (loadingIndicator) loadingIndicator.classList.remove('active');
                };

                primaryViewer.addEventListener('load', onPrimaryLoad);
            }, 700); // matches --reveal-duration: 0.7s
        };

        overlayViewer.addEventListener('load', onLoad);
    }

    /**
     * Get current state
     */
    function getState() {
        return { currentModel };
    }

    /**
     * Set model via scroll progress (0 = assembled, 1 = exploded).
     * Used by scroll choreography.
     */
    function setModelByProgress(progress) {
        if (progress > 0.5 && currentModel === 'assembled') {
            toggleModel('exploded');
        } else if (progress <= 0.5 && currentModel === 'exploded') {
            toggleModel('assembled');
        }
    }

    return {
        toggleModel,
        getState,
        setModelByProgress
    };
}
