# Frontend Task Distribution Plan
## Payroll Configuration & Policy Setup Subsystem

**Team Size:** 3 Members  
**Timeline:** To be determined  
**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS

---

## 📋 Overview

This document outlines the frontend development tasks for the Payroll Configuration & Policy Setup subsystem. Tasks are distributed across 3 team members based on feature complexity, dependencies, and logical grouping.

---

## 🎯 Task Distribution

### **Member 1: Core Configuration Pages (Phase 1 - Define Structure)**

**Focus:** Building the main configuration CRUD pages for Payroll Specialists

#### Tasks:

1. **Payroll Policies Management Page**
   - Role: Payroll Specialist (Create/Edit), All roles (View)
   - Route: `/dashboard/payroll-configuration/policies`
   - Features:
     - List all policies with status filter (Draft/Approved/Rejected)
     - Create new policy (Draft status)
     - Edit policy (only if Draft)
     - View policy details
     - Form validation
   - API Integration: `GET /payroll-configuration/policies`, `POST /payroll-configuration/policies`, `PUT /payroll-configuration/policies/:id`
   - Estimated: 3-4 days

2. **Pay Grades Management Page**
   - Role: Payroll Specialist (Create/Edit), All roles (View)
   - Route: `/dashboard/payroll-configuration/pay-grades`
   - Features:
     - List all pay grades with pagination
     - Create new pay grade (Draft status)
     - Edit pay grade (only if Draft)
     - View pay grade details
     - Integration with Organizational Structure (Job Grade/Band concept)
   - API Integration: `GET /payroll-configuration/pay-grades`, `POST /payroll-configuration/pay-grades`, `PUT /payroll-configuration/pay-grades/:id`
   - Estimated: 3-4 days

3. **Pay Types Management Page**
   - Role: Payroll Specialist (Create/Edit), All roles (View)
   - Route: `/dashboard/payroll-configuration/pay-types`
   - Features:
     - List all pay types
     - Create new pay type (Draft status)
     - Edit pay type (only if Draft)
     - View pay type details
   - API Integration: `GET /payroll-configuration/pay-types`, `POST /payroll-configuration/pay-types`, `PUT /payroll-configuration/pay-types/:id`
   - Estimated: 2-3 days

4. **Allowances Management Page**
   - Role: Payroll Specialist (Create/Edit), All roles (View)
   - Route: `/dashboard/payroll-configuration/allowances`
   - Features:
     - List all allowances
     - Create new allowance (Draft status)
     - Edit allowance (only if Draft)
     - View allowance details
   - API Integration: `GET /payroll-configuration/allowances`, `POST /payroll-configuration/allowances`, `PUT /payroll-configuration/allowances/:id`
   - Estimated: 2-3 days

**Total Estimated Time: 10-14 days**

---

### **Member 2: Benefits & Compliance Pages (Phase 1 & 2)**

**Focus:** Building benefits configuration and compliance-related pages

#### Tasks:

1. **Signing Bonuses Management Page**
   - Role: Payroll Specialist (Create/Edit), All roles (View)
   - Route: `/dashboard/payroll-configuration/signing-bonuses`
   - Features:
     - List all signing bonuses
     - Create new signing bonus (Draft status)
     - Edit signing bonus (only if Draft)
     - View signing bonus details
     - Integration with Onboarding (Contract details concept)
   - API Integration: `GET /payroll-configuration/signing-bonuses`, `POST /payroll-configuration/signing-bonuses`, `PUT /payroll-configuration/signing-bonuses/:id`
   - Estimated: 2-3 days

2. **Termination Benefits Management Page**
   - Role: Payroll Specialist (Create/Edit), All roles (View)
   - Route: `/dashboard/payroll-configuration/termination-benefits`
   - Features:
     - List all termination/resignation benefits
     - Create new termination benefit (Draft status)
     - Edit termination benefit (only if Draft)
     - View termination benefit details
     - Integration with Offboarding (Severance rules/terms concept)
   - API Integration: `GET /payroll-configuration/termination-benefits`, `POST /payroll-configuration/termination-benefits`, `PUT /payroll-configuration/termination-benefits/:id`
   - Estimated: 2-3 days

3. **Tax Rules Management Page**
   - Role: Legal Admin (Create/Edit), All roles (View - Read-only)
   - Route: `/dashboard/payroll-configuration/tax-rules`
   - Features:
     - List all tax rules (Read-only for most users)
     - Create new tax rule (Legal Admin only, Draft status)
     - View tax rule details
     - Legal rules update functionality (Edit approved rules - goes back to Draft)
     - Progressive tax rates display
   - API Integration: `GET /payroll-configuration/tax-rules`, `POST /payroll-configuration/tax-rules`, `PUT /payroll-configuration/tax-rules/:id`
   - Estimated: 3-4 days

4. **Insurance Brackets Management Page**
   - Role: Payroll Specialist (Create/Edit), HR Manager (Approve/Reject/Delete), All roles (View)
   - Route: `/dashboard/payroll-configuration/insurance-brackets`
   - Features:
     - List all insurance brackets
     - Create new insurance bracket (Draft status)
     - Edit insurance bracket (only if Draft)
     - View insurance bracket details
     - Display salary ranges and contribution percentages (employee & employer)
   - API Integration: `GET /payroll-configuration/insurance-brackets`, `POST /payroll-configuration/insurance-brackets`, `PUT /payroll-configuration/insurance-brackets/:id`
   - Estimated: 3-4 days

**Total Estimated Time: 10-14 days**

---

### **Member 3: System Settings & Approval Workflows (Phase 3, 4, 5)**

**Focus:** Building approval workflows, system settings, and HR oversight pages

**⚠️ Note:** Member 3 can start immediately on independent tasks (Company Settings, Backup, Shared Components). Approval and Stats dashboards should wait for Members 1 & 2 to create configurations.

#### Tasks:

1. **Company-Wide Settings Page** ✅ **CAN START IMMEDIATELY**
   - Role: System Admin (Create/Edit/View)
   - Route: `/dashboard/payroll-configuration/company-settings`
   - Features:
     - View company settings (pay dates, timezone, currency)
     - Create company settings (System Admin only, Draft status)
     - Edit company settings (System Admin only)
     - Form validation (currency must be EGP)
   - API Integration: `GET /payroll-configuration/company-settings`, `POST /payroll-configuration/company-settings`, `PUT /payroll-configuration/company-settings`
   - Dependencies: None (independent task)
   - Estimated: 2-3 days

2. **Backup Management Page** ✅ **CAN START IMMEDIATELY**
   - Role: System Admin (All actions)
   - Route: `/dashboard/payroll-configuration/backup`
   - Features:
     - View backup status and history
     - Manual backup trigger button
     - Backup schedule configuration
     - Download backup files
   - API Integration: (Backend API needs to be created)
   - Dependencies: None (independent task)
   - Estimated: 2-3 days

3. **Payroll Manager Approval Dashboard** ⏳ **WAIT FOR MEMBERS 1 & 2**
   - Role: Payroll Manager (Approve/Reject/Delete/View)
   - Route: `/dashboard/payroll-configuration/approvals`
   - Features:
     - List all pending approvals (excluding insurance & company settings)
     - Filter by configuration type (policies, pay grades, allowances, etc.)
     - View configuration details before approval
     - Approve configuration with comments
     - Reject configuration with rejection reason
     - Delete configurations (only Draft status)
     - Bulk approval actions
   - API Integration: 
     - `GET /payroll-configuration/pending-approvals`
     - `POST /payroll-configuration/{type}/:id/approve`
     - `POST /payroll-configuration/{type}/:id/reject`
     - `DELETE /payroll-configuration/{type}/:id`
   - Dependencies: Needs configurations from Members 1 & 2 (policies, pay grades, pay types, allowances, signing bonuses, termination benefits, tax rules)
   - Note: Can start building UI structure with mock data, but full functionality requires real data
   - Estimated: 4-5 days

4. **HR Manager Insurance Oversight Page** ⏳ **WAIT FOR MEMBER 2**
   - Role: HR Manager (Edit/Approve/Reject/Delete/View)
   - Route: `/dashboard/payroll-configuration/insurance-oversight`
   - Features:
     - List all insurance brackets (with status filter)
     - View insurance bracket details
     - Edit insurance brackets (only if Draft)
     - Approve insurance brackets
     - Reject insurance brackets with reason
     - Delete insurance brackets (only Draft status)
   - API Integration:
     - `GET /payroll-configuration/insurance-brackets`
     - `PUT /payroll-configuration/insurance-brackets/:id`
     - `POST /payroll-configuration/insurance-brackets/:id/approve`
     - `POST /payroll-configuration/insurance-brackets/:id/reject`
     - `DELETE /payroll-configuration/insurance-brackets/:id`
   - Dependencies: Needs insurance brackets from Member 2
   - Note: Can start building UI structure with mock data, but full functionality requires real data
   - Estimated: 3-4 days

5. **Configuration Statistics Dashboard** ⏳ **WAIT FOR MEMBERS 1 & 2**
   - Role: Payroll Manager, System Admin (View)
   - Route: `/dashboard/payroll-configuration/stats`
   - Features:
     - Overview cards (Total configs, Pending approvals, Approved, Rejected)
     - Charts/graphs showing configuration status distribution
     - Recent activity feed
     - Quick links to pending approvals
   - API Integration: `GET /payroll-configuration/stats`
   - Dependencies: Needs configuration data from Members 1 & 2
   - Note: Can start building UI structure with mock data, but meaningful stats require real data
   - Estimated: 2-3 days

**Total Estimated Time: 13-18 days**

---

## 🔧 Shared Components & Infrastructure (All Members)

### Common Components to Build/Reuse:

1. **Status Badge Component**
   - Display Draft/Approved/Rejected status with color coding
   - Used across all pages

2. **Configuration Form Components**
   - Reusable form fields for common inputs
   - Validation error display
   - Status-aware form (disable edit if not Draft)

3. **Approval Modal Component**
   - Reusable modal for approve/reject actions
   - Comment/reason input field
   - Used by Member 3, but should be built early

4. **Configuration List/Table Component**
   - Reusable table with pagination
   - Status filtering
   - Action buttons (Edit/Delete/Approve/Reject) based on role and status

5. **API Client Setup**
   - Create API service file: `lib/api/payroll-configuration/`
   - Functions for all CRUD operations
   - Error handling
   - Type definitions

6. **Route Protection**
   - Role-based route guards
   - Ensure proper access control per role

---

## 📁 File Structure to Create

```
frontend/
├── app/
│   └── dashboard/
│       └── payroll-configuration/
│           ├── page.tsx (Main dashboard/landing page)
│           ├── policies/
│           │   └── page.tsx
│           ├── pay-grades/
│           │   └── page.tsx
│           ├── pay-types/
│           │   └── page.tsx
│           ├── allowances/
│           │   └── page.tsx
│           ├── signing-bonuses/
│           │   └── page.tsx
│           ├── termination-benefits/
│           │   └── page.tsx
│           ├── tax-rules/
│           │   └── page.tsx
│           ├── insurance-brackets/
│           │   └── page.tsx
│           ├── company-settings/
│           │   └── page.tsx
│           ├── backup/
│           │   └── page.tsx
│           ├── approvals/
│           │   └── page.tsx
│           ├── insurance-oversight/
│           │   └── page.tsx
│           └── stats/
│               └── page.tsx
├── components/
│   └── payroll-configuration/
│       ├── StatusBadge.tsx
│       ├── ConfigurationForm.tsx
│       ├── ConfigurationTable.tsx
│       ├── ApprovalModal.tsx
│       └── RejectionModal.tsx
└── lib/
    └── api/
        └── payroll-configuration/
            ├── index.ts
            ├── policies.ts
            ├── pay-grades.ts
            ├── pay-types.ts
            ├── allowances.ts
            ├── signing-bonuses.ts
            ├── termination-benefits.ts
            ├── tax-rules.ts
            ├── insurance-brackets.ts
            ├── company-settings.ts
            ├── approvals.ts
            └── types.ts
```

---

## 🎨 Design Requirements

1. **Status Indicators:**
   - Draft: Yellow/Orange badge
   - Approved: Green badge
   - Rejected: Red badge

2. **Role-Based UI:**
   - Show/hide buttons based on user role
   - Disable edit buttons for non-Draft items
   - Show approval actions only for authorized roles

3. **Form Validation:**
   - Client-side validation before API calls
   - Display clear error messages
   - Required field indicators

4. **Responsive Design:**
   - Mobile-friendly tables (consider cards on mobile)
   - Responsive forms
   - Touch-friendly buttons

---

## 🔐 Role-Based Access Summary

| Feature | Payroll Specialist | Payroll Manager | Legal Admin | HR Manager | System Admin |
|---------|-------------------|-----------------|-------------|------------|--------------|
| Create Policies |     ✅    |    ❌ | ❌ | ❌ | ❌ |
| Create Pay Grades | ✅ | ❌ | ❌ | ❌ | ❌ |
| Create Pay Types | ✅ | ❌ | ❌ | ❌ | ❌ |
| Create Allowances | ✅ | ❌ | ❌ | ❌ | ❌ |
| Create Signing Bonuses | ✅ | ❌ | ❌ | ❌ | ❌ |
| Create Termination Benefits | ✅ | ❌ | ❌ | ❌ | ❌ |
| Create Tax Rules | ❌ | ❌ | ✅ | ❌ | ❌ |
| Create Insurance Brackets | ✅ | ❌ | ❌ | ❌ | ❌ |
| Edit (Draft only) | ✅ | ❌ | ✅ (Tax Rules) | ✅ (Insurance) | ✅ (Settings) |
| Approve/Reject | ❌ | ✅ (All except Insurance & Settings) | ❌ | ✅ (Insurance only) | ❌ |
| Delete | ❌ | ✅ (All except Insurance & Settings) | ❌ | ✅ (Insurance only) | ❌ |
| Company Settings | ❌ | ❌ | ❌ | ❌ | ✅ |
| Backup | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 📝 Key Business Rules to Implement

1. **Draft Status Enforcement:**
   - All new configurations created with `status: 'draft'`
   - Edit only allowed if `status === 'draft'`
   - Show appropriate error messages if trying to edit non-draft items

2. **Approval Workflow:**
   - After approval, item cannot be edited (must delete and recreate)
   - Show clear messaging about this restriction
   - Approval/rejection requires comments

3. **Tax Rules Special Case:**
   - Approved tax rules can be edited (for legal updates)
   - Editing approved tax rule sets it back to Draft
   - Requires re-approval

4. **Insurance Brackets:**
   - Approved by HR Manager (not Payroll Manager)
   - HR Manager can edit, approve, reject, delete

5. **Company Settings:**
   - Only one record exists
   - No approval workflow needed
   - System Admin only

---

## 🚀 Development Order Recommendation

### Week 1:
- **All Members:** Set up shared components (StatusBadge, ConfigurationTable, API client structure)
- **Member 1:** Start with Payroll Policies (simplest)
- **Member 2:** Start with Signing Bonuses
- **Member 3:** Start with Company Settings ✅ **CAN START IMMEDIATELY**

### 📌 Member 3 Starting Strategy (Can Start Before Members 1 & 2):

**Immediate Start (No Dependencies):**
1. ✅ Set up shared components (StatusBadge, ConfigurationTable, ApprovalModal, API client structure)
2. ✅ Build Company-Wide Settings Page
3. ✅ Build Backup Management Page

**Can Start UI Structure (Use Mock Data):**
4. ⚠️ Build Approval Dashboard UI structure (will need real data from Members 1 & 2 for full functionality)
5. ⚠️ Build Insurance Oversight Page UI structure (will need insurance brackets from Member 2)
6. ⚠️ Build Stats Dashboard UI structure (will need data from Members 1 & 2)

**Wait for Real Data:**
- Complete approval workflows (needs configurations to approve)
- Complete insurance oversight functionality (needs insurance brackets)
- Complete stats dashboard with real data (needs configuration data)

### Week 2:
- **Member 1:** Pay Grades, Pay Types, Allowances
- **Member 2:** Termination Benefits, Tax Rules
- **Member 3:** Backup page, start Approval Dashboard

### Week 3:
- **Member 1:** Polish and testing
- **Member 2:** Insurance Brackets, polish
- **Member 3:** Complete Approval Dashboard, Insurance Oversight, Stats Dashboard

### Week 4:
- **All Members:** Integration testing, bug fixes, UI/UX improvements

---

## ✅ Definition of Done

Each page/feature is considered complete when:

1. ✅ All CRUD operations work correctly
2. ✅ Role-based access control is enforced
3. ✅ Status-based editing restrictions work
4. ✅ Form validation is implemented
5. ✅ Error handling and user feedback is in place
6. ✅ Responsive design works on mobile/tablet/desktop
7. ✅ Code is reviewed and follows project conventions
8. ✅ Unit tests written (if applicable)
9. ✅ Integration with backend API is tested
10. ✅ Documentation updated

---

## 📞 Coordination Points

1. **API Client:** Coordinate on shared API client structure early
2. **Shared Components:** Agree on component props and interfaces
3. **Status Badge:** Standardize status display across all pages
4. **Error Messages:** Use consistent error message format
5. **Loading States:** Implement consistent loading indicators
6. **Success Messages:** Use consistent success notification pattern

---

## 🐛 Known Dependencies

1. **Backend API:** All endpoints must be available and tested
2. **Authentication:** JWT token handling must be working
3. **Role System:** User roles must be properly assigned
4. **Organizational Structure:** Integration needed for Pay Grades (Member 1)
5. **Onboarding/Offboarding:** Integration concepts needed (Member 2)

---

**Last Updated:** [Current Date]  
**Document Owner:** Development Team Lead

