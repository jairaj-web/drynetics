document.addEventListener('DOMContentLoaded', function () {
    // ===== MOBILE MENU =====
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const navOverlay = document.getElementById('nav-overlay');
    const body = document.body;

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function () {
            const isOpen = mainNav.classList.toggle('open');
            menuToggle.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', isOpen);
            body.style.overflow = isOpen ? 'hidden' : '';
            if (navOverlay) navOverlay.classList.toggle('active', isOpen);
        });

        // Close menu on nav link click
        mainNav.querySelectorAll('.nav-link').forEach(function (link) {
            link.addEventListener('click', function () {
                mainNav.classList.remove('open');
                menuToggle.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');
                body.style.overflow = '';
                if (navOverlay) navOverlay.classList.remove('active');
            });
        });

        // Close on overlay click
        if (navOverlay) {
            navOverlay.addEventListener('click', function () {
                mainNav.classList.remove('open');
                menuToggle.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');
                body.style.overflow = '';
                navOverlay.classList.remove('active');
            });
        }

        // Close on Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && mainNav.classList.contains('open')) {
                mainNav.classList.remove('open');
                menuToggle.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');
                body.style.overflow = '';
                if (navOverlay) navOverlay.classList.remove('active');
            }
        });
    }

    // ===== HEADER SCROLL EFFECT =====
    const header = document.getElementById('site-header');
    if (header) {
        var lastScroll = 0;
        window.addEventListener('scroll', function () {
            var currentScroll = window.pageYOffset;
            if (currentScroll > 80) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }
            lastScroll = currentScroll;
        }, { passive: true });
    }

    // ===== ACTIVE NAV HIGHLIGHTING =====
    var path = window.location.pathname;
    var page = path.substring(path.lastIndexOf('/') + 1) || 'index.html';

    document.querySelectorAll('.nav-link').forEach(function (link) {
        var href = link.getAttribute('href');
        if (href === page || (page === '' && href === 'index.html') || (page === '/' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // ===== SCROLL TO TOP =====
    var scrollTopBtn = document.getElementById('scroll-top');
    if (scrollTopBtn) {
        window.addEventListener('scroll', function () {
            if (window.pageYOffset > 500) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        }, { passive: true });

        scrollTopBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                var headerHeight = header ? header.offsetHeight : 0;
                var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });
});
