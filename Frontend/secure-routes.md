✅ STEP-BY-STEP: HOW FRONTEND + BACKEND AUTHENTICATION WORKS

1. User Logs In
A user enters their email and password in your React login form.

React sends these credentials to your backend (Spring Boot).

2. Backend Authenticates User
The backend checks the email/password.

If valid, the backend generates a JWT (JSON Web Token).

This token contains encoded information like user ID, their role (e.g., passenger/driver/admin), and an expiration time.

The backend sends this JWT back to the frontend as a response.

3. Frontend Stores the Token
The frontend receives the JWT and stores it locally (commonly in localStorage or sessionStorage).

This token represents the user's "login session."

4. Frontend Makes API Requests with the Token
For all future requests to protected routes (like viewing a profile, booking a ride, accessing the admin panel), the frontend adds this token to the request headers.

This tells the backend: “Hey, this is the same user who logged in.”

5. Backend Verifies the Token
When the backend receives a request with a token:

It checks if the token is valid (not expired or tampered with).

It decodes the token to get the user’s ID and role.

If the token is valid and matches access rules, the backend allows the request.

If not, it rejects the request (e.g., with a 401 Unauthorized or 403 Forbidden).

6. Backend Uses Roles to Enforce Authorization
Inside the token, the user’s role is used to decide what they're allowed to do.

For example:

A passenger can’t access driver-only endpoints.

A driver can’t access another driver’s profile just by changing the URL ID.

Only admins can access admin routes.

The backend enforces this using middleware or annotations.

7. Frontend Can Use Role Info Too
The frontend can also decode the token (or fetch the user info from the backend) to:

Show/hide buttons

Redirect to role-specific pages (like /driver/home or /passenger/home)

Prevent access to certain pages using a ProtectedRoute component

8. Logging Out
When the user logs out:

The token is deleted from localStorage.

The frontend stops sending it with requests.

The user is effectively “signed out.”