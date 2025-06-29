document.addEventListener('DOMContentLoaded', function() {
    const hoursElement = document.querySelector('.hours');
    const minutesElement = document.querySelector('.minutes');
    const secondsElement = document.querySelector('.seconds');
    const dayElement = document.querySelector('.day');
    const monthElement = document.querySelector('.month');
    const dayNumberElement = document.querySelector('.day-number');
    const yearElement = document.querySelector('.year');
    const clock = document.querySelector('.clock');

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    function updateClock() {
        const now = new Date();
        
        // Update time
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        
        hoursElement.textContent = hours;
        minutesElement.textContent = minutes;
        secondsElement.textContent = seconds;
        
        // Update date
        const day = days[now.getDay()];
        const month = months[now.getMonth()];
        const dayNumber = now.getDate().toString().padStart(2, '0');
        const year = now.getFullYear();
        
        dayElement.textContent = day;
        monthElement.textContent = month;
        dayNumberElement.textContent = dayNumber;
        yearElement.textContent = year;
        
        // Add subtle pulse animation every second
        clock.style.transform = 'scale(1.02)';
        setTimeout(() => {
            clock.style.transform = 'scale(1)';
        }, 300);
        
        // Change color based on time of day
        updateClockColor(now.getHours());
    }
    
    function updateClockColor(hours) {
        const root = document.documentElement;
        
        if (hours >= 6 && hours < 12) {
            // Morning colors
            root.style.setProperty('--primary-color', '#0984e3');
            root.style.setProperty('--secondary-color', '#74b9ff');
            root.style.setProperty('--accent-color', '#fdcb6e');
            root.style.setProperty('--glow-color', 'rgba(9, 132, 227, 0.6)');
        } else if (hours >= 12 && hours < 18) {
            // Afternoon colors
            root.style.setProperty('--primary-color', '#00b894');
            root.style.setProperty('--secondary-color', '#55efc4');
            root.style.setProperty('--accent-color', '#ffeaa7');
            root.style.setProperty('--glow-color', 'rgba(0, 184, 148, 0.6)');
        } else if (hours >= 18 && hours < 22) {
            // Evening colors
            root.style.setProperty('--primary-color', '#6c5ce7');
            root.style.setProperty('--secondary-color', '#a29bfe');
            root.style.setProperty('--accent-color', '#fd79a8');
            root.style.setProperty('--glow-color', 'rgba(108, 92, 231, 0.6)');
        } else {
            // Night colors
            root.style.setProperty('--primary-color', '#0984e3');
            root.style.setProperty('--secondary-color', '#636e72');
            root.style.setProperty('--accent-color', '#d63031');
            root.style.setProperty('--glow-color', 'rgba(214, 48, 49, 0.6)');
        }
    }

    // Initial update
    updateClock();
    
    // Update every second
    setInterval(updateClock, 1000);
    
    // Add mouse move effect
    document.addEventListener('mousemove', (e) => {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
        clock.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });
});