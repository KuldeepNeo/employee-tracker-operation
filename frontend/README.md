# Employee CRUD Frontend Client

This is the React frontend for the Employee Data Tracking Web Application. It is built using React 19, Vite 8, TypeScript, and CSS Modules, with premium glassmorphism styling.

## Tech Stack
- **React**: v19.2.7
- **Vite**: v8.0.16
- **TypeScript**: v6.0.3
- **CSS Modules**: Vanilla CSS
- **Icon Library**: `lucide-react`

---

## 1. Setup Instructions

1. **Navigate to the frontend folder**:
   ```bash
   cd frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   By default, the client points to `http://localhost:3000`. You can configure a custom API endpoint by creating a `.env` file in the `frontend` root:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

---

## 2. Running the Application

- **Start local development server**:
  ```bash
  npm run dev
  ```
  The application will start, typically running on `http://localhost:5173`.

- **Build production bundle**:
  ```bash
  npm run build
  ```

- **Preview production build**:
  ```bash
  npm run preview
  ```

---

## 3. Architecture Overview

- **Service Layer Pattern**: All API interactions are handled strictly inside `src/services/employee.service.ts`. UI components never perform direct fetch requests.
- **Custom React Hooks**: The `src/hooks/useEmployee.ts` hook coordinates asynchronous operations, state changes, loading indicators, and handles error states.
- **Glassmorphic UI**: High-fidelity overlays, focus borders, translucent background backdrops, drop-shadows, and smooth micro-animations.
