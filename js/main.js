/* Dr. Jai Prakash Online Homeopathic Clinic - JavaScript */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                }
            }
        });
    });
    
    // Scroll Animation
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 50) {
                element.classList.add('fade-in');
            }
        });
    };
    
    // Run animation check on load and scroll
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on page load
    
    // Testimonial Slider
    let currentSlide = 0;
    const testimonials = document.querySelectorAll('.testimonial-card');
    const totalSlides = testimonials.length;
    
    if (testimonials.length > 0) {
        // Set up initial state
        testimonials.forEach((slide, index) => {
            if (index !== 0) {
                slide.style.display = 'none';
            }
        });
        
        // Next slide function
        const nextSlide = () => {
            testimonials[currentSlide].style.display = 'none';
            currentSlide = (currentSlide + 1) % totalSlides;
            testimonials[currentSlide].style.display = 'block';
        };
        
        // Previous slide function
        const prevSlide = () => {
            testimonials[currentSlide].style.display = 'none';
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            testimonials[currentSlide].style.display = 'block';
        };
        
        // Set up navigation if it exists
        const nextBtn = document.querySelector('.testimonial-next');
        const prevBtn = document.querySelector('.testimonial-prev');
        
        if (nextBtn) {
            nextBtn.addEventListener('click', nextSlide);
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', prevSlide);
        }
        
        // Auto-advance slides every 5 seconds
        setInterval(nextSlide, 5000);
    }
    
    // Appointment Calendar Functionality
    const calendarDays = document.querySelectorAll('.calendar-day');
    const timeSlots = document.querySelectorAll('.time-slot');
    
    if (calendarDays.length > 0) {
        calendarDays.forEach(day => {
            day.addEventListener('click', function() {
                if (!this.classList.contains('disabled')) {
                    // Remove active class from all days
                    calendarDays.forEach(d => d.classList.remove('active'));
                    
                    // Add active class to clicked day
                    this.classList.add('active');
                    
                    // Show time slots (in a real implementation, this would load available slots for the selected day)
                    document.querySelector('.time-slots-container').style.display = 'block';
                }
            });
        });
    }
    
    if (timeSlots.length > 0) {
        timeSlots.forEach(slot => {
            slot.addEventListener('click', function() {
                if (!this.classList.contains('booked')) {
                    // Remove active class from all slots
                    timeSlots.forEach(s => s.classList.remove('active'));
                    
                    // Add active class to clicked slot
                    this.classList.add('active');
                    
                    // Enable the booking button
                    const bookButton = document.querySelector('#book-appointment-btn');
                    if (bookButton) {
                        bookButton.disabled = false;
                    }
                }
            });
        });
    }
    
    // Form Validation
    const appointmentForm = document.querySelector('#appointment-form');
    
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            let isValid = true;
            const requiredFields = this.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            // Email validation
            const emailField = this.querySelector('input[type="email"]');
            if (emailField && emailField.value) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(emailField.value)) {
                    isValid = false;
                    emailField.classList.add('error');
                }
            }
            
            // Phone validation
            const phoneField = this.querySelector('input[name="phone"]');
            if (phoneField && phoneField.value) {
                const phonePattern = /^\d{10}$/;
                if (!phonePattern.test(phoneField.value.replace(/\D/g, ''))) {
                    isValid = false;
                    phoneField.classList.add('error');
                }
            }
            
            if (isValid) {
                // In a real implementation, this would submit the form data to a server
                // For now, show a success message
                const formContainer = document.querySelector('.appointment-form');
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.innerHTML = '<h3>Appointment Request Received!</h3><p>Thank you for booking an appointment. We will confirm your appointment shortly via WhatsApp or email.</p>';
                
                formContainer.innerHTML = '';
                formContainer.appendChild(successMessage);
                
                // In a real implementation, this would also trigger a WhatsApp notification
            }
        });
    }
    
    // WhatsApp Chat Initialization
    const whatsappFloat = document.querySelector('.whatsapp-float');
    
    if (whatsappFloat) {
        whatsappFloat.addEventListener('click', function() {
            // Replace with actual phone number
            const phoneNumber = '919XXXXXXXXX';
            const message = 'Hello Dr. Jai Prakash, I would like to book an appointment.';
            
            window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
        });
    }
    
    // Language Selector
    const languageSelector = document.querySelector('#language-selector');
    
    if (languageSelector) {
        languageSelector.addEventListener('change', function() {
            // In a real implementation, this would change the website language
            // For now, just log the selected language
            console.log(`Language changed to: ${this.value}`);
            
            // This could trigger a page reload or dynamic content change
            // window.location.href = `?lang=${this.value}`;
        });
    }
});
