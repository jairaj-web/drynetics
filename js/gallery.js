/* ===== GALLERY PAGE — FILTERING + LIGHTBOX ===== */
document.addEventListener('DOMContentLoaded', function () {

    /* ---------- CATEGORY FILTERING ---------- */
    const filterBtns = document.querySelectorAll('.gallery-filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            // Toggle active class on buttons
            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');

            const category = btn.getAttribute('data-filter');

            galleryItems.forEach(function (item) {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });

            // Update lightbox items list when filter changes
            updateVisibleItems();
        });
    });

    /* ---------- LIGHTBOX ---------- */
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxCounter = document.getElementById('lightbox-counter');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');

    var visibleItems = [];
    var currentIndex = 0;

    function updateVisibleItems() {
        visibleItems = Array.from(document.querySelectorAll('.gallery-item:not(.hidden)'));
    }

    // Initialize visible items
    updateVisibleItems();

    function openLightbox(index) {
        updateVisibleItems();
        currentIndex = index;
        renderLightbox();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function renderLightbox() {
        if (visibleItems.length === 0) return;

        var item = visibleItems[currentIndex];
        var placeholder = item.querySelector('.gallery-placeholder');
        var label = item.querySelector('.gallery-label');

        // Copy gradient background
        var bgStyle = placeholder.style.background || placeholder.getAttribute('style');
        lightboxImage.style.background = placeholder.style.background;

        // Set caption from label
        var captionText = label ? label.textContent : '';
        lightboxCaption.textContent = captionText;

        // Clear and add label to lightbox placeholder
        lightboxImage.innerHTML = '';
        var labelClone = document.createElement('span');
        labelClone.className = 'gallery-label';
        labelClone.textContent = captionText;
        lightboxImage.appendChild(labelClone);

        // Update counter
        lightboxCounter.textContent = (currentIndex + 1) + ' / ' + visibleItems.length;
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % visibleItems.length;
        renderLightbox();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
        renderLightbox();
    }

    // Click gallery item to open lightbox
    galleryItems.forEach(function (item) {
        item.addEventListener('click', function () {
            updateVisibleItems();
            var idx = visibleItems.indexOf(item);
            if (idx !== -1) {
                openLightbox(idx);
            }
        });
    });

    // Close button
    lightboxClose.addEventListener('click', closeLightbox);

    // Prev / Next buttons
    lightboxPrev.addEventListener('click', function (e) {
        e.stopPropagation();
        prevSlide();
    });

    lightboxNext.addEventListener('click', function (e) {
        e.stopPropagation();
        nextSlide();
    });

    // Close on click outside content
    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
        if (!lightbox.classList.contains('active')) return;

        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                prevSlide();
                break;
            case 'ArrowRight':
                nextSlide();
                break;
        }
    });

});
