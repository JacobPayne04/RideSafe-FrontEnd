TODO-admin panel
              | - DATADOG / APM Monitoring
        | - Install and configure Java Agent
            | - Add agent to Spring Boot app (run config / JVM argument)
        | - Configure environment variables
            | - DD_AGENT_HOST
            | - DD_SERVICE
            | - DD_ENV (optional: dev, staging, prod)
        | - Set up tracing and logging integrations
        | - WANT TO TRACK:
            | - API response times
            | - Error rates (400, 500 codes)
            | - Traffic stats (users online, requests per second)
            | - Business metrics
                | - Ride bookings per hour/day
                | - Driver accept/decline rates
        | - Create Dashboards + Alerts for monitoring
        | - Test end-to-end observability
        | - Document monitoring setup for future devs

  | - UI for all stats + metrics
        | - Page: System Metrics Dashboard
        | - Charts for:
            | - Active Users (real-time)
            | - Request per second
            | - API error rate %
        | - Custom business KPI charts
        | - Data Table: Logged events / traces
        | - Filter by: Time range, Service, Error type
        | - Implement auto-refresh / WebSocket for real-time
        | - Admin Only Access (RBAC)
        | - Future add-on: Export reports (CSV/PDF)




TODO - Payment process 
                        | - Backend
        | - Integrate Stripe API (or other gateway)
        | - Add Apple Pay / Google Pay support
        | - Setup webhooks for payment success/fail
        | - Verify transactions + update ride status
        | - Secure payment routes (auth + validation)
    | - Frontend UI
        | - Payment form + methods
        | - Support Apple Pay button
        | - Payment status feedback (success/fail animations)
    | - Internal Logic
        | - Handle transaction retries
        | - Refund process (optional manual/auto flow)
        | - Logging payments in DB
        | - Future add-on: Split payments (ride sharing)
        | - Currency conversion (if international)



TODO - | - Edge case for multiple universities per city
        | - Get driver’s real-time geo location
        | - Set origin of ride near closest university
            | - Use Google Places API / AI for accuracy
        | - Render drivers based on proximity to selected university
            | - Limit # drivers shown (top N closest)
        | - Validate driver location every X seconds (configurable interval)
        | - Fallback logic for offline drivers
        | - Future add-on: Heatmaps for driver density

TODO -    | - Verify API Routes
        | - Protect routes with JWT / OAuth2
        | - Validate tokens on every request
    | - Secure Routes
        | - HTTPS only
        | - Rate limiting (protect from abuse)
        | - CORS policy
    | - Session Management
        | - Expire inactive sessions
        | - Refresh tokens (JWT refresh flow)
        | - Admin sessions stricter
        | - Logs for auth events (success/fail logins)


TODO - Frontend Syling


TODO - redis - caching - cach clear 
        | - Install Redis server (on prod / dev)
    | - Backend Integration
        | - Spring Boot Redis client
        | - Cache API responses (popular endpoints)
        | - Expire keys with TTL
    | - Frontend/Browser Caching
        | - Cache static assets (images, js)
    | - Cache Clear Logic
        | - Admin button to clear cache
        | - Trigger cache refresh after key data updates
        | - Logs on cache clears (for debugging)


TODO -    | - Ask riders to rate drivers (1-5 stars)
        | - After ride completes: pop-up prompt
    | - Backend Logic
        | - Store ratings
        | - Calculate average ratings
        | - Show on driver profile
    | - Daily / Weekly batch updates
        | - Daily (active drivers)
        | - Weekly (low usage drivers)
    | - Future add-on: Written reviews, reporting system


                    
TODo - DEPLOY
  | - Setup CI/CD pipeline
        | - GitHub Actions / Jenkins
        | - Test → Build → Deploy
    | - Backend Deployment
        | - Dockerize Spring Boot app
        | - Deploy to AWS / DigitalOcean
    | - Frontend Deployment
        | - Build React app
        | - Deploy to Netlify / Vercel / S3 + CloudFront
    | - DB / Redis setup
    | - Domain + SSL certs
    | - Final Testing on Prod

TODO - TEST
   | - Unit Tests (backend services + frontend components)
    | - Integration Tests (API + DB)
    | - E2E Tests (Cypress / Selenium for UI workflows)
    | - Manual QA (testing real scenarios)
        | - Ride booking
        | - Payment processing
        | - Geo rendering
    | - Load Testing (k6 / JMeter)
    | - Security Pen Testing (optional/future)


________________________________________________________
CHUNKED TASK TODO
________________________________________________________
✅ PRIORITIZED TASK LIST WITH CHECKBOXES

---

## 1. CORE SYSTEM FEATURES (MVP)

### Chunk 1: Payment Processing (4-6 hrs)

#### Backend Payment Integration
- [ ] Integrate Stripe API into backend (basic payment flow) 
- [ ] Setup webhooks for payment success/fail callbacks
- [ ] Verify transactions and update ride status in DB                          *Currently* here made service method and controllers for bnackend logic frontend logic almsot done needs api route and gronk port setting to 8080                       3/19/2025 8:pm TODO* - Sign up for mgrok and get the url to put on strip 
- [ ] Add Apple Pay / Google Pay support in backend (config + keys)              then test route for front end new stripe redirect, make sure to connect 
                                                                                 Strip webhook.
#### Frontend Payment Flow
- [ ] Build frontend payment form
- [ ] Implement Apple Pay / Google Pay buttons
- [ ] Payment feedback UX: Success/Fail handling (loading, confirmation)
- [ ] Secure frontend routes + validations (check auth before pay)

#### Internal Logic
- [ ] Transaction retries + logging in DB
- [ ] Refund process (manual button first, auto flow later)
- [ ] Plan future add-ons (split payments, currency conversion)

---

### Chunk 2: Geo-Location / Multi-University Edge Case (4 hrs)

#### Driver Location & Origin Setup
- [ ] Get driver’s real-time geo location (backend API + frontend tracking)
- [ ] Use Google Places API to detect nearest university (origin logic)
- [ ] Save ride origins in DB

#### Rendering Drivers Based on Proximity
- [ ] Backend: filter drivers by origin + proximity logic
- [ ] Frontend: display drivers closest to university (limit N drivers)
- [ ] Validate driver location every X seconds (WebSocket/REST fallback)
- [ ] Future: Heatmap drivers density (optional for later)

---

### Chunk 3: Security & Authentication (4 hrs)

#### Route Verification & Protection
- [ ] Protect backend routes using JWT / OAuth2
- [ ] Validate tokens on each request
- [ ] Secure all routes via HTTPS + CORS
- [ ] Rate limiting for public APIs (express-rate-limit / Spring filters)

#### Session Management
- [ ] Implement JWT refresh flow (backend + frontend)
- [ ] Expire inactive sessions (backend timers / frontend listeners)
- [ ] Make admin session expiration stricter + logs on login/logout events

---

## 2. SYSTEM INFRASTRUCTURE

### Chunk 4: Redis Caching (3-4 hrs)

#### Backend Redis Integration
- [ ] Install Redis server (local/dev first)
- [ ] Spring Boot Redis Client setup
- [ ] Cache API responses for heavy endpoints
- [ ] Add TTL (time-to-live) expirations for cache entries

#### Cache Management UI
- [ ] Admin panel button to clear caches
- [ ] Backend route for cache clear (secure it!)
- [ ] Trigger cache clear after key data changes
- [ ] Log cache clears (audit/debugging)

---

### Chunk 5: Datadog / APM Monitoring (3-4 hrs)

#### Backend APM Setup
- [ ] Install Datadog Agent on backend (Spring Boot)
- [ ] Configure environment variables: DD_AGENT_HOST, DD_SERVICE, DD_ENV
- [ ] Enable tracing and logging integrations
- [ ] Track API response times, error rates, traffic stats
- [ ] Track business metrics (ride bookings, accept/decline rates)

#### Dashboards + Alerts
- [ ] Build dashboards for active users, API rates, errors
- [ ] Setup alerts for high latency/error thresholds
- [ ] Document Datadog setup for other devs

---

## 3. USER INTERACTION & FEEDBACK

### Chunk 6: Review System (3 hrs)

#### Ratings Flow
- [ ] Frontend: After ride popup asking for 1-5 star rating
- [ ] Backend: Save ratings in DB
- [ ] Backend: Calculate average driver ratings
- [ ] Frontend: Show driver rating in driver profile
- [ ] Batch updates: daily (active drivers), weekly (low use)
- [ ] Future: Add text reviews and report system (post-launch)

---

## 4. ADMIN TOOLS & PANEL

### Chunk 7: Admin Panel Stats UI (4 hrs)

#### System Metrics Dashboard
- [ ] Create admin route/page for metrics
- [ ] Build charts for active users, requests per second, API error %
- [ ] Build custom KPIs: ride bookings/hour, driver responses
- [ ] Data table: logged events/traces with filters (time, type, service)
- [ ] Implement auto-refresh with WebSocket or polling
- [ ] RBAC (role-based access control) for admin-only
- [ ] Future: Export CSV/PDF reports (for management)

---

## 5. FRONTEND STYLING (3 hrs)

### UI/UX Enhancements
- [ ] Implement light/dark mode toggle
- [ ] Apply consistent styling (spacing, typography, components)
- [ ] Mobile responsiveness fixes
- [ ] Add subtle animations (Framer Motion)

---

## 6. DEPLOYMENT & TESTING

### Chunk 9: CI/CD & Deployment (4 hrs)

#### Pipeline Setup
- [ ] Setup GitHub Actions / Jenkins for backend
- [ ] Setup build + deploy for React frontend
- [ ] Backend: Dockerize Spring Boot app
- [ ] Deploy backend to AWS/DigitalOcean
- [ ] Deploy frontend to Netlify/Vercel/S3 + CloudFront
- [ ] Setup domain and SSL certificates
- [ ] Configure DB + Redis on production
- [ ] Final tests on production before launch

---

### Chunk 10: Testing & QA (4 hrs)

#### Backend + Frontend Tests
- [ ] Unit tests for backend services + frontend components
- [ ] Integration tests: API + DB interactions
- [ ] E2E tests: Cypress/Selenium (ride booking, payment, geo rendering)
- [ ] Manual QA: full flow testing
- [ ] Load testing: k6/JMeter (simulate traffic + stress)
- [ ] Future: Security penetration testing (optional post-launch)

---

### NEXT STEPS:
- Start with Chunk 1 (Payments) today
- Move to Geo & Security next
- Then Redis/APM/Admin Panel
- Deploy
- QA + Polish UI

