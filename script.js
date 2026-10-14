// ====================================================
// 💖 BIRTHDAY WEBSITE INTERACTIVE LOGIC
// ====================================================

document.addEventListener('DOMContentLoaded', () => {
    initPersonalization();
    initAmbientCanvas();
    initAudioSystem();
    initRomanticVideoPlayer();
    initBirthdayCake();
    initPolaroidGallery();
    initWaxSealEnvelope();
    initReasonsCapsule();
    initTimeline();
    initPoppableBalloons();
    initConfettiFireworks();
});

// ================= 1. PERSONALIZATION & CONFIG =================
function initPersonalization() {
    if (typeof CONFIG === 'undefined') return;

    // Recipient Name
    const heroName = document.getElementById('hero-recipient-name');
    if (heroName && CONFIG.recipientName) {
        heroName.textContent = CONFIG.recipientName;
    }

    // Page Title
    if (CONFIG.recipientName) {
        document.title = `Happy Birthday ${CONFIG.recipientName} ✨ | A Celebration Just For You`;
    }

    // Letter Salutation and Title
    if (CONFIG.letter) {
        const letterTitle = document.getElementById('letter-title');
        const letterSalutation = document.getElementById('letter-salutation');
        const letterBody = document.getElementById('letter-body');
        const letterClosing = document.getElementById('letter-closing');

        if (letterTitle && CONFIG.letter.title) letterTitle.textContent = CONFIG.letter.title;
        if (letterSalutation && CONFIG.letter.salutation) letterSalutation.textContent = CONFIG.letter.salutation;
        if (letterBody && CONFIG.letter.body) letterBody.textContent = CONFIG.letter.body;
        if (letterClosing && CONFIG.letter.closing) letterClosing.textContent = CONFIG.letter.closing;
    }

    // Cake Wish Texts
    if (CONFIG.cakeWishText) {
        const inst = document.getElementById('cake-instruction-text');
        if (inst) inst.textContent = CONFIG.cakeWishText;
    }
    if (CONFIG.afterBlowWishText) {
        const afterText = document.getElementById('after-blow-text');
        if (afterText) afterText.textContent = CONFIG.afterBlowWishText;
    }

    // Priority Photo and Quotes
    if (CONFIG.priorityPhoto) {
        const spotImg = document.getElementById('priority-spotlight-img');
        const mainQuote = document.getElementById('hindi-quote-main');
        const subQuote = document.getElementById('hindi-quote-sub');

        if (spotImg && CONFIG.priorityPhoto.url) spotImg.src = CONFIG.priorityPhoto.url;
        if (mainQuote && CONFIG.priorityPhoto.caption) mainQuote.innerHTML = CONFIG.priorityPhoto.caption;
        if (subQuote && CONFIG.priorityPhoto.hindiQuote) subQuote.innerHTML = CONFIG.priorityPhoto.hindiQuote;
    }
}

// ================= 2. AMBIENT PARTICLES (PETALS, HEARTS, SPARKLES) =================
function initAmbientCanvas() {
    const canvas = document.getElementById('ambient-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const PARTICLE_COUNT = 45;

    class Particle {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            this.x = Math.random() * width;
            this.y = initial ? Math.random() * height : -20;
            this.size = Math.random() * 8 + 6;
            this.speedY = Math.random() * 0.8 + 0.4;
            this.speedX = Math.random() * 0.6 - 0.3;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.02;
            this.type = Math.random() > 0.4 ? 'petal' : (Math.random() > 0.5 ? 'heart' : 'sparkle');
            this.opacity = Math.random() * 0.5 + 0.25;
            this.hue = Math.random() > 0.5 ? 340 : 45; // Pink or Golden
        }

        update() {
            this.y += this.speedY;
            this.x += Math.sin(this.y * 0.01) * 0.5 + this.speedX;
            this.rotation += this.rotationSpeed;

            if (this.y > height + 20 || this.x < -20 || this.x > width + 20) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = this.opacity;

            if (this.type === 'petal') {
                ctx.fillStyle = `hsl(${this.hue}, 80%, 75%)`;
                ctx.beginPath();
                ctx.ellipse(0, 0, this.size * 0.6, this.size * 1.2, 0, 0, Math.PI * 2);
                ctx.fill();
            } else if (this.type === 'heart') {
                ctx.fillStyle = '#ff758c';
                ctx.beginPath();
                const s = this.size * 0.6;
                ctx.moveTo(0, s * 0.3);
                ctx.bezierCurveTo(-s, -s * 0.5, -s * 1.2, s * 0.5, 0, s * 1.3);
                ctx.bezierCurveTo(s * 1.2, s * 0.5, s, -s * 0.5, 0, s * 0.3);
                ctx.fill();
            } else {
                ctx.fillStyle = '#f8cf74';
                ctx.beginPath();
                ctx.arc(0, 0, this.size * 0.25, 0, Math.PI * 2);
                ctx.shadowBlur = 8;
                ctx.shadowColor = '#f8cf74';
                ctx.fill();
            }

            ctx.restore();
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        for (let p of particles) {
            p.update();
            p.draw();
        }
        requestAnimationFrame(animate);
    }
    animate();
}

// ================= 3. ROMANTIC AUDIO SYNTHESIZER / MUSIC PLAYER =================
function initAudioSystem() {
    const musicBtn = document.getElementById('music-toggle-btn');
    const musicLabel = document.getElementById('music-label');
    const equalizer = document.getElementById('equalizer');
    const bgAudio = document.getElementById('bg-audio');

    let isPlaying = false;
    let audioCtx = null;
    let synthInterval = null;

    // Check if an external audio file is provided
    if (typeof CONFIG !== 'undefined' && CONFIG.musicFile) {
        bgAudio.src = CONFIG.musicFile;
    }

    musicBtn.addEventListener('click', () => {
        if (!isPlaying) {
            startMusic();
        } else {
            stopMusic();
        }
    });

    function startMusic() {
        isPlaying = true;
        musicLabel.textContent = "Music Playing";
        equalizer.classList.add('active');

        // If audio file exists, play it
        if (bgAudio.src && bgAudio.src !== window.location.href) {
            bgAudio.play().catch(e => {
                console.log("Audio file play prevented, falling back to romantic synth", e);
                startRomanticSynth();
            });
        } else {
            startRomanticSynth();
        }
    }

    function stopMusic() {
        isPlaying = false;
        musicLabel.textContent = "Play Music";
        equalizer.classList.remove('active');

        if (bgAudio.src) bgAudio.pause();
        if (synthInterval) {
            clearInterval(synthInterval);
            synthInterval = null;
        }
    }

    // Built-in Web Audio API Lullaby / Music Box Synth
    function startRomanticSynth() {
        try {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }

            // Romantic music box melody notes (Pentatonic / Major 7th dreamy sequence)
            // Frequencies for C major / A minor dreamy melody
            const melody = [
                523.25, 659.25, 783.99, 987.77, 880.00, 783.99, 659.25, 587.33,
                523.25, 659.25, 880.00, 783.99, 659.25, 523.25, 587.33, 523.25
            ];
            let noteIndex = 0;

            function playNote(freq) {
                if (!isPlaying || !audioCtx) return;
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();

                osc.type = 'sine'; // warm, sweet bell-like chime
                osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

                // Gentle envelope
                gain.gain.setValueAtTime(0, audioCtx.currentTime);
                gain.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.6);

                osc.connect(gain);
                gain.connect(audioCtx.destination);

                osc.start();
                osc.stop(audioCtx.currentTime + 1.7);
            }

            // Play immediate first note
            playNote(melody[noteIndex]);
            noteIndex = (noteIndex + 1) % melody.length;

            synthInterval = setInterval(() => {
                playNote(melody[noteIndex]);
                noteIndex = (noteIndex + 1) % melody.length;
            }, 600);

        } catch (e) {
            console.warn("Web Audio API not supported", e);
        }
    }
}

// ================= 3B. ROMANTIC MUSIC VIDEO PLAYER =================
function initRomanticVideoPlayer() {
    const video = document.getElementById('romantic-music-video');
    const playBtn = document.getElementById('custom-video-btn');
    if (!video || !playBtn) return;

    playBtn.addEventListener('click', () => {
        if (video.paused) {
            video.play();
            playBtn.textContent = '⏸ Pause Song Video';
            
            // Trigger romantic star confetti
            if (typeof confetti === 'function') {
                confetti({
                    particleCount: 30,
                    spread: 60,
                    origin: { y: 0.5 },
                    colors: ['#f8cf74', '#f4729f', '#ffccd5']
                });
            }
        } else {
            video.pause();
            playBtn.textContent = '▶ Play Song Video';
        }
    });

    video.addEventListener('play', () => {
        playBtn.textContent = '⏸ Pause Song Video';
        // Pause background audio/synth to prevent audio clash
        const bgAudio = document.getElementById('bg-audio');
        if (bgAudio && !bgAudio.paused) {
            bgAudio.pause();
        }
    });

    video.addEventListener('pause', () => {
        playBtn.textContent = '▶ Play Song Video';
    });

    video.addEventListener('ended', () => {
        playBtn.textContent = '🔄 Replay Song Video';
        if (typeof triggerGrandCelebration === 'function') {
            triggerGrandCelebration();
        }
    });
}

// Sound effects generator for candle blowout and pops
function playSoundEffect(type) {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        if (type === 'blow') {
            // Soft wind / breath sound
            const bufferSize = ctx.sampleRate * 0.3;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
            }
            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 500;
            const gain = ctx.createGain();
            gain.gain.value = 0.15;
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            noise.start();
        } else if (type === 'pop') {
            // Cute balloon pop chirp
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.frequency.setValueAtTime(450, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.08);
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.08);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.09);
        }
    } catch(e) {}
}

// ================= 4. INTERACTIVE BIRTHDAY CAKE & CANDLES =================
function initBirthdayCake() {
    const candles = document.querySelectorAll('.candle');
    const wishCard = document.getElementById('wish-reveal-card');
    const relightBtn = document.getElementById('relight-cake-btn');
    let blownCount = 0;

    candles.forEach(candle => {
        candle.addEventListener('click', () => {
            const candleId = candle.getAttribute('data-candle');
            const flame = document.getElementById(`flame-${candleId}`);
            const smoke = document.getElementById(`smoke-${candleId}`);

            if (flame && !flame.classList.contains('extinguished')) {
                flame.classList.add('extinguished');
                playSoundEffect('blow');

                if (smoke) {
                    smoke.classList.add('active');
                    setTimeout(() => smoke.classList.remove('active'), 1200);
                }

                blownCount++;

                // Trigger small celebratory confetti puff
                if (typeof confetti === 'function') {
                    const rect = candle.getBoundingClientRect();
                    confetti({
                        particleCount: 15,
                        spread: 45,
                        origin: {
                            x: (rect.left + rect.width / 2) / window.innerWidth,
                            y: (rect.top) / window.innerHeight
                        },
                        colors: ['#f8cf74', '#f4729f', '#ffffff']
                    });
                }

                // Check if all candles blown
                if (blownCount === candles.length) {
                    setTimeout(() => {
                        triggerGrandCelebration();
                        if (wishCard) wishCard.classList.add('show');
                    }, 400);
                }
            }
        });
    });

    if (relightBtn) {
        relightBtn.addEventListener('click', () => {
            candles.forEach(candle => {
                const candleId = candle.getAttribute('data-candle');
                const flame = document.getElementById(`flame-${candleId}`);
                if (flame) flame.classList.remove('extinguished');
            });
            blownCount = 0;
            if (wishCard) wishCard.classList.remove('show');
        });
    }
}

// Confetti blast when candles are all blown out
function triggerGrandCelebration() {
    if (typeof confetti !== 'function') return;

    // Burst 1: Golden Stars & Rose petals from center
    confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#f4729f', '#f8cf74', '#ffffff', '#ffd6e0']
    });

    // Burst 2: Left & Right cannons
    setTimeout(() => {
        confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.7 },
            colors: ['#ff758c', '#faedd9', '#f8cf74']
        });
        confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.7 },
            colors: ['#ff758c', '#faedd9', '#f8cf74']
        });
    }, 250);
}

// ================= 5. POLAROID SCRAPBOOK GALLERY & LIGHTBOX =================
function initPolaroidGallery() {
    const grid = document.getElementById('polaroid-grid');
    const enhancedBtn = document.getElementById('toggle-enhanced-btn');
    const originalBtn = document.getElementById('toggle-original-btn');
    if (!grid) return;

    let currentMode = 'enhanced';

    const enhancedGallery = [
        {
            url: "images/enhanced_paris_cafe.jpg",
            caption: "The sweetest smile in all of Paris 🥐🌸",
            date: "Parisian Spring Edition ⭐ Priority"
        },
        {
            url: "images/enhanced_royal_saree.jpg",
            caption: "The Queen of grace, royalty & pure elegance 👑",
            date: "Royal Palace Edition"
        },
        {
            url: "images/enhanced_rose_garden.jpg",
            caption: "Radiant like a blooming fairytale rose 🌹✨",
            date: "Fairytale Garden Edition"
        },
        {
            url: "images/enhanced_birthday_glam.jpg",
            caption: "Cheers to your happiest birthday Sanjana! 🥂✨",
            date: "Golden Birthday Lounge"
        },
        {
            url: "images/enhanced_ballroom_lehenga.jpg",
            caption: "Shining brighter than every chandelier 💫💚",
            date: "Grand Ballroom Edition"
        },
        {
            url: "images/enhanced_holi_festival.jpg",
            caption: "Adding vibrant colors and joy to my entire life 🎨💖",
            date: "Spring Festival of Colors"
        }
    ];

    const originalGallery = [
        {
            url: "images/original_rooftop.jpg",
            caption: "तेरी ये प्यारी सी मासूम मुस्कान... दिल की धड़कन! 💖",
            date: "⭐ Priority Favorite Memory"
        },
        {
            url: "images/original_portrait.jpg",
            caption: "That natural, gorgeous look I adore 💕",
            date: "Precious Candid Memory"
        },
        {
            url: "images/original_saree.jpg",
            caption: "Looking so stunning in traditional yellow 💛",
            date: "Sweet Moments"
        },
        {
            url: "images/original_smile.jpg",
            caption: "That gentle, heartwarming smile ✨",
            date: "Everyday Magic"
        },
        {
            url: "images/original_mirror_lehenga.jpg",
            caption: "Dressed up and looking like an angel ✨",
            date: "Mirror Selfie Memories"
        },
        {
            url: "images/original_holi.jpg",
            caption: "Laughter, colors & pure happiness together 🌈",
            date: "Festival Celebration"
        }
    ];

    function renderGallery(mode) {
        currentMode = mode;
        const items = mode === 'enhanced' ? enhancedGallery : originalGallery;

        grid.innerHTML = '';
        items.forEach((item) => {
            const card = document.createElement('div');
            card.className = 'polaroid-card';
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', `View photo: ${item.caption}`);

            card.innerHTML = `
                <div class="polaroid-image-wrap">
                    <img src="${item.url}" alt="${item.caption}" loading="lazy">
                </div>
                <p class="polaroid-caption">${item.caption}</p>
                <span class="polaroid-date">${item.date}</span>
            `;

            card.addEventListener('click', () => {
                openLightbox(item);
            });

            grid.appendChild(card);
        });
    }

    if (enhancedBtn && originalBtn) {
        enhancedBtn.addEventListener('click', () => {
            if (currentMode !== 'enhanced') {
                enhancedBtn.classList.add('active');
                originalBtn.classList.remove('active');
                renderGallery('enhanced');
            }
        });

        originalBtn.addEventListener('click', () => {
            if (currentMode !== 'original') {
                originalBtn.classList.add('active');
                enhancedBtn.classList.remove('active');
                renderGallery('original');
            }
        });
    }

    renderGallery('enhanced');
    initLightbox();
}

function initLightbox() {
    const modal = document.getElementById('lightbox-modal');
    const backdrop = document.getElementById('lightbox-backdrop');
    const closeBtn = document.getElementById('lightbox-close-btn');

    if (!modal) return;

    const closeModal = () => modal.classList.remove('active');
    backdrop.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

function openLightbox(item) {
    const modal = document.getElementById('lightbox-modal');
    const img = document.getElementById('lightbox-img');
    const caption = document.getElementById('lightbox-caption');
    const date = document.getElementById('lightbox-date');

    if (!modal || !img) return;

    img.src = item.url;
    if (caption) caption.textContent = item.caption;
    if (date) date.textContent = item.date;

    modal.classList.add('active');
}

// ================= 6. WAX SEAL LOVE LETTER =================
function initWaxSealEnvelope() {
    const envelope = document.getElementById('envelope');
    const sealBtn = document.getElementById('wax-seal-btn');
    const closeBtn = document.getElementById('close-letter-btn');

    if (!envelope || !sealBtn) return;

    sealBtn.addEventListener('click', () => {
        envelope.classList.add('open');

        // Confetti flutter
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 30,
                spread: 60,
                origin: { y: 0.7 },
                colors: ['#ffd6e0', '#f4729f', '#f8cf74']
            });
        }
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            envelope.classList.remove('open');
        });
    }
}

// ================= 7. REASONS WHY I LOVE YOU CAPSULE =================
function initReasonsCapsule() {
    const capsuleText = document.getElementById('capsule-text');
    const capsuleCounter = document.getElementById('capsule-counter');
    const nextBtn = document.getElementById('next-reason-btn');

    if (!nextBtn || !capsuleText) return;

    const defaultReasons = [
        "Your infectious smile that instantly brightens up my whole day.",
        "The gentle, caring kindness you show to everyone around you.",
        "How your eyes sparkle when you talk about things you're passionate about.",
        "Your goofy sense of humor and all our little inside jokes.",
        "The safe, cozy warmth I feel every time you hold my hand.",
        "How you inspire me and make every ordinary day feel like a magical adventure.",
        "Your thoughtful, beautiful heart that loves so deeply and purely.",
        "Simply being YOU — the most wonderful person in the universe."
    ];

    const reasons = (typeof CONFIG !== 'undefined' && CONFIG.reasons && CONFIG.reasons.length > 0)
        ? CONFIG.reasons
        : defaultReasons;

    let currentIndex = 0;

    // Set first reason
    capsuleCounter.textContent = `Reason #1 of ${reasons.length}`;
    capsuleText.textContent = `"${reasons[0]}"`;

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % reasons.length;
        
        // Quick fade animation
        capsuleText.style.opacity = '0';
        setTimeout(() => {
            capsuleCounter.textContent = `Reason #${currentIndex + 1} of ${reasons.length}`;
            capsuleText.textContent = `"${reasons[currentIndex]}"`;
            capsuleText.style.opacity = '1';
        }, 200);

        // Cute micro-confetti
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 12,
                spread: 30,
                origin: { y: 0.8 },
                colors: ['#f4729f', '#ffd6e0']
            });
        }
    });
}

// ================= 8. STORY TIMELINE =================
function initTimeline() {
    const container = document.getElementById('timeline-container');
    if (!container) return;

    const defaultTimeline = [
        {
            title: "The Serendipitous Day We Met",
            subtitle: "Where Our Story Began",
            desc: "The day destiny smiled and introduced me to the girl who would soon become my entire world."
        },
        {
            title: "Our First Cherished Moments",
            subtitle: "Butterflies & Endless Talks",
            desc: "Hours melted away in seconds. From deep late-night chats to laughter that felt like home."
        },
        {
            title: "Countless Beautiful Memories",
            subtitle: "Growing Closer Every Day",
            desc: "Every adventure, inside joke, and quiet glance made me fall in love with you over and over."
        },
        {
            title: "Today — Celebrating YOU!",
            subtitle: "Happy Birthday Gorgeous",
            desc: "Here's to celebrating the most extraordinary soul on your special day. I love you endlessly!"
        }
    ];

    const timelineData = (typeof CONFIG !== 'undefined' && CONFIG.timeline && CONFIG.timeline.length > 0)
        ? CONFIG.timeline
        : defaultTimeline;

    container.innerHTML = '';
    timelineData.forEach((item, index) => {
        const row = document.createElement('div');
        row.className = 'timeline-item';
        row.innerHTML = `
            <div class="timeline-dot"></div>
            <div class="timeline-card">
                <span class="timeline-subtitle">${item.subtitle}</span>
                <h3 class="timeline-title">${item.title}</h3>
                <p class="timeline-desc">${item.desc}</p>
            </div>
        `;
        container.appendChild(row);
    });
}

// ================= 9. POPPABLE BALLOONS SURPRISE =================
function initPoppableBalloons() {
    const arena = document.getElementById('balloons-arena');
    if (!arena) return;

    const compliments = [
        "You have the kindest soul 💕",
        "Your laugh is my favorite sound 🎶",
        "You look breathtaking today & always ✨",
        "You are my absolute favorite adventure 🌸",
        "My heart smiles whenever you are near 💖",
        "Here's to all your birthday wishes coming true! 🎂",
        "You are pure magic in human form 🌟"
    ];

    const balloonClasses = ['balloon-pink', 'balloon-gold', 'balloon-purple', 'balloon-rose', 'balloon-pink', 'balloon-gold'];
    const emojis = ['🎈', '💖', '🎂', '✨', '🌸', '🎁'];

    function createBalloon(index) {
        const balloon = document.createElement('div');
        balloon.className = `balloon ${balloonClasses[index % balloonClasses.length]}`;
        balloon.textContent = emojis[index % emojis.length];
        balloon.setAttribute('role', 'button');
        balloon.setAttribute('tabindex', '0');
        balloon.setAttribute('title', 'Click to pop for a surprise!');

        balloon.addEventListener('click', (e) => {
            popBalloon(balloon, e.clientX, e.clientY);
        });

        arena.appendChild(balloon);
    }

    function popBalloon(balloon, clickX, clickY) {
        playSoundEffect('pop');

        // Confetti burst at balloon position
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 20,
                spread: 50,
                origin: {
                    x: clickX / window.innerWidth,
                    y: clickY / window.innerHeight
                },
                colors: ['#ff758c', '#f8cf74', '#c471ed']
            });
        }

        // Floating compliment popup
        const randomCompliment = compliments[Math.floor(Math.random() * compliments.length)];
        const popup = document.createElement('div');
        popup.className = 'pop-compliment';
        popup.textContent = randomCompliment;
        popup.style.left = `${Math.min(window.innerWidth - 220, Math.max(20, clickX - 100))}px`;
        popup.style.top = `${clickY - 40}px`;
        document.body.appendChild(popup);

        setTimeout(() => popup.remove(), 2200);

        // Hide balloon and respawn after delay
        balloon.style.transform = 'scale(0)';
        balloon.style.opacity = '0';
        balloon.style.pointerEvents = 'none';

        setTimeout(() => {
            balloon.style.transform = '';
            balloon.style.opacity = '';
            balloon.style.pointerEvents = '';
        }, 3000);
    }

    for (let i = 0; i < 6; i++) {
        createBalloon(i);
    }
}

// ================= 10. EXTRA FIREWORKS CONFETTI BUTTON =================
function initConfettiFireworks() {
    const cannonBtn = document.getElementById('confetti-cannon-btn');
    if (!cannonBtn) return;

    cannonBtn.addEventListener('click', () => {
        triggerGrandCelebration();
    });
}
