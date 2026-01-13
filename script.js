/**
 * AETHERIS - Core System
 * Production Refactor: Full Features
 */

const App = {
    // Estado da Aplicação
    state: {
        isMenuOpen: false,
        currentPlanetIndex: 0,
        isAnimatingPlanet: false
    },

    // Dados Completos (Recuperados do original)
    celestialBodies: [
        {
            name: "The Sun",
            label: "SECTOR 00 // STAR",
            desc: "O coração do nosso sistema. Uma anã amarela de classe G2V que contém 99,8% da massa total do sistema solar. A fonte de toda a luz e vida.",
            stat1: "0 KM", label1: "DISTANCE TO CENTER",
            stat2: "5500°C", label2: "SURFACE TEMP",
            image: "img/planetas/planet-sun.jpg"
        },
        {
            name: "Mercury",
            label: "SECTOR 01 // INNER",
            desc: "O menor planeta. Uma rocha queimada pelo Sol, cheia de crateras e sem atmosfera para reter calor. Temperaturas oscilam drasticamente.",
            stat1: "57.9M KM", label1: "FROM SUN",
            stat2: "88 DAYS", label2: "ORBITAL PERIOD",
            image: "img/planetas/planet-mercury.jpg" 
        },
        {
            name: "Venus",
            label: "SECTOR 02 // TOXIC",
            desc: "O gêmeo infernal da Terra. Envolto em nuvens de ácido sulfúrico que prendem o calor num efeito estufa descontrolado.",
            stat1: "108.2M KM", label1: "FROM SUN",
            stat2: "225 DAYS", label2: "ORBITAL PERIOD",
            image: "img/planetas/planet-venus.webp"
        },
        {
            name: "Earth",
            label: "SECTOR 03 // HOME",
            desc: "O berço da humanidade. O único planeta conhecido por abrigar vida, protegido por uma fina camada de atmosfera e um campo magnético vibrante.",
            stat1: "149.6M KM", label1: "FROM SUN",
            stat2: "365 DAYS", label2: "ORBITAL PERIOD",
            image: "img/planetas/planet-earth.jpg"
        },
        {
            name: "The Moon",
            label: "SATELLITE // EARTH",
            desc: "O nosso companheiro constante. A superfície craterada conta a história violenta do sistema solar primitivo. Responsável pelas marés terrestres.",
            stat1: "384k KM", label1: "FROM EARTH",
            stat2: "27 DAYS", label2: "ORBITAL PERIOD",
            image: "img/planetas/planet-moon.webp"
        },
        {
            name: "Mars",
            label: "SECTOR 04 // TARGET",
            desc: "O Planeta Vermelho. Um deserto frio com vulcões extintos e vales profundos. O próximo horizonte para a expansão da consciência humana.",
            stat1: "227.9M KM", label1: "FROM SUN",
            stat2: "687 DAYS", label2: "ORBITAL PERIOD",
            image: "img/planetas/planet-mars.jpg"
        },
        {
            name: "Jupiter",
            label: "SECTOR 05 // GIANT",
            desc: "O rei dos planetas. Um gigante gasoso com uma tempestade maior que a Terra que dura há séculos. O seu campo magnético é colossal.",
            stat1: "778.5M KM", label1: "FROM SUN",
            stat2: "12 YEARS", label2: "ORBITAL PERIOD",
            image: "img/planetas/planet-jupiter.jpg"
        },
        {
            name: "Saturn",
            label: "SECTOR 06 // RINGS",
            desc: "A joia do sistema solar. Famoso pelos seus complexos anéis de gelo e rocha. Um gigante gasoso composto principalmente de hidrogénio e hélio.",
            stat1: "1.4B KM", label1: "FROM SUN",
            stat2: "29 YEARS", label2: "ORBITAL PERIOD",
            image: "img/planetas/planet-saturn.jpg"
        },
        {
            name: "Uranus",
            label: "SECTOR 07 // ICE GIANT",
            desc: "O gigante de gelo que gira de lado. Tem a atmosfera mais fria do sistema solar, com temperaturas a atingir -224°C.",
            stat1: "2.9B KM", label1: "FROM SUN",
            stat2: "84 YEARS", label2: "ORBITAL PERIOD",
            image: "img/planetas/planet-uranus.jpg"
        },
        {
            name: "Neptune",
            label: "SECTOR 08 // WINDY",
            desc: "O planeta mais distante. Escuro, frio e açoitado por ventos supersónicos. Foi o primeiro planeta a ser localizado através de previsões matemáticas.",
            stat1: "4.5B KM", label1: "FROM SUN",
            stat2: "165 YEARS", label2: "ORBITAL PERIOD",
            image: "img/planetas/planet-neptune.jpg"
        }
    ],

    init() {
        this.setupLenis();
        this.setupLoader();
        this.setupGSAP();
        this.setupTelemetry(); // Clock & Status Glitch
        this.setupCarousel();
        this.setupNavigation();
        
        console.log("%c AETHERIS PROTOCOL // INITIALIZED ", "background: #000; color: #00ff00; font-weight: bold; padding: 4px;");
    },

    setupLoader() {
        // Preloader Logic
        window.addEventListener('load', () => {
            const preloader = document.querySelector('.preloader');
            setTimeout(() => {
                if(preloader) preloader.classList.add('hidden');
                // Dispara hero animation se timeline existir
                if (this.heroTimeline) this.heroTimeline.play();
            }, 2000); // 2s delay simulado como no original
        });
    },

    setupLenis() {
        if (typeof Lenis === 'undefined') {
            console.warn("Lenis not loaded.");
            return;
        }

        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            smooth: true
        });

        const raf = (time) => {
            lenis.raf(time);
            requestAnimationFrame(raf);
        };
        requestAnimationFrame(raf);

        // Integração GSAP ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
    },

    setupGSAP() {
        if (typeof gsap === 'undefined') return;
        gsap.registerPlugin(ScrollTrigger);

        // GSAP Context para evitar Memory Leaks
        const mm = gsap.matchMedia();

        mm.add("(min-width: 1px)", () => {
            
            // 1. Hero Entrance (Paused until Loader finishes)
            this.heroTimeline = gsap.timeline({ paused: true });
            this.heroTimeline
                .from('.sys-label', { opacity: 0, y: -20, duration: 1, delay: 0.5 })
                .from('.hero-title', { opacity: 0, scale: 0.9, duration: 1.5, ease: "power2.out" }, "-=0.5")
                .from('.hero-coords', { opacity: 0, y: 20, duration: 1 }, "-=1")
                .from('.ui-layer', { opacity: 0, duration: 2 }, "-=1.5");

            // 2. Hero Parallax Text
            gsap.to('.hero-content', {
                yPercent: 50,
                opacity: 0,
                scrollTrigger: {
                    trigger: '.hero-section',
                    start: "top top",
                    end: "bottom top",
                    scrub: true
                }
            });

            // 3. Video Fade Out
            gsap.to(".bg-wrapper", {
                opacity: 0,
                scrollTrigger: {
                    trigger: ".hero-section",
                    start: "top top",
                    end: "60% top",
                    scrub: true
                }
            });

            // 4. Webb Telescope
            const webbTl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".webb-content",
                    start: "top 75%",
                }
            });
            webbTl.from(".sys-label.gold-theme", { opacity: 0, x: -20, duration: 1 })
                  .from(".webb-title", { y: 50, opacity: 0, duration: 1.2, ease: "power2.out" }, "-=0.8")
                  .from(".webb-body p", { opacity: 0, y: 20, duration: 1 }, "-=0.8")
                  .from(".readout-line", { opacity: 0, x: -20, duration: 0.8, stagger: 0.1 }, "-=0.5");

            // Webb Image Parallax
            gsap.to(".webb-img-inner", {
                yPercent: -20,
                ease: "none",
                scrollTrigger: {
                    trigger: ".webb-section",
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });

            // 5. Gallery Parallax (Desktop Split)
            if (window.innerWidth > 900) {
                gsap.to(".col-left", {
                    yPercent: -20,
                    ease: "none",
                    scrollTrigger: {
                        trigger: ".gallery-section",
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1
                    }
                });
            }

            // 6. Marquee Infinite Scroll
            const marquee = document.querySelector(".marquee-inner");
            if (marquee) {
                const content = marquee.innerHTML;
                marquee.innerHTML = content + content + content; // Clone x3
                gsap.to(".marquee-inner", {
                    xPercent: -50,
                    repeat: -1,
                    duration: 30,
                    ease: "linear"
                });
            }

            // 7. Scroll Line Progress
            gsap.to('.scroll-line', {
                height: '100%',
                ease: 'none',
                scrollTrigger: {
                    trigger: 'body',
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 0.3
                }
            });
        });
    },

    setupTelemetry() {
        const timeEl = document.querySelector('.scrambler');
        const decEl = document.querySelector('.declination-readout'); // Valor da sidebar
        const statusEl = document.querySelector('.status-live');
        const heroDec = document.getElementById('hero-dec');
        const heroRA = document.getElementById('hero-ra');

        // 1. RELÓGIO (Com ms, otimizado)
        const updateClock = () => {
            const now = new Date();
            const h = now.getHours().toString().padStart(2, '0');
            const m = now.getMinutes().toString().padStart(2, '0');
            const s = now.getSeconds().toString().padStart(2, '0');
            const ms = Math.floor(now.getMilliseconds() / 10).toString().padStart(2, '0');
            
            if(timeEl) timeEl.innerHTML = `${h}:${m}:${s}<span style="opacity:0.5; font-size: 0.8em">.${ms}</span>`;
            if(heroRA) heroRA.innerText = `RA ${h}h ${m}m ${s}s`;
            
            requestAnimationFrame(updateClock);
        };
        updateClock();

        // 2. MOUSE TRACKER (Sidebar) - Throttled
        let lastTime = 0;
        document.addEventListener('mousemove', (e) => {
            const now = Date.now();
            if (now - lastTime < 30) return; // Limita execuções
            lastTime = now;

            if (decEl) {
                const yPct = e.clientY / window.innerHeight;
                const degrees = Math.floor((yPct * 180) - 90);
                const minutes = Math.floor((e.clientX / window.innerWidth) * 60);
                const sign = degrees >= 0 ? '+' : '';
                decEl.innerText = `${sign}${degrees}° ${minutes}' 00"`;
            }
        });

        // 3. SCROLL DECLINATION (Hero)
        if(heroDec) {
            ScrollTrigger.create({
                trigger: "body",
                start: "top top",
                end: "bottom bottom",
                onUpdate: (self) => {
                    const deg = 62 - (self.progress * 150);
                    heroDec.innerText = `DEC ${Math.floor(deg)}°`;
                }
            });
        }

        // 4. STATUS GLITCH
        const states = ["STABLE", "LOCKED", "SCANNING", "CALIBRATING", "LINKED"];
        setInterval(() => {
            if(Math.random() > 0.9 && statusEl) {
                const randomState = states[Math.floor(Math.random() * states.length)];
                statusEl.innerText = "///...";
                statusEl.style.color = "#ffff00"; // Amarelo
                setTimeout(() => {
                    statusEl.innerText = randomState;
                    statusEl.style.color = "#00ff00"; // Verde
                }, 200);
            }
        }, 2000);
    },

    setupCarousel() {
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        const counter = document.querySelector('.carousel-counter');
        const img = document.getElementById('active-planet-img');
        
        // Elementos DOM de Texto
        const els = {
            title: document.getElementById('planet-title'),
            desc: document.getElementById('planet-desc'),
            label: document.getElementById('planet-label'),
            stat1: document.getElementById('planet-stat1'),
            stat2: document.getElementById('planet-stat2'),
            l_stat1: document.getElementById('label-stat1'),
            l_stat2: document.getElementById('label-stat2')
        };

        // Função de Atualização
        const updatePlanet = (direction) => {
            if (this.state.isAnimatingPlanet) return;
            this.state.isAnimatingPlanet = true;

            const len = this.celestialBodies.length;
            if (direction === 'next') this.state.currentPlanetIndex = (this.state.currentPlanetIndex + 1) % len;
            else this.state.currentPlanetIndex = (this.state.currentPlanetIndex - 1 + len) % len;

            const body = this.celestialBodies[this.state.currentPlanetIndex];

            // Saída
            const tl = gsap.timeline({
                onComplete: () => {
                    // Troca de Dados
                    els.title.innerText = body.name;
                    els.desc.innerText = body.desc;
                    els.label.innerText = body.label;
                    els.stat1.innerText = body.stat1;
                    els.stat2.innerText = body.stat2;
                    els.l_stat1.innerText = body.label1;
                    els.l_stat2.innerText = body.label2;
                    
                    img.src = body.image;
                    
                    const countStr = (this.state.currentPlanetIndex + 1).toString().padStart(2, '0');
                    counter.innerText = `${countStr} / ${len}`;

                    // Entrada
                    gsap.timeline()
                        .to(img, { 
                            scale: 1, opacity: 1, filter: "blur(0px) contrast(1.2)", 
                            duration: 0.5, ease: "back.out(1.5)" 
                        })
                        .to([els.title, els.desc, els.stat1, els.stat2], { 
                            y: 0, opacity: 1, duration: 0.4, stagger: 0.05 
                        }, "-=0.4")
                        .add(() => { this.state.isAnimatingPlanet = false; });
                }
            });

            tl.to([els.title, els.desc, els.stat1, els.stat2], { y: -10, opacity: 0, duration: 0.3 })
              .to(img, { scale: 0.8, opacity: 0, filter: "blur(10px)", duration: 0.3 }, "<");
        };

        // Listeners
        if(nextBtn) nextBtn.addEventListener('click', () => updatePlanet('next'));
        if(prevBtn) prevBtn.addEventListener('click', () => updatePlanet('prev'));
        
        // Inicializar com o contador correto
        const len = this.celestialBodies.length;
        if(counter) counter.innerText = `01 / ${len}`;
    },

    setupNavigation() {
        const trigger = document.querySelector('.menu-trigger');
        const overlay = document.querySelector('.nav-overlay');
        const links = document.querySelectorAll('.nav-link');
        const resetTrigger = document.querySelector('.reset-trigger');
        
        // Menu Timeline
        let tl = gsap.timeline({ paused: true, reversed: true });
        tl.to(overlay, { autoAlpha: 1, duration: 0.5, pointerEvents: 'all' })
          .to(links, { y: 0, opacity: 1, stagger: 0.1, duration: 0.5, ease: "power3.out" }, "-=0.2")
          .to('.nav-footer', { opacity: 1 }, "-=0.2");

        const toggleMenu = () => {
            this.state.isMenuOpen = !this.state.isMenuOpen;
            if (this.state.isMenuOpen) {
                tl.play();
                trigger.innerText = "CLOSE X";
                trigger.style.color = "#ff5555";
            } else {
                tl.reverse();
                trigger.innerText = "MENU =";
                trigger.style.color = "";
            }
        };

        trigger.addEventListener('click', toggleMenu);
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                if(targetId.startsWith('#')) {
                    e.preventDefault();
                    toggleMenu();
                    
                    setTimeout(() => {
                        const section = document.querySelector(targetId);
                        if(section) section.scrollIntoView({ behavior: 'smooth' });
                    }, 600);
                }
            });
        });

        if(resetTrigger) {
            resetTrigger.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        }
    }
};

// Start
document.addEventListener("DOMContentLoaded", () => App.init());