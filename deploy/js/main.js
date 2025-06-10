// Main JavaScript for ExotiPets

// Mobile navigation toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (navToggle && mainNav) {
        navToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.nav-toggle') && !event.target.closest('.main-nav')) {
            if (mainNav && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
            }
        }
    });
    
    // Cookie banner management
    const cookieBanner = document.getElementById('cookieBanner');
    const acceptCookiesBtn = document.getElementById('acceptCookies');
    const cookieSettingsBtn = document.getElementById('cookieSettings');
    
    // Check if cookie consent is already given
    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        cookieBanner.style.display = 'flex';
    } else if (cookieBanner) {
        cookieBanner.style.display = 'none';
    }
    
    // Accept cookies
    if (acceptCookiesBtn) {
        acceptCookiesBtn.addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.style.display = 'none';
            enableAllCookies();
        });
    }
    
    // Cookie settings
    if (cookieSettingsBtn) {
        cookieSettingsBtn.addEventListener('click', function() {
            // Open cookie settings modal or redirect to settings page
            window.location.href = 'cookie-settings.html';
        });
    }
    
    // Contact form validation
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Basic form validation
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            const consent = document.getElementById('consent').checked;
            
            let isValid = true;
            let errorMessage = '';
            
            if (!name.trim()) {
                isValid = false;
                errorMessage += 'Le nom est requis.\n';
            }
            
            if (!email.trim()) {
                isValid = false;
                errorMessage += 'L\'email est requis.\n';
            } else if (!isValidEmail(email)) {
                isValid = false;
                errorMessage += 'Veuillez entrer un email valide.\n';
            }
            
            if (!subject) {
                isValid = false;
                errorMessage += 'Le sujet est requis.\n';
            }
            
            if (!message.trim()) {
                isValid = false;
                errorMessage += 'Le message est requis.\n';
            }
            
            if (!consent) {
                isValid = false;
                errorMessage += 'Vous devez accepter la politique de confidentialité.\n';
            }
            
            if (isValid) {
                // Simulate form submission
                alert('Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.');
                contactForm.reset();
            } else {
                alert('Veuillez corriger les erreurs suivantes :\n' + errorMessage);
            }
        });
    }
    
    // Affiliate link tracking
    const affiliateLinks = document.querySelectorAll('a[href*="amazon"]');
    affiliateLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            // Track affiliate link click
            console.log('Affiliate link clicked:', link.href);
            
            // You would normally send this data to your analytics service
            if (typeof gtag === 'function') {
                gtag('event', 'affiliate_click', {
                    'link_url': link.href,
                    'link_text': link.textContent
                });
            }
        });
    });
});

// Helper functions
function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function enableAllCookies() {
    // This function would enable analytics, advertising cookies, etc.
    console.log('All cookies enabled');
    
    // Example: Enable Google Analytics
    if (typeof gtag === 'function') {
        gtag('consent', 'update', {
            'analytics_storage': 'granted',
            'ad_storage': 'granted'
        });
    }
}

// Lazy loading images
document.addEventListener('DOMContentLoaded', function() {
    const lazyImages = document.querySelectorAll('img.lazy');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(function(img) {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        let lazyLoadThrottleTimeout;
        
        function lazyLoad() {
            if (lazyLoadThrottleTimeout) {
                clearTimeout(lazyLoadThrottleTimeout);
            }
            
            lazyLoadThrottleTimeout = setTimeout(function() {
                const scrollTop = window.pageYOffset;
                lazyImages.forEach(function(img) {
                    if (img.offsetTop < (window.innerHeight + scrollTop)) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                    }
                });
                
                if (lazyImages.length === 0) {
                    document.removeEventListener('scroll', lazyLoad);
                    window.removeEventListener('resize', lazyLoad);
                    window.removeEventListener('orientationChange', lazyLoad);
                }
            }, 20);
        }
        
        document.addEventListener('scroll', lazyLoad);
        window.addEventListener('resize', lazyLoad);
        window.addEventListener('orientationChange', lazyLoad);
    }
});
