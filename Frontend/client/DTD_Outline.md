
🔐 1. Google Sign-In Logic
 On Google Sign-In:

 Check if a user exists with that Google email.

 If exists → Sign them in (return tokens).

 If not → Proceed with registration flow.

 Connect this logic to your current OAuth flow.

📧 2. Google Email Verification
 On Google Sign-Up: Send email verification (if your app requires).

 On Google Sign-In: Check if email is verified.

 Block or warn if not verified.

 Add resend verification flow if needed.

🕒 3. createdAt Field Setup
 Add createdAt field to Passenger model (auto-generate).

 Add createdAt field to Driver model (auto-generate).

 Ensure timestamps are set at save via @CreatedDate or manually in service.

📄 4. Driver Document Upload Flow
 Backend service method to handle file uploads (save path, name, status).

 Controller endpoint for drivers to submit documents.

 Optional: Add document status tracking (e.g., "Pending", "Approved").

🕒 5. 7-Day Token Session Flow
 Method to create JWT with 7-day expiry.

 Save token reference to database or cache (optional for tracking).

 Middleware method to check token expiry on each request.

 Auto-logout logic:

 Frontend: remove token after 7 days.

 Backend: reject expired token on request.

🚫 6. Driver Decline Ride Feature
 Create service method to decline a ride (declineRide(driverId, rideId)).

 Create controller endpoint (e.g. @PostMapping("/driver/decline")).

 Connect frontend button to call this endpoint and update ride status.

 Reflect updated status on the UI.

🧹 7. Remove Obsolete Passenger Methods
 Identify and delete unused service methods in PassengerService.

 Remove corresponding controller methods in PassengerController.

🧭 8. Open Driver Location in Maps
 Use driver's pickup coordinates to generate Google Maps URL.

 Add frontend button: “Open in Maps”.

 On click → Launch: https://www.google.com/maps/dir/?api=1&destination=lat,lng

 (Optional) Add fallback for invalid or missing location.

⏱️ 9. Checkout Timer Tasks
 Fix timer countdown on checkout page (ensure it resets properly).

 Remove unused/old timer component/page.

 Confirm only one timer logic is running per session.