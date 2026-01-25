# 🏢 Listings Manager - Frontend

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white)](https://tanstack.com/query/latest)

A professional, role-based real estate listings management dashboard. This frontend provides a comprehensive interface for administrators, editors, and subscribers to track, manage, and analyze property listings aggregated from multiple sources.

---

## 📖 Table of Contents

- [🚀 Project Overview](#-project-overview)
- [🏗️ Architecture & Tech Stack](#-architecture--tech-stack)
- [🔐 User Roles & Permissions](#-user-roles--permissions)
- [🛠️ Key Functionalities](#-key-functionalities)
  - [Dashboard & Analytics](#dashboard--analytics)
  - [Listing Management](#listing-management)
  - [Search & Filtering](#search--filtering)
  - [History & Auditing](#history--auditing)
  - [User & Scraper Management](#user--scraper-management)
- [📊 Data Schemas (Frontend)](#-data-schemas-frontend)
- [📁 Project Structure](#-project-structure)
- [🚦 Getting Started](#-getting-started)
- [🧼 Code Quality & Standards](#-code-quality--standards)

---

## 🚀 Project Overview

The **Listings Manager Frontend** is designed to streamline the workflow of real estate professionals. It offers a centralized hub for monitoring property listings, tracking price changes, managing external scraper activities, and providing insightful statistics. The application is built with a focus on **performance**, **security**, and **user experience**.

---

## 🏗️ Architecture & Tech Stack

The project follows a modern modular architecture, separating UI components, state management, and service layers for maximum maintainability.

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | **React 18+** | Declarative UI building with a component-based model. |
| **Language** | **TypeScript** | Static typing for enterprise-grade stability and developer productivity. |
| **Bundler** | **Vite** | Lightning-fast development server and optimized production builds. |
| **Styling** | **Tailwind CSS + shadcn/ui** | Utility-first styling combined with highly accessible, pre-built components. |
| **Routing** | **React Router 6** | Sophisticated client-side routing with role-based navigation guards. |
| **Data Fetching** | **TanStack Query (v5)** | Efficient server-state management, caching, and synchronization. |
| **HTTP Client** | **Axios** | Robust API communication with request/response interceptors. |
| **Icons** | **Lucide React** | Consistent and beautiful SVG-based icon set. |

---

## 🔐 User Roles & Permissions

The application implements strict Role-Based Access Control (RBAC) to ensure data integrity and security.

### 🎭 Role Matrix

| Capability | Admin | Editor | Subscriber | Guest |
| :--- | :---: | :---: | :---: | :---: |
| **Login / Password Recovery** | ✅ | ✅ | ✅ | ✅ |
| **View Listings Dashboard** | ✅ | ✅ | ✅ | ❌ |
| **Advanced Search & Filtering** | ✅ | ✅ | ✅ | ❌ |
| **Manage Favorites** | ✅ | ✅ | ✅ | ❌ |
| **Access Listing Details** | ✅ | ✅ | ✅ | ❌ |
| **Edit/Update Listings** | ✅ | ✅ | ❌ | ❌ |
| **Archive/Restore Listings** | ✅ | ✅ | ❌ | ❌ |
| **Manual Listing Creation** | ✅ | ✅ | ❌ | ❌ |
| **View Audit Logs/History** | ✅ | ✅ | ❌ | ❌ |
| **Control Scrapers** | ✅ | ✅ | ❌ | ❌ |
| **User Management** | ✅ | ❌ | ❌ | ❌ |
| **System-wide Statistics** | ✅ | ❌ | ❌ | ❌ |

---

## 🛠️ Key Functionalities

### Dashboard & Analytics
- **Summary Cards**: Real-time insights into total listings, active vs. archived, and latest updates.
- **Statistical Charts**: Visual representation of market trends and user activities (Admin Only).
- **Recent Activity**: A glanceable list of the latest changes across the platform.

### Listing Management
- **Full CRUD**: Create, Read, Update, and (Soft) Delete property listings.
- **Sold Status**: Efficiently mark properties as sold to track historical performance.
- **Archive System**: Robust soft-delete mechanism allowing for listing restoration if needed.

### Search & Filtering
- **Multi-parameter Search**: Filter by location, price range (initial vs. current), bedrooms, bathrooms, and square footage.
- **Source Filtering**: Filter listings by the originating website/scrapper.
- **Dynamic Search UI**: Responsive and intuitive search interface with instant feedback.

### History & Auditing
- **Field-level Tracking**: Detailed logs showing *what* was changed, *when*, and by *whom*.
- **Temporal Views**: View the historical state of any listing to track price fluctuations over time.

### User & Scraper Management
- **Scraper Dashboard**: Monitor the status of external automated scrapers and trigger manual runs.
- **User Lifecycle**: Create, suspend, and manage specialized roles for team members.

---

## 📊 Data Schemas (Frontend)

The application utilizes several core interfaces to ensure consistent data handling.

### Listing Object
```typescript
interface Listing {
  id: number;
  date_first_listed: string;
  listing_link: string;
  latitude: number;
  longitude: number;
  address: string;
  initial_price: number;
  current_price: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  listing_website: string;
  square_footage: string;
  zoning: string;
  zoning_plan: string;
  zoning_description: string;
  sale_date?: string | null;
  sale_price?: number | null;
  image_listing: string;
}
```

### User Object
```typescript
interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'editor' | 'subscriber';
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}
```

---

## 📁 Project Structure

```text
src/
├── components/      # Atomic and composite UI components (shadcn + custom)
│   ├── admin/       # Components specific to the Admin panel
│   ├── editor/      # Components specific to the Editor panel
│   └── ui/          # Reusable base UI elements (buttons, inputs, etc.)
├── contexts/        # React Contexts (Authentication, Theme, etc.)
├── hooks/           # Custom React hooks for business logic reuse
├── lib/             # Third-party library configurations
├── pages/           # Route-level components (Page Views)
│   ├── admin/       # Admin-specific pages
│   ├── editor/      # Editor-specific pages
│   └── subscriber/  # Subscriber-specific pages
├── services/        # API communication layer (Axios clients)
├── utils/           # Helper functions and formatting utilities
└── App.tsx          # Main application entry point and routing config
```

---

## 🚦 Getting Started

### Prerequisites
- **Node.js**: v18.x or higher
- **PackageManager**: `npm` or `bun`

### Installation
1. Clone the repository:
   ```bash
   git clone [repository-url]
   ```
2. Install dependencies:
   ```bash
   npm install
   # OR
   bun install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Configure `VITE_API_URL` to point to your backend service.

### Development
Run the development server:
```bash
npm run dev
# OR
bun dev
```

### Building for Production
Create an optimized production build:
```bash
npm run build
```

---

## 🧼 Code Quality & Standards

- **ESLint**: Enforces consistent coding patterns.
- **Prettier**: Ensures automated code formatting.
- **Component Pattern**: Separation of UI (presentational) and Logic (container/hooks).
- **TanStack Query**: Used as the "Single Source of Truth" for server-side state.
