# Hostinger Server Integration Steps for Dr. Jai Prakash's Homeopathic Clinic Website

This document provides specific steps for integrating the appointment notification system with Hostinger's hosting environment.

## 1. Initial Hostinger Setup

### Domain and Hosting Configuration
1. Log in to your Hostinger control panel
2. Ensure your domain is properly configured and pointing to your hosting
3. Verify that PHP version is set to 7.4 or higher:
   - Go to "Websites" > Select your domain > "Advanced" > "PHP Configuration"
   - Set PHP version to 7.4 or higher
   - Enable required PHP extensions: mysqli, curl, mbstring, openssl

### SSL Certificate Setup
1. Navigate to "SSL" section in Hostinger control panel
2. Enable free Let's Encrypt SSL certificate for your domain
3. Enable "Force HTTPS" to ensure all traffic is encrypted

## 2. File Upload and Directory Structure

### Upload Website Files
1. Use Hostinger's File Manager or FTP client (like FileZilla)
2. Upload all website files to the public_html directory
3. Ensure proper file permissions:
   - HTML, CSS, JS files: 644
   - PHP files: 644
   - Directories: 755

### Create Secure Directory for Sensitive Files
1. Create a directory outside public_html for sensitive configuration:
   ```
   /home/username/config/
   ```
2. Create a configuration file with database and API credentials:
   ```php
   <?php
   // Database configuration
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'your_database_name');
   define('DB_USER', 'your_database_user');
   define('DB_PASS', 'your_database_password');
   
   // Email configuration
   define('SMTP_HOST', 'smtp.hostinger.com');
   define('SMTP_PORT', 587);
   define('SMTP_USER', 'appointments@yourdomainname.com');
   define('SMTP_PASS', 'your_email_password');
   
   // WhatsApp API configuration
   define('WHATSAPP_SID', 'your_twilio_sid');
   define('WHATSAPP_TOKEN', 'your_twilio_token');
   define('WHATSAPP_NUMBER', 'your_whatsapp_number');
   ?>
   ```

## 3. Database Setup on Hostinger

### Create MySQL Database
1. In Hostinger control panel, go to "Databases" > "MySQL Databases"
2. Create a new database (e.g., clinic_appointments)
3. Create a new database user with a strong password
4. Assign all privileges to the user for this database

### Import Database Schema
1. Access phpMyAdmin through Hostinger control panel
2. Select your database
3. Go to "Import" tab
4. Upload and execute the create_tables.sql file

## 4. Email Configuration on Hostinger

### Set Up Email Account
1. Go to "Email" section in Hostinger control panel
2. Create a new email account (e.g., appointments@yourdomainname.com)
3. Set a strong password and note it down for configuration

### Configure Email Forwarding (Optional)
1. Set up email forwarding to your personal email for immediate notifications
2. Go to "Email" > Select your email account > "Forwarding"
3. Add your personal email address as the forwarding destination

## 5. Installing Required PHP Libraries

### Install Composer
1. Connect to your hosting via SSH (if available on your Hostinger plan):
   ```
   ssh username@your-hostinger-server.com
   ```
2. Install Composer:
   ```
   curl -sS https://getcomposer.org/installer | php
   mv composer.phar /usr/local/bin/composer
   ```

### Install Required Packages
1. Navigate to your website directory:
   ```
   cd public_html
   ```
2. Install PHPMailer:
   ```
   composer require phpmailer/phpmailer
   ```
3. Install Twilio SDK for WhatsApp integration:
   ```
   composer require twilio/sdk
   ```

### Alternative Manual Installation
If SSH access is not available:
1. Download PHPMailer and Twilio SDK from their GitHub repositories
2. Create a "vendor" directory in your website folder
3. Upload the libraries to the vendor directory
4. Create a simple autoload.php file

## 6. Securing Your Integration

### Create .htaccess File
Create a .htaccess file in your website root with the following content:

```
# Protect sensitive files
<FilesMatch "^(config\.php|send_email\.php|send_whatsapp\.php)$">
  Order deny,allow
  Deny from all
</FilesMatch>

# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Prevent directory listing
Options -Indexes

# Protect against common exploits
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-XSS-Protection "1; mode=block"
  Header set X-Frame-Options "SAMEORIGIN"
</IfModule>
```

### Implement Rate Limiting
Add to your PHP processing script:

```php
<?php
// Simple rate limiting
session_start();
$current_time = time();
$session_timeout = 3600; // 1 hour

if (isset($_SESSION['last_submission_time'])) {
    // Allow only one submission per 5 minutes
    if ($current_time - $_SESSION['last_submission_time'] < 300) {
        echo json_encode(['success' => false, 'message' => 'Please wait before submitting another appointment request.']);
        exit;
    }
}

// Record submission time
$_SESSION['last_submission_time'] = $current_time;
?>
```

## 7. Connecting Website Frontend to Backend

### Update Form Action
Modify the appointment form in index.html to point to the processing script:

```html
<form id="appointment-form" action="process_appointment.php" method="post">
```

### Include Processing Script
Ensure the booking.js file is properly linked in your HTML:

```html
<script src="js/booking.js"></script>
```

## 8. Testing on Hostinger

### Test Email Functionality
1. Upload test_email.php to your server
2. Access it through your browser: https://yourdomainname.com/test_email.php
3. Check if the test email is received

### Test WhatsApp Functionality
1. Upload test_whatsapp.php to your server
2. Access it through your browser: https://yourdomainname.com/test_whatsapp.php
3. Check if the test WhatsApp message is received on your phone

### Test Full Appointment Flow
1. Fill out the appointment form on your website
2. Submit the form
3. Verify that:
   - Success message appears
   - Email notification is received by the clinic
   - Confirmation email is sent to the patient
   - WhatsApp notification is sent (if opted in)
   - Appointment is recorded in the database

## 9. Monitoring and Maintenance

### Set Up Error Logging
Add to your PHP scripts:

```php
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', '/home/username/logs/php_errors.log');
```

### Regular Backups
1. Set up automatic database backups in Hostinger control panel
2. Schedule weekly backups of all website files
3. Download and store backups securely offline

### Monitor Email Deliverability
1. Regularly check spam scores of your emails
2. Ensure your domain has proper SPF and DKIM records
3. Monitor email delivery rates and adjust templates if needed

## 10. Troubleshooting Common Hostinger Issues

### PHP Memory Limits
If you encounter memory limit errors:
1. Create a php.ini file in your website root
2. Add: `memory_limit = 128M`

### File Permission Issues
If you encounter permission errors:
1. Connect via FTP or File Manager
2. Set correct permissions:
   - PHP files: 644
   - Directories: 755
   - Config directory: 700

### Database Connection Issues
If database connections fail:
1. Verify database credentials
2. Check if your Hostinger plan has database access limits
3. Optimize database queries to reduce load

## Conclusion

Following these Hostinger-specific integration steps will ensure your appointment booking system with email and WhatsApp notifications functions correctly. Remember to replace placeholder values with your actual credentials and test thoroughly before going live.
