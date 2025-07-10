/**
 * Feminine Sensuality - script.js
 * ---
 * Pure, vanilla JavaScript for elegant interactions.
 * No frameworks, no libraries.
 */

// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {

    /**
     * Component Loader
     * ---
     * Fetches and injects reusable HTML components like the navbar and footer.
     * This keeps the main HTML files clean and makes components easy to manage.
     */
    const loadComponent = (url, placeholderId) => {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Component failed to load: ${url}`);
                }
                return response.text();
            })
            .then(data => {
                document.getElementById(placeholderId).innerHTML = data;
                // Re-run scripts that might be needed for the new content, like the mobile menu
                if (placeholderId === 'navbar-placeholder') {
                    initializeNavbarScripts();
                }
            })
            .catch(error => console.error(error));
    };

    // Load the main components
    loadComponent('components/navbar.html', 'navbar-placeholder');
    loadComponent('components/footer.html', 'footer-placeholder');

    /**
     * Mobile Navigation Toggle
     * ---
     * This function is now initialized *after* the navbar is loaded
     * to ensure the elements exist in the DOM.
     */
    const initializeNavbarScripts = () => {
        const hamburgerMenu = document.getElementById('hamburger-menu');
        const navLinksWrapper = document.querySelector('.nav-links-wrapper');

        if (hamburgerMenu && navLinksWrapper) {
            hamburgerMenu.addEventListener('click', () => {
                hamburgerMenu.classList.toggle('is-active');
                navLinksWrapper.classList.toggle('nav-active');
                document.body.style.overflow = navLinksWrapper.classList.contains('nav-active') ? 'hidden' : 'auto';
            });
        }
    };

    /**
     * Intersection Observer for Fade-In Animations
     * ---
     * Adds a subtle fade-in effect to sections as they enter the viewport.
     */
    const sectionsToAnimate = document.querySelectorAll('.content-section, .offering-card, .article-card, .newsletter-cta-section');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sectionsToAnimate.forEach(section => {
        section.classList.add('fade-in-section');
        observer.observe(section);
    });

});
