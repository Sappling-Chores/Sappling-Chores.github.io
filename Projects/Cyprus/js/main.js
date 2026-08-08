/**
 * main.js
 * Entry point — scroll orchestration, IntersectionObserver wiring,
 * section reveals, theme integration, and mobile detection.
 */

import { createViewerToggle } from './viewer-toggle.js';

// ---- Configuration ----
const PLACEHOLDER_MODELS = {
    assembled: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
    exploded: 'https://modelviewer.dev/shared-assets/models/RobotExpressive.glb',
    pcb: 'https://modelviewer.dev/shared-assets/models/Horse.glb'
};

const FALLBACK_IMAGES = {
    design: 'https://picsum.photos/seed/design-fallback/1200/675',
    pcb: 'https://picsum.photos/seed/pcb-fallback/1200/675'
};

// ---- State ----
let designToggle = null;
let pcbToggle = null;
let isMobile = false;

// ---- Initialization ----
document.addEventListener('DOMContentLoaded', () => {
    detectMobile();
    initThemeIntegration();
    initScrollReveal();
    initDesignSection();
    initPcbSection();
});

// ---- Mobile detection ----
function detectMobile() {
    isMobile = window.matchMedia('(max-width: 768px)').matches ||
               'ontouchstart' in window ||
               navigator.maxTouchPoints > 0;
}

// ---- Theme integration ----
function initThemeIntegration() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.body.classList.contains('dark-mode');
            const next = isDark ? 'light-mode' : 'dark-mode';
            document.body.classList.remove('dark-mode', 'light-mode');
            document.body.classList.add(next);
            localStorage.setItem('theme', next);
        });
    }
    if (!document.body.classList.contains('light-mode') &&
        !document.body.classList.contains('dark-mode')) {
        document.body.classList.add(localStorage.getItem('theme') || 'dark-mode');
    }
}

// ---- Scroll reveal ----
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
}

// ---- Design section (Phase 4) ----
function initDesignSection() {
    const container = document.querySelector('.design-viewer');
    if (!container) return;

    const primaryViewer = container.querySelector('.model-primary');
    const overlayViewer = container.querySelector('.model-overlay');
    const loadingIndicator = container.querySelector('.viewer-loading');

    if (!primaryViewer || !overlayViewer) return;

    designToggle = createViewerToggle({
        container,
        primaryViewer,
        overlayViewer,
        assembledSrc: PLACEHOLDER_MODELS.assembled,
        explodedSrc: PLACEHOLDER_MODELS.exploded,
        fallbackImage: FALLBACK_IMAGES.design,
        loadingIndicator
    });

    // Wire up toggle buttons
    document.querySelectorAll('[data-design-model]').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.designModel;
            designToggle.toggleModel(target);
            // Update active states
            document.querySelectorAll('[data-design-model]').forEach(b =>
                b.classList.toggle('active', b.dataset.designModel === target)
            );
        });
    });

    // Always reset to assembled on page load
    designToggle.toggleModel('assembled');
    document.querySelectorAll('[data-design-model]').forEach(b =>
        b.classList.toggle('active', b.dataset.designModel === 'assembled')
    );
}

// ---- PCB section (Phase 5) ----
function initPcbSection() {
    const container = document.querySelector('.pcb-viewer');
    if (!container) return;

    const primaryViewer = container.querySelector('model-viewer');
    const annotatedOverlay = container.querySelector('.pcb-annotated');

    if (!primaryViewer) return;

    // Wire PCB view toggle (3D ↔ annotated image)
    document.querySelectorAll('[data-pcb-view]').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.pcbView;

            if (target === 'annotated') {
                annotatedOverlay?.classList.add('visible');
            } else {
                annotatedOverlay?.classList.remove('visible');
            }

            document.querySelectorAll('[data-pcb-view]').forEach(b =>
                b.classList.toggle('active', b.dataset.pcbView === target)
            );
        });
    });

    // Wire up PCB accordion
    document.querySelectorAll('.spec-accordion__trigger').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.spec-accordion__item');
            const expanded = btn.getAttribute('aria-expanded') === 'true';
            btn.setAttribute('aria-expanded', String(!expanded));
            item.classList.toggle('open', !expanded);
        });
    });
}




