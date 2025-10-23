// ===================================
// NAVIGATION & PAGE TRANSITIONS
// ===================================

const navTabs = document.querySelectorAll('.nav-tab');
const pagesWrapper = document.querySelector('.pages-wrapper');
const ctaButton = document.getElementById('ctaButton');
let currentPage = 0;

// CTA button configurations per page
const ctaConfigs = [
    { text: "Let's Connect", class: '', color: 'coral' },
    { text: 'Request Advisory Session', class: 'advisor', color: 'navy' },
    { text: 'Book Balaji to Speak', class: 'speaker', color: 'turquoise' },
    { text: 'Start Your Journey', class: 'coach', color: 'yellow' }
];

// Navigate to specific page
function navigateToPage(pageIndex) {
    if (pageIndex < 0 || pageIndex > 3) return;
    
    currentPage = pageIndex;
    
    // Update pages wrapper position
    const translateValue = -100 * pageIndex;
    pagesWrapper.style.transform = `translateX(${translateValue}vw)`;
    
    // Update active nav tab
    navTabs.forEach((tab, index) => {
        if (index === pageIndex) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    // Update CTA button
    updateCTA(pageIndex);
    
    // Update URL hash without scrolling
    const pageIds = ['leader', 'advisor', 'speaker', 'coach'];
    history.pushState(null, null, `#${pageIds[pageIndex]}`);
}

// Update CTA button based on current page
function updateCTA(pageIndex) {
    const config = ctaConfigs[pageIndex];
    ctaButton.textContent = config.text;
    
    // Remove all classes
    ctaButton.className = 'cta-button';
    
    // Add page-specific class
    if (config.class) {
        ctaButton.classList.add(config.class);
    }
}

// Nav tab click handlers
navTabs.forEach((tab, index) => {
    tab.addEventListener('click', (e) => {
        e.preventDefault();
        navigateToPage(index);
    });
});

// Handle initial page load based on URL hash
function handleInitialHash() {
    const hash = window.location.hash.slice(1);
    const pageMap = {
        'leader': 0,
        'advisor': 1,
        'speaker': 2,
        'coach': 3
    };
    
    if (pageMap[hash] !== undefined) {
        navigateToPage(pageMap[hash]);
    }
}

// Call on page load
handleInitialHash();

// Handle browser back/forward buttons
window.addEventListener('popstate', handleInitialHash);

// ===================================
// TOUCH SWIPE SUPPORT (Mobile)
// ===================================

let touchStartX = 0;
let touchEndX = 0;

pagesWrapper.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

pagesWrapper.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left (next page)
            if (currentPage < 3) {
                navigateToPage(currentPage + 1);
            }
        } else {
            // Swipe right (previous page)
            if (currentPage > 0) {
                navigateToPage(currentPage - 1);
            }
        }
    }
}

// ===================================
// KEYBOARD NAVIGATION
// ===================================

document.addEventListener('keydown', (e) => {
    // Left arrow key
    if (e.key === 'ArrowLeft' && currentPage > 0) {
        navigateToPage(currentPage - 1);
    }
    // Right arrow key
    else if (e.key === 'ArrowRight' && currentPage < 3) {
        navigateToPage(currentPage + 1);
    }
});

// ===================================
// CONTACT MODAL
// ===================================

const contactModal = document.getElementById('contactModal');
const modalClose = document.getElementById('modalClose');
const contactForm = document.getElementById('contactForm');

// Open modal when CTA button clicked
ctaButton.addEventListener('click', (e) => {
    e.preventDefault();
    contactModal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

// Close modal when X button clicked
modalClose.addEventListener('click', () => {
    contactModal.classList.remove('active');
    document.body.style.overflow = '';
});

// Close modal when clicking outside
contactModal.addEventListener('click', (e) => {
    if (e.target === contactModal) {
        contactModal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && contactModal.classList.contains('active')) {
        contactModal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Handle form submission
contactForm.addEventListener('submit', (e) => {
    // If using Netlify Forms, the form will submit naturally
    // Add success message handling here if needed
    
    // Example: Show success message and reset form
    setTimeout(() => {
        alert('Thank you for your message! I will get back to you soon.');
        contactForm.reset();
        contactModal.classList.remove('active');
        document.body.style.overflow = '';
    }, 500);
});

// ===================================
// SMOOTH SCROLL FOR SECTIONS
// ===================================

const pageSections = document.querySelectorAll('.page-section');

pageSections.forEach(section => {
    let isScrolling;
    
    section.addEventListener('scroll', () => {
        // Clear our timeout throughout the scroll
        window.clearTimeout(isScrolling);
        
        // Set a timeout to run after scrolling ends
        isScrolling = setTimeout(() => {
            // Snap to nearest section
            const sections = section.querySelectorAll('.section');
            let closestSection = null;
            let closestDistance = Infinity;
            
            sections.forEach(sec => {
                const rect = sec.getBoundingClientRect();
                const distance = Math.abs(rect.top);
                
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestSection = sec;
                }
            });
            
            if (closestSection && closestDistance > 10) {
                closestSection.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }
        }, 150);
    });
});

// ===================================
// ANIMATE ON SCROLL (Optional Enhancement)
// ===================================

const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe metric cards and other elements
const animateElements = document.querySelectorAll('.metric-card, .value-card, .expertise-card, .topic-card');

animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ===================================
// COUNTER ANIMATION FOR METRICS
// ===================================

function animateCounter(element, start, end, duration) {
    let startTime = null;
    const isNumber = /^\d+$/.test(end);
    
    function animation(currentTime) {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        
        if (isNumber) {
            const current = Math.floor(progress * (parseInt(end) - parseInt(start)) + parseInt(start));
            element.textContent = current.toLocaleString();
        }
        
        if (progress < 1) {
            requestAnimationFrame(animation);
        } else {
            element.textContent = end;
        }
    }
    
    requestAnimationFrame(animation);
}

// Trigger counter animation when metrics section is visible
const metricsSection = document.querySelector('.metrics-grid');
let metricsAnimated = false;

const metricsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !metricsAnimated) {
            const metricNumbers = document.querySelectorAll('.metric-number');
            metricNumbers.forEach(num => {
                const finalValue = num.textContent;
                num.textContent = '0';
                setTimeout(() => {
                    animateCounter(num, 0, finalValue, 2000);
                }, 200);
            });
            metricsAnimated = true;
        }
    });
}, { threshold: 0.5 });

if (metricsSection) {
    metricsObserver.observe(metricsSection);
}

// ===================================
// PAGE VISIBILITY - Reset animations when returning to page
// ===================================

document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Reset metrics animation if user returns to page
        metricsAnimated = false;
    }
});

// ===================================
// PERFORMANCE: Lazy load background images
// ===================================

// If you add actual photo URLs, uncomment and use this:
/*
const lazyLoadImages = () => {
    const sections = document.querySelectorAll('.leader-section-1, .leader-section-2, .leader-section-3');
    const imageUrls = [
        'path/to/leader-section-1.jpg',
        'path/to/leader-section-2.jpg',
        'path/to/leader-section-3.jpg'
    ];
    
    sections.forEach((section, index) => {
        const img = new Image();
        img.onload = () => {
            section.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('${imageUrls[index]}')`;
        };
        img.src = imageUrls[index];
    });
};

// Call when page loads
window.addEventListener('load', lazyLoadImages);
*/

// ===================================
// ANALYTICS (Optional - Add your tracking code)
// ===================================

// Track page views
function trackPageView(pageName) {
    // Google Analytics example
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            page_title: pageName,
            page_location: window.location.href
        });
    }
    
    // Or custom analytics
    console.log(`Page view: ${pageName}`);
}

// Track when user navigates to different pages
navTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
        const pageNames = ['Leader', 'Advisor', 'Speaker', 'Coach'];
        trackPageView(pageNames[index]);
    });
});

// ===================================
// INITIALIZE
// ===================================

console.log('Balaji Ganapathy Personal Website Loaded');
console.log('Navigate using: Tab clicks, Arrow keys, or Swipe gestures');

// Set initial CTA
updateCTA(0);