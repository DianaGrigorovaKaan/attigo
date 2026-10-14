// ============================================
// ATTIGO - JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
        } else {
            header.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]:not(.skip-link)').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const fragment = this.getAttribute('href').slice(1);
            if (!fragment) return;
            let target;
            try {
                target = document.getElementById(decodeURIComponent(fragment));
            } catch {
                return;
            }
            if (target) {
                e.preventDefault();
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Animate elements on scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe animated elements
    document.querySelectorAll('.service-card, .offering-card, .value-card, .faq-item, .team-member').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Add staggered animation delay
    document.querySelectorAll('.services-grid .service-card').forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });
    
    document.querySelectorAll('.offerings-grid .offering-card').forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.05}s`;
    });
    
    document.querySelectorAll('.values-grid .value-card').forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });
    
});
