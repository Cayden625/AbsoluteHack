// FTC Team 28028 - Absolute Hack Website Scripts

document.addEventListener('DOMContentLoaded', function() {
    // Initialize countdown timer
    initCountdownTimer();
    
    // Add smooth scrolling for internal links
    initSmoothScrolling();
    
    // Add intersection observer for animations
    initScrollAnimations();
    
    // Add image lazy loading
    initLazyLoading();
});

/**
 * Initialize countdown timer
 * Set your competition date here
 */
function initCountdownTimer() {
    // Set the date for the next competition (you can modify this date)
    // Format: Year, Month (0-11), Day, Hour, Minute, Second
    const nextCompetitionDate = new Date(2025, 2, 15, 9, 0, 0); // March 15, 2025, 9:00 AM
    
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = nextCompetitionDate.getTime() - now;
        
        if (distance < 0) {
            // Competition has passed, show zeros
            daysElement.textContent = '00';
            hoursElement.textContent = '00';
            minutesElement.textContent = '00';
            secondsElement.textContent = '00';
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Format numbers with leading zeros
        daysElement.textContent = days.toString().padStart(2, '0');
        hoursElement.textContent = hours.toString().padStart(2, '0');
        minutesElement.textContent = minutes.toString().padStart(2, '0');
        secondsElement.textContent = seconds.toString().padStart(2, '0');
        
        // Add animation class when numbers change
        [daysElement, hoursElement, minutesElement, secondsElement].forEach(element => {
            element.style.transform = 'scale(1.1)';
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 150);
        });
    }
    
    // Update countdown immediately
    updateCountdown();
    
    // Update countdown every second
    setInterval(updateCountdown, 1000);
}

/**
 * Initialize smooth scrolling for internal links
 */
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed header if any
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Initialize scroll animations using Intersection Observer
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Add stagger effect for team members and cards
                if (entry.target.classList.contains('team-member') || 
                    entry.target.classList.contains('about-card') ||
                    entry.target.classList.contains('robot-card') ||
                    entry.target.classList.contains('gallery-item')) {
                    
                    const siblings = entry.target.parentElement.children;
                    const index = Array.from(siblings).indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 0.1}s`;
                }
            }
        });
    }, observerOptions);
    
    // Add initial styles and observe elements
    const animatedElements = document.querySelectorAll(
        '.team-member, .coach-member, .about-card, .evolution-card, .robot-card, .gallery-item'
    );
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

/**
 * Initialize lazy loading for images
 */
function initLazyLoading() {
    const images = document.querySelectorAll('img[src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // Add loading effect
                img.style.opacity = '0';
                
                const newImg = new Image();
                newImg.onload = function() {
                    img.style.transition = 'opacity 0.3s ease';
                    img.style.opacity = '1';
                };
                
                newImg.onerror = function() {
                    // Handle image loading errors
                    img.style.opacity = '0.5';
                    img.alt = 'Image could not be loaded';
                };
                
                newImg.src = img.src;
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
}

/**
 * Utility function to format competition date
 * Call this function to update the competition date
 */
function setCompetitionDate(year, month, day, hour = 9, minute = 0, second = 0) {
    // This function can be called to dynamically update the competition date
    // month is 0-indexed (0 = January, 11 = December)
    const competitionDate = new Date(year, month, day, hour, minute, second);
    
    // Store in localStorage for persistence
    localStorage.setItem('competitionDate', competitionDate.toISOString());
    
    // Restart the timer with the new date
    initCountdownTimer();
}

/**
 * Add keyboard navigation support
 */
document.addEventListener('keydown', function(e) {
    // Add keyboard support for team member cards
    if (e.key === 'Enter' || e.key === ' ') {
        const focusedElement = document.activeElement;
        if (focusedElement.classList.contains('team-member') || 
            focusedElement.classList.contains('coach-member')) {
            e.preventDefault();
            focusedElement.click();
        }
    }
});

/**
 * Add touch support for mobile devices
 */
if ('ontouchstart' in window) {
    const cards = document.querySelectorAll('.team-member, .coach-member, .robot-card, .gallery-item');
    
    cards.forEach(card => {
        card.addEventListener('touchstart', function() {
            this.style.transform = 'translateY(-5px) scale(0.98)';
        });
        
        card.addEventListener('touchend', function() {
            this.style.transform = 'translateY(-8px) scale(1)';
        });
    });
}

/**
 * Performance optimization: Debounce scroll events
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Add scroll-to-top functionality
 */
window.addEventListener('scroll', debounce(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Show/hide scroll-to-top button (if you add one in the future)
    if (scrollTop > 500) {
        document.body.classList.add('scrolled');
    } else {
        document.body.classList.remove('scrolled');
    }
}, 100));

/**
 * Error handling for images
 */
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        this.style.display = 'none';
        
        // Create placeholder text
        const placeholder = document.createElement('div');
        placeholder.className = 'image-placeholder';
        placeholder.textContent = 'Image not available';
        placeholder.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f8f9fa;
            color: #6c757d;
            border: 2px dashed #dee2e6;
            border-radius: 8px;
            min-height: 120px;
            font-style: italic;
        `;
        
        this.parentNode.insertBefore(placeholder, this.nextSibling);
    });
});

// Console message for developers
console.log(`
🤖 FTC Team 28028 - Absolute Hack Website
🚀 Innovating, Competing, Winning
⚡ Website loaded successfully!

To update the competition countdown, use:
setCompetitionDate(year, month, day, hour, minute, second)
Example: setCompetitionDate(2025, 2, 15, 9, 0, 0) // March 15, 2025 at 9:00 AM
`);

// Export functions for external use
window.AbsoluteHack = {
    setCompetitionDate: setCompetitionDate,
    initCountdownTimer: initCountdownTimer
};