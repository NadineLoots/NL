document.addEventListener('DOMContentLoaded', function() {
    const menuContainer = document.querySelector('.menu-container');
    const menuToggle = document.querySelector('.menu-toggle');
    const menuItems = document.querySelectorAll('.menu-item');
    const menuHighlight = document.querySelector('.menu-highlight');
    
    // Toggle menu active state
    menuToggle.addEventListener('click', function() {
        menuContainer.classList.toggle('active');
    });
    
    // Add hover effect to menu items
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', function(e) {
            const link = this.querySelector('a');
            const linkRect = link.getBoundingClientRect();
            
            // Position the highlight element
            menuHighlight.style.width = `${linkRect.width + 20}px`;
            menuHighlight.style.height = `${linkRect.height + 20}px`;
            menuHighlight.style.left = `${linkRect.left - 10}px`;
            menuHighlight.style.top = `${linkRect.top - 10}px`;
            
            // Set highlight color based on which item is hovered
            const index = Array.from(menuItems).indexOf(item);
            const colors = ['#ff5e57', '#ff9f43', '#2e86de', '#5f27cd', '#1dd1a1'];
            menuHighlight.style.background = `rgba(${hexToRgb(colors[index])}, 0.1)`;
        });
    });
    
    // Helper function to convert hex to rgb
    function hexToRgb(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `${r}, ${g}, ${b}`;
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!menuContainer.contains(e.target) && !e.target.classList.contains('menu-toggle')) {
            menuContainer.classList.remove('active');
        }
    });
});