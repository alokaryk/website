// Validation Script for Dr. Jai Prakash's Homeopathic Clinic Website

document.addEventListener('DOMContentLoaded', function() {
    console.log('Validation script loaded');
    
    // Run validation checks
    validateResponsiveness();
    validateBookingSystem();
    validateMultilingualSupport();
    validateAccessibility();
    validatePerformance();
    
    // Log validation results
    console.log('Validation complete. Check console for results.');
});

// Validate responsive design
function validateResponsiveness() {
    console.log('Validating responsiveness...');
    
    // Check viewport meta tag
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) {
        console.error('Viewport meta tag missing!');
    } else {
        console.log('✓ Viewport meta tag found');
    }
    
    // Check responsive elements
    const responsiveElements = [
        { selector: '.header-container', name: 'Header' },
        { selector: '.hero-content', name: 'Hero section' },
        { selector: '.about-content', name: 'About section' },
        { selector: '.services-grid', name: 'Services grid' },
        { selector: '.testimonial-slider', name: 'Testimonials' },
        { selector: '.appointment-form', name: 'Appointment form' },
        { selector: '.contact-container', name: 'Contact section' },
        { selector: '.footer-container', name: 'Footer' }
    ];
    
    responsiveElements.forEach(element => {
        const el = document.querySelector(element.selector);
        if (!el) {
            console.warn(`${element.name} element not found for responsive check`);
        } else {
            console.log(`✓ ${element.name} element found`);
        }
    });
    
    // Check mobile menu
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (!mobileMenuBtn) {
        console.error('Mobile menu button not found!');
    } else {
        console.log('✓ Mobile menu button found');
    }
    
    console.log('Responsiveness validation complete');
}

// Validate booking system
function validateBookingSystem() {
    console.log('Validating booking system...');
    
    // Check appointment form
    const appointmentForm = document.querySelector('#appointment-form');
    if (!appointmentForm) {
        console.error('Appointment form not found!');
        return;
    } else {
        console.log('✓ Appointment form found');
    }
    
    // Check required form fields
    const requiredFields = [
        { selector: 'input[name="name"]', name: 'Name field' },
        { selector: 'input[name="phone"]', name: 'Phone field' },
        { selector: 'input[name="email"]', name: 'Email field' },
        { selector: 'input[name="condition"]', name: 'Health condition field' }
    ];
    
    requiredFields.forEach(field => {
        const el = appointmentForm.querySelector(field.selector);
        if (!el) {
            console.error(`${field.name} not found!`);
        } else if (!el.hasAttribute('required')) {
            console.warn(`${field.name} should be marked as required`);
        } else {
            console.log(`✓ ${field.name} validated`);
        }
    });
    
    // Check calendar
    const calendar = document.querySelector('.calendar-grid');
    if (!calendar) {
        console.error('Calendar not found!');
    } else {
        console.log('✓ Calendar found');
    }
    
    // Check time slots
    const timeSlots = document.querySelector('.time-slots');
    if (!timeSlots) {
        console.error('Time slots not found!');
    } else {
        console.log('✓ Time slots found');
    }
    
    // Check booking button
    const bookButton = document.querySelector('#book-appointment-btn');
    if (!bookButton) {
        console.error('Book appointment button not found!');
    } else {
        console.log('✓ Book appointment button found');
    }
    
    console.log('Booking system validation complete');
}

// Validate multilingual support
function validateMultilingualSupport() {
    console.log('Validating multilingual support...');
    
    // Check language selector
    const languageSelector = document.querySelector('#language-selector');
    if (!languageSelector) {
        console.error('Language selector not found!');
    } else {
        console.log('✓ Language selector found');
    }
    
    // Check if i18n.js is loaded
    if (typeof changeLanguage === 'undefined') {
        console.error('i18n.js not loaded or changeLanguage function not defined!');
    } else {
        console.log('✓ i18n.js loaded');
    }
    
    // Check for translatable elements
    const translatableElements = document.querySelectorAll('[data-i18n]');
    if (translatableElements.length === 0) {
        console.error('No translatable elements found!');
    } else {
        console.log(`✓ ${translatableElements.length} translatable elements found`);
    }
    
    console.log('Multilingual support validation complete');
}

// Validate accessibility
function validateAccessibility() {
    console.log('Validating accessibility...');
    
    // Check alt text for images
    const images = document.querySelectorAll('img');
    let missingAlt = 0;
    
    images.forEach(img => {
        if (!img.hasAttribute('alt')) {
            missingAlt++;
            console.warn(`Image missing alt text: ${img.src}`);
        }
    });
    
    if (missingAlt === 0) {
        console.log('✓ All images have alt text');
    } else {
        console.error(`${missingAlt} images missing alt text`);
    }
    
    // Check form labels
    const formInputs = document.querySelectorAll('input, textarea, select');
    let missingLabels = 0;
    
    formInputs.forEach(input => {
        if (input.type !== 'button' && input.type !== 'submit' && input.type !== 'hidden') {
            const id = input.id;
            if (!id) {
                missingLabels++;
                console.warn('Form input missing ID for label association');
            } else {
                const label = document.querySelector(`label[for="${id}"]`);
                if (!label) {
                    missingLabels++;
                    console.warn(`No label found for input with ID: ${id}`);
                }
            }
        }
    });
    
    if (missingLabels === 0) {
        console.log('✓ All form inputs have associated labels');
    } else {
        console.error(`${missingLabels} form inputs missing proper labels`);
    }
    
    // Check heading hierarchy
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    let headingLevels = headings.map(h => parseInt(h.tagName.substring(1)));
    
    let isSequential = true;
    for (let i = 0; i < headingLevels.length - 1; i++) {
        if (headingLevels[i+1] - headingLevels[i] > 1) {
            isSequential = false;
            console.warn(`Non-sequential heading levels: ${headingLevels[i]} to ${headingLevels[i+1]}`);
        }
    }
    
    if (isSequential) {
        console.log('✓ Heading hierarchy is sequential');
    } else {
        console.error('Heading hierarchy is not sequential');
    }
    
    console.log('Accessibility validation complete');
}

// Validate performance
function validatePerformance() {
    console.log('Validating performance...');
    
    // Check image optimization
    const images = document.querySelectorAll('img');
    console.log(`Total images: ${images.length}`);
    
    // Check external scripts
    const externalScripts = Array.from(document.querySelectorAll('script[src]')).filter(script => {
        return !script.src.includes(window.location.hostname);
    });
    
    console.log(`External scripts: ${externalScripts.length}`);
    
    // Check external stylesheets
    const externalStyles = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).filter(link => {
        return !link.href.includes(window.location.hostname);
    });
    
    console.log(`External stylesheets: ${externalStyles.length}`);
    
    console.log('Performance validation complete');
}

// Function to test WhatsApp integration
function testWhatsAppIntegration() {
    console.log('Testing WhatsApp integration...');
    
    const whatsappFloat = document.querySelector('.whatsapp-float');
    if (!whatsappFloat) {
        console.error('WhatsApp float button not found!');
        return;
    }
    
    // Simulate click on WhatsApp button
    console.log('Simulating click on WhatsApp button...');
    // In a real test, we would trigger the click event
    
    console.log('WhatsApp integration test complete');
}

// Function to test form submission
function testFormSubmission() {
    console.log('Testing form submission...');
    
    const appointmentForm = document.querySelector('#appointment-form');
    if (!appointmentForm) {
        console.error('Appointment form not found!');
        return;
    }
    
    // Fill in test data
    const testData = {
        name: 'Test User',
        phone: '9876543210',
        email: 'test@example.com',
        condition: 'Test Condition'
    };
    
    // In a real test, we would fill the form and submit it
    console.log('Form submission test complete');
}

// Run additional tests if needed
// testWhatsAppIntegration();
// testFormSubmission();
