# Reachable AI: Frontend Web Client

This directory contains the frontend web application for the **Reachable AI** CRM. It is a highly responsive, modern Single Page Application (SPA) built with React and Vite.

## Architecture & Design

The frontend is designed with a premium, minimalist aesthetic prioritizing user experience, dynamic interactions, and data visualization.

*   **State-Based Routing**: Rather than using heavy routing libraries, the application uses an internal `activePage` state context to switch views instantly without reloading.
*   **Context API**: Global state management (Authentication, Navigation, Webhook Testing Logs) is handled natively via React Context to avoid prop-drilling.
*   **Modular Components**: UI components are isolated and reusable (e.g., specific tabs for settings, copilot chats, metrics cards).

## Tech Stack

*   **Framework**: React 18 + Vite
*   **Styling**: Pure CSS (CSS Variables for theming, no Tailwind)
*   **Animations**: Framer Motion
*   **Icons**: Lucide React
*   **Data Visualization**: Recharts
*   **HTTP Client**: Axios

## Environment Variables

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:8000
```
*Note: In production (e.g., on Vercel), this variable must be set in your deployment environment settings to point to your live backend URL.*

## Running Locally

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Development Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

## Key Directories

*   `src/components/`: Contains all UI components, categorized by domain (auth, crm, landing).
*   `src/api/`: Axios interceptors and wrapper functions for backend API communication.
*   `src/index.css`: Global CSS variables defining the design system (colors, typography, spacing).
*   `src/App.jsx`: Main entry point handling authentication state and high-level routing.
*   `src/components/crm/AppShell.jsx`: The layout wrapper (sidebar + top bar) that orchestrates the internal CRM views.
