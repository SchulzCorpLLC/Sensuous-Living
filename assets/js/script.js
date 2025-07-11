/* ---
   script.js
   Handles mobile navigation and scroll-triggered animations.
   --- */

document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Navigation Logic (from previous step) ---
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
                navMenu.appendChild(navActions);
                navActions.style.display = 'flex';
            } else {
                navActionsOriginalParent.appendChild(navActions);
                navActions.style.display = '';
            }
        });
    }

    // --- Resize handler for navigation (from previous step) ---
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024) {
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


    // --- NEW: Scroll-Triggered Animation Logic for Brand Essence Section ---
    const essenceSection = document.getElementById('brand-essence');
    
    if (essenceSection) {
        const animatedElements = essenceSection.querySelectorAll('.section-title, .section-intro, .pillar, .essence-cta');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // When the element is in view, the 'is-visible' class will trigger the animation
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    // Optional: unobserve after animation to prevent re-triggering
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1 // Trigger when 10% of the element is visible
        });

        animatedElements.forEach(el => {
            // Initially pause the animation
            el.style.animationPlayState = 'paused';
            observer.observe(el);
        });
    }
});
