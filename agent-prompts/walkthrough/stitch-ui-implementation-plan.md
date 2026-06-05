# Implementation Plan - Pixel-Perfect Re-creation of Stitch Designs

Recreate both desktop screens ("Employee Performance & Data Dashboard" and "Employee Management Portal") from the Stitch design system project ID `2766926417001430867` with pixel-perfect fidelity.

## User Review Required

> [!IMPORTANT]
> The design system in Stitch is configured in **LIGHT** mode with a custom color palette (anchored by Deep Navy `#1E3A8A` / `#00236f` and Slate Gray `#475569` / `#515f74`), contrasting with the current dark theme of the prototype. The new design system will strictly apply the Light Corporate-Modern theme of Stitch.
> We will implement a layout selector in the TopAppBar allowing seamless toggle between the two screens:
> 1. **Dashboard Layout** (Screen 1: featuring the persistent SideNavBar, performance metric cards, table with hovering action icons, and System Health footer).
> 2. **Portal Layout** (Screen 2: full-width header, table with persistent Edit/Delete buttons, no sidebar, no metrics, no health footer).

---

## Proposed Changes

### Core Styles & Theme Configuration

#### [MODIFY] [index.css](file:///Users/neo/Desktop/Vibe%20Coding%20Training/vibe_projects/employee-tracker-operation/frontend/src/index.css)
- Reset and redefine CSS variables in `:root` to map to Stitch named colors (e.g. `--primary: #00236f;`, `--primary-container: #1e3a8a;`, `--surface: #f7f9fb;`, `--on-surface: #191c1e;`, `--border-subtle: #E2E8F0;`, etc.).
- Configure typography configurations based on the Inter font specification (line heights, font sizes, weights).
- Set global HTML/Body background color to `#f7f9fb` to match Stitch Light Mode.
- Define outline styles (1px border, transitions) and standardized rounded corners (`--radius-default: 4px` / `0.25rem`).

---

### Layouts & View Switching

#### [MODIFY] [App.tsx](file:///Users/neo/Desktop/Vibe%20Coding%20Training/vibe_projects/employee-tracker-operation/frontend/src/App.tsx)
- Add a new state variables: `viewLayout` (`'dashboard' | 'portal'`) and `selectedDepartment` (`string`).
- Integrate the SideNavBar element (from Screen 1) conditionally rendered only in the `'dashboard'` layout.
- Render the TopAppBar. Add a layout selector dropdown in the header to switch between `'dashboard'` (Dashboard View) and `'portal'` (Portal View).
- Conditionally render the KPI cards (Record Success, Data Accuracy, Task Completion, Efficiency) when `'dashboard'` is active.
- Conditionally render the System Health Footer bar in `'dashboard'` mode.
- Update modal bindings and confirmation dialogs to use custom elements mapping to the new Stitch corporate-modern theme.

#### [MODIFY] [App.module.css](file:///Users/neo/Desktop/Vibe%20Coding%20Training/vibe_projects/employee-tracker-operation/frontend/src/App.module.css)
- Define layout classes matching Stitch layout dimensions (64rem sidebar, 16rem main canvas padding, 4rem/16px top bar height).
- Implement metrics card grid container styles (4-column grid on desktop).
- Add CSS modules styling for the SideNavBar, Brand header, navigation links, TopAppBar elements, and layout toggle controls.
- Update footer styles for System Health.

---

### Components Re-styling

#### [MODIFY] [EmployeeList.tsx](file:///Users/neo/Desktop/Vibe%20Coding%20Training/vibe_projects/employee-tracker-operation/frontend/src/components/EmployeeList/EmployeeList.tsx)
- Accept a new prop `viewLayout` (`'dashboard' | 'portal'`).
- Display standard table headers: `Employee Name`, `ID`, `Department`, `Role`, `Status`, `Actions`.
- Display status badge styling for employees (e.g., Active or On Leave, based on employee status/department).
- Render actions cell conditionally:
  - If `viewLayout === 'dashboard'`: render hover-only edit/delete icon buttons (with group-hover opacity).
  - If `viewLayout === 'portal'`: render persistent, styled "Edit" and "Delete" button components with icons and label text.
- Add pagination controls in the table footer to match the Stitch design footer ("Showing X of Y employees", chevrons).

#### [MODIFY] [EmployeeList.module.css](file:///Users/neo/Desktop/Vibe%20Coding%20Training/vibe_projects/employee-tracker-operation/frontend/src/components/EmployeeList/EmployeeList.module.css)
- Implement table row height (48px fixed), header uppercase labels (`label-sm`), zebra row striping or light bottom borders, and hover background color (`#ffffff`).
- Define status chip classes with light-tinted backgrounds and high-contrast text.
- Add styles for persistent button layouts (Portal view actions) and opacity transitions for hover icons (Dashboard view actions).

#### [MODIFY] [EmployeeForm.tsx](file:///Users/neo/Desktop/Vibe%20Coding%20Training/vibe_projects/employee-tracker-operation/frontend/src/components/EmployeeForm/EmployeeForm.tsx)
- Re-style input fields, dropdown select elements, and buttons (4px radius, 1px solid border `#E2E8F0`, shifting to Primary Blue on focus, persistent text labels above input).
- Map colors of Cancel and Submit buttons to Stitch theme ("Save/Submit" should use Tertiary/Success Green).

#### [MODIFY] [Modal.tsx](file:///Users/neo/Desktop/Vibe%20Coding%20Training/vibe_projects/employee-tracker-operation/frontend/src/components/Modal/Modal.tsx)
- Apply Soft and Structural styling (4px border radius, subtle shadows `0px 4px 12px rgba(0,0,0,0.05)`, and light surface backgrounds).

#### [MODIFY] [Card.tsx](file:///Users/neo/Desktop/Vibe%20Coding%20Training/vibe_projects/employee-tracker-operation/frontend/src/components/Card/Card.tsx)
- Update wrapper styles (Level 1 surface, `#FFFFFF` background with `1px solid #E2E8F0` border, `4px` radius).

---

## Verification Plan

### Automated Tests
- Run `npm run build` to verify there are no TypeScript compile errors.

### Manual Verification
- Deploy/run the app locally and toggle the layout selector in the header to confirm both layouts (Dashboard and Portal) are visually correct and identical to the Stitch mockups.
- Perform CRUD operations (create, update, delete) in both layout modes to verify the API service works seamlessly.
- Verify responsiveness by testing screen size changes (desktop, tablet, and mobile views).
