# Franchiseen Admin ERP System

**Internal Enterprise Resource Planning Platform for Franchiseen Company**

This is the comprehensive ERP system for Franchiseen - a Multi-Tenant Fintech Franchise Management and Crowdfunding Platform. This admin portal is exclusively designed for internal company operations and is accessible only to Franchiseen team members with `@franchiseen.com` email addresses.

## 🏢 About Franchiseen Admin

Franchiseen Admin serves as the central command center for managing all company activities, operations, and business processes. This platform enables our team to efficiently handle:

- **Business Operations Management** - Franchise oversight, funding operations, and project management
- **Team & User Administration** - Employee management, access control, and role assignments
- **Financial Operations** - Investment tracking, payout management, and financial reporting
- **Software Development** - Bug tracking, feature management, and database administration
- **Strategic Planning** - Company strategy, partnerships, and resource allocation

## 🛠 Technology Stack

Built with modern, scalable technologies:

- **[Convex](https://convex.dev/)** - Real-time backend database and server logic
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router for optimal performance
- **[React](https://react.dev/)** - Frontend framework for interactive user interfaces
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Modern, accessible UI components
- **[Clerk](https://clerk.com/)** - Authentication with email domain restriction

## 🔐 Authentication & Access Control

**Restricted Access**: This system is exclusively for Franchiseen team members. Access is restricted to email addresses ending with `@franchiseen.com` domain only.

### Authentication Features:
- **Email + OTP Verification** - Secure two-factor authentication via Clerk
- **Domain Restriction** - Only `@franchiseen.com` emails can access the system
- **Session Management** - Automatic session handling and secure redirects
- **Role-Based Access** - Different permission levels for various team roles

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Access to Franchiseen company email (`@franchiseen.com`)
- Environment variables configured

### Installation & Setup

1. **Clone and Install Dependencies**
   ```bash
   git clone <repository-url>
   cd admin
   npm install
   ```

2. **Environment Configuration**
   Ensure your `.env.local` file contains:
   ```env
   # Convex Configuration
   CONVEX_DEPLOYMENT=dev:exuberant-warbler-928
   NEXT_PUBLIC_CONVEX_URL=https://exuberant-warbler-928.convex.cloud

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

   # OpenAI Configuration for Franny AI
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Access the System**
   - Navigate to `http://localhost:3002` (or the port shown in terminal)
   - Enter your `@franchiseen.com` email address
   - Complete OTP verification
   - You'll be automatically redirected to the home page with Franny AI assistant

### Production Deployment
```bash
npm run build
npm start
```

## 📊 System Modules

### Core Business Operations
- **🏢 Businesses** - Franchise management and oversight
- **💰 Operations** - Funding, ongoing projects, and closed deals
- **👥 Teams** - Employee management and team coordination
- **👤 Users** - User administration and access control

### Administrative Functions
- **🔧 Software Management** - Bug tracking, features, and database admin
- **📈 Analytics** - Performance metrics and business intelligence
- **🏠 Property Management** - Real estate and asset tracking
- **💳 Payouts** - Financial distributions and payment processing

### Strategic Planning
- **📋 Admin Tools** - Access control, strategy planning, and resources
- **🤝 Partnerships** - Partner relations and channel management
- **📚 Documentation** - Company handbooks, policies, and procedures

## 🔧 Development Guidelines

### Code Standards
- **TypeScript** - Strict type checking enabled
- **ESLint** - Code quality and consistency
- **Prettier** - Code formatting
- **shadcn/ui** - Consistent UI component library

### Project Structure
```
admin/
├── app/                    # Next.js App Router pages
│   ├── (platform)/        # Protected admin routes
│   ├── login/             # Authentication pages
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── admin/            # Admin-specific components
│   └── modals/           # Modal dialogs
├── lib/                  # Utility functions
├── convex/               # Convex backend functions
└── public/               # Static assets
```

### Key Features
- **Franny AI Assistant** - ChatGPT-powered AI assistant for franchise management help
- **Smart Home Page** - Personalized dashboard with agenda management for different time periods
- **Real-time Updates** - Live data synchronization via Convex
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Type Safety** - Full TypeScript coverage
- **Authentication** - Secure email-based login with domain restriction
- **Role-Based Access** - Granular permissions system
- **Agenda Management** - Organize tasks by Today, This Week, This Month, and This Quarter

## 🛡️ Security & Compliance

- **Domain Restriction** - Only `@franchiseen.com` emails allowed
- **Session Security** - Automatic session management and timeouts
- **Data Protection** - Encrypted data transmission and storage
- **Access Logging** - Comprehensive audit trails
- **Role-Based Permissions** - Granular access control

## 📞 Support & Contact

For technical support or access issues:
- **Internal IT Support** - Contact your system administrator
- **Development Team** - Reach out via company Slack channels
- **Emergency Access** - Contact CTO for urgent access requirements

## 📚 Additional Resources

### Technical Documentation
- [Convex Documentation](https://docs.convex.dev/) - Backend and database
- [Next.js Documentation](https://nextjs.org/docs) - Frontend framework
- [Clerk Documentation](https://clerk.com/docs) - Authentication system
- [shadcn/ui Documentation](https://ui.shadcn.com/) - UI components

### Company Resources
- **Employee Handbook** - Available in the admin portal
- **IT Policies** - Security and usage guidelines
- **Training Materials** - System usage and best practices

---

**© 2024 Franchiseen Company. Internal Use Only.**

*This system contains proprietary and confidential information. Unauthorized access is prohibited.*

