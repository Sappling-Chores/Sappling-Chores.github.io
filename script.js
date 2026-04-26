(async () => {
  await loadSlim(tsParticles);

  await tsParticles.load({
    id: "tsparticles",
    options: {
      fpsLimit: 60,
      interactivity: {
        events: {
          onClick: { enable: true, mode: "push" },
          onHover: { enable: true, mode: ["grab", "repulse"] },
          resize: true,
        },
        modes: {
          push: { quantity: 4 },
          repulse: { distance: 80, duration: 0.4 },
          grab: { distance: 110, links: { opacity: 0.3 } }
        },
      },
      particles: {
        color: { value: "#ffffff" },
        links: { 
          enable: true, 
          distance: 100, 
          color: "#ffffff", 
          opacity: 0.15, 
          width: 0.5 
        },
        move: {
          direction: "none",
          enable: true,
          outModes: { default: "out" },
          random: false,
          speed: { min: 0.1, max: 0.8 },
          straight: false,
        },
        number: {
          density: { enable: true, width: 400, height: 400 },
          value: 90,
        },
        opacity: {
          value: { min: 0.1, max: 0.6 },
          animation: {
            enable: true,
            speed: 1,
            sync: false,
            mode: "auto",
            startValue: "random",
            destroy: "none",
          },
        },
        shape: { type: "circle" },
        size: {
          value: { min: 0.5, max: 1.5 },
        },
      },
      detectRetina: true,
    }
  });
})();