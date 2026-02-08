# Setup Guide

## Database Setup

1. **Set up your database connection:**
   - Create a `.env` file in the root directory
   - Add your PostgreSQL connection string, NextAuth secret, and PayPal credentials:
     ```
     DATABASE_URL="postgresql://user:password@localhost:5432/heone_stories?schema=public"
     AUTH_SECRET="your-random-secret-key-here"
     
     # PayPal Configuration (for international payments)
     NEXT_PUBLIC_PAYPAL_CLIENT_ID="your-paypal-client-id"
     PAYPAL_CLIENT_ID="your-paypal-client-id"
     PAYPAL_CLIENT_SECRET="your-paypal-client-secret"
     PAYPAL_API_URL="https://api-m.sandbox.paypal.com"  # Use sandbox for testing, production: https://api-m.paypal.com
     ```
     Generate a secure AUTH_SECRET using: `openssl rand -base64 32`
     
     **Note:** For development/testing, PayPal credentials are optional. The system will work in mock mode without them.

2. **Generate Prisma Client:**
   ```bash
   npm run db:generate
   ```

3. **Push the schema to your database:**
   ```bash
   npm run db:push
   ```
   Or use migrations:
   ```bash
   npm run db:migrate
   ```

4. **Seed the database with an admin user:**
   ```bash
   npm run db:seed
   ```
   
   This will create an admin user with:
   - Username: `admin`
   - Password: `admin123` (hashed with bcrypt)
   
   **⚠️ IMPORTANT:** Change the password in production!

## Admin Panel

Access the admin panel at: `/admin`

Default credentials:
- Username: `admin`
- Password: `admin123`

The admin panel is now secured with NextAuth (Auth.js) authentication.

## Payment Configuration

### Morocco (MAD Currency)
- Payment method: Bank transfer (virement bancaire)
- After confirmation, users are redirected to contact confirmation page
- Bank account details need to be updated in `app/payment/page.tsx`:
  - Bank name
  - Account number
  - IBAN

### International (USD Currency)
- Payment method: PayPal (with credit/debit card option)
- Requires PayPal API credentials in `.env` file
- Works in mock mode for development without PayPal credentials

## Features

- ✅ Order management with status tracking
- ✅ NextAuth authentication (secure JWT-based sessions)
- ✅ Password hashing with bcrypt
- ✅ Protected admin routes via middleware
- ✅ Order filtering by status
- ✅ Pagination for orders
- ✅ Responsive admin panel
- ✅ Country-based payment methods (Bank transfer for Morocco, PayPal for international)
- ✅ Currency support (MAD for Morocco, USD for international)
- ✅ Contact confirmation page for bank transfers

## Next Steps (To be implemented)

- [ ] Email notifications
- [ ] Order export functionality
- [ ] Admin user management (create/edit admins)
- [ ] Update bank account details in payment page