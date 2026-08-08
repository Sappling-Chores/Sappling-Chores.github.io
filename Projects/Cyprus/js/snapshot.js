/**
 * snapshot.js
 * Capture helper for model-viewer's toDataURL().
 * Provides fallback to a pre-rendered image if toDataURL() fails.
 */

/**
 * Capture a snapshot of the model-viewer's current view.
 * @param {HTMLElement} modelViewer - The model-viewer element
 * @param {string} fallbackImageSrc - URL/path to a fallback image
 * @returns {string} Data URL of the captured snapshot, or the fallback src
 */
export function captureSnapshot(modelViewer, fallbackImageSrc) {
    try {
        if (modelViewer && typeof modelViewer.toDataURL === 'function') {
            const dataUrl = modelViewer.toDataURL('image/png');
            if (dataUrl && dataUrl.length > 100) {
                return dataUrl;
            }
        }
    } catch (e) {
        console.warn('[snapshot] toDataURL() failed, using fallback:', e.message);
    }
    return fallbackImageSrc || '';
}
