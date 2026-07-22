# Email and WhatsApp Notification Integration Guide for Hostinger

This guide explains how to set up email and WhatsApp notifications for appointment bookings on your homeopathic clinic website hosted on Hostinger.

## Table of Contents
1. [Overview](#overview)
2. [Email Notification Setup](#email-notification-setup)
3. [WhatsApp Notification Setup](#whatsapp-notification-setup)
4. [Integration with Hostinger](#integration-with-hostinger)
5. [Testing and Troubleshooting](#testing-and-troubleshooting)

## Overview

When a client books an appointment through your website, you'll want to receive notifications and send confirmations through both email and WhatsApp. This requires:

1. Server-side processing of form submissions
2. Email service integration
3. WhatsApp Business API integration
4. Database storage for appointment records

## Email Notification Setup

### Step 1: Set Up Hostinger Email Accounts

1. Log in to your Hostinger control panel
2. Navigate to "Email" section
3. Create a dedicated email account for appointments (e.g., appointments@yourdomainname.com)
4. Note down the SMTP server details:
   - SMTP Server: smtp.hostinger.com
   - Port: 587 (with TLS) or 465 (with SSL)
   - Username: your full email address
   - Password: your email password

### Step 2: Configure PHP Mail Function

Create a PHP script (`send_email.php`) in your website directory:

```php
<?php
// Email sending function
function sendAppointmentEmail($recipient, $subject, $message) {
    // Hostinger SMTP configuration
    $smtp_server = 'smtp.hostinger.com';
    $smtp_port = 587;
    $smtp_username = 'appointments@yourdomainname.com'; // Replace with your email
    $smtp_password = 'your_email_password'; // Replace with your password
    
    // Email headers
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: Dr. Jai Prakash Clinic <appointments@yourdomainname.com>" . "\r\n";
    
    // For Hostinger, you can use the built-in mail() function
    return mail($recipient, $subject, $message, $headers);
    
    // Alternatively, use PHPMailer library for more reliable delivery
    // (See PHPMailer implementation below)
}
?>
```

### Step 3: Implement PHPMailer (Recommended)

For more reliable email delivery, use PHPMailer library:

1. Install PHPMailer via Hostinger's SSH access or upload manually:
   ```
   composer require phpmailer/phpmailer
   ```

2. Create an enhanced email function:

```php
<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

function sendAppointmentEmail($recipient, $subject, $messageBody) {
    $mail = new PHPMailer(true);
    
    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host = 'smtp.hostinger.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'appointments@yourdomainname.com'; // Replace with your email
        $mail->Password = 'your_email_password'; // Replace with your password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;
        
        // Recipients
        $mail->setFrom('appointments@yourdomainname.com', 'Dr. Jai Prakash Clinic');
        $mail->addAddress($recipient);
        
        // Content
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $messageBody;
        
        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Email could not be sent. Mailer Error: {$mail->ErrorInfo}");
        return false;
    }
}
?>
```

## WhatsApp Notification Setup

### Step 1: Register for WhatsApp Business API

1. Sign up for a WhatsApp Business account at [business.whatsapp.com](https://business.whatsapp.com/)
2. Complete the verification process for your business
3. Choose an official WhatsApp Business API provider (options below)

### Step 2: Select a WhatsApp API Provider

Choose one of these providers based on your needs:

1. **Twilio**: [twilio.com/whatsapp](https://www.twilio.com/whatsapp)
   - Easy integration with PHP
   - Pay-as-you-go pricing
   - Good documentation

2. **MessageBird**: [messagebird.com/whatsapp](https://www.messagebird.com/whatsapp)
   - Simple REST API
   - Competitive pricing
   - Supports template messages

3. **360dialog**: [360dialog.com](https://www.360dialog.com/)
   - Specialized in WhatsApp Business API
   - Supports multiple languages
   - Good for high-volume messaging

### Step 3: Implement WhatsApp Notification Function

Using Twilio as an example:

1. Install Twilio PHP SDK via Composer:
   ```
   composer require twilio/sdk
   ```

2. Create a WhatsApp notification function:

```php
<?php
require_once 'vendor/autoload.php';
use Twilio\Rest\Client;

function sendWhatsAppNotification($phoneNumber, $message) {
    // Your Twilio credentials
    $sid = 'YOUR_TWILIO_ACCOUNT_SID';
    $token = 'YOUR_TWILIO_AUTH_TOKEN';
    $whatsappNumber = 'whatsapp:+14155238886'; // Your Twilio WhatsApp number
    
    try {
        $client = new Client($sid, $token);
        
        // Format the recipient's number for WhatsApp
        $recipientWhatsApp = 'whatsapp:' . $phoneNumber;
        
        // Send the message
        $message = $client->messages->create(
            $recipientWhatsApp,
            [
                'from' => $whatsappNumber,
                'body' => $message
            ]
        );
        
        return $message->sid;
    } catch (Exception $e) {
        error_log("WhatsApp notification failed: " . $e->getMessage());
        return false;
    }
}
?>
```

## Integration with Hostinger

### Step 1: Create a Database for Appointments

1. Log in to your Hostinger control panel
2. Navigate to "Databases" section
3. Create a new MySQL database
4. Create a database user and assign permissions
5. Note down the database credentials

### Step 2: Create Appointment Processing Script

Create a file named `process_appointment.php`:

```php
<?php
// Include email and WhatsApp functions
require_once 'send_email.php';
require_once 'send_whatsapp.php';

// Database connection
$db_host = 'localhost';
$db_name = 'your_database_name';
$db_user = 'your_database_user';
$db_pass = 'your_database_password';

$conn = new mysqli($db_host, $db_user, $db_pass, $db_name);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Process form submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Collect form data
    $name = $conn->real_escape_string($_POST['name']);
    $phone = $conn->real_escape_string($_POST['phone']);
    $email = $conn->real_escape_string($_POST['email']);
    $condition = $conn->real_escape_string($_POST['condition']);
    $consultationType = $conn->real_escape_string($_POST['consultation-type']);
    $appointmentDate = $conn->real_escape_string($_POST['appointment-date']);
    $appointmentTime = $conn->real_escape_string($_POST['appointment-time']);
    $message = isset($_POST['message']) ? $conn->real_escape_string($_POST['message']) : '';
    $whatsappNotifications = isset($_POST['whatsapp-notifications']) ? 1 : 0;
    
    // Save to database
    $sql = "INSERT INTO appointments (name, phone, email, health_condition, consultation_type, appointment_date, appointment_time, message, whatsapp_notifications, created_at)
            VALUES ('$name', '$phone', '$email', '$condition', '$consultationType', '$appointmentDate', '$appointmentTime', '$message', $whatsappNotifications, NOW())";
    
    if ($conn->query($sql) === TRUE) {
        $appointmentId = $conn->insert_id;
        
        // Send email notification to clinic
        $clinicEmail = "dr.jaiprakash@yourdomainname.com"; // Replace with actual email
        $subject = "New Appointment Request: $name";
        $emailBody = "
            <h2>New Appointment Request</h2>
            <p><strong>Patient:</strong> $name</p>
            <p><strong>Phone:</strong> $phone</p>
            <p><strong>Email:</strong> $email</p>
            <p><strong>Health Concern:</strong> $condition</p>
            <p><strong>Consultation Type:</strong> $consultationType</p>
            <p><strong>Requested Date:</strong> $appointmentDate</p>
            <p><strong>Requested Time:</strong> $appointmentTime</p>
            <p><strong>Additional Message:</strong> $message</p>
            <p><strong>WhatsApp Notifications:</strong> " . ($whatsappNotifications ? 'Yes' : 'No') . "</p>
        ";
        
        sendAppointmentEmail($clinicEmail, $subject, $emailBody);
        
        // Send confirmation email to patient
        $patientSubject = "Your Appointment Request with Dr. Jai Prakash";
        $patientEmailBody = "
            <h2>Appointment Request Confirmation</h2>
            <p>Dear $name,</p>
            <p>Thank you for requesting an appointment with Dr. Jai Prakash's Homeopathic Clinic.</p>
            <p>We have received your request for a $consultationType consultation on $appointmentDate at $appointmentTime.</p>
            <p>We will confirm your appointment shortly. If you have any questions, please contact us.</p>
            <p>Warm regards,<br>Dr. Jai Prakash's Homeopathic Clinic</p>
        ";
        
        sendAppointmentEmail($email, $patientSubject, $patientEmailBody);
        
        // Send WhatsApp notification if opted in
        if ($whatsappNotifications) {
            $whatsappMessage = "Thank you for booking an appointment with Dr. Jai Prakash's Homeopathic Clinic. Your $consultationType consultation is requested for $appointmentDate at $appointmentTime. We will confirm shortly.";
            sendWhatsAppNotification($phone, $whatsappMessage);
        }
        
        // Return success response
        echo json_encode(['success' => true, 'message' => 'Appointment request received']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error: ' . $conn->error]);
    }
    
    $conn->close();
    exit;
}
?>
```

### Step 3: Update the Booking JavaScript

Modify the existing `booking.js` file to submit to the PHP script:

```javascript
// Add this to the existing form submission handler in booking.js
document.getElementById('appointment-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate form
    if (!validateForm(this)) {
        return;
    }
    
    // Get form data
    const formData = new FormData(this);
    
    // Add selected date and time to form data
    const selectedDate = document.querySelector('.calendar-day.active')?.getAttribute('data-date');
    const selectedTime = document.querySelector('.time-slot.active')?.textContent;
    
    formData.append('appointment-date', selectedDate);
    formData.append('appointment-time', selectedTime);
    
    // Submit form via AJAX
    fetch('process_appointment.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Show success message
            showBookingConfirmation({
                name: formData.get('name'),
                date: selectedDate,
                time: selectedTime,
                consultationType: formData.get('consultation-type')
            });
        } else {
            // Show error message
            alert('Error: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while processing your request. Please try again.');
    });
});
```

### Step 4: Create Database Tables

Create a SQL file (`create_tables.sql`) with the following content:

```sql
CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    health_condition TEXT NOT NULL,
    consultation_type VARCHAR(20) NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    message TEXT,
    whatsapp_notifications TINYINT(1) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending',
    created_at DATETIME NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

Execute this SQL through Hostinger's phpMyAdmin or MySQL console.

## Testing and Troubleshooting

### Testing Email Notifications

1. Create a test script (`test_email.php`):

```php
<?php
require_once 'send_email.php';

$result = sendAppointmentEmail(
    'your-test-email@example.com',
    'Test Email from Dr. Jai Prakash Clinic',
    '<h1>Test Email</h1><p>This is a test email to verify the email notification system.</p>'
);

if ($result) {
    echo "Test email sent successfully!";
} else {
    echo "Failed to send test email.";
}
?>
```

2. Access this script through your browser to test email functionality

### Testing WhatsApp Notifications

1. Create a test script (`test_whatsapp.php`):

```php
<?php
require_once 'send_whatsapp.php';

$result = sendWhatsAppNotification(
    '+919XXXXXXXXX', // Replace with your phone number
    'This is a test message from Dr. Jai Prakash Clinic appointment system.'
);

if ($result) {
    echo "Test WhatsApp message sent successfully! Message ID: $result";
} else {
    echo "Failed to send test WhatsApp message.";
}
?>
```

2. Access this script through your browser to test WhatsApp functionality

### Common Issues and Solutions

1. **Emails not sending**
   - Verify SMTP credentials
   - Check if Hostinger allows outgoing SMTP
   - Try using PHPMailer instead of mail() function
   - Check spam/junk folders

2. **WhatsApp messages not delivering**
   - Verify API credentials
   - Ensure the recipient number is in international format
   - Check if the WhatsApp Business account is approved
   - Verify template message compliance

3. **Database connection issues**
   - Confirm database credentials
   - Check database user permissions
   - Verify table structure

4. **Form submission errors**
   - Check browser console for JavaScript errors
   - Verify form field names match PHP script
   - Test with minimal data to isolate issues

## Security Considerations

1. **Protect sensitive files**
   - Store API keys and credentials outside web root
   - Use .htaccess to restrict access to PHP scripts

2. **Prevent SQL injection**
   - Use prepared statements instead of string concatenation
   - Validate and sanitize all user inputs

3. **Enable HTTPS**
   - Activate SSL certificate through Hostinger
   - Force HTTPS using .htaccess redirects

4. **Implement rate limiting**
   - Prevent form spam with CAPTCHA
   - Limit submissions per IP address

## Conclusion

By following this guide, you'll have a complete system for receiving email and WhatsApp notifications when clients book appointments through your website. The integration works with Hostinger's hosting environment and provides both you and your clients with timely confirmations and reminders.

Remember to replace placeholder values with your actual credentials and customize the message templates to match your clinic's communication style.
