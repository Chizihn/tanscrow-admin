# Tanscrow Admin Frontend

This is the admin dashboard for the Tanscrow escrow platform. It enables platform administrators to manage users, transactions, disputes, withdrawals, system settings, audit logs, verification documents, and more, with advanced tools for monitoring and support.

## Features

- Admin authentication and secure access
- Dashboard with platform stats and recent activity
- User management (search, filter, view, impersonate)
- Transaction and dispute management (filter, resolve, export)
- Withdrawal approvals and management
- Verification document review (approve/reject in bulk)
- System configuration and settings
- Audit logs and admin activity trail
- Reports and export to CSV/Excel
- Notifications and support tools
- Mobile responsive and accessible UI

## Project Structure

- `app/` - Main Next.js app directory
- `components/` - UI and feature components
- `lib/` - API and utility libraries
- `styles/` - Global and component styles

## Environment Variables

Create a `.env.local` file in the admin frontend root:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/graphql
# Add any other required variables
```

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Set environment variables:**
   - See above for `.env.local` example
3. **Run the development server:**
   ```bash
   npm run dev
   ```
4. **Open [http://localhost:3000](http://localhost:3000) in your browser**

## Usage Notes

- **Authentication:**
  - Only admin users (created in backend) can log in
- **Dashboard:**
  - View stats, recent admin actions, and platform health
- **User Management:**
  - Search, filter, view, impersonate users
- **Transactions/Disputes:**
  - Advanced filtering, bulk actions, export, resolve
- **Withdrawals:**
  - Approve/reject, view history
- **Verification Docs:**
  - Review, approve/reject in bulk
- **Audit Logs:**
  - View all admin actions and system events
- **Reports:**
  - Export users, transactions, logs, etc. to CSV/Excel

## How to Test / Demo

1. **Start the backend API** (see backend README)
2. **Create an admin user** in the database or via seed script
3. **Log in as admin** and explore dashboard, users, transactions, disputes, withdrawals, etc.
4. **Test impersonation, bulk actions, and export features**
5. **Review audit logs and reports**

---

For backend API details, see the backend/README.md and API docs.
