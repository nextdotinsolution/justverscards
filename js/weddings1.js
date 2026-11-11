/**
 * WEDDINGS1 INVITATION ENGINE
 * Double Wedding Celebration:
 * Shaheen Ahmed & Noora Maisoon • Shifa & Ajmal Farhan
 * Saturday, 2nd January 2027 • Meruzila Convention Centre, Elettil, Koduvally
 */

(function () {
    'use strict';

    // Target Event Date: Saturday, 2nd January 2027 at 10:30 AM IST
    const EVENT_DATE = new Date('2027-01-02T10:30:00+05:30');

    // =========================================================================
    // 1. CINEMATIC ENVELOPE OVERLAY & VIDEO UNVEIL SEQUENCE
    // =========================================================================
    const overlay = document.getElementById('weiOverlay');
    const videoWrap = document.getElementById('weiVideoWrap');
    const video = document.getElementById('weiVideo');
    const skipBtn = document.getElementById('weiSkipBtn');
    const audio = document.getElementById('weiAudio');
    const audioBtn = document.getElementById('weiAudioBtn');
    const iconPause = document.getElementById('weiIconPause');
    const iconPlay = document.getElementById('weiIconPlay');

    let done = false;
    let audioUnlocked = false;

    function unlockAudio() {
        if (audioUnlocked || !audio) return;
        audioUnlocked = true;
        const p = audio.play();
        if (p && p.then) {
            p.then(function () {
                audio.pause();
                audio.currentTime = 0;
            }).catch(function () {});
        } else {
            audio.pause();
        }
    }

    function startVideo() {
        if (done) return;
        done = true;

        if (overlay) {
            overlay.style.opacity = '0';
            overlay.style.pointerEvents = 'none';
            setTimeout(function () {
                overlay.style.display = 'none';
            }, 1400);
        }

        let videoWatchdog = null;

        if (videoWrap && video) {
            videoWrap.classList.add('wei-video-in');
            const vp = video.play();
            if (vp && vp.catch) vp.catch(function () {});

            videoWatchdog = setTimeout(function () {
                if (!video.dataset.fading) {
                    video.dataset.fading = '1';
                    endSequence();
                }
            }, 5500);

            videoWrap.addEventListener('click', function () {
                if (videoWatchdog) clearTimeout(videoWatchdog);
                if (video) video.pause();
                endSequence();
            }, { once: true });
        }

        if (audio) {
            audio.volume = 1.0;
            const ap = audio.play();
            if (ap && ap.catch) ap.catch(function () {});
        }
    }

    function endSequence() {
        if (!videoWrap) return;
        videoWrap.classList.remove('wei-video-in');
        videoWrap.classList.add('wei-video-out');
        setTimeout(function () {
            videoWrap.style.display = 'none';
        }, 1400);

        if (audioBtn) {
            audioBtn.style.visibility = 'visible';
            audioBtn.style.opacity = '1';
        }

        const artboard = document.getElementById('front-artboard');
        if (artboard && !artboard.classList.contains('artboard-revealed')) {
            artboard.classList.add('artboard-revealed');
        }
    }

    if (overlay) {
        overlay.addEventListener('touchstart', unlockAudio, { passive: true });
        overlay.addEventListener('click', startVideo);
    }

    if (skipBtn) {
        skipBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            if (video) video.pause();
            endSequence();
        });
    }

    if (video) {
        video.addEventListener('timeupdate', function () {
            if (video.duration && video.currentTime >= video.duration - 0.8 && !video.dataset.fading) {
                video.dataset.fading = '1';
                endSequence();
            }
        });

        video.addEventListener('ended', endSequence);
    }

    // Fast preview bypass via URL parameter (?preview=1 or ?skip=1)
    if (new URLSearchParams(window.location.search).has('skip') || new URLSearchParams(window.location.search).has('preview')) {
        if (overlay) overlay.style.display = 'none';
        if (videoWrap) videoWrap.style.display = 'none';
        const artboard = document.getElementById('front-artboard');
        if (artboard) artboard.classList.add('artboard-revealed');
        document.querySelectorAll('.reveal-anim').forEach(function(el) {
            el.classList.add('is-visible', 'revealed');
        });
    }

    // Audio Play/Pause Button Toggle
    if (audioBtn && audio) {
        audioBtn.addEventListener('click', function () {
            if (audio.paused) {
                audio.play();
                if (iconPlay) iconPlay.style.display = 'none';
                if (iconPause) iconPause.style.display = 'block';
            } else {
                audio.pause();
                if (iconPlay) iconPlay.style.display = 'block';
                if (iconPause) iconPause.style.display = 'none';
            }
        });
    }

    if (video) {
        video.load();
    }

    if (!overlay || overlay.style.display === 'none') {
        const artboard = document.getElementById('front-artboard');
        if (artboard) artboard.classList.add('artboard-revealed');
    }

    // =========================================================================
    // 2. FRONT ARTBOARD "SCROLL DOWN" NAVIGATION
    // =========================================================================
    const scrollBtn = document.getElementById('artboard-scroll-btn') || document.querySelector('.artboard-scroll-down');
    if (scrollBtn) {
        scrollBtn.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.getElementById('countdownContainer') || document.querySelector('.section-countdown-artboard');
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }

    // =========================================================================
    // 3. SHIMMERING LIVE COUNTDOWN TIMER
    // =========================================================================
    const elDays = document.getElementById('days');
    const elHours = document.getElementById('hours');
    const elMins = document.getElementById('minutes');
    const elSecs = document.getElementById('seconds');
    const countdownContainer = document.getElementById('countdownContainer');

    const prev = { days: null, hours: null, minutes: null, seconds: null };
    let countdownRevealed = false;

    function flip(el, newVal) {
        if (!el || el.textContent === newVal) return;
        el.classList.add('flip-out');
        setTimeout(function () {
            el.classList.remove('flip-out');
            el.classList.add('flip-in');
            el.textContent = newVal;
            el.offsetHeight;
            el.classList.remove('flip-in');
        }, 520);
    }

    function tickCountdown() {
        const now = new Date();
        const dist = EVENT_DATE.getTime() - now.getTime();

        if (dist < 0) {
            if (countdownContainer) {
                countdownContainer.innerHTML = '<div style="font-family:Cinzel,serif;font-size:24px;color:#A67D2B;letter-spacing:0.08em;">Barakallahu Feekum — Today is The Blessed Day!</div>';
            }
            return;
        }

        const d = String(Math.floor(dist / (1000 * 60 * 60 * 24)));
        const h = String(Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
        const m = String(Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
        const s = String(Math.floor((dist % (1000 * 60)) / 1000)).padStart(2, '0');

        if (elDays && d !== prev.days) { flip(elDays, d); prev.days = d; }
        if (elHours && h !== prev.hours) { flip(elHours, h); prev.hours = h; }
        if (elMins && m !== prev.minutes) { flip(elMins, m); prev.minutes = m; }
        if (elSecs && s !== prev.seconds) { flip(elSecs, s); prev.seconds = s; }
    }

    tickCountdown();
    setInterval(tickCountdown, 1000);

    function doCountdownReveal() {
        if (countdownRevealed) return;
        countdownRevealed = true;
        document.querySelectorAll('.number').forEach(function (el) { el.classList.add('revealed'); });
        document.querySelectorAll('.label').forEach(function (el) { el.classList.add('revealed'); });
        document.querySelectorAll('.separator').forEach(function (el) { el.classList.add('revealed'); });
    }

    if (countdownContainer && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function (entries) {
            if (entries[0].isIntersecting) {
                doCountdownReveal();
                observer.disconnect();
            }
        }, { threshold: 0.3 });
        observer.observe(countdownContainer);

        setTimeout(function () {
            const r = countdownContainer.getBoundingClientRect();
            if (r.top < window.innerHeight && r.bottom > 0) doCountdownReveal();
        }, 300);
    } else {
        doCountdownReveal();
    }

    // =========================================================================
    // 4. AMBIENT FLOATING GOLD DUST PARTICLES CANVAS
    // =========================================================================
    const dustCanvas = document.getElementById('ambient-canvas');
    if (dustCanvas) {
        const dCtx = dustCanvas.getContext('2d');
        let dWidth = (dustCanvas.width = window.innerWidth);
        let dHeight = (dustCanvas.height = window.innerHeight);

        const particles = [];
        const TOTAL_PARTICLES = 36;

        function Particle() {
            this.reset();
        }

        Particle.prototype.reset = function () {
            this.x = Math.random() * dWidth;
            this.y = Math.random() * dHeight + dHeight;
            this.radius = Math.random() * 2 + 0.8;
            this.speedY = Math.random() * 0.45 + 0.2;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.6 + 0.2;
            this.pulse = Math.random() * Math.PI;
        };

        Particle.prototype.update = function () {
            this.y -= this.speedY;
            this.x += this.speedX;
            this.pulse += 0.03;
            if (this.y < -10) this.reset();
        };

        Particle.prototype.draw = function () {
            dCtx.beginPath();
            dCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            const currentAlpha = Math.max(0.1, this.opacity + Math.sin(this.pulse) * 0.25);
            dCtx.fillStyle = 'rgba(216, 186, 114, ' + currentAlpha + ')';
            dCtx.shadowBlur = 8;
            dCtx.shadowColor = 'rgba(180, 140, 61, 0.5)';
            dCtx.fill();
        };

        for (let i = 0; i < TOTAL_PARTICLES; i++) {
            const p = new Particle();
            p.y = Math.random() * dHeight;
            particles.push(p);
        }

        function animateDust() {
            dCtx.clearRect(0, 0, dWidth, dHeight);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            requestAnimationFrame(animateDust);
        }

        animateDust();

        window.addEventListener('resize', function () {
            dWidth = dustCanvas.width = window.innerWidth;
            dHeight = dustCanvas.height = window.innerHeight;
        });
    }

    // =========================================================================
    // 5. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
    // =========================================================================
    const revealElements = document.querySelectorAll('.reveal-anim');
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver(
            function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.08, rootMargin: '0px 0px -25px 0px' }
        );

        revealElements.forEach(function (el) {
            revealObserver.observe(el);
        });
    } else {
        revealElements.forEach(function (el) {
            el.classList.add('revealed');
        });
    }

    // =========================================================================
    // 6. CALENDAR INTEGRATIONS (GOOGLE CALENDAR & ICAL DOWNLOAD)
    // =========================================================================
    const btnGoogleCal = document.getElementById('btn-google-calendar');
    const btnAppleCal = document.getElementById('btn-apple-calendar');
    const btnCalToggle = document.getElementById('btn-save-calendar-toggle');
    const calMenu = document.getElementById('calendar-dropdown-menu');

    if (btnCalToggle && calMenu) {
        btnCalToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            const isOpen = calMenu.classList.toggle('active');
            btnCalToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        document.addEventListener('click', function (e) {
            if (!e.target.closest('.calendar-dropdown-wrap')) {
                calMenu.classList.remove('active');
                btnCalToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    const calTitle = encodeURIComponent('Wedding of Shaheen & Noora • Shifa & Ajmal');
    const calDetails = encodeURIComponent(
        'We warmly invite you to celebrate the wedding of:\n\n' +
        '• Shaheen Ahmed & Noora Maisoon\n' +
        '• Shifa & Ajmal Farhan\n\n' +
        'Date: Saturday, 2nd January 2027\n' +
        'Time: 10:30 AM to 2:30 PM\n' +
        'Venue: Meruzila Convention Centre, Elettil, Koduvally (Near Vadi Husna Public School)\n\n' +
        'Location Map: https://maps.app.goo.gl/gqiC6uwyXmuQNy3B7'
    );
    const calLocation = encodeURIComponent('Meruzila Convention Centre, Elettil, Koduvally, Near Vadi Husna Public School');
    // Saturday, 2 January 2027: 10:30 AM to 2:30 PM IST (UTC 05:00 to 09:00)
    const calDates = '20270102T050000Z/20270102T090000Z';

    if (btnGoogleCal) {
        btnGoogleCal.href = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' +
            calTitle + '&dates=' + calDates + '&details=' + calDetails + '&location=' + calLocation;
    }

    if (btnAppleCal) {
        btnAppleCal.addEventListener('click', function () {
            const icsContent = [
                'BEGIN:VCALENDAR',
                'VERSION:2.0',
                'PRODID:-//Shaheen Noora Shifa Ajmal//Wedding Invitation//EN',
                'CALSCALE:GREGORIAN',
                'METHOD:PUBLISH',
                'BEGIN:VEVENT',
                'UID:shaheen-noora-shifa-ajmal-2027@invitation.com',
                'DTSTAMP:20261111T120000Z',
                'DTSTART:20270102T050000Z',
                'DTEND:20270102T090000Z',
                'SUMMARY:Wedding of Shaheen & Noora • Shifa & Ajmal',
                'DESCRIPTION:Wedding Celebration of Shaheen Ahmed & Noora Maisoon and Shifa & Ajmal Farhan at Meruzila Convention Centre\\, Elettil\\, Koduvally.',
                'LOCATION:Meruzila Convention Centre\\, Elettil\\, Koduvally\\, Kerala',
                'STATUS:CONFIRMED',
                'END:VEVENT',
                'END:VCALENDAR'
            ].join('\r\n');

            const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.setAttribute('download', 'Wedding_Shaheen_Noora_Shifa_Ajmal.ics');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }
})();

