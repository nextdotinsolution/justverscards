/**
 * NEENA WITH NIKHIL — THE SACRED GARDEN
 * Christian Betrothal Ceremony Engine
 * 28th October 2026 • Little Flower Church, Poomala
 * 
 * Features:
 * 1. Exact Envelope Overlay & Unveil Video Sequence (matching The Sacred Garden)
 * 2. Samsung/iOS Touch Audio Priming & Floating Music Controller
 * 3. Smooth Scroll Navigation for Front Artboard
 * 4. Shimmering Gold Live Countdown Timer with Flip & Candlelight Animations
 * 5. Interactive Gold Foil Scratch & Reveal Couple Portrait Canvas
 * 6. Ambient Floating Golden Dust Particle Canvas
 * 7. Calendar Integrations (Google Calendar & Apple/iCal .ics)
 * 8. Sacred Prayers & Blessings Guestbook with LocalStorage
 * 9. Pre-populated WhatsApp Sharing
 * 10. Scroll-Triggered Reveal Animations
 */

(function () {
    'use strict';

    // Target Event Date: Friday, 5th February 2027 at 10:30 AM IST
    const EVENT_DATE = new Date('2027-02-05T10:30:00+05:30');

    // =========================================================================
    // 1. CINEMATIC ENVELOPE OVERLAY & VIDEO UNVEIL SEQUENCE
    // (Exact Architecture from The Sacred Garden)
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

    // Samsung/Android touchstart priming fix:
    // Non-muted audio.play() is not reliably accepted from a touchstart on Samsung Internet/Android.
    // Priming audio silently on touchstart unlocks it so that the click event can play it seamlessly.
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

        // Fade out initial envelope
        if (overlay) {
            overlay.style.opacity = '0';
            overlay.style.pointerEvents = 'none';
            setTimeout(function () {
                overlay.style.display = 'none';
            }, 1400);
        }

        let videoWatchdog = null;

        // Show and play opening envelope video
        if (videoWrap && video) {
            videoWrap.classList.add('wei-video-in');
            const vp = video.play();
            if (vp && vp.catch) vp.catch(function () {});

            // Safety watchdog: Video is 4.8s. If video pauses or stalls on mobile,
            // force complete sequence after 5.5s so user is never stuck in the middle.
            videoWatchdog = setTimeout(function () {
                if (!video.dataset.fading) {
                    video.dataset.fading = '1';
                    endSequence();
                }
            }, 5500);

            // Tapping anywhere on video screen also immediately completes sequence
            videoWrap.addEventListener('click', function () {
                if (videoWatchdog) clearTimeout(videoWatchdog);
                if (video) video.pause();
                endSequence();
            }, { once: true });
        }

        // Start music simultaneously
        if (audio) {
            audio.volume = 1.0;
            const ap = audio.play();
            if (ap && ap.catch) ap.catch(function () {});
        }

        // Pre-play ambient swans background video during tap gesture
        const artboardVideo = document.querySelector('.artboard-video');
        if (artboardVideo) {
            artboardVideo.play().catch(function () {});
        }
    }

    function endSequence() {
        if (!videoWrap) return;
        videoWrap.classList.remove('wei-video-in');
        videoWrap.classList.add('wei-video-out');
        setTimeout(function () {
            videoWrap.style.display = 'none';
        }, 1400);

        // Reveal floating music controller button
        if (audioBtn) {
            audioBtn.style.visibility = 'visible';
            audioBtn.style.opacity = '1';
        }

        // Trigger artboard one-shot entrance animation & ensure background video plays
        const artboard = document.getElementById('front-artboard');
        if (artboard && !artboard.classList.contains('artboard-revealed')) {
            artboard.classList.add('artboard-revealed');
        }
        const artboardVideo = document.querySelector('.artboard-video');
        if (artboardVideo && artboardVideo.paused) {
            artboardVideo.play().catch(function () {});
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

    // Smoothly fade video 0.8s before end
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

    // Fallback: If user directly views page without envelope or envelope was already closed,
    // ensure the artboard font entrance animation fires gracefully once.
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
    // 3. SHIMMERING CANDLELIGHT LIVE COUNTDOWN TIMER (rec2487446093)
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
            el.offsetHeight; // Force reflow
            el.classList.remove('flip-in');
        }, 520);
    }

    function tickCountdown() {
        const now = new Date();
        const dist = EVENT_DATE.getTime() - now.getTime();

        if (dist < 0) {
            if (countdownContainer) {
                countdownContainer.innerHTML = '<div style="font-family:Cinzel,serif;font-size:24px;color:#A67D2B;">Barakallahu Feekum — Today is The Day! 🌙</div>';
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
    // 4. INTERACTIVE SCRATCH & REVEAL PORTRAIT CANVAS
    // =========================================================================
    const scratchCanvas = document.getElementById('scratch-canvas');
    const portraitHint = document.getElementById('scratch-hint');

    if (scratchCanvas) {
        const sCtx = scratchCanvas.getContext('2d');
        let cleared = false;
        let isDrawing = false;
        let isScratching = false;
        let isScrolling = false;
        let lastX = 0;
        let lastY = 0;
        let touchStartX = 0;
        let touchStartY = 0;
        let touchStartTime = 0;
        let scratchCount = 0;

        function triggerReveal() {
            if (cleared) return;
            cleared = true;
            scratchCanvas.classList.add('revealed');
            scratchCanvas.style.pointerEvents = 'none';
            scratchCanvas.style.transition = 'opacity 0.6s ease-out, filter 0.6s ease-out';
            scratchCanvas.style.filter = 'blur(6px)';
            scratchCanvas.style.opacity = '0';

            setTimeout(function () {
                scratchCanvas.style.display = 'none';
            }, 600);

            if (portraitHint) {
                portraitHint.textContent = 'Blessed by the Lord';
            }
        }

        // Tap hint to reveal
        if (portraitHint) {
            portraitHint.style.cursor = 'pointer';
            portraitHint.addEventListener('click', triggerReveal);
            portraitHint.addEventListener('touchend', function (e) {
                if (e.cancelable) e.preventDefault();
                triggerReveal();
            });
        }

        function initScratchCanvas() {
            if (cleared) return;
            const rect = scratchCanvas.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) return;
            scratchCanvas.width = rect.width;
            scratchCanvas.height = rect.height;

            // Warm gold luxury foil cover
            const grad = sCtx.createLinearGradient(0, 0, rect.width, rect.height);
            grad.addColorStop(0, '#B48C3D');
            grad.addColorStop(0.35, '#E8D49B');
            grad.addColorStop(0.65, '#A67D2B');
            grad.addColorStop(1, '#8C6819');

            sCtx.fillStyle = grad;
            sCtx.fillRect(0, 0, rect.width, rect.height);

            // Sacred Crescent & Monogram on scratch layer
            sCtx.fillStyle = '#ffffff';
            sCtx.font = 'bold 24px Cinzel, serif';
            sCtx.textAlign = 'center';
            sCtx.textBaseline = 'middle';
            sCtx.fillText('🌙', rect.width / 2, rect.height / 2 - 14);
            sCtx.font = '600 13px Cinzel, serif';
            sCtx.fillText('SCRATCH TO REVEAL', rect.width / 2, rect.height / 2 + 18);
        }

        setTimeout(initScratchCanvas, 300);
        window.addEventListener('resize', function () {
            if (!cleared) initScratchCanvas();
        });

        function scratchAt(x, y) {
            sCtx.globalCompositeOperation = 'destination-out';
            sCtx.beginPath();
            sCtx.arc(x, y, 38, 0, Math.PI * 2);
            sCtx.fill();
        }

        function scratchLine(x1, y1, x2, y2) {
            sCtx.globalCompositeOperation = 'destination-out';
            sCtx.lineWidth = 72;
            sCtx.lineCap = 'round';
            sCtx.lineJoin = 'round';
            sCtx.beginPath();
            sCtx.moveTo(x1, y1);
            sCtx.lineTo(x2, y2);
            sCtx.stroke();
        }

        function checkScratchPercentage(isRelease) {
            if (cleared) return;
            const w = scratchCanvas.width;
            const h = scratchCanvas.height;
            if (w === 0 || h === 0) return;
            try {
                const imgData = sCtx.getImageData(0, 0, w, h);
                const pixels = imgData.data;
                let transparentPixels = 0;
                let totalSampled = 0;

                for (let i = 3; i < pixels.length; i += 16) {
                    totalSampled++;
                    if (pixels[i] === 0) transparentPixels++;
                }

                const ratio = transparentPixels / totalSampled;
                // Auto reveal if >= 12% cleared during swipe, or >= 5% on finger release, or after 5 strokes
                if (ratio >= 0.12 || (isRelease && (ratio >= 0.05 || scratchCount >= 5))) {
                    triggerReveal();
                }
            } catch (err) {
                if (isRelease) triggerReveal();
            }
        }

        function getPos(e) {
            const rect = scratchCanvas.getBoundingClientRect();
            let clientX = e.clientX;
            let clientY = e.clientY;
            if (e.touches && e.touches.length > 0) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else if (e.changedTouches && e.changedTouches.length > 0) {
                clientX = e.changedTouches[0].clientX;
                clientY = e.changedTouches[0].clientY;
            }
            return {
                x: clientX - rect.left,
                y: clientY - rect.top
            };
        }

        // Mouse events (Desktop)
        scratchCanvas.addEventListener('mousedown', function (e) {
            if (cleared) return;
            isDrawing = true;
            touchStartTime = Date.now();
            const pos = getPos(e);
            lastX = pos.x;
            lastY = pos.y;
            touchStartX = pos.x;
            touchStartY = pos.y;
            scratchAt(pos.x, pos.y);
            scratchCount++;
            checkScratchPercentage(false);
        });

        window.addEventListener('mousemove', function (e) {
            if (!isDrawing || cleared) return;
            const pos = getPos(e);
            scratchLine(lastX, lastY, pos.x, pos.y);
            lastX = pos.x;
            lastY = pos.y;
            scratchCount++;
            if (scratchCount % 3 === 0) {
                checkScratchPercentage(false);
            }
        });

        window.addEventListener('mouseup', function (e) {
            if (isDrawing) {
                isDrawing = false;
                const dist = Math.hypot(lastX - touchStartX, lastY - touchStartY);
                if (Date.now() - touchStartTime < 280 && dist < 15) {
                    triggerReveal();
                } else {
                    checkScratchPercentage(true);
                }
            }
        });

        // Touch events (Mobile: Direction-aware for silky-smooth vertical page scrolling)
        scratchCanvas.addEventListener('touchstart', function (e) {
            if (cleared) return;
            // IMPORTANT: Do NOT call preventDefault() here so the browser can freely scroll vertically!
            isDrawing = true;
            isScratching = false;
            isScrolling = false;
            touchStartTime = Date.now();
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            const pos = getPos(e);
            lastX = pos.x;
            lastY = pos.y;
        }, { passive: true });

        scratchCanvas.addEventListener('touchmove', function (e) {
            if (!isDrawing || cleared) return;
            if (isScrolling) return; // Allow uninterrupted native vertical scroll

            const touch = e.touches[0];
            const dx = touch.clientX - touchStartX;
            const dy = touch.clientY - touchStartY;
            const absX = Math.abs(dx);
            const absY = Math.abs(dy);

            // Determine gesture intent once moved past 6px
            if (!isScratching && (absX > 6 || absY > 6)) {
                // If vertical motion dominates, it's a page scroll
                if (absY > absX * 1.25) {
                    isScrolling = true;
                    return; // Let browser scroll naturally
                } else {
                    isScratching = true;
                }
            }

            if (isScratching) {
                if (e.cancelable) e.preventDefault();
                const pos = getPos(e);
                scratchLine(lastX, lastY, pos.x, pos.y);
                lastX = pos.x;
                lastY = pos.y;
                scratchCount++;

                if (scratchCount % 3 === 0) {
                    checkScratchPercentage(false);
                }
            }
        }, { passive: false });

        scratchCanvas.addEventListener('touchend', function (e) {
            if (isDrawing && !cleared) {
                isDrawing = false;
                const touchEnd = e.changedTouches && e.changedTouches[0] ? e.changedTouches[0] : null;
                const endX = touchEnd ? touchEnd.clientX : touchStartX;
                const endY = touchEnd ? touchEnd.clientY : touchStartY;
                const dist = Math.hypot(endX - touchStartX, endY - touchStartY);
                const duration = Date.now() - touchStartTime;

                // Tap-to-reveal: quick touch without large movement
                if (duration < 320 && dist < 18) {
                    triggerReveal();
                    return;
                }

                // If user scratched or performed strokes, finalize reveal
                if (isScratching || scratchCount >= 3) {
                    checkScratchPercentage(true);
                }
            }
            isDrawing = false;
            isScratching = false;
            isScrolling = false;
        });

        scratchCanvas.addEventListener('touchcancel', function () {
            isDrawing = false;
            isScratching = false;
            isScrolling = false;
        });
    }

    // =========================================================================
    // 5. AMBIENT FLOATING GOLD DUST PARTICLES CANVAS
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
    // 6. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
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
    // 7. CALENDAR INTEGRATIONS (GOOGLE CALENDAR & ICAL DOWNLOAD)
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

    const calTitle = encodeURIComponent('Nikah & Walima Ceremony | Farhan & Ayesha');
    const calDetails = encodeURIComponent(
        'Solemnization of Nikah & Walima Ceremony between Ayesha Mariyam and Mohammed Farhan.\n\nNikah Ceremony: 10:30 AM at Kozhikode Beach Juma Masjid, Beach Road, Vellayil, Kozhikode.\nWalima Dawat & Reception: 12:30 PM Onwards at The Gateway Hotel (Taj), PT Usha Road, Kozhikode.\n\nLocation Map: https://maps.google.com/?q=Beach+Juma+Masjid+Kozhikode'
    );
    const calLocation = encodeURIComponent('Kozhikode Beach Juma Masjid, Beach Road, Vellayil, Kozhikode, Kerala');
    // 5 Feb 2027 10:30 AM IST to 3:30 PM IST (05:00 UTC to 10:00 UTC)
    const calDates = '20270205T050000Z/20270205T100000Z';

    if (btnGoogleCal) {
        btnGoogleCal.href = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' +
            calTitle + '&dates=' + calDates + '&details=' + calDetails + '&location=' + calLocation;
    }

    if (btnAppleCal) {
        btnAppleCal.addEventListener('click', function () {
            const icsContent = [
                'BEGIN:VCALENDAR',
                'VERSION:2.0',
                'PRODID:-//Farhan and Ayesha//Muslim Wedding Invitation//EN',
                'CALSCALE:GREGORIAN',
                'METHOD:PUBLISH',
                'BEGIN:VEVENT',
                'UID:farhan-ayesha-nikah-2027@invitation.com',
                'DTSTAMP:20261002T100000Z',
                'DTSTART:20270205T050000Z',
                'DTEND:20270205T100000Z',
                'SUMMARY:Nikah & Walima Ceremony | Farhan & Ayesha',
                'DESCRIPTION:Solemnization of Nikah Ceremony between Ayesha Mariyam and Mohammed Farhan at Kozhikode Beach Juma Masjid followed by Walima Dawat at The Gateway Hotel.',
                'LOCATION:Kozhikode Beach Juma Masjid\\, Beach Road\\, Vellayil\\, Kozhikode\\, Kerala',
                'STATUS:CONFIRMED',
                'END:VEVENT',
                'END:VCALENDAR'
            ].join('\r\n');

            const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.setAttribute('download', 'Farhan_Ayesha_Nikah.ics');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }
})();

