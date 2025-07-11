/* ---
   script.js
   Handles mobile navigation toggle for theclass.com recreation.
   --- */

document.addEventListener('DOMContentLoaded', () => {
    // Get the necessary DOM elements
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navActions = document.querySelector('.nav-actions'); // Select by class

    // Check if all elements exist before adding event listeners
    if (navToggle && navMenu && navActions) {
        // Add a click event listener to the hamburger menu icon
        navToggle.addEventListener('click', () => {
            // Toggle the 'active' class on the hamburger icon for animation
            navToggle.classList.toggle('active');

            // Toggle the 'active' class on the navigation menu to show/hide it
            navMenu.classList.toggle('active');
            
            // We need to inject the nav-actions into the mobile menu flow.
            // A simple way is to toggle a class on it as well.
            // For a more robust solution, you might move the HTML element with JS.
            if (navMenu.classList.contains('active')) {
                // If the menu is active, append actions to it
                navMenu.appendChild(navActions);
                navActions.style.display = 'flex'; // Ensure it's visible
            } else {
                // When menu is closed, move actions back to the header
                document.querySelector('.navbar').appendChild(navActions);
                navActions.style.display = ''; // Reset display style
            }
        });
    } else {
        console.error('Navigation elements not found. Mobile menu will not work.');
    }
});

// A small adjustment for the mobile menu logic to handle window resizing.
// If a user opens the mobile menu and then resizes to desktop, the menu should reset.
window.addEventListener('resize', () => {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navActions = document.querySelector('.nav-actions');
    
    if (window.innerWidth > 1024) {
        // If we are on a desktop view, reset mobile menu state
        if (navToggle && navMenu && navActions) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            // Ensure nav-actions are back in their original desktop position
            document.querySelector('.navbar').appendChild(navActions);
            navActions.style.display = 'flex';
        }
    } else {
        // On mobile view, ensure the nav actions are correctly placed if the menu is not active
        if (navMenu && !navMenu.classList.contains('active')) {
             document.querySelector('.navbar').appendChild(navActions);
             navActions.style.display = 'none';
        }
    }
});
