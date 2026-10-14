// Shared disclosure navigation for the consultancy and product pages.
document.querySelectorAll('.site-navigation').forEach(nav => {
    const menuButton = nav.querySelector('.navigation-toggle');
    const menu = nav.querySelector('.navigation-links');
    const productsButton = nav.querySelector('.products-toggle');
    const products = nav.querySelector('.product-links');
    const mobile = window.matchMedia('(max-width: 768px)');

    function setProducts(open) {
        productsButton.setAttribute('aria-expanded', String(open));
        products.classList.toggle('is-open', open);
    }

    function setMenu(open) {
        menuButton.setAttribute('aria-expanded', String(open));
        menu.classList.toggle('is-open', open);
        if (!open) setProducts(false);
    }

    setMenu(false);

    menuButton.addEventListener('click', () => {
        setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
    });

    productsButton.addEventListener('click', () => {
        setProducts(productsButton.getAttribute('aria-expanded') !== 'true');
    });

    nav.addEventListener('keydown', event => {
        if (event.key !== 'Escape') return;
        if (productsButton.getAttribute('aria-expanded') === 'true') {
            setProducts(false);
            productsButton.focus();
        } else if (mobile.matches && menuButton.getAttribute('aria-expanded') === 'true') {
            setMenu(false);
            menuButton.focus();
        } else {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
    });

    nav.addEventListener('click', event => {
        if (!event.target.closest('a')) return;
        if (mobile.matches) menuButton.focus();
        else if (products.contains(event.target)) productsButton.focus();
        setMenu(false);
    });

    nav.addEventListener('focusout', event => {
        // A breakpoint can hide the focused control before matchMedia fires.
        if (!event.relatedTarget && !event.target.getClientRects().length) {
            if (mobile.matches) menuButton.focus();
            else if (event.target === menuButton) menu.querySelector('a').focus();
            else if (products.contains(event.target)) productsButton.focus();
        }
        if (!nav.contains(event.relatedTarget)) setMenu(false);
        else if (!event.relatedTarget.closest('.navigation-products')) setProducts(false);
    });

    document.addEventListener('click', event => {
        if (!nav.contains(event.target)) {
            // An unfocusable outside target must not leave focus in a hidden panel.
            if (menu.contains(document.activeElement)) {
                if (mobile.matches) menuButton.focus();
                else if (products.contains(document.activeElement)) productsButton.focus();
            }
            setMenu(false);
        }
    });

    mobile.addEventListener('change', () => {
        const focused = document.activeElement;
        if (mobile.matches && menu.contains(focused)) menuButton.focus();
        else if (!mobile.matches && focused === menuButton) menu.querySelector('a').focus();
        else if (products.contains(focused)) productsButton.focus();
        setMenu(false);
    });
});

// Keep links available if JavaScript is disabled or fails to load.
document.documentElement.classList.add('navigation-ready');
