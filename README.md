# UptimeHarbor - Serverless Website Monitoring Platform

[![Tests](https://img.shields.io/badge/tests-4%20passing-green.svg)](https://github.com/kilo-org/kilocode)
[![Build](https://img.shields.io/badge/build-passing-green.svg)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg)]()

UptimeHarbor is a portfolio-quality, serverless website monitoring platform that checks website availability, records latency and status history, detects outages, and presents the results in a polished, real-time monitoring dashboard. Built with modern web technologies and AWS serverless architecture, this project demonstrates genuine cloud engineering and full-stack development skills suitable for showcasing to recruiters.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Pages & UI Components](#pages--ui-components)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Development](#development)
- [Testing](#testing)
- [Building for Production](#building-for-production)
- [API Reference](#api-reference)
- [Security Considerations](#security-considerations)
- [AWS Deployment Guide](#aws-deployment-guide)
- [Cost & Free Tier Analysis](#cost--free-tier-analysis)
- [Environment Variables](#environment-variables)
- [Teardown Guide](#teardown-guide)
- [Known Limitations](#known-limitations)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

## Overview

UptimeHarbor provides comprehensive website monitoring capabilities with a focus on reliability, security, and user experience. The platform continuously monitors registered websites for availability, measures response times, maintains historical data, and instantly detects when sites go down or come back up. All of this is presented through an intuitive, dark-themed dashboard inspired by professional developer tools.

## Features

### Core Monitoring Features

- **Website Registration**: Add and manage HTTP/HTTPS URLs with custom names and check intervals
- **Real-time Health Checks**: Perform instant availability checks with configurable timeouts
- **Latency Tracking**: Measure and record response times for each check
- **Status History**: Maintain comprehensive historical check data for trend analysis
- **Outage Detection**: Automatically detect transitions between up/down states
- **Incident Management**: Track and log outages with start/end times and duration
- **Duplicate Prevention**: Avoid creating duplicate incidents for continuous outages
- **Manual Checks**: Trigger on-demand health checks from the dashboard

### Dashboard & Analytics

- **Overview Dashboard**: At-a-glance view of all monitored sites, health status, and incidents
- **Key Metrics**: Display total sites, healthy count, failing count, and active incidents
- **Uptime Visualization**: Interactive charts showing uptime trends and response times (powered by Recharts)
- **Recent Activity**: View latest health check results in real-time
- **Website Table**: Sortable and filterable table of all monitored websites
- **Detailed Views**: Drill down into individual website performance and history
- **Incident Timeline**: Chronological view of all incidents across monitored sites

### User Interface

- **Modern Dark Theme**: Professional slate/navy color scheme optimized for extended monitoring
- **Responsive Design**: Fully responsive layout that works on desktop, tablet, and mobile devices
- **Intuitive Navigation**: Clean sidebar navigation with active state indicators
- **Loading States**: Skeleton loaders for improved perceived performance
- **Empty States**: Helpful guidance when no data is available
- **Error Handling**: User-friendly error messages and fallback states
- **Interactive Charts**: Smooth, responsive data visualizations
- **Accessible Components**: Built with semantic HTML and proper ARIA attributes

### Security Features

- **SSRF Protection**: Blocks private IP ranges (10.x, 172.16-31.x, 192.168.x), localhost, 127.0.0.1, 0.0.0.0, and cloud metadata endpoints (169.254.169.254)
- **URL Validation**: Strict validation allowing only HTTP and HTTPS protocols
- **Input Sanitization**: Backend validation for all API inputs
- **CORS Configuration**: Properly configured cross-origin resource sharing
- **Least Privilege**: IAM policies designed with minimal required permissions
- **Secure Defaults**: No hardcoded secrets, credentials isolated to environment variables
- **Request Timeouts**: Bounded timeouts prevent hanging requests
- **No Credential Exposure**: Zero AWS credentials in frontend code

## Pages & UI Components

### Pages

1. **Dashboard** (`/`) - Main overview page
   - Statistics cards (Total Sites, Healthy, Failing, Incidents)
   - Recent health check activity
   - Quick status overview

2. **Websites** (`/websites`) - Website management page
   - Comprehensive table of all monitored websites
   - Status indicators (up/down)
   - Last check timestamps and latency
   - Actions to view details, test, pause, or remove sites
   - Add new website functionality (UI ready)

3. **Website Detail** (`/websites/:id`) - Individual website analytics
   - Detailed performance metrics
   - Check history timeline
   - Uptime and latency charts
   - Incident history for this site
   - Monitoring settings management

4. **Incidents** (`/incidents`) - Global incident log
   - Chronological list of all outages
   - Duration tracking for resolved incidents
   - Site attribution for each incident
   - Status indicators (resolved/ongoing)

### Reusable Components

- **Sidebar** - Navigation component with route highlighting
- **Header** - Top bar with responsive mobile menu
- **Layout** - Main application layout wrapper
- **AppContext** - Global state management for application data

### Utilities & Services

- **validation.ts** - URL validation and SSRF protection logic
- **api.ts** - Axios-based API client with TypeScript interfaces
- **utils.ts** - Tailwind CSS class merging utility (clsx + tailwind-merge)

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| [React](https://react.dev/) | 18.x | UI library |
| [TypeScript](https://www.typescriptlang.org/) | ~5.9.x | Type safety |
| [Vite](https://vitejs.dev/) | ^8.3.0 | Build tool & dev server |
| [React Router DOM](https://reactrouter.com/) | ^7.18.4 | Client-side routing |
| [Tailwind CSS](https://tailwindcss.com/) | 3.4.18 | Styling framework |
| [TanStack Query](https://tanstack.com/query) | ^5.104.3 | Data fetching & caching |
| [Axios](https://axios-http.com/) | ^1.20.0 | HTTP client |
| [Recharts](https://recharts.org/) | ^3.10.1 | Data visualization/charts |
| [Lucide React](https://lucide.dev/) | ^1.58.0 | Icon library |
| [date-fns](https://date-fns.org/) | ^4.4.0 | Date utilities |
| [clsx](https://github.com/lukeed/clsx) | ^2.1.1 | Conditional classes |
| [tailwind-merge](https://github.com/dcastil/tailwind-merge) | ^3.7.0 | Merge Tailwind classes |

### Backend (AWS Serverless)

| Service | Purpose |
|---|---|
| [AWS API Gateway](https://aws.amazon.com/api-gateway/) | HTTP API endpoints |
| [AWS Lambda](https://aws.amazon.com/lambda/) | Serverless compute for API & health checks |
| [Amazon DynamoDB](https://aws.amazon.com/dynamodb/) | NoSQL database for persistent storage |
| [Amazon EventBridge Scheduler](https://aws.amazon.com/eventbridge/scheduler/) | Recurring health check scheduling |
| [Amazon CloudWatch](https://aws.amazon.com/cloudwatch/) | Logs, metrics, and monitoring |
| [AWS IAM](https://aws.amazon.com/iam/) | Identity & access management (least privilege) |

### Development & Testing

| Technology | Version | Purpose |
|---|---|---|
| [Vitest](https://vitest.dev/) | ^5.0.5 | Unit & component testing |
| [React Testing Library](https://testing-library.com/react) | ^16.3.3 | Component testing utilities |
| [jsdom](https://github.com/jsdom/jsdom) | ^27.0.0 | DOM environment for tests |
| [ESBuild](https://esbuild.github.io/) | ^0.24.0 | Lambda function bundling |
| [Node.js](https://nodejs.org/) | v24.17.0 | Runtime environment |
| [npm](https://www.npmjs.com/) | 11.14.0 | Package manager |

## Architecture

UptimeHarbor follows a serverless, event-driven architecture designed for scalability, cost-efficiency, and operational simplicity.

### High-Level Architecture

```
┌─────────────────┐
│   React SPA     │  (Vite + Tailwind CSS, hosted on S3/CloudFront)
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────────────────────────────────────┐
│           AWS API Gateway (HTTP API)             │
│  ┌─────────────┬─────────────┬─────────────────┐ │
│  │  Websites    │   Health      │   Incidents     │ │
│  │   Routes     │   Checks      │    & Stats      │ │
│  └─────────────┴─────────────┴─────────────────┘ │
└─────────────────────────┬─────────────────────────┘
                          │ Lambda Invocations
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  AWS Lambda Functions                     │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │   API CRUD   │  │ Health Checker │  │   Scheduler     │  │
│  │   Handlers   │  │    Function    │  │    Function     │  │
│  └─────────────┘  └──────────────┘  └─────────────────┘  │
└─────────────────────────┬─────────────────────────────────┘
                          │ DynamoDB API Calls
                          ▼
┌─────────────────────────────────────────────────────────┐
│                Amazon DynamoDB Tables                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │  Websites    │  │    Checks    │  │   Incidents     │  │
│  │    Table     │  │    Table     │  │     Table       │  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │ Scheduled Triggers
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Amazon EventBridge Scheduler                 │
│           (Periodic website health checks)                │
└─────────────────────────────────────────────────────────┘
                          │ Logs & Metrics
                          ▼
                    ┌─────────────────┐
                    │ Amazon CloudWatch│
                    └─────────────────┘
```

### Data Model

#### Websites Table
- **Partition Key**: `websiteId` (String, UUID)
- **Attributes**: `url`, `name`, `checkInterval` (seconds), `enabled` (boolean), `lastCheck` (ISO timestamp), `status` ('up'|'down'), `latency` (ms), `createdAt`, `updatedAt`

#### Checks Table (History)
- **Partition Key**: `websiteId` (String)
- **Sort Key**: `timestamp` (String, ISO 8601)
- **Attributes**: `checkId`, `status`, `statusCode`, `latency`, `error`
- **Note**: TTL recommended for automatic cleanup after retention period

#### Incidents Table
- **Partition Key**: `websiteId` (String)
- **Sort Key**: `startedAt` (String, ISO 8601)
- **Attributes**: `incidentId`, `resolvedAt`, `duration` (ms), `reason`
- **Global Secondary Index (GSI)** recommended for querying all incidents across websites

### Request Flow

1. **User Action**: User interacts with React SPA
2. **API Call**: Frontend makes authenticated HTTP request to API Gateway
3. **Routing**: API Gateway routes to appropriate Lambda function based on path/method
4. **Processing**: Lambda function validates input, applies SSRF checks, executes business logic
5. **Persistence**: Lambda writes/reads from DynamoDB tables
6. **Response**: Results returned through API Gateway to frontend
7. **UI Update**: React Query updates UI with fresh data
8. **Scheduled Checks**: EventBridge Scheduler triggers checker Lambda at configured intervals
9. **Monitoring**: All operations logged to CloudWatch

## Project Structure

```
UptimeHarbor/
├── README.md                    # This comprehensive documentation
├── package.json                 # Root package.json (workspace config)
├── vitest.config.ts             # Root Vitest configuration
├── frontend/                    # React frontend application
│   ├── index.html               # HTML entry point
│   ├── package.json             # Frontend dependencies
│   ├── vite.config.ts           # Vite configuration
│   ├── vitest.config.ts         # Frontend test config
│   ├── tailwind.config.js       # Tailwind CSS config
│   ├── postcss.config.js        # PostCSS config
│   ├── tsconfig.json            # TypeScript root config
│   ├── tsconfig.app.json        # App-specific TS config
│   ├── tsconfig.node.json       # Node-specific TS config
│   ├── public/                  # Static assets
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── src/                     # Source code
│   │   ├── App.tsx              # Root app component with routing
│   │   ├── main.tsx             # Application entry point
│   │   ├── index.css            # Global styles with Tailwind
│   │   ├── vite-env.d.ts        # Vite type declarations
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Header.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── context/             # React context providers
│   │   │   └── AppContext.tsx
│   │   ├── layouts/             # Layout components
│   │   │   └── Layout.tsx
│   │   ├── lib/                 # Utility libraries
│   │   │   └── utils.ts
│   │   ├── pages/               # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Websites.tsx
│   │   │   ├── WebsiteDetail.tsx
│   │   │   └── Incidents.tsx
│   │   ├── services/            # API services
│   │   │   └── api.ts
│   │   ├── test/                # Test setup
│   │   │   └── setup.ts
│   │   └── utils/               # Utility functions
│   │       └── validation.ts
│   └── dist/                    # Production build output
├── backend/                     # Backend Lambda functions
│   └── lambda/                  # Lambda source code
│       ├── package.json         # Lambda dependencies
│       ├── tsconfig.json        # Lambda TS config
│       ├── api/                 # API CRUD Lambda
│       │   └── index.ts
│       ├── checker/             # Health checker Lambda
│       │   └── index.ts
│       └── scheduler/          # EventBridge scheduler Lambda
│           └── index.ts
├── infra/                       # Infrastructure documentation
│   └── README.md                # AWS deployment templates & notes
├── shared/                      # Shared code (future use)
└── tests/                       # Integration & E2E tests
    └── frontend/                # Frontend unit tests
        ├── dashboard.test.tsx
        └── validation.test.ts
```

## Installation & Setup

### Prerequisites

- [Node.js](https://nodejs.org/) v20.x or higher (v24.17.0 recommended)
- [npm](https://www.npmjs.com/) v10.x or higher
- [Git](https://git-scm.com/) (optional)
- AWS Account (only required for deployment, not for local development)

### Local Setup

1. **Clone/Download the repository**
   ```bash
   cd F:\UptimeHarbor
   ```

2. **Install dependencies**
   
   For the frontend:
   ```bash
   cd frontend
   npm install
   ```
   
   Or from root (workspace):
   ```bash
   npm install
   ```

3. **Verify installation**
   ```bash
   cd frontend
   npm run build
   ```

4. **Run tests to ensure everything works**
   ```bash
   cd ..  # back to root
   npx vitest run
   ```

## Development

### Start Development Server

The frontend dev server runs with hot module replacement:

```bash
cd frontend
npm run dev
```

Or from root:
```bash
npm run dev
```

The application will be available at:
- **Local**: http://localhost:5175 (default port)
- **Network**: http://localhost:5175 (or configured port)

### Running with Background Process (Production Preview)

For testing the production build locally:

```bash
cd frontend
npm run build
npx serve@latest dist --listen 8080
```

Access at: http://localhost:8080

### Development Workflow

1. Make changes to source files in `frontend/src/`
2. Vite automatically hot-reloads changes
3. Run tests with `npx vitest run` or `npx vitest` (watch mode)
4. Check TypeScript with `cd frontend && npx tsc --noEmit`
5. Build to verify production readiness

### Code Quality Guidelines

- **TypeScript First**: All code must be strongly typed
- **Component Structure**: Use functional components with hooks
- **File Naming**: Use PascalCase for components, camelCase for utilities
- **CSS**: Use Tailwind utility classes, avoid custom CSS unless necessary
- **Testing**: Write tests for critical logic (validation, components)
- **Security**: Always validate user inputs and apply SSRF protections
- **No Secrets**: Never commit API keys, credentials, or tokens

## Testing

### Running Tests

Run all frontend unit tests:
```bash
cd F:\UptimeHarbor
npx vitest run
```

Run tests in watch mode:
```bash
npx vitest
```

Run with coverage (if configured):
```bash
npx vitest run --coverage
```

### Current Test Suite

| Test File | Tests | Description |
|---|---|---|
| `tests/frontend/dashboard.test.tsx` | 1 | Verifies Dashboard component renders correctly |
| `tests/frontend/validation.test.ts` | 3 | Validates URL format checking and SSRF protection logic |

**Total: 4 passing tests**

### Test Coverage Areas

- ✅ URL validation (valid/invalid protocols)
- ✅ SSRF protection (localhost, 127.0.0.1 blocking)
- ✅ Component rendering
- 🔄 More tests can be added for API services, hooks, and interactions

## Building for Production

### Build Frontend

```bash
cd frontend
npm run build
```

Or from root:
```bash
npm run build
```

This creates an optimized production build in `frontend/dist/` with:
- Minified JavaScript and CSS
- Tree-shaking for smaller bundle size
- Asset optimization and hashing
- Code splitting

### Build Output

```
dist/
├── index.html
├── assets/
│   ├── index-B5-6ELwa.js      (319.65 kB, gzipped 100.35 kB)
│   └── index-BGnmsrV1.css     (6.79 kB, gzipped 2.18 kB)
└── ...
```

### Verify Build

Test the production build locally:
```bash
cd frontend
npx serve@latest dist
```

## API Reference

The backend API follows RESTful conventions. All endpoints return JSON and use standard HTTP status codes.

### Base URL

- **Local Development**: `http://localhost:3000` (or API Gateway URL after deployment)
- **Production**: `https://{api-id}.execute-api.{region}.amazonaws.com`

### Endpoints

#### Websites

| Method | Endpoint | Description | Body |
|---|---|---|---|
| `GET` | `/websites` | List all monitored websites | - |
| `POST` | `/websites` | Add a new monitored website | `{ url: string, name?: string, checkInterval?: number }` |
| `GET` | `/websites/{id}` | Get website details | - |
| `PUT` | `/websites/{id}` | Update website settings | `{ name?, checkInterval?, enabled? }` |
| `DELETE` | `/websites/{id}` | Remove a website | - |
| `POST` | `/websites/{id}/check` | Trigger manual health check | - |
| `GET` | `/websites/{id}/history` | Get check history | - |

#### Incidents

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/incidents` | List all incidents |
| `GET` | `/incidents?websiteId={id}` | List incidents for specific website |

#### Statistics

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/stats` | Get dashboard summary statistics |

### Response Format

**Success Response (200/201):**
```json
{
  "data": { ... },
  "message": "success"
}
```

**Error Response (4xx/5xx):**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid URL provided"
  }
}
```

### Data Types

```typescript
interface Website {
  id: string
  url: string
  name?: string
  checkInterval: number  // seconds
  enabled: boolean
  lastCheck?: string     // ISO 8601
  status?: 'up' | 'down'
  latency?: number       // milliseconds
  createdAt: string
  updatedAt: string
}

interface CheckResult {
  id: string
  websiteId: string
  status: 'up' | 'down'
  statusCode?: number
  latency: number
  error?: string
  timestamp: string      // ISO 8601
}

interface Incident {
  id: string
  websiteId: string
  startedAt: string      // ISO 8601
  resolvedAt?: string    // ISO 8601
  duration?: number      // milliseconds
  reason: string
}
```

## Security Considerations

### Implemented Protections

1. **SSRF Prevention**
   - Blocks private IPv4 ranges: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16
   - Blocks localhost/loopback: localhost, 127.0.0.1, ::1
   - Blocks unspecified: 0.0.0.0
   - Blocks cloud metadata: 169.254.169.254 (AWS IMDSv1)
   - Only allows http:// and https:// protocols

2. **Input Validation**
   - URL format validation using native URL constructor
   - Request body validation on Lambda handlers
   - Type checking with TypeScript

3. **Network Security**
   - API Gateway CORS configuration
   - Lambda functions run in VPC only if necessary (avoid for cost)
   - Least-privilege IAM roles per Lambda function

4. **Secrets Management**
   - No credentials in source code
   - Use AWS Systems Manager Parameter Store or Secrets Manager for sensitive config
   - Environment variables for non-sensitive config

5. **Logging & Monitoring**
   - CloudWatch Logs for all Lambda invocations
   - CloudWatch Metrics for API errors, latency
   - X-Ray tracing (optional)

### Security Best Practices

- Keep dependencies updated (`npm audit`)
- Review IAM policies regularly
- Enable CloudTrail for audit logging
- Implement rate limiting on API Gateway
- Consider API key authentication for production
- Use AWS WAF for additional protection (if public-facing)

## AWS Deployment Guide

> **Important**: Before deploying, verify AWS Free Tier eligibility and current pricing. Monitor billing closely to avoid unexpected charges.

### Prerequisites

- AWS CLI configured (`aws configure`)
- AWS SAM CLI or AWS CDK installed (recommended)
- Appropriate IAM permissions for creating the required resources

### Deployment Approach

The project includes Lambda function code that can be deployed using:

1. **AWS SAM (Serverless Application Model)** - Simplest for Lambda + API Gateway + DynamoDB
2. **AWS CDK** - Infrastructure as Code with TypeScript
3. **AWS Console** - Manual deployment (not recommended for repeatability)

### Required AWS Resources

| Resource | Purpose | Notes |
|---|---|---|
| API Gateway (HTTP API) | REST API frontend | ~$1.00/M requests after free tier |
| Lambda Functions (3x) | API, checker, scheduler | 1M free requests/month |
| DynamoDB Tables (3x) | Data storage | 25GB free |
| EventBridge Scheduler | Cron-like scheduling | 1M free invocations/month |
| CloudWatch Logs | Logging | 5GB free/month |
| IAM Roles | Permissions | Free |

### Deployment Checklist

- [ ] Review free tier limits for your account region
- [ ] Create DynamoDB tables with appropriate key schema
- [ ] Package and deploy Lambda functions (use esbuild for bundling)
- [ ] Configure API Gateway routes and integrations
- [ ] Set up EventBridge Scheduler rules
- [ ] Configure environment variables
- [ ] Test endpoints after deployment
- [ ] Update frontend `VITE_API_BASE_URL` with API Gateway URL
- [ ] Rebuild and deploy frontend to S3/CloudFront
- [ ] Set up monitoring and alerts

### Frontend Hosting Options

| Option | Free Tier | Notes |
|---|---|---|
| **S3 Static Hosting** | 5GB free, 20k GET requests | Simple, HTTP only by default |
| **CloudFront + S3** | 1TB free egress (first 12 months), HTTPS included | Recommended, better performance & security |
| **AWS Amplify** | Build & deploy included, some limits | Great for CI/CD |

**Recommendation**: Use CloudFront + S3 for production to get HTTPS and global CDN.

## Cost & Free Tier Analysis

This application is designed to operate within AWS Free Tier limits for light to moderate usage.

### Always Free Services

| Service | Free Limit | Potential Usage | Cost if Exceeded |
|---|---|---|---|
| Lambda | 1M requests, 400K GB-seconds/month | ~10-100 websites checking every 5 min = ~30k-300k requests/month | $0.20/M requests after |
| DynamoDB | 25GB storage, 25 RCU, 25 WCU | Minimal for MVP (< 1GB) | ~$0.25/GB/month for storage |
| CloudWatch Logs | 5GB ingestion, 5GB storage/month | Low for this use case | $0.50/GB after |

### 12-Month Free Tier (New Accounts)

| Service | Free Limit | Notes |
|---|---|---|
| API Gateway (HTTP) | 1M requests/month | First 12 months only |
| CloudFront | 1TB data transfer out | First 12 months only |

### Estimated Monthly Costs

| Scenario | Estimated Cost | Notes |
|---|---|---|
| **Minimal (demo)**: 5-10 sites, 5-min checks | $0 - $0.10/month | Likely stays in free tier |
| **Light Production**: 20-50 sites, 5-min checks | $0 - $2/month | May exceed API Gateway free tier after 12 months |
| **Moderate**: 100+ sites, frequent checks | $5 - $15/month | Scale based on usage |

### Cost Optimization Tips

- Use longer check intervals (5-15 minutes) to reduce Lambda invocations
- Implement DynamoDB TTL on Checks table to auto-delete old history
- Limit check history retention (e.g., 30-90 days)
- Use CloudFront caching for static assets
- Monitor with AWS Cost Explorer and set billing alarms

**Disclaimer**: Free tier limits change over time. Always verify current rates at [AWS Free Tier page](https://aws.amazon.com/free/). This project does not guarantee zero costs.

## Environment Variables

### Frontend (.env)

Create a `.env` file in `frontend/` directory:

```bash
VITE_API_BASE_URL=https://your-api-gateway-id.execute-api.region.amazonaws.com
```

For local development without AWS:
```bash
VITE_API_BASE_URL=/api  # or http://localhost:3000
```

### Backend (Lambda Environment Variables)

Configure in Lambda function settings:

| Variable | Description | Example |
|---|---|---|
| `WEBSITES_TABLE` | DynamoDB table name for websites | `uptimeharbor-websites` |
| `CHECKS_TABLE` | DynamoDB table name for checks | `uptimeharbor-checks` |
| `INCIDENTS_TABLE` | DynamoDB table name for incidents | `uptimeharbor-incidents` |
| `AWS_REGION` | AWS region | `us-east-1` |
| `DEFAULT_TIMEOUT_MS` | HTTP request timeout | `5000` |
| `MAX_HISTORY_DAYS` | Days to retain check history | `30` |

## Teardown Guide

To avoid ongoing charges, remove all AWS resources when done.

### Using AWS CLI

```bash
# Delete DynamoDB tables
aws dynamodb delete-table --table-name uptimeharbor-websites
aws dynamodb delete-table --table-name uptimeharbor-checks
aws dynamodb delete-table --table-name uptimeharbor-incidents

# Delete Lambda functions
aws lambda delete-function --function-name uptimeharbor-api
aws lambda delete-function --function-name uptimeharbor-checker
aws lambda delete-function --function-name uptimeharbor-scheduler

# Delete API Gateway
aws apigatewayv2 delete-api --api-id <api-id>

# Delete EventBridge Scheduler schedules
aws scheduler delete-schedule --name uptimeharbor-check-scheduler --group-name uptimeharbor

# Delete S3 bucket and CloudFront (if used)
aws s3 rb s3://uptimeharbor-frontend --force
aws cloudfront delete-distribution --id <distribution-id>

# Delete CloudWatch Log Groups
aws logs delete-log-group --log-group-name /aws/lambda/uptimeharbor-api
aws logs delete-log-group --log-group-name /aws/lambda/uptimeharbor-checker
aws logs delete-log-group --log-group-name /aws/lambda/uptimeharbor-scheduler
```

### Manual Console Cleanup

1. Go to DynamoDB > Tables - Delete all three tables
2. Go to Lambda > Functions - Delete all three functions
3. Go to API Gateway > APIs - Delete the HTTP API
4. Go to EventBridge > Schedules - Delete scheduled rules
5. Go to S3 - Empty and delete frontend bucket
6. Go to CloudFront - Disable and delete distribution
7. Go to CloudWatch > Log groups - Delete Lambda log groups
8. Go to IAM > Roles - Delete custom roles created

### Verification

- Check AWS Billing Dashboard for any remaining resources
- Review Cost Explorer for unexpected charges
- Ensure no running Lambda functions or active schedules remain

## Known Limitations

### Current State (MVP)

- **Backend Implementation**: Lambda functions are scaffolded with basic structure. Full CRUD operations, health checking logic, and scheduled processing need complete implementation for AWS deployment
- **Database**: DynamoDB tables not provisioned yet - requires AWS deployment
- **Scheduled Checks**: EventBridge scheduler configured in design but not deployed/active
- **Authentication**: No user authentication or multi-tenancy implemented
- **Rate Limiting**: Not implemented on API endpoints
- **Real-time Updates**: Dashboard uses polling via React Query (no WebSocket)
- **Data Retention**: TTL and cleanup policies not automated
- **Alerting**: No email/SMS notifications for outages (can add via SNS)

### Design Constraints

- **Budget**: Strict ₹0 budget - no paid services used in local dev
- **Scope**: Kept minimal for 1-day implementation while maintaining quality
- **Free Tier Focus**: Architecture designed around free tier limits
- **Local-First**: Core UI and validation work entirely offline

## Roadmap

### Near-Term Improvements

- [ ] Complete Lambda function implementations (CRUD, health checks, scheduling)
- [ ] Add comprehensive backend unit tests
- [ ] Implement proper error handling and logging
- [ ] Add request validation with Zod/Joi
- [ ] Create SAM/CloudFormation template for IaC deployment
- [ ] Add health check retry logic with exponential backoff

### Mid-Term Enhancements

- [ ] Email/SMS alerts via AWS SNS
- [ ] Slack/Discord webhook notifications
- [ ] Advanced charts with time range filters
- [ ] Uptime percentage calculations
- [ ] SLA tracking and reporting
- [ ] API key authentication
- [ ] Multi-user support with RBAC
- [ ] Data export (CSV/JSON)

### Long-Term Features

- [ ] Real-time updates via WebSocket API Gateway
- [ ] SSL certificate expiration monitoring
- [ ] DNS resolution checks
- [ ] Content change detection
- [ ] Mobile app (React Native)
- [ ] Public status pages
- [ ] Integration with status page providers

## Running the Application Now

### Option 1: Development Server (Hot Reload)
```bash
cd F:\UptimeHarbor\frontend
npx vite --port 5175
# Access: http://localhost:5175
```

### Option 2: Production Preview
```bash
cd F:\UptimeHarbor\frontend
npm run build && npx serve@latest dist --listen 8080
# Access: http://localhost:8080
```

### Option 3: From Root
```bash
cd F:\UptimeHarbor
npm run dev  # runs frontend dev server
```

## Verification Commands

```bash
# Type checking
cd frontend && npx tsc --noEmit

# Run all tests
cd .. && npx vitest run

# Production build
cd frontend && npm run build

# Check for vulnerabilities
npm audit
```

## Contributing

This is a portfolio project, but contributions for learning purposes are welcome:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with passion for cloud engineering and modern web development.**

*Last Updated: October 16, 2026*
