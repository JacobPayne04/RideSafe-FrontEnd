

🕒 5. 7-Day Token Session Flow
 Method to create JWT with 7-day expiry.

 Save token reference to database or cache (optional for tracking).

 Middleware method to check token expiry on each request.

 Auto-logout logic:

 Frontend: remove token after 7 days.

 Backend: reject expired token on request.




🧭 8. Open Driver Location in Maps
 Use driver's pickup coordinates to generate Google Maps URL.

 Add frontend button: “Open in Maps”.

 On click → Launch: https://www.google.com/maps/dir/?api=1&destination=lat,lng

 (Optional) Add fallback for invalid or missing location.

⏱️ 9. Checkout Timer Tasks
 Fix timer countdown on checkout page (ensure it resets properly).

 Remove unused/old timer component/page.

 Confirm only one timer logic is running per session.