document.addEventListener('DOMContentLoaded', function () {
    var revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    if (!revealElements.length) return;

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(function (el) {
        observer.observe(el);
    });
});
