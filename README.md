# HR Analytics & Leave Dispatch Portal

A professional-grade internal management tool built to bridge the gap between employee leave tracking and automated HR communication.

> **Note to Reviewers:** This repository is a technical showcase. Due to the sensitive nature of HR data and security configurations (Firebase/OAuth), the environment variables are not public. Please refer to the **Technical Highlights** section to see the implementation details.

---

## 🎯 Project Purpose

Managing leave quotas manually often leads to communication gaps. This portal was built to:

- **Centralize Data**: Provide a single dashboard for HR to monitor leave utilization across multiple departments.
- **Automate Outreach**: Streamline employee notifications via an automated email dispatch system.
- **Guarantee Security**: Implement strict enterprise-grade security through Google OAuth and admin whitelisting.

---

## 🛠 Technical Highlights

### 1. Robust State & Effect Management

I focused on handling complex React lifecycles to ensure a "production-ready" feel:

- **Race Condition Prevention**: Implemented cleanup flags (`isMounted`) in `useEffect` to prevent "double-fetching" and state updates on unmounted components.
- **Batch Processing**: Built a sequential email dispatcher with SMTP throttling protection and a real-time progress tracker using `useMemo` for optimized performance.

### 2. High-Fidelity UI/UX

- **Modern Aesthetic**: Leveraged **HeroUI** and **Tailwind CSS** to create a custom "Portal" design system with signature `rounded-portal` tokens and glassmorphism.
- **Fluid Animations**: Orchestrated **Framer Motion** variants to handle skeleton transitions and "waterfall" list loading, ensuring a polished user experience with zero layout shift.

### 3. Security-First Architecture

- **Auth Guard**: Developed a custom `AuthProvider` that intercepts Firebase authentication to validate users against a server-side whitelist before granting access to the application context.
- **Type-Safe Domain**: Strictly typed the entire ecosystem (`Employee`, `LeaveUsage`, `Analytics`) to ensure data integrity when merging Asana API data with internal database records.

---

## 🏗 Modular Architecture

The codebase is organized following atomic design and modular principles:

- **`/@types`**: Centralized domain models (Matches backend structure for zero-mapping overhead).
- **`/@context`**: Global Auth & Security Guard logic.
- **`/@components`**: Reusable UI units (StatsPanel, UsersTable, Sidebar).
- **`/@services`**: Abstracted API layer for third-party integrations.

---

## 🚀 Key Features

- **Interactive Quota Tracking**: Visual progress bars for Annual and Sick leave with automated "Exceeded" pulse alerts.
- **Drill-down Analytics**: Specialized modal breakdown for non-quota leave types like WFH, Personal, or Compassionate leave.
- **Intelligent Dispatch**: A robust email queue system with status persistence (Sent/Sending/Pending) and batch-send capabilities.

---

## 💻 Tech Stack

- **Core**: Next.js 15 (App Router), TypeScript
- **UI/UX**: HeroUI, Tailwind CSS, Framer Motion, Lucide Icons
- **Backend/BaaS**: Firebase Auth, Firestore
- **Data Vis**: Chart.js

---

## 📄 License

This project is for demonstration purposes and is licensed under the MIT License.
