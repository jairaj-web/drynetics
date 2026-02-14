/* ===== FAQ ACCORDION & CATEGORY FILTER ===== */

document.addEventListener('DOMContentLoaded', function () {

    // --- Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(function (question) {
        question.addEventListener('click', function () {
            const parentItem = this.closest('.faq-item');
            const isOpen = parentItem.classList.contains('open');

            // Close all other items (single-open mode)
            faqItems.forEach(function (item) {
                if (item !== parentItem) {
                    item.classList.remove('open');
                    item.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle the clicked item
            if (isOpen) {
                parentItem.classList.remove('open');
                this.setAttribute('aria-expanded', 'false');
            } else {
                parentItem.classList.add('open');
                this.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // --- Category Filter ---
    const categoryButtons = document.querySelectorAll('.faq-category-btn');

    categoryButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            const category = this.getAttribute('data-category');

            // Update active state on buttons
            categoryButtons.forEach(function (b) {
                b.classList.remove('active');
            });
            this.classList.add('active');

            // Close all open FAQ items when switching categories
            faqItems.forEach(function (item) {
                item.classList.remove('open');
                item.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });

            // Filter FAQ items
            let visibleCount = 0;
            faqItems.forEach(function (item) {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.classList.remove('hidden');
                    visibleCount++;
                } else {
                    item.classList.add('hidden');
                }
            });

            // Show/hide no-results message
            var noResults = document.querySelector('.faq-no-results');
            if (noResults) {
                if (visibleCount === 0) {
                    noResults.classList.add('visible');
                } else {
                    noResults.classList.remove('visible');
                }
            }
        });
    });

});
