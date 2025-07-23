/* ---
   script.js
   Handles component loading, hybrid navigation, scroll behaviors, animations, and audio.
   Updated with permanent navbar background functionality.
   --- */

document.addEventListener('DOMContentLoaded', () => {

    // --- SMART PATH LOGIC ---
    // Determines the correct relative path to the project root,
    // so components can be loaded from any page depth.
    const path = window.location.pathname;
    const isRoot = path.endsWith('/') || path.endsWith('/index.html');
    const depth = isRoot ? 0 : (path.split('/').length - 2);
    const basePath = '../'.repeat(depth > 0 ? depth : 0);
    // --- END SMART PATH LOGIC ---

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

            // Close menu function
            const closeMenu = () => {
                slideInPanel.classList.remove('is-open');
                pageOverlay.classList.remove('is-active');
                document.body.classList.remove('menu-is-open');
            };

            // Open menu function
            const openMenu = () => {
                slideInPanel.classList.add('is-open');
                pageOverlay.classList.add('is-active');
                document.body.classList.add('menu-is-open');
            };

            // Event listeners
            navToggle.addEventListener('click', toggleMenu);
            pageOverlay.addEventListener('click', closeMenu);
            panelCloseBtn.addEventListener('click', closeMenu);

            // Close menu when clicking on navigation links
            const panelLinks = slideInPanel.querySelectorAll('a');
            panelLinks.forEach(link => {
                link.addEventListener('click', closeMenu);
            });

            // Close menu on Escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    closeMenu();
                }
            });

            // Prevent body scrolling when menu is open
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.attributeName === 'class') {
                        if (document.body.classList.contains('menu-is-open')) {
                            document.body.style.overflow = 'hidden';
                        } else {
                            document.body.style.overflow = '';
                        }
                    }
                });
            });

            observer.observe(document.body, {
                attributes: true,
                attributeFilter: ['class']
            });
        }
    }

    /**
     * Handles the permanent background and enhanced scroll effects for the navbar.
     * The navbar now always has a background, with enhanced styling when scrolling.
     */
    function handleHeaderScroll() {
        const header = document.querySelector('.main-header');
        if (!header) return;

        let lastScrollY = window.scrollY;
        let ticking = false;

        const updateHeader = () => {
            const currentScrollY = window.scrollY;
            const isAtTop = currentScrollY < 50;

            // Don't hide header if menu is open
            if (document.body.classList.contains('menu-is-open')) {
                ticking = false;
                return;
            }

            // Enhanced background effect when scrolling (optional)
            if (isAtTop) {
                header.classList.remove('is-scrolled');
            } else {
                header.classList.add('is-scrolled');
            }

            // Hide/show header based on scroll direction
            if (currentScrollY > lastScrollY && !isAtTop && currentScrollY > 100) {
                header.classList.add('is-hidden');
            } else {
                header.classList.remove('is-hidden');
            }

            lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        };

        // Use requestAnimationFrame for smooth performance
        window.addEventListener('scroll', requestTick, { passive: true });

        // Initialize header state
        updateHeader();
    }

    /**
     * Fetches a component, rewrites its internal links and image paths to be relative 
     * to the current page, and injects it into its placeholder.
     * @param {string} componentName - The name of the component file (e.g., 'navbar.html').
     * @param {string} placeholderId - The ID of the element to inject the HTML into.
     * @param {function} callback - An optional callback function to run after loading.
     */
    function loadComponent(componentName, placeholderId, callback) {
        fetch(`${basePath}components/${componentName}`)
            .then(response => {
                if (!response.ok) throw new Error(`Network response was not ok for ${componentName}`);
                return response.text();
            })
            .then(html => {
                const placeholder = document.getElementById(placeholderId);
                if (!placeholder) return;

                // --- DYNAMIC PATH REWRITING ---
                const tempContainer = document.createElement('div');
                tempContainer.innerHTML = html;

                // Rewrite anchor tags
                const links = tempContainer.querySelectorAll('a');
                links.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
                        link.setAttribute('href', `${basePath}${href}`);
                    }
                });
                
                // Rewrite image tags
                const images = tempContainer.querySelectorAll('img');
                images.forEach(img => {
                    const src = img.getAttribute('src');
                    if (src && !src.startsWith('http') && !src.startsWith('data:')) {
                        img.setAttribute('src', `${basePath}${src}`);
                    }
                });

                // Rewrite video tags
                const videos = tempContainer.querySelectorAll('video source, video');
                videos.forEach(video => {
                    const src = video.getAttribute('src');
                    if (src && !src.startsWith('http') && !src.startsWith('data:')) {
                        video.setAttribute('src', `${basePath}${src}`);
                    }
                });

                // Rewrite audio tags
                const audios = tempContainer.querySelectorAll('audio source, audio');
                audios.forEach(audio => {
                    const src = audio.getAttribute('src');
                    if (src && !src.startsWith('http') && !src.startsWith('data:')) {
                        audio.setAttribute('src', `${basePath}${src}`);
                    }
                });
                // --- END DYNAMIC PATH REWRITING ---

                placeholder.innerHTML = tempContainer.innerHTML;
                
                if (callback) callback();
            })
            .catch(error => {
                console.error(`Failed to load ${componentName}:`, error);
                const placeholder = document.getElementById(placeholderId);
                if(placeholder) {
                    placeholder.innerHTML = `<p style="text-align:center; padding: 1rem; color: #666;">Error: ${componentName} could not be loaded.</p>`;
                }
            });
    }

    /**
     * Smooth scrolling for anchor links with navbar offset
     */
    function initializeSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const header = document.querySelector('.main-header');
                    const navbarHeight = header ? header.offsetHeight : 80;
                    const targetPosition = targetSection.offsetTop - navbarHeight - 20; // Extra 20px padding
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /**
     * Initialize scroll-triggered animations with improved performance
     */
    function initializeScrollAnimations() {
        const animatedElements = document.querySelectorAll(
            '.section-intro, .pillar, .essence-cta, .offer-card, .founder-image, .founder-bio, .blog-card, .the-circle-content, .the-journey-content'
        );
        
        if (animatedElements.length > 0) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        // Optional: unobserve to improve performance
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px' // Trigger slightly before element is fully visible
            });

            animatedElements.forEach((el, index) => {
                // Add staggered animation delay
                el.style.animationDelay = `${index * 100}ms`;
                observer.observe(el);
            });
        }
    }

    /**
     * Enhanced background audio logic with better error handling
     */
    function initializeBackgroundAudio() {
        const music = document.getElementById('background-music');
        const musicControl = document.getElementById('music-control');
        const speakerIcon = document.getElementById('speaker-icon');

        if (!music || !musicControl || !speakerIcon) return;

        const speakerOnIcon = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>`;
        const speakerOffIcon = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>`;

        let hasInteracted = false;

        const toggleMusic = () => {
            if (music.paused) {
                music.play().then(() => {
                    speakerIcon.innerHTML = speakerOnIcon;
                    speakerIcon.classList.remove('muted');
                    musicControl.setAttribute('title', 'Pause Music');
                }).catch(error => {
                    console.error("Audio playback failed:", error);
                    showAudioError();
                });
            } else {
                music.pause();
                speakerIcon.innerHTML = speakerOffIcon;
                speakerIcon.classList.add('muted');
                musicControl.setAttribute('title', 'Play Music');
            }
        };

        const showAudioError = () => {
            speakerIcon.innerHTML = speakerOffIcon;
            speakerIcon.classList.add('muted');
            musicControl.setAttribute('title', 'Audio unavailable');
            musicControl.style.opacity = '0.5';
        };

        // Set initial volume
        music.volume = 0.3;

        // Handle audio errors
        music.addEventListener('error', showAudioError);
        music.addEventListener('loadstart', () => {
            console.log('Audio loading started...');
        });

        musicControl.addEventListener('click', toggleMusic);

        // Auto-start audio on first user interaction (respecting browser policies)
        const startAudioOnInteraction = () => {
            if (hasInteracted) return;
            
            music.play().then(() => {
                speakerIcon.innerHTML = speakerOnIcon;
                speakerIcon.classList.remove('muted');
                musicControl.setAttribute('title', 'Pause Music');
                hasInteracted = true;
            }).catch(error => {
                console.log("Autoplay was prevented. User must click the control button.");
                hasInteracted = true;
            });
        };

        // Try to start audio on various user interactions
        ['click', 'touchstart', 'keydown'].forEach(event => {
            document.addEventListener(event, startAudioOnInteraction, { once: true, passive: true });
        });
    }

    /**
     * Initialize form handling for contact forms, newsletters, etc.
     */
    function initializeForms() {
        const forms = document.querySelectorAll('form[action*="formspree"]');
        
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) {
                    const originalText = submitBtn.textContent;
                    submitBtn.textContent = 'Sending...';
                    submitBtn.disabled = true;
                    
                    // Re-enable after 3 seconds (form will redirect or show success)
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                    }, 3000);
                }
            });
        });
    }

    /**
     * Handle image loading errors with graceful fallbacks
     */
    function initializeImageErrorHandling() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            img.addEventListener('error', function() {
                if (!this.dataset.fallbackApplied) {
                    // Apply fallback image
                    const altText = this.alt || 'Image not available';
                    const width = this.width || 400;
                    const height = this.height || 300;
                    
                    this.src = `https://placehold.co/${width}x${height}/F9F7FD/49375B?text=${encodeURIComponent(altText)}`;
                    this.dataset.fallbackApplied = 'true';
                }
            });
        });
    }

    // --- COMPONENT LOADING AND INITIALIZATION ---
    
    // Load navbar first, then initialize all navbar-dependent functionality
    loadComponent('navbar.html', 'navbar-placeholder', () => {
        initializeNavbar();
        handleHeaderScroll();
        initializeSmoothScrolling();
    });
    
    // Load footer and initialize Feather icons
    loadComponent('footer.html', 'footer-placeholder', () => {
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    });

    // Initialize all other functionality
    initializeScrollAnimations();
    initializeBackgroundAudio();
    initializeForms();
    initializeImageErrorHandling();

    // --- PERFORMANCE OPTIMIZATIONS ---
    
    // Preload critical images when page is idle
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            const criticalImages = document.querySelectorAll('img[data-preload="true"]');
            criticalImages.forEach(img => {
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
            });
        });
    }

    // Add loading states for better UX
    window.addEventListener('load', () => {
        document.body.classList.add('page-loaded');
        
        // Hide any loading spinners
        const loaders = document.querySelectorAll('.loader, .loading');
        loaders.forEach(loader => {
            loader.style.display = 'none';
        });
    });

    // --- ACCESSIBILITY IMPROVEMENTS ---
    
    // Add focus management for better keyboard navigation
    document.addEventListener('keydown', (e) => {
        // Escape key handling for modals/overlays
        if (e.key === 'Escape') {
            // Close any open modals, menus, etc.
            const activeOverlays = document.querySelectorAll('.is-active, .is-open');
            activeOverlays.forEach(overlay => {
                overlay.classList.remove('is-active', 'is-open');
            });
        }

        // Tab key handling for better focus management
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    // Remove keyboard navigation class when mouse is used
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });

    // --- ERROR HANDLING ---
    
    // Global error handler for any uncaught errors
    window.addEventListener('error', (e) => {
        console.error('Global error caught:', e.error);
        // Could send to analytics or error reporting service
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled promise rejection:', e.reason);
        e.preventDefault(); // Prevent default browser error handling
    });

    console.log('🌸 Sensuous-Living script initialized successfully');
});