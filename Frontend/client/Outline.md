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
                        | - Backend-TESTING/TWEAKS****
        | - Integrate Stripe API (or other gateway)
        | - Add Apple Pay / Google Pay support
        | - Setup webhooks for payment success/fail
        | - Verify transactions + update ride status
        | - Secure payment routes (auth + validation)
    | - Frontend UI -TESTING/TWEAKS****
        | - Payment form + methods
        | - Support Apple Pay button
        | - Payment status feedback (success/fail animations)
    | - Internal Logic-TESTING/TWEAKS****
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


---                                           
 # TOMARROW add driver id field to payment request -> add it to the payment request form in teh front end to send ->destructure in the create paymetn intent service -> send it through wiuth the rest of the payment intrnet trhough teh controller -> webhook recievs it -> destructure it in the webhook -> add it to the createPaymentIntent params (rideID,DrvierId) -> destrucrture in the payment service to then be used to subscrivbe the driver ✔DONE                                                                                                                                 
 #FrontEnd -add driverId field to the payment form from local storage -> 
 #Backend - Add driverId field to payment request -> Frontend sends payment request -> destructure in create payment intent -> add it into the payload to payment controller ->webhook revieves payload -> destructure under the rideId const before extracted from metadata -> add it into prams with updateRidePaymentAmount -> pull it from params and add the driver id to teh driver destiantion              
DONE✔

________________________________________________________
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
- [✔] Add Apple Pay / Google Pay support in backend (config + keys)  -🛑TODO#🛑  

    
                                                                                 
#### Frontend Payment Flow
- [✔] Build frontend payment form 
- [✔] Implement Apple Pay / Google Pay buttons -TODO#
- [✔] Payment feedback UX: Success/Fail handling (loading, confirmation)
- [ ] Secure frontend routes + validations (check auth before pay) -🛑TODO#🛑

#### Internal Logic ^^ 4/4/2025 ^^TODO#
- [✔] Refund process (manual button first, auto flow later)
- Frontend:## refund process flow.
- [✔] front end checkout have 10 min timer start DateNow()-> after 10 min unhide the refund button 
  
- Backend:## refund logic.
create refund route for stripe to refund payment and to update ride as cancelled to not be rendered.
- [✔] FIX GOOGLE MAPS LOADING ERROR ---- 
- [ ]  Add Stripe’s PaymentRequestButtonElement - apple pay, venmo ect -🛑TODO#🛑
- [✔]  FIX google maps api key to a new account for it to work -^^CURRENT^^
- [ ]  fix javascript button not staying green based on adatabasse state
- [ ]  
  





#### Driver Stripe account setup / allowed to drive variable
- [ ] add account set up for stripe and that to update the drivers account as driveable-🛑TODO#🛑
- [ ] Add isallowed to Drive for giving cords to render for passengers-🛑TODO#🛑
  
### Chunk 2: Geo-Location / Multi-University Edge Case (4 hrs)
- [✔]

#### Driver Location & Origin Setup
- [✔] Get driver’s real-time geo location (backend API + frontend tracking)
- [✔] Get passenger's real-time geo location (backend API + frontend tracking)

#### Rendering Drivers Based on Proximity
- [✔] Backend: filter drivers by origin + proximity logic ##TODO
- [✔] Frontend: display drivers closest to passengers

### Chunk 2.5  create driver onboarding ###

 - [ ]  make driver manual on boarding to be able to drive and be accepted.
  and set up stripe account. -🛑TODO#🛑
  - [ ] SPECIFIC* style main website
  - [ ] clean up and refactoring - clean up all comments and unsed commented code nad naming convenetions.
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










-------------------------------------
📁 1. Data Model Preparation   |DONE|

🔹 1.1 Update Driver Model

Add field:

@GeoSpatialIndexed(type = GeoSpatialIndexType.GEO_2DSPHERE)
private GeoJsonPoint location;

Add getter and setter:

public GeoJsonPoint getLocation() { return location; }
public void setLocation(GeoJsonPoint location) { this.location = location; }

🔹 1.2 Passenger Model

No changes needed


---------------------------


📁 2. Driver Location Handling

🔹 2.1 On Driver Online  |DONE|

Accept latitude and longitude from frontend

Convert to GeoJsonPoint(longitude, latitude)

Set location and mark driver as online

Example logic:

driver.setLocation(new GeoJsonPoint(longitude, latitude));
driver.setIsOnline(true);
driverRepository.save(driver);

🔹 2.2 On Driver Offline

Set isOnline = false

Optionally clear location

---------------------------


📁 3. MongoDB Indexing  |DONE|

🔹 3.1 Create Geospatial Index

Run once in Mongo shell:

db.drivers.createIndex({ location: "2dsphere" })

---------------------------



📁 4. Nearby Driver Query (Backend) |DONE|

🔹 4.1 Accept Passenger Location

Use browser geolocation to get latitude and longitude

Send it to backend API

🔹 4.2 Backend Query Example

Query query = new Query(Criteria.where("location")
    .nearSphere(new Point(passengerLng, passengerLat))
    .maxDistance(10.0 / 3963.2));  // 10 miles in radians
query.addCriteria(Criteria.where("isOnline").is(true));

Return filtered list of drivers


---------------------------


📁 5. Frontend Integration

🔹 5.1 Fetch Passenger Location  |DONE|

navigator.geolocation.getCurrentPosition(pos => {
  const lat = pos.coords.latitude;
  const lng = pos.coords.longitude;
  // Send to backend
});

🔹 5.2 Display Nearby Drivers |DONE|

Show returned drivers on list or map

Handle empty result set gracefully

🔹 5.3 TEST - |DONE|

📌 Notes :

Coordinates must be [longitude, latitude]
GeoJsonPoint from spring-data-mongodb
maxDistance uses radians: miles / 3963.2
No caching or rate-limiting needed for MVP




















