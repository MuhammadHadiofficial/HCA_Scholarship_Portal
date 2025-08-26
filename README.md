# HCA Scholarship Portal

A comprehensive scholarship management portal for universities, built with Next.js, Prisma, and modern web technologies.

## Features

### 🎓 Student Features
- Apply for scholarships for specific intakes/semesters
- Upload documents (utility bills, academic records)
- Track application status and progress
- View approved scholarships and disbursements
- Access guidelines and policies

### 👨‍💼 Staff & Admin Features
- Review and approve scholarship applications
- Assign internal statuses and create notes
- Vote on scholarship decisions
- Manage intake periods and semesters
- Generate reports and analytics

### 👨‍🎓 Alumni Features
- Register and get verified with digital signatures
- Make pledges and donations
- Upload payment receipts
- Track contribution history
- View impact of donations

### 💰 Financial Management
- Full and partial semester fee scholarships
- One-time and recurring scholarship options
- Stripe integration for international payments
- Google Cloud Storage for document management
- Public dashboard for fund transparency

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Better Auth with OAuth support
- **UI**: shadcn/ui components with Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Payments**: Stripe integration
- **File Storage**: Google Cloud Storage
- **PDF Generation**: React PDF Renderer
- **Form Handling**: React Hook Form with Zod validation

## Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Google Cloud Storage account (for file uploads)
- Stripe account (for payments)

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd HCA_Scholarship_Portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Update `.env` with your configuration:
   - Database connection string
   - OAuth provider credentials
   - Stripe keys
   - Google Cloud Storage credentials
   - Email settings

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed with initial data
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Setup

The application uses PostgreSQL with Prisma ORM. Key models include:

- **Users**: Role-based access (Student, Staff, Alumni, Admin)
- **Applications**: Scholarship applications with status tracking
- **Scholarships**: Awarded scholarships with disbursement tracking
- **Intakes**: Semester/intake period management
- **Alumni**: Pledges, payments, and verification
- **Guidelines**: Dynamic content management
- **Program Funds**: Budget allocation and expense tracking

## Authentication

The portal supports multiple authentication methods:
- Email/password authentication
- Google OAuth
- GitHub OAuth
- Role-based access control

## File Upload

Documents are stored in Google Cloud Storage:
- Utility bills
- Academic transcripts
- Payment receipts
- Generated certificates

## Payment Integration

Stripe integration for:
- International student payments
- Alumni donations
- Secure payment processing

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Role-based dashboards
│   └── api/               # API routes
├── components/            # Reusable UI components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utility functions
│   ├── auth.ts           # Authentication config
│   ├── prisma.ts         # Database client
│   └── utils.ts          # Helper functions
└── generated/            # Generated Prisma client
```

## Deployment

### Environment Variables

Ensure all required environment variables are set in production:

```bash
# Database
DATABASE_URL="postgresql://..."

# Authentication
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-secret"

# OAuth Providers
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Stripe
STRIPE_PUBLISHABLE_KEY="..."
STRIPE_SECRET_KEY="..."

# Google Cloud Storage
GOOGLE_CLOUD_PROJECT_ID="..."
GOOGLE_CLOUD_PRIVATE_KEY="..."
GOOGLE_CLOUD_CLIENT_EMAIL="..."
GOOGLE_CLOUD_BUCKET_NAME="..."
```

### Deployment Platforms

- **Vercel**: Recommended for Next.js applications
- **Railway**: Easy PostgreSQL integration
- **DigitalOcean**: App Platform with managed databases
- **AWS**: ECS with RDS

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.
