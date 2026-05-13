document.addEventListener('DOMContentLoaded', () => {
    
    // ============================================================
    // 0. GSAP Plugin Registration
    // ============================================================
    gsap.registerPlugin(ScrollTrigger);

    // ============================================================
    // 1. Lenis Smooth Scroll
    // ============================================================
    const lenis = new Lenis({
        duration: 1.4,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothTouch: false,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0, 0);
    lenis.stop(); 

    // ============================================================
    // 0.0 Welcome, Login & Intro Controller (Unified)
    // ============================================================
    const welcomeScreen = document.getElementById('welcome-screen');
    const loginGate     = document.getElementById('login-gate');
    const introLoader   = document.getElementById('intro-loader');
    const loginBtn      = document.getElementById('login-btn');
    const userIn        = document.getElementById('login-user');
    const passIn        = document.getElementById('login-pass');
    const errorMsg      = document.getElementById('login-error');

    // 1. Welcome to Cinematic Video Intro
    if (welcomeScreen) {
        welcomeScreen.addEventListener('click', () => {
            const introTl = gsap.timeline({
                onComplete: () => {
                    welcomeScreen.style.display = 'none';
                    if (loginGate) {
                        loginGate.style.display = 'flex';
                        gsap.from('.login-box', { y: 50, opacity: 0, duration: 1, ease: 'back.out(1.4)' });
                    }
                }
            });

            // Phase 1: Zoom & Transition
            introTl.to('.pulse-heart', { scale: 5, opacity: 0, duration: 0.6, ease: 'power2.in' })
                   .to('.welcome-content h1, .welcome-content p, .tap-hint', { opacity: 0, duration: 0.3 }, "<")
                   .to(welcomeScreen, { backgroundColor: '#ffffff', duration: 0.1 });

            // Phase 2: Slower Video-style Keyword Montage
            const videoWords = ["TRUST", "LAUGHTER", "LOYALTY", "MEMORIES" , "BESTIE"];
            videoWords.forEach((word) => {
                introTl.call(() => {
                    welcomeScreen.innerHTML = `<div class="video-word">${word}</div>`;
                    gsap.fromTo('.video-word', 
                        { scale: 0.7, opacity: 0, filter: 'blur(10px)' }, 
                        { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power2.out' }
                    );
                    gsap.to('.video-word', { opacity: 0, scale: 1.2, duration: 0.6, delay: 1.2, ease: 'power2.in' });
                }, null, "+=1.8"); 
            });
        });
    }

    // 2. Login to Dashboard (Direct Reveal)
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            const user = userIn.value.trim().toLowerCase();
            const pass = passIn.value.trim().toLowerCase();

            // Case-insensitive check for Keethu
            if (user === 'keethu' && pass === '21052004') {
                gsap.to(loginGate, { 
                    opacity: 0, 
                    duration: 1, 
                    onComplete: () => {
                        loginGate.style.display = 'none';
                        document.body.style.overflow = 'visible';
                        document.body.style.overflowX = 'hidden';
                        fireworks();
                        if (mainContent) mainContent.classList.remove('hidden');
                        // Ensure all scroll triggers are recalculated after reveal
                        setTimeout(() => ScrollTrigger.refresh(), 500);
                    } 
                });
            } else {
                if (errorMsg) errorMsg.style.display = 'block';
                gsap.fromTo('.login-box', { x: -10 }, { x: 10, duration: 0.1, repeat: 5, yoyo: true });
            }
        });
    }

    function startIntroAnimation() {
        if (!loginGate || !introLoader) return;
        
        gsap.to(loginGate, { opacity: 0, duration: 0.8, onComplete: () => {
            loginGate.style.display = 'none';
            introLoader.style.display = 'flex';
            introLoader.style.opacity = '1';
        }});
        
        const messages = [
            "Syncing Bestie Hearts...",
            "Loading 10 Years of Laughter...",
            "Unlocking Secret Memories...",
            "Preparing the Surprise...",
            "Ready?"
        ];
        
        let msgIndex = 0;
        const textEl = document.getElementById('loader-text');
        const progress = document.querySelector('.loader-progress');

        const tl = gsap.timeline({
            onComplete: () => {
                gsap.to(introLoader, { opacity: 0, duration: 1, onComplete: () => {
                    introLoader.style.display = 'none';
                    document.body.style.overflow = 'visible';
                    document.body.style.overflowX = 'hidden';
                }});
            }
        });

        if (progress) tl.to(progress, { width: '100%', duration: 6, ease: 'power1.inOut' });

        const msgInterval = setInterval(() => {
            if (msgIndex < messages.length - 1) {
                msgIndex++;
                if (textEl) {
                    gsap.to(textEl, { opacity: 0, y: -10, duration: 0.3, onComplete: () => {
                        textEl.textContent = messages[msgIndex];
                        gsap.to(textEl, { opacity: 1, y: 0, duration: 0.3 });
                    }});
                }
            } else {
                clearInterval(msgInterval);
            }
        }, 1200);
    }

    // ============================================================
    // 2. Cute Teddy Cursor & Magic Sticker Trail
    // ============================================================
    const cursor = document.getElementById('custom-cursor');
    cursor.innerHTML = '🧸'; 

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let curX = mouseX, curY = mouseY;
    let lastStickerTime = 0;

    window.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Spawn a sticker every 100ms as the mouse moves
        const now = Date.now();
        if (now - lastStickerTime > 100) {
            spawnSticker(e.clientX, e.clientY);
            lastStickerTime = now;
        }
    });

    function spawnSticker(x, y) {
        const stickers = ['🎂', '🎁', '🥳', '✨', '🎈', '💖', '🧁', '🎉'];
        const emoji = stickers[Math.floor(Math.random() * stickers.length)];
        const el = document.createElement('div');
        el.className = 'bg-decoration sticker-trail';
        el.textContent = emoji;
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.style.fontSize = `${1 + Math.random()}rem`;
        document.body.appendChild(el);

        gsap.to(el, {
            x: (Math.random() - 0.5) * 100,
            y: (Math.random() - 0.5) * 100 - 50,
            rotation: Math.random() * 360,
            scale: 0,
            opacity: 0,
            duration: 1 + Math.random(),
            ease: 'power1.out',
            onComplete: () => el.remove()
        });
    }

    gsap.ticker.add(() => {
        curX += (mouseX - curX) * 0.15;
        curY += (mouseY - curY) * 0.15;
        gsap.set(cursor, { x: curX, y: curY });
        
        const waddle = Math.sin(Date.now() * 0.005) * 12;
        gsap.set(cursor, { rotation: waddle });
    });

    // Ripple effect on click
    window.addEventListener('mousedown', (e) => {
        const ripple = document.createElement('div');
        ripple.className = 'mouse-ripple';
        ripple.style.left = `${e.clientX}px`;
        ripple.style.top = `${e.clientY}px`;
        document.body.appendChild(ripple);
        
        // Teddy "pounce" on click
        gsap.to(cursor, { scale: 0.7, duration: 0.1, yoyo: true, repeat: 1 });
        
        setTimeout(() => ripple.remove(), 800);
    });
    
    // Cursor enlarge on interactables
    document.querySelectorAll('button, a, .polaroid-inner, #envelope, .bucket-item').forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(cursor, { scale: 1.6, duration: 0.3, ease: 'back.out(2)' });
            cursor.innerHTML = '🧸✨'; // Sparkling teddy on hover
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(cursor, { scale: 1, duration: 0.3, ease: 'power2.out' });
            cursor.innerHTML = '🧸'; 
        });
    });

    // Love symbols removed as requested
    // function spawnHeart removed
    // ============================================================
    // 3. Floating Decorations (Balloons, Caps, Water Balls)
    // ============================================================
    function spawnBalloon() {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        
        // Curated Palette: Aqua, Baby Pink, Pearly White, Pastel Gold
        const colors = ['#bae6fd', '#fbcfe8', '#ffffff', '#fef3c7', '#f9a8d4'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        balloon.style.setProperty('--color', color);
        balloon.style.left = `${Math.random() * 95}vw`;
        
        // Random sizes for depth
        const size = 35 + Math.random() * 25;
        balloon.style.width = `${size}px`;
        balloon.style.height = `${size * 1.2}px`;
        balloon.style.opacity = 0.7 + Math.random() * 0.2;
        
        const string = document.createElement('div');
        string.className = 'balloon-string';
        balloon.appendChild(string);
        document.body.appendChild(balloon);

        gsap.to(balloon, {
            y: -window.innerHeight - 300,
            x: (Math.random() - 0.5) * 200,
            rotation: (Math.random() - 0.5) * 30,
            duration: 15 + Math.random() * 10, // Slower, more graceful
            ease: 'sine.inOut',
            onComplete: () => balloon.remove()
        });
    }

    function spawnCap() {
        const el = document.createElement('div');
        el.className = 'bg-decoration birthday-cap';
        el.textContent = '🥳';
        el.style.left = `${Math.random() * 100}vw`;
        el.style.top = `-50px`;
        document.body.appendChild(el);

        gsap.to(el, {
            y: window.innerHeight + 100,
            x: (Math.random() - 0.5) * 150,
            rotation: 360,
            duration: 8 + Math.random() * 8,
            ease: 'none',
            onComplete: () => el.remove()
        });
    }

    function spawnWaterBall() {
        const el = document.createElement('div');
        el.className = 'bg-decoration water-ball';
        const size = 15 + Math.random() * 35;
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        el.style.left = `${Math.random() * 100}vw`;
        el.style.bottom = `-50px`;
        document.body.appendChild(el);

        gsap.to(el, {
            y: -window.innerHeight - 100,
            x: (Math.random() - 0.5) * 100,
            scale: 1.5,
            opacity: 0,
            duration: 12 + Math.random() * 10,
            ease: 'power1.inOut',
            onComplete: () => el.remove()
        });
    }

    // Faster spawn rates for "Full" effect
    setInterval(spawnBalloon, 1200); 
    setInterval(spawnCap, 2500);
    setInterval(spawnWaterBall, 1000);

    // Massive Initial wave
    for(let i=0; i<20; i++) {
        setTimeout(spawnWaterBall, Math.random() * 3000);
        setTimeout(spawnBalloon, Math.random() * 3000);
        setTimeout(spawnCap, Math.random() * 5000);
    }

    // spawnHeart removed as requested

    // ============================================================
    // 4. Three.js Canvas Removed as requested
    // ============================================================
    const canvas = document.getElementById('webgl-canvas');
    if (canvas) canvas.style.display = 'none';

    window.addEventListener('resize', () => {
        // Just for layout stability if needed
    });

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // ============================================================
    // 5. Hero Entrance — GSAP Timeline
    // ============================================================
    // Set initial states
    gsap.set('.hero-text', { y: 40, opacity: 0 });
    gsap.set('.surprise-btn', { scale: 0.85, opacity: 0 });
    gsap.set('.hero-scroll-indicator', { opacity: 0 });
    gsap.set('.gs-hero-glow',  { scale: 0, opacity: 0 });
    gsap.set('.gs-hero-glow-2',{ scale: 0, opacity: 0 });

    const heroTl = gsap.timeline({ delay: 0.3 });
    heroTl
        .to('.gs-hero-glow',   { scale: 1, opacity: 1, duration: 2,   ease: 'power3.out' })
        .to('.gs-hero-glow-2', { scale: 1, opacity: 1, duration: 2,   ease: 'power3.out' }, '-=1.5')
        .to('.hero-text',      { y: 0, opacity: 1, stagger: 0.15, duration: 1.2, ease: 'expo.out' }, '-=1')
        .to('.surprise-btn',   { scale: 1, opacity: 1, duration: 0.9, ease: 'back.out(1.7)' }, '-=0.4')
        .to('.hero-scroll-indicator', { opacity: 1, duration: 0.8 }, '+=0.5');

    // Floating orb animation
    gsap.to('.gs-hero-glow',  { x: 40, y: -30, duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.gs-hero-glow-2',{ x: -30, y: 40, duration: 6, repeat: -1, yoyo: true, ease: 'sine.inOut' });

    // Typewriter
    const words = "To my Amazing Best Friend — thank you for being the person who knows me best! 🌸👯‍♀️";
    const tyEl  = document.getElementById('typewriter');
    let ti = 0;
    setTimeout(function type() {
        if (ti < words.length) { tyEl.innerHTML += words[ti++]; setTimeout(type, 48); }
    }, 2000);

    // ============================================================
    // 7. Surprise Button Click — Cinematic Reveal
    // ============================================================
    const surpriseBtn  = document.getElementById('surprise-btn');
    const mainContent  = document.getElementById('main-content');
    const overlay      = document.getElementById('cinematic-overlay');

    surpriseBtn.addEventListener('click', () => {
        // Disable further clicks immediately
        surpriseBtn.disabled = true;
        gsap.to(surpriseBtn, { opacity: 0.5, scale: 0.95, duration: 0.3 });
        surpriseBtn.textContent = '🎉 Surprise Opened!';

        // Fade overlay in
        gsap.set(overlay, { opacity: 0, pointerEvents: 'all' });
        gsap.to(overlay, {
            opacity: 1,
            duration: 0.6,
            ease: 'power2.inOut',
            onComplete: () => {
                // Reveal content
                mainContent.classList.remove('hidden');

                // Init all scroll triggers
                initScrollAnimations();

                // Enable smooth scroll
                lenis.start();
                setTimeout(() => ScrollTrigger.refresh(), 150);

                // Fade overlay out
                gsap.to(overlay, {
                    opacity: 0,
                    duration: 0.8,
                    delay: 0.1,
                    onComplete: () => gsap.set(overlay, { pointerEvents: 'none' })
                });

                // Scroll to memories
                setTimeout(() => {
                    lenis.scrollTo('#memories', { duration: 2.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
                }, 400);

                // Fireworks
                fireworks();
            }
        });
    });

    // ============================================================
    // 8. Fireworks Sequence
    // ============================================================
    function fireworks() {
        const end = Date.now() + 5000;
        const colors1 = ['#db2777', '#fbcfe8', '#a855f7', '#f9a8d4'];
        const colors2 = ['#d97706', '#fde68a', '#db2777', '#fbcfe8'];

        (function frame() {
            const left = end - Date.now();
            if (left <= 0) return;
            const n = Math.round(60 * (left / 5000));

            confetti({ startVelocity: 42, spread: 360, ticks: 90, zIndex: 600,
                particleCount: n, origin: { x: 0.1 + Math.random() * 0.35, y: -0.1 }, colors: colors1 });
            confetti({ startVelocity: 42, spread: 360, ticks: 90, zIndex: 600,
                particleCount: n, origin: { x: 0.55 + Math.random() * 0.35, y: -0.1 }, colors: colors2 });

            setTimeout(frame, 320);
        })();
    }

    // ============================================================
    // 9. Scroll Animations (called after content is revealed)
    // ============================================================
    // ============================================================
    // 5. Interactive Bucket List (Tilt & Confetti)
    // ============================================================
    const bucketItems = document.querySelectorAll('.bucket-item');
    bucketItems.forEach(item => {
        // 3D Tilt Effect
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            gsap.to(item, {
                rotateX: rotateX,
                rotateY: rotateY,
                scale: 1.05,
                duration: 0.5,
                ease: 'power2.out',
                transformPerspective: 1000
            });
        });

        item.addEventListener('mouseleave', () => {
            gsap.to(item, {
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)'
            });
        });

        // Confetti on Click
        item.addEventListener('click', () => {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#db2777', '#f472b6', '#ffffff']
            });
            
            // Temporary "Success" glow
            gsap.to(item, {
                boxShadow: '0 0 30px rgba(219, 39, 119, 0.6)',
                duration: 0.3,
                yoyo: true,
                repeat: 1
            });
        });
    });

    function initScrollAnimations() {

        // --- Cinematic Quote ---
        gsap.from('.gs-quote', {
            scrollTrigger: { trigger: '.cinematic-quote-section', start: 'top 80%' },
            y: 50, opacity: 0, scale: 0.9, duration: 1.5, ease: 'expo.out'
        });

        // --- Section titles ---
        gsap.utils.toArray('.gs-title').forEach(el => {
            gsap.from(el, {
                scrollTrigger: { trigger: el, start: 'top 88%' },
                y: 60, opacity: 0, duration: 1.2, ease: 'expo.out'
            });
        });

        // --- Polaroid cards: each animates in independently ---
        gsap.utils.toArray('.gs-polaroid').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 92%',
                },
                y: 80,
                opacity: 0,
                rotation: i % 2 === 0 ? 8 : -8,
                duration: 1.2,
                delay: (i % 3) * 0.1,
                ease: 'back.out(1.3)',
                clearProps: 'rotation'
            });
        });

        // 3D tilt on polaroids
        document.querySelectorAll('.polaroid-inner').forEach(card => {
            card.addEventListener('mousemove', e => {
                const r  = card.getBoundingClientRect();
                const rx = ((e.clientY - r.top)  / r.height - 0.5) * -20;
                const ry = ((e.clientX - r.left) / r.width  - 0.5) *  20;
                gsap.to(card, {
                    rotationX: rx, rotationY: ry,
                    transformPerspective: 800,
                    duration: 0.4, ease: 'power2.out'
                });
            });
            card.addEventListener('mouseleave', () => {
                // Restore base rotation from CSS var
                const base = parseFloat(card.style.getPropertyValue('--r') || '0');
                gsap.to(card, { rotationX: 0, rotationY: 0, rotation: base, duration: 0.6, ease: 'power2.out' });
            });
        });

        // --- Reason cards 3D Tilt & Glow ---
        document.querySelectorAll('.reason-card').forEach(card => {
            // Add glow element
            const glow = document.createElement('div');
            glow.className = 'card-glow';
            card.appendChild(glow);

            card.addEventListener('mousemove', e => {
                const r  = card.getBoundingClientRect();
                const x  = e.clientX - r.left;
                const y  = e.clientY - r.top;
                
                // Update glow position
                card.style.setProperty('--x', `${x}px`);
                card.style.setProperty('--y', `${y}px`);

                // 3D Tilt
                const rx = ((e.clientY - r.top)  / r.height - 0.5) * -15;
                const ry = ((e.clientX - r.left) / r.width  - 0.5) *  15;
                
                gsap.to(card, {
                    rotationX: rx, 
                    rotationY: ry,
                    transformPerspective: 1000,
                    duration: 0.4, 
                    ease: 'power2.out'
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, { 
                    rotationX: 0, 
                    rotationY: 0, 
                    duration: 0.6, 
                    ease: 'elastic.out(1, 0.3)' 
                });
            });
        });

        gsap.from('.gs-reason', {
            scrollTrigger: { 
                trigger: '#reasons', 
                start: 'top 85%', 
                onEnter: () => gsap.set('.gs-reason', { visibility: 'visible' }) 
            },
            y: 50, 
            opacity: 0, 
            rotationX: -15,
            transformPerspective: 1000,
            stagger: 0.1, 
            duration: 1, 
            ease: 'power2.out',
            clearProps: 'all' 
        });

        // --- Bucket List Tree Growth ---
        gsap.set('#bucket-trunk-progress', { height: 0 });
        gsap.to('#bucket-trunk-progress', {
            scrollTrigger: {
                trigger: '.bucket-tree-container',
                start: 'top 70%',
                end: 'bottom 85%',
                scrub: 1.5
            },
            height: '100%',
            ease: 'none'
        });

        gsap.from('.gs-bucket', {
            scrollTrigger: {
                trigger: '.bucket-tree-container',
                start: 'top 75%'
            },
            x: (i) => i % 2 === 0 ? -50 : 50,
            opacity: 0,
            stagger: 0.2,
            duration: 1,
            ease: 'power2.out'
        });

        // --- Timeline line draw ---
        gsap.to('#timeline-line-progress', {
            scrollTrigger: {
                trigger: '#timeline',
                start: 'top 60%',
                end: 'bottom 80%',
                scrub: 1.5
            },
            height: '100%',
            ease: 'none'
        });

        // --- Timeline items ---
        gsap.utils.toArray('.gs-timeline').forEach((item) => {
            const fromLeft = item.classList.contains('left-item');
            gsap.from(item.querySelector('.gs-timeline-content'), {
                scrollTrigger: { trigger: item, start: 'top 82%' },
                x: fromLeft ? -60 : 60,
                opacity: 0,
                duration: 1.1,
                ease: 'back.out(1.4)'
            });
            gsap.from(item.querySelector('.timeline-dot'), {
                scrollTrigger: { trigger: item, start: 'top 82%' },
                scale: 0, opacity: 0, duration: 0.5, delay: 0.2,
                ease: 'back.out(2)'
            });
        });

        // --- Bucket list ---
        gsap.from('.gs-bucket', {
            scrollTrigger: { 
                trigger: '#bucket-list', 
                start: 'top 85%', // Trigger earlier
                onEnter: () => gsap.set('.gs-bucket', { visibility: 'visible' }) // Ensure visibility
            },
            x: -30, 
            opacity: 0, 
            stagger: 0.08, 
            duration: 1.2, 
            ease: 'power2.out',
            clearProps: 'all' // Clean up after animation
        });

        // --- The Promise ---
        gsap.from('.gs-promise', {
            scrollTrigger: { trigger: '.promise-wrap', start: 'top 85%' },
            y: 40, opacity: 0, scale: 0.95, duration: 1.2, ease: 'back.out(1.5)'
        });

        // --- Envelope ---
        gsap.from('.gs-envelope', {
            scrollTrigger: { trigger: '#letter', start: 'top 75%' },
            y: 80, scale: 0.92, opacity: 0, duration: 1.5, ease: 'power3.out'
        });
    }

    // ============================================================
    // 10. Interactive Letter
    // ============================================================
    const envelope     = document.getElementById('envelope');
    const envFront     = document.getElementById('envelope-front');
    const letterBox    = document.getElementById('letter-content');
    const letterText   = document.getElementById('letter-text');
    let letterOpened   = false;

    const message = `My Dearest Bestie,<br><br>
They say that true friends are like stars — you don't always see them, but you know they're always there. Thank you for being my brightest star.<br><br>
From all the late-night talks to the countless inside jokes, having you as my best friend is the greatest gift. You're more than a friend; you're family.<br><br>
On your special day, I wish you all the laughter, adventure, and happiness in the world. I'll always be right here by your side.<br><br>
Happy Birthday to my Favorite Person! 💖🎂✨`;

    envelope.addEventListener('click', () => {
        if (letterOpened) return;
        letterOpened = true;

        gsap.to(envFront, {
            opacity: 0, scale: 0.75, duration: 0.5, ease: 'power2.in',
            onComplete: () => {
                envFront.style.display = 'none';
                letterBox.style.display = 'block';

                gsap.fromTo(letterBox,
                    { opacity: 0, height: 0 },
                    {
                        opacity: 1, height: 'auto', duration: 0.8, ease: 'expo.out',
                        onComplete: () => {
                            // Typewriter effect on letter
                            let j = 0, inTag = false, html = '';
                            (function typeMsg() {
                                if (j >= message.length) return;
                                const ch = message[j++];
                                if (ch === '<') inTag = true;
                                html += ch;
                                letterText.innerHTML = html;
                                if (ch === '>') inTag = false;
                                setTimeout(typeMsg, inTag ? 0 : 30);
                            })();
                        }
                    }
                );
            }
        });
    });

});
