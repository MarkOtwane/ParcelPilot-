# Gmail Setup for ParcelPilot Mailer

## Step 1: Enable 2-Factor Authentication

1. Go to your Google Account settings
2. Navigate to Security
3. Enable 2-Step Verification

## Step 2: Generate App Password

1. Go to Google Account settings
2. Navigate to Security
3. Under "2-Step Verification", click on "App passwords"
4. Select "Mail" as the app and "Other" as the device
5. Click "Generate"
6. Copy the 16-character password

## Step 3: Create .env File

Create a `.env` file in the backend directory with the following content:

```env
# Database
DATABASE_URL="file:./dev.db"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# Gmail Configuration
GMAIL_USER="your-email@gmail.com"
GMAIL_APP_PASSWORD="your-16-character-app-password"

# Cloudinary (optional)
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# Server
PORT=3000
NODE_ENV=development
```

## Step 4: Test the Mailer

After setting up the .env file, restart your backend server:

```bash
npm run start:dev
```

The mailer should now work with Gmail SMTP!

## Troubleshooting

- Make sure you're using the App Password, not your regular Gmail password
- Ensure 2-Factor Authentication is enabled
- Check that the GMAIL_USER is your full email address
- Verify the GMAIL_APP_PASSWORD is exactly 16 characters
