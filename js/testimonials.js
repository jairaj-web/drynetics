document.addEventListener('DOMContentLoaded', function () {
    var track = document.querySelector('.testimonials-track');
    var slides = document.querySelectorAll('.testimonial-slide');
    var prevBtn = document.querySelector('.testimonial-prev');
    var nextBtn = document.querySelector('.testimonial-next');
    var dots = document.querySelectorAll('.testimonial-dot');

    if (!track || !slides.length) return;

    var currentIndex = 0;
    var totalSlides = slides.length;
    var autoPlayInterval;

    function goToSlide(index) {
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        currentIndex = index;
        track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
        updateDots();
    }

    function updateDots() {
        dots.forEach(function (dot, i) {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    // Button controls
    if (nextBtn) nextBtn.addEventListener('click', function () { stopAutoPlay(); nextSlide(); startAutoPlay(); });
    if (prevBtn) prevBtn.addEventListener('click', function () { stopAutoPlay(); prevSlide(); startAutoPlay(); });

    // Dot controls
    dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
            stopAutoPlay();
            goToSlide(i);
            startAutoPlay();
        });
    });

    // Pause on hover
    var wrapper = document.querySelector('.testimonials-wrapper');
    if (wrapper) {
        wrapper.addEventListener('mouseenter', stopAutoPlay);
        wrapper.addEventListener('mouseleave', startAutoPlay);
    }

    // Touch swipe support
    var touchStartX = 0;
    var touchEndX = 0;

    if (track) {
        track.addEventListener('touchstart', function (e) {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoPlay();
        }, { passive: true });

        track.addEventListener('touchend', function (e) {
            touchEndX = e.changedTouches[0].screenX;
            var diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) nextSlide();
                else prevSlide();
            }
            startAutoPlay();
        }, { passive: true });
    }

    // Start
    updateDots();
    startAutoPlay();
});
