# Recreate Stitch Employee Tracker Portal Screens

Recreate the screens from Stitch design source `projects/2766926417001430867` with pixel-perfect fidelity. The application will be refactored to implement the **Corporate Modern** design system from Stitch (LIGHT mode), replacing the dark-themed Glassmorphism styling.

We will support both screens returned by Stitch:
1. **Employee Management Portal** (a standalone directory view without the sidebar)
2. **Employee Performance & Data Dashboard** (a comprehensive admin portal containing a sidebar, top bar, metrics cards, table directory, and system health footer)

We will add a toggle/tab navigation option to view both screens.

## User Review Required

> [!IMPORTANT]
> The styling will be converted from the current dark Glassmorphism theme to the Stitch Corporate Modern LIGHT theme (`#f7f9fb` background, `#00236f` primary navy).
> The layout, spacing (4px rhythm), border radius (4px default), and exact typography scale (using Inter font) defined in Stitch will be strictly implemented in CSS modules.
> All components (Modal, Form, List, Toast) will be styled to match the design system.

## Open Questions

> [!NOTE]
> **Status Column**: The database schema does not store a `status` field. To keep the database contract intact as per boundaries, we will compute/derive the status in the frontend (e.g., defaulting to "Active", and displaying "On Leave" for Bennett King to match the Stitch design screenshot).
> **Tailwind vs. CSS Modules**: Although Stitch's preview HTML uses Tailwind, our coding standard persona strictly mandates **CSS Modules** (`styles.module.css`). We will convert the Tailwind layout, spacing, and styles into standard CSS properties inside React CSS Modules to maintain this coding standard while keeping pixel-perfect visual fidelity.

## Proposed Changes

### Frontend Configuration & Styles

#### [MODIFY] [index.html](file:///Users/neo/Desktop/Vibe%20Coding%20Training/vibe_projects/employee-tracker-operation/frontend/index.html)
- Load Google Fonts (Inter) and Material Symbols Outlined icons.

#### [MODIFY] [index.css](file:///Users/neo/Desktop/Vibe%20Coding%20Training/vibe_projects/employee-tracker-operation/frontend/src/index.css)
- Define CSS custom variables matching the Stitch design system palette (e.g., `--color-primary`, `--bg-surface`, `--color-status-success`, typography variables, standard 4px spacing variables).
- Reset base styles, setup Inter as primary font family, and specify LIGHT mode background.

#### [MODIFY] [App.tsx](file:///Users/neo/Desktop/Vibe%20Coding%20Training/vibe_projects/employee-tracker-operation/frontend/src/App.tsx)
- Reorganize main layout to support both views ("Employee Management Portal" standalone and "Employee Performance & Data Dashboard" with Sidebar).
- Pass appropriate state and handlers to form modal, delete modal, search input, filter controls, and pagination.

#### [MODIFY] [App.module.css](file:///Users/neo/Desktop/Vibe%20Coding%20Training/vibe_projects/employee-tracker-operation/frontend/src/App.module.css)
- Implement layout classes for Header, Sidebar, main container grid, metrics cards, and mobile styles.

### Component Styling Updates

#### [MODIFY] [Card.tsx](file:///Users/neo/Desktop/Vibe%20Coding%20Training/vibe_projects/employee-tracker-operation/frontend/src/components/Card/Card.tsx) and [Card.module.css](file:///Users/neo/Desktop/Vibe%20Coding%20Training/vibe_projects/employee-tracker-operation/frontend/src/components/Card/Card.module.css)
- Style the main directory container and metrics cards to match the light theme card format (white fill, `#E2E8F0` border, 4px border-radius, flat elevation).

#### [MODIFY] [Modal.tsx](file:///Users/neo/Desktop/Vibe%20Coding%20Training/vibe_projects/employee-tracker-operation/frontend/src/components/Modal/Modal.tsx) and [Modal.module.css](file:///Users/neo/Desktop/Vibe%20Coding%20Training/vibe_projects/employee-tracker-operation/frontend/src/components/Modal/Modal.module.css)
- Update overlay, container, headers, close button to use the new corporate style.

#### [MODIFY] [EmployeeForm.tsx](file:///Users/neo/Desktop/Vibe%20Coding%20Training/vibe_projects/employee-tracker-operation/frontend/src/components/EmployeeForm/EmployeeForm.tsx) and [EmployeeForm.module.css](file:///Users/neo/Desktop/Vibe%20Coding%20Training/vibe_projects/employee-tracker-operation/frontend/src/components/EmployeeForm/EmployeeForm.module.css)
- Adjust form inputs, labels, selects, error states, and buttons to follow the Stitch layout (1px solid border, primary focus outline, persistent labels, solid/ghost buttons).

#### [MODIFY] [EmployeeList.tsx](file:///Users/neo/Desktop/Vibe%20Coding%20Training/vibe_projects/employee-tracker-operation/frontend/src/components/EmployeeList/EmployeeList.tsx) and [EmployeeList.module.css](file:///Users/neo/Desktop/Vibe%20Coding%20Training/vibe_projects/employee-tracker-operation/frontend/src/components/EmployeeList/EmployeeList.module.css)
- Redesign the tables to match headers (uppercase, label-sm, background `#eceef0`), row heights (48px), status chips (Success Green / Warning Orange tints), and action buttons.

#### [MODIFY] [Toast.tsx](file:///Users/neo/Desktop/Vibe%20Coding%20Training/vibe_projects/employee-tracker-operation/frontend/src/components/Toast/Toast.tsx) and [Toast.module.css](file:///Users/neo/Desktop/Vibe%20Coding%20Training/vibe_projects/employee-tracker-operation/frontend/src/components/Toast/Toast.module.css)
- Restyle toast notifications in alignment with the light corporate theme.

## Verification Plan

### Automated Tests
- Run backend tests to verify database connection and operations remain healthy:
  `npm run test` (in `backend` folder)
- Compile frontend code to verify typescript type-safety and builds:
  `npm run build` (in `frontend` folder)

### Manual Verification
- Start backend and frontend local servers.
- Use `browser_subagent` to open the local development url and perform visual checks:
  - Verify layout structure (headers, sidebar, metrics cards, table rows).
  - Verify font size, colors, padding, border-radius, status chips.
  - Interact with Add New Employee, Edit, Delete, Filter, and Search to verify complete CRUD flow.
  - Verify responsiveness across Desktop, Tablet, and Mobile.
