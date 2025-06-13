_______________________________________________________
CHUNKED TASK TODO
________________________________________________________
✅ PRIORITIZED TASK LIST WITH CHECKBOXES

---

## 1. CORE SYSTEM FEATURES (MVP)

### Chunk 1: Payment Processing (4-6 hrs)

#### Backend Payment Integration
- [✔] Integrate Stripe API into backend (basic payment flow) 
- [✔] Setup webhooks for payment success/fail callbacks     
- [✔] Verify transactions and update ride status in DB                                         
- [✔] Add Apple Pay / Google Pay support in backend (config + keys)    

    
                                                                                 
#### Frontend Payment Flow
- [✔] Build frontend payment form 
- [✔] Implement Apple Pay / Google Pay buttons -TODO#
- [✔] Payment feedback UX: Success/Fail handling (loading, confirmation)
- [✔] add thing to put vnemo name so when yo up[ay poeple cna pay ou back ]

#### Internal Logic ^^ 4/4/2025 ^^TODO#
- [✔] Refund process (manual button first, auto flow later)
- Frontend:## refund process flow.
- [✔] front end checkout have 10 min timer start DateNow()-> after 10 min unhide the refund button 
  
- Backend:## refund logic.
create refund route for stripe to refund payment and to update ride as cancelled to not be rendered.
- [✔] FIX GOOGLE MAPS LOADING ERROR ---- 
- [✔]  Add Stripe’s PaymentRequestButtonElement - apple pay, venmo ect -
- [✔]  FIX google maps api key to a new account for it to work -^^CURRENT^^

  

#### Driver Stripe account setup / allowed to drive variable
- [✔] add account set up for stripe and that to update the drivers account as driveable-
- [✔] Add isallowed to Drive for giving cords to render for passengers-instead of webhook to send it to a admin base there will bne an account with admmin route that renders drivers based on if they are not allowed to drive
  
### Chunk 2: Geo-Location / Multi-University Edge Case (4 hrs)
- [✔]

#### Driver Location & Origin Setup
- [✔] Get driver’s real-time geo location (backend API + frontend tracking)
- [✔] Get passenger's real-time geo location (backend API + frontend tracking)

#### Rendering Drivers Based on Proximity
- [✔] Backend: filter drivers by origin + proximity logic ##TODO
- [✔] Frontend: display drivers closest to passengers

### Chunk 2.5  create driver onboarding ###

 - [✔] make driver manual on boarding to be able to drive and be accepted.
  and set up stripe account. 
-  [✔] clean up and refactoring - clean up all comments and unsed commented code nad naming convenetions.

---

## 3. USER INTERACTION & FEEDBACK

### Chunk 6: Review System (3 hrs)

#### Ratings Flow
- [✔] Frontend: After ride popup asking for 1-5 star rating
- [✔] Backend: Save ratings in DB
- [✔] Backend: Calculate average driver ratings
- [] Frontend: Show driver rating in driver profile


---
- [✔]  fix javascript button not staying green based on database state 
---

---
## 5. FRONTEND STYLING (3 hrs)
### UI/UX Enhancements
- [ ] Implement light/dark mode toggle
- [✔] Apply consistent styling (spacing, typography, components)
- [ ] Mobile responsiveness fixes
- [✔] Add subtle animations (Framer Motion)

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

---

### Chunk 4: Datadog / APM Monitoring (3-4 hrs)

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

### Chunk 10: Testing & QA (4 hrs)

#### Backend + Frontend Tests
- [ ] Unit tests for backend services + frontend components
- [ ] Integration tests: API + DB interactions
- [ ] E2E tests: Cypress/Selenium (ride booking, payment, geo rendering)
- [ ] Manual QA: full flow testing
- [ ] Load testing: k6/JMeter (simulate traffic + stress)
- [ ] Future: Security penetration testing (optional post-launch)

---

### Chunk 5: Redis Caching (3-4 hrs)

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


-TEST AGAIN WIHT RECDIS ECt

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



### NEXT STEPS:
🔐 Token Validation
 - [ ] Create AuthValidationService.java
 - [ ]Create JwtService.java
 - [ ]Call validateRequest(token, id, role) inside protected endpoints

🔒 Controller Security
 - [ ] Inject AuthValidationService in each secured controller
 - [ ] Add @RequestHeader("Authorization") to protected methods
 - [ ] Ensure userId and role match token before processing

🛡 Rate Limiting
 Create RateLimiterService.java

 - [ ] Add rateLimiterService.isAllowed(ip) logic in sensitive methods
 - [ ] Return HTTP 429 when request exceeds rate limit

🌐 CORS Configuration
 - [ ] Add CorsConfig.java to allow local dev (e.g. localhost:3000)
 - [ ] Configure production domain in CORS before deploy

🔐 HTTPS Prep
- [ ]  Use https:// in all frontend API requests (.env)
- [ ] Remove hardcoded http:// URLs
- [ ] (Optional) Setup self-signed HTTPS in Spring Boot for dev

🧱 Frontend Route Protection
 - [ ] Create PrivateRoute.jsx
 - [ ] Store token, role, userId in sessionStorage
 - [ ] Wrap protected routes with <PrivateRoute element={...} allowedRole="..." />

📤 Frontend Auth Headers
 - [ ] Attach Authorization header on all Axios/fetch requests
 - [ ] (Optional) Create api.js with Axios interceptor for token


### LEGAL ###
- [ ] talk to lawyer
- [ ] draft tos
- [ ] code impliment tos