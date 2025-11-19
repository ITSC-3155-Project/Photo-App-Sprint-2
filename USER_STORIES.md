# User Stories for Photo Sharing App

## How to Create These as GitHub Issues:

1. Go to your GitHub repository
2. Click on "Issues" tab
3. Click "New Issue" for each story below
4. Add appropriate labels: `user-story`, `sprint-1`, size labels (`small`, `medium`, `large`)
5. Create a GitHub Project Board with columns: `To Do`, `In Progress`, `In Review`, `Done`

---

## Story 1: Baseline Application - User List Navigation

**Title:** As a user, I want to see a list of all users so that I can navigate to their profiles

**Description:**
As a photo sharing app user, I want to see a list of all registered users in the sidebar so that I can easily browse and access different user profiles. This will help me discover content from different photographers.

**Acceptance Criteria:**
- [ ] User list displays in the left sidebar
- [ ] Each user shows their first name and last name
- [ ] Clicking on a user navigates to their detail page
- [ ] Currently selected user is highlighted
- [ ] User list loads from the server API (`/user/list`)
- [ ] Loading state is shown while fetching users
- [ ] Error message displays if users fail to load

**Technical Notes:**
- Component: `UserList.jsx`
- API Endpoint: `GET /user/list`
- Use React Router for navigation

**Size:** Medium (3 story points)

---

## Story 2: Baseline Application - User Detail View

**Title:** As a user, I want to view detailed information about a photographer so that I can learn more about them

**Description:**
As a photo sharing app user, I want to click on a user from the list and see their detailed profile including their location, occupation, and description. This helps me understand the photographer's background and interests.

**Acceptance Criteria:**
- [ ] User detail page displays first name, last name, location, occupation, and description
- [ ] Information is well-formatted and easy to read
- [ ] A "View Photos" button is prominently displayed
- [ ] Clicking "View Photos" navigates to the user's photo gallery
- [ ] User data loads from the server API (`/user/:id`)
- [ ] Loading spinner shows while fetching data
- [ ] Error handling for invalid user IDs
- [ ] Page supports deep linking (URL can be bookmarked)

**Technical Notes:**
- Component: `UserDetail.jsx`
- API Endpoint: `GET /user/:id`
- Use Material-UI Card component for layout

**Size:** Medium (3 story points)

---

## Story 3: Baseline Application - User Photos Gallery

**Title:** As a user, I want to view all photos uploaded by a photographer so that I can appreciate their work

**Description:**
As a photo sharing app user, I want to see all photos uploaded by a specific photographer in a gallery view. Each photo should display the upload date and all associated comments so I can engage with the content and community.

**Acceptance Criteria:**
- [ ] Photos display in a vertical scrollable list
- [ ] Each photo shows the image, upload date/time
- [ ] All comments for each photo are displayed below the image
- [ ] Each comment shows: commenter name, comment text, and timestamp
- [ ] Commenter names are clickable links to their profiles
- [ ] Photos load from the server API (`/photosOfUser/:id`)
- [ ] Images have fallback UI if they fail to load
- [ ] Empty state message if user has no photos
- [ ] Loading state while fetching photos

**Technical Notes:**
- Component: `UserPhotos.jsx`
- API Endpoint: `GET /photosOfUser/:id`
- Images served from `/images/` directory

**Size:** Large (5 story points)

---

## Story 4: Baseline Application - Top Bar Context

**Title:** As a user, I want the top bar to show my name and current context so that I know where I am in the app

**Description:**
As a photo sharing app user, I want to see the app name in the top bar along with contextual information about what I'm currently viewing (e.g., "Photos of John Doe" or "John Doe"). This helps me maintain orientation while navigating the app.

**Acceptance Criteria:**
- [ ] Top bar displays "Monish Munagala" on the left side
- [ ] Top bar displays current view context in the center
- [ ] Context updates dynamically based on current route:
  - Home: "Photo Sharing App"
  - User detail: "{FirstName} {LastName}"
  - User photos: "Photos of {FirstName} {LastName}"
- [ ] Version number displays on the right side
- [ ] Version fetched from `/test/info` API endpoint

**Technical Notes:**
- Component: `TopBar.jsx`
- Use React Router's `useLocation` hook
- Fetch version on component mount

**Size:** Small (2 story points)

---

## Story 5: Model Data - Implement FetchModel Function

**Title:** As a developer, I want to implement XMLHttpRequest-based API calls so that the app fetches live data from the server

**Description:**
As a developer working on the photo sharing app, I need to implement a custom `FetchModel` function using XMLHttpRequest (without external libraries) to fetch data from the web server. This will replace the mock data currently loaded into the DOM.

**Acceptance Criteria:**
- [ ] FetchModel function implemented in `lib/fetchModelData.js`
- [ ] Function uses XMLHttpRequest (no fetch API or axios)
- [ ] Returns a Promise that resolves with `{ data: parsedResponse }`
- [ ] Handles successful responses (status 200-299)
- [ ] Rejects promise with `{ status, statusText }` on errors
- [ ] Handles network errors appropriately
- [ ] Handles JSON parsing errors
- [ ] All components use FetchModel instead of window.models
- [ ] No references to `window.models` remain in code
- [ ] App works without loading `modelData/photoApp.js`

**Technical Notes:**
- File: `lib/fetchModelData.js`
- Must use XMLHttpRequest API
- Promise-based implementation required

**Size:** Medium (3 story points)

---

## Story 6: Model Data - Express Server API

**Title:** As a developer, I want a working Express server with RESTful endpoints so that the frontend can fetch data

**Description:**
As a developer, I need a functional Express.js web server that provides RESTful API endpoints for user and photo data. The server should serve mock data initially but be structured to easily connect to a database later.

**Acceptance Criteria:**
- [ ] Express server runs on port 3001
- [ ] GET `/test/info` returns schema info with version
- [ ] GET `/user/list` returns array of all users
- [ ] GET `/user/:id` returns single user object
- [ ] GET `/photosOfUser/:id` returns array of photos for user
- [ ] CORS headers configured for development
- [ ] Server logs requests for debugging
- [ ] Mock data structured according to schema
- [ ] 404 errors returned for invalid user IDs
- [ ] Server can be started with `npm run server`

**Technical Notes:**
- File: `server/webServer.js`
- Port: 3001
- Use Express.js framework

**Size:** Medium (3 story points)

---

## Story 7: Project Setup - Development Environment

**Title:** As a developer, I want a properly configured development environment so that I can build and test efficiently

**Description:**
As a developer, I need the project to have proper build tools, linting, formatting, and scripts configured so the development workflow is smooth and code quality is maintained.

**Acceptance Criteria:**
- [ ] Vite configured for React development
- [ ] ESLint configured with React rules
- [ ] Prettier configured for code formatting
- [ ] Both frontend and backend start with single command
- [ ] Hot module replacement works in development
- [ ] Proxy configured to route API calls to backend
- [ ] npm scripts documented in README
- [ ] .gitignore properly configured
- [ ] No lint errors in codebase

**Technical Notes:**
- Use Vite for frontend bundling
- Use concurrently to run both servers
- Configure ESLint with recommended React rules

**Size:** Small (2 story points)

---

## Sprint Planning Notes:

**Sprint 1 Goal:** Create a functional photo-sharing app where users can browse photographers, view profiles, and see photo galleries with comments.

**Total Story Points:** 21 points

**Priority Order:**
1. Story 7 (Project Setup) - Foundation
2. Story 6 (Express Server) - Backend foundation
3. Story 5 (FetchModel) - Data layer
4. Story 1 (User List) - Core navigation
5. Story 4 (Top Bar) - UI foundation
6. Story 2 (User Detail) - Profile viewing
7. Story 3 (User Photos) - Main feature

**Team Roles to Document:**
- Product Owner: [Name]
- Scrum Master: [Name]
- Developers: [Names]

**Scrum Ceremonies:**
- Daily Standup: [Time] (document in standup.md)
- Sprint Planning: [Date completed]
- Sprint Review: [Date scheduled]
- Sprint Retrospective: [Date scheduled]

- ---

## Sprint 2 – Database and Axios Stories
### Story 8: Database – Persist Photo App Data in MongoDB

**Title:** As a developer, I want the photo app data stored in MongoDB so that it persists across server restarts and behaves like a real full-stack app.

**Description:**  
As a developer on the photo sharing app, I need the users, photos, comments, and schema info to be stored in a MongoDB database using Mongoose schemas. The existing Express routes (`/test/info`, `/user/list`, `/user/:id`, `/photosOfUser/:id`) should read from the database instead of hard-coded model data.

**Acceptance Criteria:**

- MongoDB is running locally and can be connected to from `webServer.js` and `loadDatabase.js`.
- Mongoose schemas are defined in:
  - `schema/user.js`
  - `schema/photo.js`
  - `schema/schemaInfo.js`
- `loadDatabase.js` populates the database with the starter photo app data.
- `GET /test/info` returns the `SchemaInfo` document from MongoDB.
- `GET /user/list` returns all users from the `User` collection (only `_id`, `first_name`, `last_name`).
- `GET /user/:id` returns a single user document.
- `GET /photosOfUser/:id` returns photos for that user, with embedded comment user objects populated.
- No routes use the old mock `models` data anymore.
- All database errors return a 500 with an informative JSON error message.

**Technical Notes:**

- Use Mongoose for schema definitions and queries.
- Use `async`/`await` and `try/catch` in `webServer.js`.
- Ensure MongoDB connection string is configured once and reused.

**Size:** Large (5 story points)
### Story 9: Axios – Fetch Models from Web Server

**Title:** As a developer, I want the React front-end to use axios so that all model data is fetched via standard HTTP requests.

**Description:**  
As a photo sharing app developer, I want to replace the old `FetchModel` hack with axios so that all components use a consistent, modern HTTP client. The app should still behave the same to the user, but all model data should be loaded using axios from the Node/Express backend.

**Acceptance Criteria:**

- axios is installed and listed as a dependency in `package.json`.
- Any remaining calls to `FetchModel` are removed or refactored.
- `UserList`, `UserDetail`, `UserPhotos`, and `TopBar` fetch their data using axios:
  - `GET /user/list`
  - `GET /user/:id`
  - `GET /photosOfUser/:id`
  - `GET /test/info`
- Components show:
  - loading state while axios request is in flight,
  - error state if the request fails.
- No references to `window.models` remain anywhere in the React code.
- The UI looks and behaves the same as before from a user perspective.

**Technical Notes:**

- Import with `import axios from 'axios';`.
- Use `axios.get(url)` which returns a Promise.
- Handle `.then` and `.catch` (or `async`/`await`) for success and error cases.
- Consider extracting shared axios logic if needed.

**Size:** Medium (3 story points)
