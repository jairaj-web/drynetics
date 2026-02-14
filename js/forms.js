/* ===== FORMS.JS - Client-side Validation & Form Handling ===== */

(function () {
    'use strict';

    // ---- Utility Functions ----

    /**
     * Validate email format using regex.
     */
    function isValidEmail(email) {
        var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    /**
     * Validate Indian 10-digit mobile number.
     * Accepts optional +91 or 0 prefix, digits only after stripping.
     */
    function isValidPhone(phone) {
        var cleaned = phone.replace(/[\s\-()]+/g, '');
        // Strip leading +91 or 91 or 0
        if (cleaned.startsWith('+91')) {
            cleaned = cleaned.substring(3);
        } else if (cleaned.startsWith('91') && cleaned.length > 10) {
            cleaned = cleaned.substring(2);
        } else if (cleaned.startsWith('0') && cleaned.length === 11) {
            cleaned = cleaned.substring(1);
        }
        return /^[6-9]\d{9}$/.test(cleaned);
    }

    /**
     * Set error state on a form group.
     */
    function setError(input, message) {
        var group = input.closest('.form-group');
        if (!group) return;
        group.classList.add('error');
        var errorEl = group.querySelector('.form-error');
        if (errorEl) {
            errorEl.textContent = message;
        }
    }

    /**
     * Clear error state from a form group.
     */
    function clearError(input) {
        var group = input.closest('.form-group');
        if (!group) return;
        group.classList.remove('error');
        var errorEl = group.querySelector('.form-error');
        if (errorEl) {
            errorEl.textContent = '';
        }
    }

    /**
     * Clear all errors in a form.
     */
    function clearAllErrors(form) {
        var groups = form.querySelectorAll('.form-group.error');
        groups.forEach(function (group) {
            group.classList.remove('error');
        });
    }

    /**
     * Validate a single field. Returns true if valid.
     */
    function validateField(input) {
        var value = input.value.trim();
        var type = input.type || input.tagName.toLowerCase();
        var isRequired = input.hasAttribute('required');

        // Clear previous error
        clearError(input);

        // Required check
        if (isRequired && !value) {
            setError(input, 'This field is required.');
            return false;
        }

        // Skip further validation if empty and not required
        if (!value) return true;

        // Email validation
        if (type === 'email') {
            if (!isValidEmail(value)) {
                setError(input, 'Please enter a valid email address.');
                return false;
            }
        }

        // Phone validation
        if (type === 'tel') {
            if (!isValidPhone(value)) {
                setError(input, 'Please enter a valid 10-digit mobile number.');
                return false;
            }
        }

        // Select validation (required)
        if (input.tagName.toLowerCase() === 'select' && isRequired) {
            if (!value || value === '') {
                setError(input, 'Please select an option.');
                return false;
            }
        }

        return true;
    }

    /**
     * Validate all fields in a form. Returns true if all valid.
     */
    function validateForm(form) {
        var inputs = form.querySelectorAll('.form-input, .form-textarea, .form-select');
        var isValid = true;
        var firstInvalid = null;

        inputs.forEach(function (input) {
            if (!validateField(input)) {
                isValid = false;
                if (!firstInvalid) {
                    firstInvalid = input;
                }
            }
        });

        // Scroll to first invalid field
        if (firstInvalid) {
            firstInvalid.focus();
            firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        return isValid;
    }

    /**
     * Show success overlay.
     */
    function showSuccessOverlay(formType) {
        var overlay = document.getElementById('form-success-overlay');
        if (!overlay) return;

        var title = overlay.querySelector('.form-success-card h3');
        var msg = overlay.querySelector('.form-success-card p');

        if (formType === 'contact') {
            if (title) title.textContent = 'Message Sent!';
            if (msg) msg.textContent = 'Thank you for reaching out. We\'ll get back to you within 24 hours.';
        } else if (formType === 'pickup') {
            if (title) title.textContent = 'Pickup Scheduled!';
            if (msg) msg.textContent = 'We\'ll confirm your pickup within 30 minutes. Check your phone for updates.';
        }

        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    /**
     * Hide success overlay.
     */
    function hideSuccessOverlay() {
        var overlay = document.getElementById('form-success-overlay');
        if (!overlay) return;
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    /**
     * Build WhatsApp message from form data and open in new tab.
     */
    function redirectToWhatsApp(formData, formType) {
        var phone = '919663769112';
        var message = '';

        if (formType === 'contact') {
            message = 'Hi Drynetics! I\'d like to get in touch.\n\n';
            message += 'Name: ' + (formData.name || '') + '\n';
            message += 'Email: ' + (formData.email || '') + '\n';
            message += 'Phone: ' + (formData.phone || '') + '\n';
            if (formData.service) message += 'Service: ' + formData.service + '\n';
            if (formData.message) message += 'Message: ' + formData.message + '\n';
        } else if (formType === 'pickup') {
            message = 'Hi Drynetics! I\'d like to schedule a pickup.\n\n';
            message += 'Name: ' + (formData.name || '') + '\n';
            message += 'Phone: ' + (formData.phone || '') + '\n';
            if (formData.email) message += 'Email: ' + formData.email + '\n';
            if (formData.date) message += 'Preferred Date: ' + formData.date + '\n';
            if (formData.time) message += 'Preferred Time: ' + formData.time + '\n';
            message += 'Address: ' + (formData.address || '') + '\n';
            if (formData.service) message += 'Service: ' + formData.service + '\n';
            if (formData.instructions) message += 'Special Instructions: ' + formData.instructions + '\n';
        }

        var url = 'https://wa.me/' + phone + '?text=' + encodeURIComponent(message);
        window.open(url, '_blank');
    }

    // ---- Set Minimum Date for Date Picker ----

    function setMinDate() {
        var dateInputs = document.querySelectorAll('input[type="date"]');
        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var year = tomorrow.getFullYear();
        var month = String(tomorrow.getMonth() + 1).padStart(2, '0');
        var day = String(tomorrow.getDate()).padStart(2, '0');
        var minDate = year + '-' + month + '-' + day;

        dateInputs.forEach(function (input) {
            input.setAttribute('min', minDate);
            // Also set default value hint
            if (!input.value) {
                input.setAttribute('value', '');
            }
        });
    }

    // ---- Initialize Forms ----

    function initContactForm() {
        var form = document.getElementById('contact-form');
        if (!form) return;

        // Real-time validation on blur
        var inputs = form.querySelectorAll('.form-input, .form-textarea, .form-select');
        inputs.forEach(function (input) {
            input.addEventListener('blur', function () {
                validateField(input);
            });
            // Clear error on input
            input.addEventListener('input', function () {
                clearError(input);
            });
        });

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            clearAllErrors(form);

            if (!validateForm(form)) {
                return;
            }

            // Collect form data
            var formData = {
                name: form.querySelector('#contact-name').value.trim(),
                email: form.querySelector('#contact-email').value.trim(),
                phone: form.querySelector('#contact-phone').value.trim(),
                service: form.querySelector('#contact-service').value,
                message: form.querySelector('#contact-message').value.trim()
            };

            // Show success overlay
            showSuccessOverlay('contact');

            // Set up WhatsApp button in overlay
            var waBtn = document.getElementById('success-whatsapp-btn');
            if (waBtn) {
                waBtn.onclick = function () {
                    redirectToWhatsApp(formData, 'contact');
                };
            }

            // Reset form
            form.reset();
        });
    }

    function initPickupForm() {
        var form = document.getElementById('pickup-form');
        if (!form) return;

        // Real-time validation on blur
        var inputs = form.querySelectorAll('.form-input, .form-textarea, .form-select');
        inputs.forEach(function (input) {
            input.addEventListener('blur', function () {
                validateField(input);
            });
            input.addEventListener('input', function () {
                clearError(input);
            });
        });

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            clearAllErrors(form);

            if (!validateForm(form)) {
                return;
            }

            // Collect form data
            var formData = {
                name: form.querySelector('#pickup-name').value.trim(),
                phone: form.querySelector('#pickup-phone').value.trim(),
                email: form.querySelector('#pickup-email') ? form.querySelector('#pickup-email').value.trim() : '',
                date: form.querySelector('#pickup-date').value,
                time: form.querySelector('#pickup-time').value,
                address: form.querySelector('#pickup-address').value.trim(),
                service: form.querySelector('#pickup-service').value,
                instructions: form.querySelector('#pickup-instructions') ? form.querySelector('#pickup-instructions').value.trim() : ''
            };

            // Show success overlay
            showSuccessOverlay('pickup');

            // Set up WhatsApp button in overlay
            var waBtn = document.getElementById('success-whatsapp-btn');
            if (waBtn) {
                waBtn.onclick = function () {
                    redirectToWhatsApp(formData, 'pickup');
                };
            }

            // Reset form
            form.reset();
        });
    }

    function initSuccessOverlay() {
        var overlay = document.getElementById('form-success-overlay');
        if (!overlay) return;

        // Close on overlay background click
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) {
                hideSuccessOverlay();
            }
        });

        // Close button
        var closeBtn = overlay.querySelector('.form-success-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', hideSuccessOverlay);
        }

        // Close/OK button
        var okBtn = document.getElementById('success-close-btn');
        if (okBtn) {
            okBtn.addEventListener('click', hideSuccessOverlay);
        }

        // Close on Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                hideSuccessOverlay();
            }
        });
    }

    // ---- DOM Ready ----

    document.addEventListener('DOMContentLoaded', function () {
        setMinDate();
        initContactForm();
        initPickupForm();
        initSuccessOverlay();
    });

})();
