/* ---
   script.js
   Handles component loading, hybrid navigation, scroll behaviors, animations, and audio.
   --- */

document.addEventListener('DOMContentLoaded', () => {

    /**
     * Initializes the interactive logic for the hybrid navigation system.
     */
    function initializeNavbar() {
        const navToggle = document.getElementById('nav-toggle');
        const slideInPanel = document.getElementById('slide-in-panel');
        const pageOverlay = document.getElementById('page-overlay');
        const panelCloseBtn = document.getElementById('panel-close-btn');

        if (navToggle && slideInPanel && pageOverlay && panelCloseBtn) {
            const toggleMenu = () => {
                slideInPanel.classList.toggle('is-open');
                pageOverlay.classList.toggle('is-active');
                document.body.classList.toggle('menu-is-open');
            };

            navToggle.addEventListener('click', toggleMenu);
            pageOverlay.addEventListener('click', toggleMenu);
            panelCloseBtn.addEventListener('click', toggleMenu);
        }
    }

    /**
     * Handles the show/hide behavior of the header on scroll.
     */
    function handleHeaderScroll() {
        const header = document.querySelector('.main-header');
        if (!header) return;

        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            const isAtTop = currentScrollY < 50;

            if (document.body.classList.contains('menu-is-open')) return;

            if (isAtTop) {
                header.classList.remove('is-scrolled');
            } else {
                header.classList.add('is-scrolled');
            }

            if (currentScrollY > lastScrollY && !isAtTop) {
                header.classList.add('is-hidden');
            } else {
                header.classList.remove('is-hidden');
            }

            lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
        });
    }

    /**
     * Fetches a component and injects it into its placeholder.
     * @param {string} componentName - The name of the component file (e.g., 'navbar.html').
     * @param {string} placeholderId - The ID of the element to inject the HTML into.
     * @param {function} callback - An optional callback function to run after loading.
     */
    function loadComponent(componentName, placeholderId, callback) {
        fetch(`components/${componentName}`)
            .then(response => {
                if (!response.ok) throw new Error(`Network response was not ok for ${componentName}`);
                return response.text();
            })
            .then(html => {
                const placeholder = document.getElementById(placeholderId);
                if (placeholder) {
                    placeholder.innerHTML = html;
                    if (callback) callback();
                }
            })
            .catch(error => {
                console.error(`Failed to load ${componentName}:`, error);
                const placeholder = document.getElementById(placeholderId);
                if(placeholder) placeholder.innerHTML = `<p style="text-align:center; padding: 1rem;">Error: ${componentName} could not be loaded.</p>`;
            });
    }

    // --- Load All Components ---
    loadComponent('navbar.html', 'navbar-placeholder', () => {
        initializeNavbar();
        handleHeaderScroll();
    });
    
    // MODIFIED: Added a callback to activate Feather Icons after the footer loads.
    loadComponent('footer.html', 'footer-placeholder', () => {
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    });


    // --- Scroll-Triggered Animation Logic ---
    const animatedElements = document.querySelectorAll(
        '.section-intro, .pillar, .essence-cta, .offer-card, .founder-image, .founder-bio'
    );
    
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1 
        });

        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }


    // --- Background Audio Logic ---
    const music = document.getElementById('background-music');
    const musicControl = document.getElementById('music-control');
    const speakerIcon = document.getElementById('speaker-icon');

    if (music && musicControl && speakerIcon) {
        const speakerOnIcon = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>`;
        const speakerOffIcon = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9"x2="23" y2="15"></line>`;

        const toggleMusic = () => {
            if (music.paused) {
                music.play().then(() => {
                    speakerIcon.innerHTML = speakerOnIcon;
                }).catch(error => console.error("Audio playback failed:", error));
            } else {
                music.pause();
                speakerIcon.innerHTML = speakerOffIcon;
            }
        };

        musicControl.addEventListener('click', toggleMusic);

        const startAudioOnInteraction = () => {
             if (music.paused) {
                music.play().then(() => {
                    speakerIcon.innerHTML = speakerOnIcon;
                }).catch(error => console.log("Autoplay was prevented. User must click the control button."));
            }
        };

        document.body.addEventListener('click', startAudioOnInteraction, { once: true });
        document.body.addEventListener('scroll', startAudioOnInteraction, { once: true });
    }
});
