// Appointment Booking and Alerts System Integration

// Configuration
const CONFIG = {
    // Replace with actual WhatsApp Business API credentials in production
    whatsapp: {
        enabled: true,
        phoneNumber: "919XXXXXXXXX", // Replace with actual clinic phone number
        apiKey: "YOUR_WHATSAPP_API_KEY" // For demonstration only
    },
    // Replace with actual email service credentials in production
    email: {
        enabled: true,
        fromEmail: "appointments@jaiprakashclinic.com",
        apiKey: "YOUR_EMAIL_API_KEY" // For demonstration only
    },
    // Calendar settings
    calendar: {
        workingDays: [1, 2, 3, 4, 5, 6], // Monday to Saturday
        morningHours: ["9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30"],
        eveningHours: ["16:00", "16:30", "17:00", "17:30", "18:00", "18:30"]
    },
    // Appointment settings
    appointment: {
        duration: 30, // minutes
        bufferTime: 5, // minutes between appointments
        maxDaysInAdvance: 30, // book up to 30 days in advance
        reminderTimes: [24, 2] // hours before appointment
    }
};

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the booking system
    initializeBookingSystem();
    
    // Set up form submission handler
    setupFormSubmission();
});

// Initialize the booking calendar and time slots
function initializeBookingSystem() {
    const today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();
    
    // Update calendar header
    updateCalendarHeader(currentMonth, currentYear);
    
    // Generate calendar days
    generateCalendarDays(currentMonth, currentYear);
    
    // Set up calendar navigation
    document.querySelector('.calendar-nav.prev').addEventListener('click', function() {
        navigateMonth(-1, currentMonth, currentYear);
    });
    
    document.querySelector('.calendar-nav.next').addEventListener('click', function() {
        navigateMonth(1, currentMonth, currentYear);
    });
    
    // Set up day selection
    setupDaySelection();
}

// Update the calendar header with month and year
function updateCalendarHeader(month, year) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];
    document.querySelector('.current-month').textContent = `${monthNames[month]} ${year}`;
}

// Generate calendar days for the specified month
function generateCalendarDays(month, year) {
    const calendarGrid = document.querySelector('.calendar-grid');
    if (!calendarGrid) return;
    
    // Clear existing calendar days
    calendarGrid.innerHTML = '';
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    
    // Add days from previous month
    const prevMonthDays = firstDay === 0 ? 6 : firstDay - 1; // Adjust for Monday as first day
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevMonthYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = new Date(prevMonthYear, prevMonth + 1, 0).getDate();
    
    for (let i = daysInPrevMonth - prevMonthDays + 1; i <= daysInPrevMonth; i++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day disabled';
        dayElement.textContent = i;
        calendarGrid.appendChild(dayElement);
    }
    
    // Add days of current month
    for (let i = 1; i <= daysInMonth; i++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = i;
        
        // Check if this day is in the past
        const currentDate = new Date(year, month, i);
        if (currentDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
            dayElement.classList.add('disabled');
        } else {
            // Check if this is a working day
            const dayOfWeek = currentDate.getDay() || 7; // Convert Sunday (0) to 7
            if (!CONFIG.calendar.workingDays.includes(dayOfWeek)) {
                dayElement.classList.add('disabled');
            } else {
                // This is a bookable day
                dayElement.setAttribute('data-date', `${year}-${month+1}-${i}`);
            }
        }
        
        calendarGrid.appendChild(dayElement);
    }
    
    // Add days from next month to fill the grid
    const totalDaysAdded = prevMonthDays + daysInMonth;
    const nextMonthDays = 42 - totalDaysAdded; // 6 rows of 7 days
    
    for (let i = 1; i <= nextMonthDays; i++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day disabled';
        dayElement.textContent = i;
        calendarGrid.appendChild(dayElement);
    }
}

// Navigate to previous or next month
function navigateMonth(direction, currentMonth, currentYear) {
    currentMonth += direction;
    
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    
    updateCalendarHeader(currentMonth, currentYear);
    generateCalendarDays(currentMonth, currentYear);
    setupDaySelection();
}

// Set up day selection functionality
function setupDaySelection() {
    const calendarDays = document.querySelectorAll('.calendar-day:not(.disabled)');
    const timeSlotsContainer = document.querySelector('.time-slots-container');
    
    calendarDays.forEach(day => {
        day.addEventListener('click', function() {
            // Remove active class from all days
            document.querySelectorAll('.calendar-day').forEach(d => {
                d.classList.remove('active');
            });
            
            // Add active class to selected day
            this.classList.add('active');
            
            // Show time slots
            if (timeSlotsContainer) {
                timeSlotsContainer.style.display = 'block';
                
                // In a real implementation, this would fetch available slots for the selected date
                const selectedDate = this.getAttribute('data-date');
                fetchAvailableTimeSlots(selectedDate);
            }
        });
    });
}

// Fetch available time slots for the selected date
function fetchAvailableTimeSlots(date) {
    // In a real implementation, this would make an API call to check availability
    // For demonstration, we'll simulate some random availability
    
    const timeSlots = document.querySelector('.time-slots');
    if (!timeSlots) return;
    
    // Clear existing time slots
    timeSlots.innerHTML = '';
    
    // Generate morning slots
    CONFIG.calendar.morningHours.forEach(time => {
        const slot = document.createElement('div');
        slot.className = 'time-slot';
        slot.textContent = formatTime(time);
        
        // Randomly mark some slots as booked (for demonstration)
        if (Math.random() < 0.3) {
            slot.classList.add('booked');
        }
        
        timeSlots.appendChild(slot);
    });
    
    // Generate evening slots
    CONFIG.calendar.eveningHours.forEach(time => {
        const slot = document.createElement('div');
        slot.className = 'time-slot';
        slot.textContent = formatTime(time);
        
        // Randomly mark some slots as booked (for demonstration)
        if (Math.random() < 0.3) {
            slot.classList.add('booked');
        }
        
        timeSlots.appendChild(slot);
    });
    
    // Set up time slot selection
    setupTimeSlotSelection();
}

// Format time from 24-hour to 12-hour format
function formatTime(time) {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
}

// Set up time slot selection functionality
function setupTimeSlotSelection() {
    const timeSlots = document.querySelectorAll('.time-slot:not(.booked)');
    const bookButton = document.querySelector('#book-appointment-btn');
    
    timeSlots.forEach(slot => {
        slot.addEventListener('click', function() {
            // Remove active class from all slots
            document.querySelectorAll('.time-slot').forEach(s => {
                s.classList.remove('active');
            });
            
            // Add active class to selected slot
            this.classList.add('active');
            
            // Enable the booking button
            if (bookButton) {
                bookButton.disabled = false;
            }
        });
    });
}

// Set up form submission handler
function setupFormSubmission() {
    const appointmentForm = document.querySelector('#appointment-form');
    
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (!validateForm(this)) {
                return;
            }
            
            // Collect form data
            const formData = new FormData(this);
            const appointmentData = {
                name: formData.get('name'),
                phone: formData.get('phone'),
                email: formData.get('email'),
                condition: formData.get('condition'),
                consultationType: formData.get('consultation-type'),
                message: formData.get('message'),
                whatsappNotifications: formData.has('whatsapp-notifications'),
                date: document.querySelector('.calendar-day.active')?.getAttribute('data-date'),
                time: document.querySelector('.time-slot.active')?.textContent
            };
            
            // Process the appointment
            processAppointment(appointmentData);
        });
    }
}

// Validate the appointment form
function validateForm(form) {
    let isValid = true;
    
    // Check required fields
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
        } else {
            field.classList.remove('error');
        }
    });
    
    // Check if date and time are selected
    if (!document.querySelector('.calendar-day.active')) {
        isValid = false;
        alert('Please select an appointment date.');
    } else if (!document.querySelector('.time-slot.active')) {
        isValid = false;
        alert('Please select an appointment time.');
    }
    
    return isValid;
}

// Process the appointment booking
function processAppointment(data) {
    // In a real implementation, this would send the data to a server
    console.log('Processing appointment:', data);
    
    // Simulate successful booking
    showBookingConfirmation(data);
    
    // Send notifications
    if (data.whatsappNotifications) {
        sendWhatsAppNotification(data);
    }
    
    sendEmailNotification(data);
}

// Show booking confirmation
function showBookingConfirmation(data) {
    const formContainer = document.querySelector('.appointment-form');
    
    if (formContainer) {
        // Create confirmation message
        const confirmationMessage = document.createElement('div');
        confirmationMessage.className = 'success-message';
        confirmationMessage.innerHTML = `
            <h3>Appointment Confirmed!</h3>
            <p>Thank you, ${data.name}. Your appointment has been scheduled for:</p>
            <p><strong>${data.date} at ${data.time}</strong></p>
            <p>We have sent a confirmation to your phone and email. Please arrive 10 minutes before your scheduled time.</p>
            <p>If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
            <button class="btn" onclick="location.reload()">Book Another Appointment</button>
        `;
        
        // Replace form with confirmation
        formContainer.innerHTML = '';
        formContainer.appendChild(confirmationMessage);
    }
}

// Send WhatsApp notification
function sendWhatsAppNotification(data) {
    if (!CONFIG.whatsapp.enabled) return;
    
    // In a real implementation, this would use the WhatsApp Business API
    console.log('Sending WhatsApp notification to:', data.phone);
    
    // Example message template
    const message = `
        Hello ${data.name},
        
        Your appointment with Dr. Jai Prakash has been confirmed for ${data.date} at ${data.time}.
        
        Health concern: ${data.condition}
        Consultation type: ${data.consultationType}
        
        Location: District Baghpat, Uttar Pradesh, India
        
        Please arrive 10 minutes before your scheduled time. If you need to reschedule or cancel, please contact us at least 24 hours in advance.
        
        Thank you for choosing Dr. Jai Prakash's Homeopathic Clinic.
    `;
    
    // In a real implementation, this would make an API call to send the message
    console.log('WhatsApp message:', message);
}

// Send email notification
function sendEmailNotification(data) {
    if (!CONFIG.email.enabled) return;
    
    // In a real implementation, this would use an email service API
    console.log('Sending email notification to:', data.email);
    
    // Example email template
    const emailSubject = `Appointment Confirmation - Dr. Jai Prakash's Homeopathic Clinic`;
    const emailBody = `
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #7ca682; color: white; padding: 10px 20px; text-align: center; }
                .content { padding: 20px; background-color: #f9f7f4; }
                .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
                .appointment-details { background-color: white; padding: 15px; margin: 15px 0; border-left: 4px solid #7ca682; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>Appointment Confirmation</h2>
                </div>
                <div class="content">
                    <p>Dear ${data.name},</p>
                    <p>Your appointment with Dr. Jai Prakash has been confirmed.</p>
                    
                    <div class="appointment-details">
                        <p><strong>Date:</strong> ${data.date}</p>
                        <p><strong>Time:</strong> ${data.time}</p>
                        <p><strong>Health Concern:</strong> ${data.condition}</p>
                        <p><strong>Consultation Type:</strong> ${data.consultationType}</p>
                    </div>
                    
                    <p><strong>Location:</strong> 123 Wellness Street, Green Park, New Delhi - 110016</p>
                    
                    <p>Please arrive 10 minutes before your scheduled time. If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
                    
                    <p>Thank you for choosing Dr. Jai Prakash's Homeopathic Clinic.</p>
                </div>
                <div class="footer">
                    <p>© 2025 Dr. Jai Prakash Homeopathic Clinic. All Rights Reserved.</p>
                    <p>District Baghpat, Uttar Pradesh, India</p>
                    <p>Phone: +91 9536183311 | Email: drjaiprakashclinic@gmail.com</p>
                </div>
            </div>
        </body>
        </html>
    `;
    
    // In a real implementation, this would make an API call to send the email
    console.log('Email subject:', emailSubject);
    console.log('Email body:', emailBody);
}

// For integration with external calendar services (Google Calendar, etc.)
function syncWithCalendar(appointmentData) {
    // In a real implementation, this would use the Google Calendar API or similar
    console.log('Syncing appointment with calendar:', appointmentData);
}

// For integration with clinic management system
function updateClinicSchedule(appointmentData) {
    // In a real implementation, this would update the clinic's internal scheduling system
    console.log('Updating clinic schedule:', appointmentData);
}

// Set up reminder system
function scheduleReminders(appointmentData) {
    // In a real implementation, this would schedule reminders at specified intervals
    CONFIG.appointment.reminderTimes.forEach(hours => {
        console.log(`Scheduling reminder ${hours} hours before appointment:`, appointmentData);
    });
}
