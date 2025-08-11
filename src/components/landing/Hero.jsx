import { useEffect } from 'react';

const Hero = () => {
  useEffect(() => {
    if (window.particlesJS) {
      window.particlesJS('particles-js', {
        particles: {
          number: {
            value: 100,
            density: { enable: true, value_area: 800 }
          },
          color: {
            value: ['#00AEEF', '#1E3A8A', '#7DD3FC']
          },
          shape: {
            type: 'circle'
          },
          opacity: {
            value: 0.6,
            random: true,
            animation: {
              enable: true,
              speed: 1,
              opacity_min: 0.1,
              sync: false
            }
          },
          size: {
            value: 3,
            random: true
          },
          line_linked: {
            enable: true,
            distance: 150,
            color: '#1E3A8A',
            opacity: 0.2,
            width: 1
          },
          move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'out',
            bounce: false
          }
        },
        interactivity: {
          detect_on: 'canvas',
          events: {
            onhover: {
              enable: true,
              mode: 'grab'
            },
            onclick: {
              enable: true,
              mode: 'push'
            },
            resize: true
          },
          modes: {
            grab: {
              distance: 140,
              line_linked: {
                opacity: 1
              }
            },
            push: {
              particles_nb: 4
            }
          }
        },
        retina_detect: true
      });
    }
  }, []);

  return (
    <section className="relative min-h-[500px] flex items-center justify-center overflow-hidden bg-white">
      <div id="particles-js" className="absolute inset-0 z-0" />
      <div className="container mx-auto px-4 relative z-10 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          <span className="text-navy-900">TIM DEVELOPERS </span>
          <span className="text-electric-blue">KAMI</span>
        </h1>
        <p className="text-lg md:text-xl text-navy-900 max-w-3xl mx-auto leading-relaxed">
          Kami adalah sekelompok mahasiswa dengan semangat kolaborasi dan keahlian 
          di bidang masing-masing, siap menyelesaikan proyek ini secara maksimal.
        </p>
      </div>
    </section>
  );
};

export default Hero;
