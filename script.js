// ============================================
// ATTIGO - JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Header scroll effect
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
        } else {
            header.style.boxShadow = 'none';
        }
    });
    
    // Read the current preference on each click, including changes made while open.
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
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
                    behavior: reducedMotion.matches ? 'auto' : 'smooth'
                });
            }
        });
    });
});
