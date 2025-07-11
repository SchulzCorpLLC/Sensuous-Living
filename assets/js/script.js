/* ---
   script.js
   Handles mobile navigation, scroll-triggered animations, and background audio.
   --- */

document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Navigation Logic ---
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navActions = document.querySelector('.nav-actions');
    const navbar = document.querySelector('.navbar');

    if (navToggle && navMenu && navActions && navbar) {
        const navActionsOriginalParent = navActions.parentNode;
        navToggle.addEventListener('click', () => {
            const isMenuOpen = navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            if (isMenuOpen) {
                document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
                navMenu.appendChild(navActions);
                navActions.style.display = 'flex';
            } else {
                document.body.style.overflow = '';
                navActionsOriginalParent.appendChild(navActions);
                navActions.style.display = '';
            }
        });
    }

    // --- Resize handler for navigation ---
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024) {
            document.body.style.overflow = '';
            if (navToggle && navMenu && navActions && navbar) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                if (navActions.parentNode !== navbar) {
                    navbar.appendChild(navActions);
                }
                navActions.style.display = 'flex';
            }
        } else {
            if (navMenu && !navMenu.classList.contains('active')) {
                if (navActions.parentNode !== navbar) {
                    navbar.appendChild(navActions);
                }
                navActions.style.display = 'none';
            }
        }
    });


    // --- Scroll-Triggered Animation Logic ---
    const animatedElements = document.querySelectorAll(
        '.section-title, .section-intro, .pillar, .essence-cta, .offer-card, .founder-image, .founder-bio'
    );
    
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1 
        });

        animatedElements.forEach(el => {
            el.style.animationPlayState = 'paused';
            observer.observe(el);
        });
    }

    // --- Background Audio Logic (NEW) ---
    const music = document.getElementById('background-music');
    const musicControl = document.getElementById('music-control');
    const speakerIcon = document.getElementById('speaker-icon');

    if (music && musicControl && speakerIcon) {
        // SVG paths for speaker icons
        const speakerOnIcon = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>`;
        const speakerOffIcon = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9"x2="23" y2="15"></line>`;

        const toggleMusic = () => {
            if (music.paused) {
                music.play().then(() => {
                    speakerIcon.innerHTML = speakerOnIcon;
                }).catch(error => {
                    console.error("Audio playback failed:", error);
                    // If autoplay fails, the user must interact with the button again.
                });
            } else {
                music.pause();
                speakerIcon.innerHTML = speakerOffIcon;
            }
        };

        musicControl.addEventListener('click', toggleMusic);

        // Attempt to autoplay on first user interaction with the page
        const startAudioOnInteraction = () => {
             if (music.paused) {
                music.play().then(() => {
                    speakerIcon.innerHTML = speakerOnIcon;
                }).catch(error => {
                    // This is expected if the user hasn't interacted yet.
                    // The user can still click the control button.
                    console.log("Autoplay was prevented. User must click the control button.");
                });
            }
            // Remove the listener after the first interaction
            document.body.removeEventListener('click', startAudioOnInteraction);
            document.body.removeEventListener('scroll', startAudioOnInteraction);
        };

        document.body.addEventListener('click', startAudioOnInteraction, { once: true });
        document.body.addEventListener('scroll', startAudioOnInteraction, { once: true });
    }
});
