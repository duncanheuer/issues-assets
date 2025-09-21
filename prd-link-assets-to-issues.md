# PRD: Link Assets to Issues (SafetyCulture)

## Overview
Enable users to link one or more Assets to an Issue in SafetyCulture. Linking provides operational context (what equipment/location is impacted), enables triage and routing, consolidates history for better decision-making, and improves reporting across the Issues and Assets products.

This PRD covers data model, UX, permissions, APIs and success measures to deliver an end-to-end “Link Assets to Issues” capability across web (MVP), with forward-compatible design for mobile and API.

## Problem Statement
Today, users cannot formally associate an Issue with the Asset(s) involved. Workarounds include free-text mentioning the asset name or attaching photos. This causes:
- Loss of traceability between Issues and Assets.
- Friction in triage and assignment because context is missing.
- No visibility on an Asset’s incident history.
- Poor reporting (e.g., top Assets by incident count, MTTR by Asset).

## Goals & Non-Goals
- **Goals**
  - **[G1]** Link zero, one, or many Assets to an Issue during creation and after creation.
  - **[G2]** Provide an asset picker with search, filtering and multi-select.
  - **[G3]** Display linked Assets within the Issue detail, and show linked Issues within the Asset record.
  - **[G4]** Support permissions and site-scoping aligned with existing Issues and Assets RBAC.
  - **[G5]** Track changes in history/activity and expose links via API.
  - **[G6]** Provide scalable list/table display patterns for multiple assets (chips + count with popover).
- **Non-Goals (MVP)**
  - Creating or editing Asset records from the Issue flow (beyond deep-links).
  - Bulk link/unlink across multiple Issues in a single action.
  - Automated linking based on image recognition or IoT signals.
  - Mobile parity in the same release (design for, but not in MVP scope).

## User Stories
- **Reporter**: “As a site user raising an Issue, I want to search and select the Asset affected so the assignee has the right context.”
- **Assignee**: “As an assignee, I want to view and update linked Assets on the Issue so I can coordinate work with maintenance.”
- **Asset Manager**: “As an asset owner, I want to see all Issues linked to my Asset to understand reliability and plan maintenance.”
- **Supervisor**: “As a supervisor, I want to filter Issues by Asset to prioritize work and spot recurring problems.”
- **Auditor**: “As an auditor, I want immutable activity records when Assets are linked or unlinked from an Issue.”

## Functional Requirements
### FR1. Data Model
- Introduce a many-to-many join: `issue_asset_link`
  - Fields: `id`, `issue_id` (FK), `asset_id` (FK), `created_at`, `created_by`, `deleted_at` (nullable), `deleted_by` (nullable).
  - Constraint: unique on `(issue_id, asset_id, deleted_at IS NULL)` to prevent duplicate active links.
  - Indexes on `issue_id`, `asset_id`, and `(asset_id, deleted_at)`.
- Surface link counts on Issue and Asset aggregates for list performance (optional computed or cached).

### FR2. Permissions & Scoping
- Users must have permission to view an Asset to link it and to subsequently view it on the Issue.
- Users must have permission to edit an Issue to add/remove links.
- If a user can view the Issue but lacks permission to view a linked Asset, display a masked chip: “Restricted asset”.
- Respect site/organization scoping consistent with current Issues/Assets model (cross-site linking allowed only if the tenant allows cross-site visibility; otherwise limit to the Issue’s site by default).

### FR3. Create Issue: Link Assets (MVP Web)
- Asset picker component with:
  - Search-as-you-type (name, code, tags), optional filter by Site/Type/Status.
  - Multi-select with checkboxes.
  - Selected assets appear as chips in the form and are included on submit.
- Form submission creates Issue then bulk-creates `issue_asset_link` records (transactional).
- Error handling surfaces failed links but preserves successful ones; clearly communicate partial success.

### FR4. Issue Detail: Linked Assets Section
- Show chips for linked assets; each chip links to the Asset record.
- Provide “Add asset” button to invoke the same asset picker.
- Each chip has a remove “×” action (if user has edit permission).
- Activity log event types:
  - `asset_linked`: includes asset id/name, actor, timestamp.
  - `asset_unlinked`: includes asset id/name, actor, timestamp.

### FR5. Asset Record: Linked Issues Section
- A panel/table lists Issues linked to the Asset with columns: Issue ID, Title, Status, Created, Assignee.
- Sort by Created (desc) by default; filter by Status.
- Each row links to the Issue.

### FR6. Lists, Tables, Filters (Issues List)
- Add “Assets” column showing linked Assets using the display pattern below.
- Add filter: by one or more Assets.
- Search includes linked asset names/codes.

### FR7. Display Pattern for Multiple Assets (Tables)
- Show up to the first 2 assets as chips (name/code) in the cell.
- If more than 2, show a compact count badge: `+N`.
- Hover or click the count badge to open a popover with the full list (scrollable, searchable in popover optional).
- Chips truncate with ellipsis if overflowing; table maintains column width.
- Keyboard and screen reader accessible: count badge has a descriptive label, popover is focus-trapped, escape closes.

### FR8. API
- REST/GraphQL endpoints:
  - `GET /issues/{id}/assets` → list linked assets.
  - `POST /issues/{id}/assets` → link assets (array of asset_ids).
  - `DELETE /issues/{id}/assets/{asset_id}` → unlink asset.
  - `GET /assets/{id}/issues` → list linked issues.
- Responses include minimal asset/issue fields needed for lists and chips (id, name/code, site, type).

### FR9. Telemetry & Reporting
- Track: links created per user/day, avg assets per issue, top assets by linked issues, issues filtered by asset.
- Expose metrics in analytics later (not MVP UI).

## Edge Cases & Considerations
- Asset archived or deleted:
  - Archived: keep link but visually mark as “Archived” and prevent new links.
  - Deleted: soft-delete link; show activity “Asset removed (deleted)”.
- Permission loss after linking: show “Restricted asset” chip; do not leak names.
- Cross-site linking rules vary by tenant: default picker to Issue’s site; allow override only if policy permits.
- Duplicate link attempts: backend idempotency ensures one active link only.
- Very large selections (100s):
  - Bulk linking API processes in chunks; UI shows progress and final summary.
  - Table cell uses chips + `+N` pattern with popover; export contains full list.
- Concurrency: simultaneous add/remove on same Issue should be safe via unique constraints + transactions.
- Offline/mobile: out of scope for MVP; design is compatible for later.
- Localization: chips and messages translate; long names truncate with tooltip.
- Accessibility: picker keyboard navigation, ARIA roles, focus management, color contrast for chips.

## Success Metrics
- 30–50% of Issues have ≥1 linked Asset within 60 days of launch.
- 20% reduction in average time-to-triage for Issues with linked Assets.
- ≥90% success rate of link/unlink operations (low error rate).
- ≥70% of active users who create Issues interact with the asset picker within 90 days.
- Qualitative: improved CSAT/NPS for Issues & Assets workflows (survey comments referencing “context” or “linking”).

## Open Questions
- Should cross-site linking be restricted by default or tenant-configurable?
- Maximum assets per issue? (Propose soft warning at 50, hard cap at 500 to protect UI/perf.)
- Which asset fields should show in chips: Name or Name + Code? (Propose Name, tooltip includes Code.)
- Should asset picker support type filters (Vehicles, Tools, Locations) in MVP?
- Do we need bulk link/unlink in Issues list as a near-term follow-up?

## Example Workflows
- **Raising a new Issue and linking an Asset during creation**
  1. User clicks “Create Issue”.
  2. Fills in title, description, category, site.
  3. Clicks “Add asset(s)” → asset picker opens.
  4. Searches for “Hilux”, selects 2 assets → chips appear in the form.
  5. Submits Issue → Issue created; links persisted; Issue detail shows linked assets chips; activity shows 2 `asset_linked` events.

- **Linking an Asset to an existing Issue**
  1. Open Issue detail → “Linked Assets” section → “Add asset”.
  2. Search and select 1+ assets, confirm.
  3. Chips appear; activity stream records `asset_linked` events.

- **Viewing linked Assets from within an Issue**
  1. Open Issue detail.
  2. See chips for linked assets; the first 2 visible and a `+N` badge if more.
  3. Hover/click `+N` → popover lists all assets; click an asset to open its record.

- **Viewing Issues linked to a specific Asset**
  1. Open Asset record page.
  2. “Linked Issues” section lists recent Issues with status and created date; filter by status; click to navigate to Issue.

## Acceptance Criteria
- **Create Flow**
  - Given a user is creating an Issue, when they open the asset picker and select one or more assets, then those assets appear as chips in the create form.
  - Given a user submits the Issue create form, when valid assets are selected, then the Issue is created and `issue_asset_link` rows are persisted transactionally.
  - Given a backend failure linking one of several assets, when partial success occurs, then the UI surfaces which assets failed and the Issue is still created with successful links.

- **Issue Detail**
  - Given a user opens an existing Issue, when they link an Asset, then that Asset appears under the “Linked Assets” section as a chip and an `asset_linked` entry appears in activity.
  - Given a user removes an Asset from an Issue, when the page refreshes, then the chip is removed and an `asset_unlinked` activity entry is visible.
  - Given an Issue has more than two linked Assets, when the Issue detail loads, then the first two assets display as chips and a `+N` badge is shown.
  - Given a user activates the `+N` badge, when the popover opens, then the full list of assets is visible and keyboard-accessible.

- **Asset Record**
  - Given an Asset has linked Issues, when a user views the Asset, then a list/table of linked Issues is visible with Issue ID, Title, Status, Created and Assignee.
  - Given the list of linked Issues is long, when the user scrolls, then the table remains performant (paginated or virtualized) and sortable by Created.

- **Permissions**
  - Given a user can view an Issue but not a particular Asset, when the Issue detail loads, then the asset is shown as “Restricted asset” without revealing its name.
  - Given a user lacks edit permission on an Issue, when viewing “Linked Assets”, then the “Add asset” and remove actions are not visible.

- **Search, Filters & Lists**
  - Given a user is on the Issues list, when they search or filter by an asset, then only Issues linked to matching assets are returned.
  - Given multiple assets are linked to an Issue, when the table renders, then at most 2 chips are shown with a `+N` badge and a popover reveals the full set.

- **APIs**
  - Given a client calls `POST /issues/{id}/assets` with duplicates, when processed, then only unique active links are created and the response indicates idempotency.
  - Given a client calls `DELETE /issues/{id}/assets/{asset_id}`, when successful, then the link is soft-deleted and subsequent `GET /issues/{id}/assets` does not include it.

- **Telemetry**
  - Given telemetry is enabled, when users link/unlink assets, then events are recorded with tenant, user and counts for analytics.

---

## Display Guidance for Tables (Multiple Assets)
- Show up to 2 asset chips in the cell; if >2, show `+N` badge.
- Hover/click `+N` to show a popover listing all asset names (scrollable up to 400px height).
- Chips truncate long names with an ellipsis; full name visible in tooltip.
- Ensure keyboard navigation and ARIA labels on `+N` control and popover.
- Exports and APIs return the full list of linked assets; UI is a compact view only.
