# CUET Print Service - Comprehensive Test Plan

## Application Overview

The CUET Print Service is a hyper-local SaaS platform that connects students with campus print shops. Students can upload PDF files with print configurations, shop owners receive orders in real-time and process them, and admins approve new shop registrations. The system includes authentication (email/password and Google OAuth), role-based access control (student, owner, admin), real-time order updates, file storage, and payment processing at pickup.

## Test Scenarios

### 1. Authentication

**Seed:** `tests/seed.spec.ts`

#### 1.1. Student signup with valid credentials

**File:** `tests/authentication/student-signup-valid.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/signup
    - expect: The signup page should load successfully
    - expect: The 'Student' tab should be selected by default
    - expect: Form fields should be visible: Full Name, Email, Password
  2. Fill in the 'Full Name' field with 'John Doe'
    - expect: The text should appear in the Full Name field
  3. Fill in the 'Email' field with 'student1@cuet.ac.bd'
    - expect: The email should appear in the Email field
  4. Fill in the 'Password' field with 'SecurePass123!'
    - expect: The password should be masked in the Password field
  5. Click the 'Sign Up as Student' button
    - expect: A loading spinner should appear briefly
    - expect: A success toast notification should appear with message 'Account created successfully'
    - expect: The user should be redirected to /dashboard
    - expect: The dashboard page should display student-specific content

#### 1.2. Shop owner signup with complete information

**File:** `tests/authentication/shop-owner-signup-valid.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/signup
    - expect: The signup page should load successfully
  2. Click on the 'Shop Owner' tab
    - expect: The 'Shop Owner' tab should become active
    - expect: Additional fields 'Shop Name' and 'Location' should appear below password field
    - expect: The submit button text should change to 'Register Shop'
  3. Fill in 'Full Name' with 'Owner Name'
    - expect: The text should appear in the field
  4. Fill in 'Email' with 'owner1@cuet.ac.bd'
    - expect: The email should appear in the field
  5. Fill in 'Password' with 'OwnerPass123!'
    - expect: The password should be masked
  6. Fill in 'Shop Name' with 'Mayer Doa Photostat'
    - expect: The shop name should appear in the field
  7. Fill in 'Location' with 'Civil Building, Ground Floor'
    - expect: The location should appear in the field
  8. Click the 'Register Shop' button
    - expect: A loading spinner should appear briefly
    - expect: A success toast notification should appear
    - expect: The user should be redirected to /manage
    - expect: The manage page should load (shop owner dashboard)

#### 1.3. Student login with valid credentials

**File:** `tests/authentication/student-login-valid.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/login
    - expect: The login page should load successfully
    - expect: The 'Student' tab should be selected by default
    - expect: Google OAuth button should be visible
    - expect: Email and password fields should be visible
  2. Fill in 'Student Email' with 'student1@cuet.ac.bd'
    - expect: The email should appear in the field
  3. Fill in 'Password' with 'SecurePass123!'
    - expect: The password should be masked
  4. Click the 'Login as Student' button
    - expect: A loading spinner should appear briefly
    - expect: A success toast with 'Logged in successfully' should appear
    - expect: The user should be redirected to /dashboard

#### 1.4. Shop owner login with valid credentials

**File:** `tests/authentication/shop-owner-login-valid.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/login
    - expect: The login page should load successfully
  2. Click on the 'Shop Owner' tab
    - expect: The 'Shop Owner' tab should become active
    - expect: The email placeholder should change to 'shop@cuet.ac.bd'
    - expect: The button text should change to 'Login to Dashboard'
  3. Fill in 'Shop Email' with 'owner1@cuet.ac.bd'
    - expect: The email should appear in the field
  4. Fill in 'Password' with 'OwnerPass123!'
    - expect: The password should be masked
  5. Click the 'Login to Dashboard' button
    - expect: A loading spinner should appear briefly
    - expect: A success toast should appear
    - expect: The user should be redirected to /manage

#### 1.5. Login with invalid credentials

**File:** `tests/authentication/login-invalid-credentials.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/login
    - expect: The login page should load successfully
  2. Fill in 'Student Email' with 'wronguser@cuet.ac.bd'
    - expect: The email should appear in the field
  3. Fill in 'Password' with 'WrongPassword123'
    - expect: The password should be masked
  4. Click the 'Login as Student' button
    - expect: A loading spinner should appear briefly
    - expect: An error toast should appear with title 'Login Failed'
    - expect: The error message should contain 'Invalid credentials' or similar
    - expect: The user should remain on the login page

#### 1.6. Signup with missing required fields

**File:** `tests/authentication/signup-missing-fields.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/signup
    - expect: The signup page should load successfully
  2. Fill in only the 'Email' field with 'incomplete@cuet.ac.bd'
    - expect: The email should appear in the field
  3. Click the 'Sign Up as Student' button
    - expect: An error toast should appear with title 'Error'
    - expect: The error message should say 'Please fill in all fields' or 'Please fill in all basic fields'
    - expect: The user should remain on the signup page
    - expect: No account should be created

#### 1.7. Shop owner signup with missing shop details

**File:** `tests/authentication/shop-owner-signup-missing-shop-details.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/signup
    - expect: The signup page should load successfully
  2. Click on the 'Shop Owner' tab
    - expect: The Shop Owner tab should become active
    - expect: Shop Name and Location fields should appear
  3. Fill in 'Full Name' with 'Owner Name'
    - expect: The text should appear
  4. Fill in 'Email' with 'owner2@cuet.ac.bd'
    - expect: The email should appear
  5. Fill in 'Password' with 'OwnerPass123!'
    - expect: The password should be masked
  6. Leave 'Shop Name' and 'Location' fields empty
    - expect: The fields should remain empty
  7. Click the 'Register Shop' button
    - expect: An error toast should appear
    - expect: The error message should say 'Shop Name and Location are required'
    - expect: The user should remain on the signup page
    - expect: No account should be created

#### 1.8. Google OAuth login initiation

**File:** `tests/authentication/google-oauth-initiation.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/login
    - expect: The login page should load successfully
    - expect: A 'Continue with Google' button should be visible with Google icon
  2. Click the 'Continue with Google' button
    - expect: The browser should navigate to a Google OAuth consent page (URL should contain 'accounts.google.com' or similar)
    - expect: The page should display Google's authentication interface

#### 1.9. Forgot password flow initiation

**File:** `tests/authentication/forgot-password-flow.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/login
    - expect: The login page should load successfully
  2. Click the 'Forgot password?' link
    - expect: The user should be redirected to /forgot-password
    - expect: A heading 'Forgot Password' should be visible
    - expect: A description should say 'Enter your email to receive a password reset link'
    - expect: An email input field should be visible
    - expect: A 'Send Recovery Email' button should be visible
  3. Fill in the email field with 'student1@cuet.ac.bd'
    - expect: The email should appear in the field
  4. Click the 'Send Recovery Email' button
    - expect: A success toast should appear indicating the recovery email was sent
    - expect: The button should show a loading state briefly

#### 1.10. Login with empty fields

**File:** `tests/authentication/login-empty-fields.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/login
    - expect: The login page should load successfully
  2. Leave both email and password fields empty
    - expect: Both fields should remain empty
  3. Click the 'Login as Student' button
    - expect: An error toast should appear with title 'Error'
    - expect: The message should say 'Please fill in all fields'
    - expect: The user should remain on the login page

### 2. Student Dashboard

**Seed:** `tests/seed.spec.ts`

#### 2.1. View available shops

**File:** `tests/student-dashboard/view-available-shops.spec.ts`

**Steps:**
  1. Log in as a student and navigate to /dashboard
    - expect: The dashboard page should load successfully
    - expect: A heading 'New Print Job' should be visible
    - expect: A shop selection dropdown should be visible with placeholder 'Choose a printing shop...'
  2. Click on the shop selection dropdown
    - expect: A list of active shops should appear
    - expect: Each shop should display: shop name, location, and online/offline status
    - expect: Offline shops should be disabled/grayed out
    - expect: Shop pricing information (B&W and Color) should be visible

#### 2.2. Select a shop and configure print settings

**File:** `tests/student-dashboard/select-shop-configure-settings.spec.ts`

**Steps:**
  1. Log in as a student and navigate to /dashboard
    - expect: The dashboard should load successfully
  2. Open the shop dropdown and select an online shop
    - expect: The selected shop should appear in the dropdown
    - expect: Shop details (name, location, pricing) should be visible below
    - expect: Print configuration options should become available
  3. Select 'Color' print mode from the radio group
    - expect: The 'Color' option should be selected
    - expect: The price calculation should update to use color pricing
  4. Select '3' from the copies dropdown
    - expect: The copies field should show '3'
    - expect: The total price should recalculate (shop color price × 3)
  5. Verify the calculated price is displayed
    - expect: A price display should show the total amount in Taka (৳)
    - expect: The price should be correct based on: (color price per page) × (number of copies)

#### 2.3. Upload PDF and create order

**File:** `tests/student-dashboard/upload-pdf-create-order.spec.ts`

**Steps:**
  1. Log in as a student, navigate to /dashboard, and configure a print job (select shop, set to B&W, 2 copies)
    - expect: The dashboard should be configured with a shop selected and print settings configured
  2. Click on the file upload area or 'Choose File' button
    - expect: A file picker dialog should open
  3. Select a valid PDF file (under 50MB)
    - expect: The file name should appear in the upload component
    - expect: The file size should be displayed
  4. Click the 'Pay & Print' or upload button
    - expect: A progress bar should appear showing upload progress
    - expect: The progress should increase from 0% to 100%
    - expect: A success toast should appear saying 'Order Created' or similar
    - expect: The file upload should complete successfully
    - expect: The form should reset or indicate successful submission

#### 2.4. Upload PDF without selecting shop

**File:** `tests/student-dashboard/upload-without-shop.spec.ts`

**Steps:**
  1. Log in as a student and navigate to /dashboard
    - expect: The dashboard should load successfully
  2. Do not select any shop from the dropdown
    - expect: No shop should be selected
  3. Attempt to upload a PDF file
    - expect: An error toast should appear
    - expect: The error should say 'Please select a shop first' or similar
    - expect: The file should not be uploaded
    - expect: No order should be created

#### 2.5. Upload file that exceeds size limit

**File:** `tests/student-dashboard/upload-oversized-file.spec.ts`

**Steps:**
  1. Log in as a student, navigate to /dashboard, and select a shop
    - expect: The dashboard should be ready with a shop selected
  2. Attempt to upload a PDF file larger than 50MB
    - expect: An error toast should appear
    - expect: The error should indicate the file is too large
    - expect: The upload should be rejected
    - expect: No order should be created

#### 2.6. Upload non-PDF file

**File:** `tests/student-dashboard/upload-non-pdf-file.spec.ts`

**Steps:**
  1. Log in as a student, navigate to /dashboard, and select a shop
    - expect: The dashboard should be ready
  2. Attempt to upload a non-PDF file (e.g., .docx, .jpg, .txt)
    - expect: An error toast should appear
    - expect: The error should indicate only PDF files are allowed
    - expect: The upload should be rejected

#### 2.7. Email verification banner display for unverified student

**File:** `tests/student-dashboard/email-verification-banner.spec.ts`

**Steps:**
  1. Create a new student account and log in without verifying email
    - expect: The student should be logged in and on /dashboard
  2. Observe the dashboard page
    - expect: A yellow/warning banner should be visible at the top
    - expect: The banner should contain text 'Email not verified'
    - expect: The banner should say 'Please verify your email address to ensure full account access'
    - expect: A 'Verify Email' button should be visible in the banner
  3. Click the 'Verify Email' button
    - expect: A toast notification should appear saying 'Verification link sent to your email' or 'Email Sent'

#### 2.8. Price calculation for different configurations

**File:** `tests/student-dashboard/price-calculation-variations.spec.ts`

**Steps:**
  1. Log in as a student, navigate to /dashboard, and select a shop with known pricing (e.g., B&W: 2৳, Color: 5৳)
    - expect: The shop should be selected
  2. Select 'Black & White' and '1' copy
    - expect: The displayed price should be 2৳ (1 × 2)
  3. Change copies to '5'
    - expect: The displayed price should update to 10৳ (5 × 2)
  4. Change print type to 'Color'
    - expect: The displayed price should update to 25৳ (5 × 5)
  5. Change copies to '10'
    - expect: The displayed price should update to 50৳ (10 × 5)

#### 2.9. Navigate to different sections from student dashboard

**File:** `tests/student-dashboard/dashboard-navigation.spec.ts`

**Steps:**
  1. Log in as a student and navigate to /dashboard
    - expect: The dashboard should load with a navigation bar
  2. Check if there's a navigation menu or header
    - expect: A navigation bar should be visible at the top
    - expect: The nav bar should show student-specific menu items
  3. Click any navigation links if present (e.g., Orders, Profile, Logout)
    - expect: The corresponding pages should load correctly
    - expect: The user should remain authenticated

### 3. Shop Owner Dashboard

**Seed:** `tests/seed.spec.ts`

#### 3.1. View incoming orders in real-time

**File:** `tests/shop-owner-dashboard/view-incoming-orders.spec.ts`

**Steps:**
  1. Log in as a shop owner and navigate to /manage
    - expect: The shop owner dashboard should load
    - expect: A heading like 'Order Queue' or 'Manage Orders' should be visible
    - expect: If there are orders, they should be displayed in cards or a list
    - expect: If no orders, an empty state message should appear
  2. Have a student create a new order for this shop (in another session/browser)
    - expect: A toast notification should appear saying 'Queue Updated' or 'New activity detected'
    - expect: The new order should appear in the order list automatically
    - expect: The order card should show: student ID, order date/time, file information, print config (B&W/Color, copies), total price, and status badge

#### 3.2. Download PDF from order

**File:** `tests/shop-owner-dashboard/download-pdf.spec.ts`

**Steps:**
  1. Log in as a shop owner and navigate to /manage with at least one pending order
    - expect: The manage page should load with order(s) displayed
  2. Locate an order card with status 'pending'
    - expect: The order card should show order details
    - expect: A 'Download PDF' or download button/icon should be visible
  3. Click the 'Download PDF' button
    - expect: The PDF file should download or open in a new browser tab
    - expect: The file should be the correct PDF uploaded by the student

#### 3.3. Mark order as completed

**File:** `tests/shop-owner-dashboard/mark-order-completed.spec.ts`

**Steps:**
  1. Log in as a shop owner and navigate to /manage with a pending order
    - expect: The manage page should load with the order displayed
    - expect: The order status should show 'pending' badge
  2. Click the 'Mark Complete' or 'Complete' button on the order
    - expect: A success toast should appear saying 'Order marked as done' or 'Completed'
    - expect: The order status badge should change from 'pending' to 'completed'
    - expect: The order card styling might change (e.g., grayed out or moved to completed section)

#### 3.4. Filter orders by status

**File:** `tests/shop-owner-dashboard/filter-orders-by-status.spec.ts`

**Steps:**
  1. Log in as a shop owner and navigate to /manage with multiple orders in different statuses
    - expect: The manage page should load with multiple orders visible
  2. Check if there are filter or tab options (e.g., 'All', 'Pending', 'Completed')
    - expect: If filters exist, clicking them should show only orders matching that status
    - expect: The order list should update to show filtered results

#### 3.5. Email verification banner for unverified shop owner

**File:** `tests/shop-owner-dashboard/email-verification-banner-owner.spec.ts`

**Steps:**
  1. Create a new shop owner account and log in without verifying email
    - expect: The shop owner should be logged in and on /manage
  2. Observe the manage page
    - expect: A yellow/warning banner should be visible
    - expect: The banner should say 'Email not verified'
    - expect: A 'Verify Email' button should be present in the banner
  3. Click the 'Verify Email' button
    - expect: A toast should appear saying 'Verification link sent to your email'

#### 3.6. Handle shop with no orders

**File:** `tests/shop-owner-dashboard/no-orders-state.spec.ts`

**Steps:**
  1. Log in as a shop owner whose shop has no orders
    - expect: The manage page should load successfully
    - expect: An empty state message should appear (e.g., 'No orders yet' or 'Waiting for orders')
    - expect: No order cards should be displayed

#### 3.7. Shop owner with no shop assigned

**File:** `tests/shop-owner-dashboard/no-shop-assigned.spec.ts`

**Steps:**
  1. Create a shop owner account but manually delete or not create the shop document in the database
    - expect: This is an edge case for testing error handling
  2. Log in as this shop owner and navigate to /manage
    - expect: An error message or empty state should appear
    - expect: The message should indicate 'No shop found' or 'Shop not registered'

### 4. Shop Settings

**Seed:** `tests/seed.spec.ts`

#### 4.1. Update shop name and location

**File:** `tests/shop-settings/update-shop-details.spec.ts`

**Steps:**
  1. Log in as a shop owner and navigate to /settings
    - expect: The settings page should load
    - expect: Form fields should be pre-filled with current shop data: Shop Name, Location, B&W Price, Color Price, and an Online/Offline toggle
  2. Change the 'Shop Name' from current value to 'Updated Shop Name'
    - expect: The new name should appear in the field
  3. Change the 'Location' to 'New Building, 2nd Floor'
    - expect: The new location should appear in the field
  4. Click the 'Save' or 'Save Changes' button
    - expect: A loading spinner should appear on the button
    - expect: A success toast should appear saying 'Shop settings updated successfully' or 'Saved'
    - expect: The form should retain the new values
  5. Refresh the page
    - expect: The updated shop name and location should still be displayed
    - expect: Changes should be persisted

#### 4.2. Update pricing (B&W and Color)

**File:** `tests/shop-settings/update-pricing.spec.ts`

**Steps:**
  1. Log in as a shop owner and navigate to /settings
    - expect: The settings page should load with current pricing displayed
  2. Change 'B&W Price' from current value to '3'
    - expect: The field should show '3'
  3. Change 'Color Price' from current value to '6'
    - expect: The field should show '6'
  4. Click the 'Save' button
    - expect: A success toast should appear
    - expect: The new pricing should be saved
  5. Verify pricing is updated for students by logging in as a student and checking the shop's pricing
    - expect: The shop should display B&W: 3৳ and Color: 6৳ on the student dashboard

#### 4.3. Toggle shop online/offline status

**File:** `tests/shop-settings/toggle-online-status.spec.ts`

**Steps:**
  1. Log in as a shop owner and navigate to /settings
    - expect: The settings page should load
    - expect: An 'Online' or 'Shop Status' toggle switch should be visible
  2. Check the current state of the toggle (assume it's ON/online)
    - expect: The toggle should show the current online status
  3. Click the toggle to turn it OFF
    - expect: The toggle should visually change to the OFF state
  4. Click the 'Save' button
    - expect: A success toast should appear
    - expect: The shop status should be saved as offline
  5. Verify by logging in as a student and checking shop availability
    - expect: The shop should appear as 'Offline' in the shop selection dropdown
    - expect: The shop should be disabled/unselectable

#### 4.4. Update pricing with invalid values

**File:** `tests/shop-settings/update-pricing-invalid.spec.ts`

**Steps:**
  1. Log in as a shop owner and navigate to /settings
    - expect: The settings page should load
  2. Enter a negative value in 'B&W Price' (e.g., '-5')
    - expect: The field should accept the input
  3. Click the 'Save' button
    - expect: An error toast should appear indicating invalid price
    - expect: The save should be rejected
    - expect: OR the system should handle it gracefully with validation

#### 4.5. Settings page displays loading state

**File:** `tests/shop-settings/settings-loading-state.spec.ts`

**Steps:**
  1. Log in as a shop owner and navigate to /settings
    - expect: Initially, a loading spinner should appear while fetching shop data
    - expect: After data loads, the form should populate with current shop information

### 5. Admin Panel

**Seed:** `tests/seed.spec.ts`

#### 5.1. Admin views pending shop approvals

**File:** `tests/admin-panel/view-pending-shops.spec.ts`

**Steps:**
  1. Create a new shop owner account (which creates a shop with is_active: false)
    - expect: The shop should be created but not active
  2. Log in with an admin email (from ADMIN_EMAILS list) and navigate to /admin-panel
    - expect: The admin panel should load
    - expect: A heading 'Pending Approvals' should be visible
    - expect: A grid or list of pending shops should be displayed
    - expect: Each shop card should show: shop name, location, owner email, B&W price, color price
    - expect: An 'Approve' button should be visible on each shop card

#### 5.2. Admin approves a pending shop

**File:** `tests/admin-panel/approve-shop.spec.ts`

**Steps:**
  1. Log in as admin and navigate to /admin-panel with at least one pending shop
    - expect: The admin panel should load with pending shop(s) displayed
  2. Click the 'Approve' button on one of the pending shops
    - expect: A success toast should appear saying 'Shop Approved!' or similar
    - expect: The approved shop card should disappear from the pending list
    - expect: The shop should now have is_active: true in the database
  3. Verify by logging in as a student and checking shop availability
    - expect: The newly approved shop should now appear in the student's shop selection dropdown

#### 5.3. Non-admin user cannot access admin panel

**File:** `tests/admin-panel/non-admin-access-denied.spec.ts`

**Steps:**
  1. Log in as a regular student or shop owner (not an admin email)
    - expect: The user should be logged in
  2. Attempt to navigate to /admin-panel directly via URL
    - expect: The user should be redirected away from /admin-panel
    - expect: They should be redirected to their appropriate dashboard (/dashboard for students or /manage for owners)
    - expect: OR an 'Access Denied' message should appear

#### 5.4. Admin panel shows empty state when no pending shops

**File:** `tests/admin-panel/empty-state-no-pending.spec.ts`

**Steps:**
  1. Ensure all shops are already approved (no pending shops)
    - expect: No shops should have is_active: false
  2. Log in as admin and navigate to /admin-panel
    - expect: The admin panel should load
    - expect: An empty state message should appear (e.g., 'No pending shops' or similar)
    - expect: No shop cards should be displayed

#### 5.5. Admin panel loading state

**File:** `tests/admin-panel/admin-panel-loading.spec.ts`

**Steps:**
  1. Log in as admin and navigate to /admin-panel
    - expect: Initially, a loading spinner should appear while fetching pending shops
    - expect: After data loads, the pending shops should be displayed

### 6. Navigation and Routing

**Seed:** `tests/seed.spec.ts`

#### 6.1. Navigate from homepage to login

**File:** `tests/navigation/homepage-to-login.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/
    - expect: The homepage should load
    - expect: A 'Login' button should be visible in the header
  2. Click the 'Login' button
    - expect: The user should be redirected to /login
    - expect: The login page should load successfully

#### 6.2. Navigate from homepage to signup

**File:** `tests/navigation/homepage-to-signup.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/
    - expect: The homepage should load
  2. Click the 'Sign Up' button in the header
    - expect: The user should be redirected to /signup
    - expect: The signup page should load successfully

#### 6.3. Navigate from login to signup

**File:** `tests/navigation/login-to-signup.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/login
    - expect: The login page should load
  2. Click the 'Sign up' link at the bottom of the login form
    - expect: The user should be redirected to /signup
    - expect: The signup page should load

#### 6.4. Navigate from signup to login

**File:** `tests/navigation/signup-to-login.spec.ts`

**Steps:**
  1. Navigate to http://localhost:3000/signup
    - expect: The signup page should load
  2. Click the 'Login' link in the text 'Already have an account? Login'
    - expect: The user should be redirected to /login
    - expect: The login page should load

#### 6.5. Authenticated student cannot access shop owner routes

**File:** `tests/navigation/student-cannot-access-owner-routes.spec.ts`

**Steps:**
  1. Log in as a student
    - expect: The student should be on /dashboard
  2. Attempt to navigate to /manage directly via URL
    - expect: The student should be redirected back to /dashboard
    - expect: OR an access denied message should appear
  3. Attempt to navigate to /settings directly via URL
    - expect: The student should be redirected back to /dashboard
    - expect: OR an access denied message should appear

#### 6.6. Authenticated shop owner cannot access student routes

**File:** `tests/navigation/owner-cannot-access-student-routes.spec.ts`

**Steps:**
  1. Log in as a shop owner
    - expect: The owner should be on /manage
  2. Attempt to navigate to /dashboard directly via URL
    - expect: The owner should be redirected back to /manage
    - expect: OR an access denied message should appear

#### 6.7. Unauthenticated user redirected to login

**File:** `tests/navigation/unauthenticated-redirect.spec.ts`

**Steps:**
  1. Ensure no user is logged in (clear session/cookies)
    - expect: No user session should exist
  2. Attempt to navigate to /dashboard
    - expect: The user should be redirected to /login
  3. Attempt to navigate to /manage
    - expect: The user should be redirected to /login
  4. Attempt to navigate to /settings
    - expect: The user should be redirected to /login

#### 6.8. Logout functionality

**File:** `tests/navigation/logout-functionality.spec.ts`

**Steps:**
  1. Log in as any user (student or owner)
    - expect: The user should be authenticated and on their dashboard
  2. Look for a logout button or link in the navigation/header
    - expect: A logout option should be visible
  3. Click the logout button
    - expect: The user session should be cleared
    - expect: The user should be redirected to /login or the homepage
    - expect: Attempting to access protected routes should now redirect to /login

### 7. Email Verification

**Seed:** `tests/seed.spec.ts`

#### 7.1. Send verification email from student dashboard

**File:** `tests/email-verification/send-verification-student.spec.ts`

**Steps:**
  1. Create a new student account without verifying email
    - expect: The student should be logged in
  2. Navigate to /dashboard
    - expect: A verification banner should be visible
  3. Click the 'Verify Email' button in the banner
    - expect: A toast notification should appear saying 'Verification link sent to your email' or 'Email Sent'
    - expect: The verification email should be sent to the student's email address

#### 7.2. Verify email via link

**File:** `tests/email-verification/verify-email-link.spec.ts`

**Steps:**
  1. Create a new student account and trigger a verification email
    - expect: A verification email should be sent
  2. Retrieve the verification link from the email (or mock it in test)
    - expect: The link should point to /verify with appropriate query parameters
  3. Click the verification link or navigate to it
    - expect: The user should be redirected to /verify
    - expect: A success message or toast should appear saying 'Email verified successfully' or similar
    - expect: The user's emailVerification status should be set to true
  4. Navigate back to /dashboard
    - expect: The verification banner should no longer appear

#### 7.3. Verified student does not see verification banner

**File:** `tests/email-verification/verified-no-banner.spec.ts`

**Steps:**
  1. Log in as a student who has already verified their email
    - expect: The student should be on /dashboard
  2. Check the dashboard for verification banner
    - expect: No verification banner should be visible
    - expect: The dashboard should show normal content

### 8. Edge Cases and Error Handling

**Seed:** `tests/seed.spec.ts`

#### 8.1. Handle database connection failure gracefully

**File:** `tests/edge-cases/database-connection-failure.spec.ts`

**Steps:**
  1. Simulate a database connection failure (e.g., incorrect database ID in env variables)
    - expect: This requires setup to temporarily break the database connection
  2. Attempt to log in as a user
    - expect: An error toast should appear with a user-friendly message
    - expect: The application should not crash
    - expect: The user should remain on the login page

#### 8.2. Handle missing environment variables

**File:** `tests/edge-cases/missing-env-variables.spec.ts`

**Steps:**
  1. Remove or comment out a required environment variable (e.g., NEXT_PUBLIC_DB_ID)
    - expect: This requires setup to temporarily remove env variables
  2. Attempt to access the application
    - expect: An error should be logged to the console
    - expect: An error toast or message should appear indicating configuration error
    - expect: The application should handle the missing config gracefully

#### 8.3. Concurrent order creation for same shop

**File:** `tests/edge-cases/concurrent-orders.spec.ts`

**Steps:**
  1. Have two students create orders for the same shop at the same time (use parallel test execution)
    - expect: Both orders should be created successfully
    - expect: No race conditions or data corruption should occur
    - expect: Both orders should appear in the shop owner's queue

#### 8.4. Shop owner marks already completed order as complete again

**File:** `tests/edge-cases/mark-completed-twice.spec.ts`

**Steps:**
  1. Log in as shop owner and mark an order as completed
    - expect: The order status should change to 'completed'
  2. Attempt to mark the same order as completed again
    - expect: The action should either be prevented (button disabled)
    - expect: OR a message should indicate the order is already completed
    - expect: No error should occur

#### 8.5. Student uploads PDF during network interruption

**File:** `tests/edge-cases/upload-network-interruption.spec.ts`

**Steps:**
  1. Log in as student, select shop, and start uploading a PDF
    - expect: The upload should start with progress bar visible
  2. Simulate network disconnection during upload (throttle network or disconnect)
    - expect: An error toast should appear indicating upload failed
    - expect: The progress bar should stop
    - expect: The user should be able to retry the upload

#### 8.6. Student attempts to submit order without selecting file

**File:** `tests/edge-cases/submit-order-no-file.spec.ts`

**Steps:**
  1. Log in as student, navigate to /dashboard, and select a shop with print config
    - expect: The dashboard should be ready
  2. Do not select any file
    - expect: No file should be selected
  3. Click the 'Pay & Print' button
    - expect: An error toast should appear saying 'Please select a PDF file'
    - expect: No order should be created

#### 8.7. Special characters in shop name and location

**File:** `tests/edge-cases/special-characters-shop-details.spec.ts`

**Steps:**
  1. Create a shop owner account with shop name containing special characters (e.g., 'Shop #1 & Co. (Main)')
    - expect: The shop should be created successfully
  2. Log in as admin and approve the shop
    - expect: The shop should be approved
  3. Log in as student and view the shop in dropdown
    - expect: The shop name should display correctly with special characters
    - expect: The shop should be selectable and functional

#### 8.8. Very long file names

**File:** `tests/edge-cases/very-long-filename.spec.ts`

**Steps:**
  1. Create a PDF file with a very long filename (e.g., 255+ characters)
    - expect: The file should exist
  2. Log in as student and attempt to upload this file
    - expect: The upload should either succeed
    - expect: OR an error should appear if filename exceeds limits
    - expect: The filename should be truncated or handled gracefully in the UI

#### 8.9. Browser back button during upload

**File:** `tests/edge-cases/back-button-during-upload.spec.ts`

**Steps:**
  1. Log in as student and start uploading a large PDF file
    - expect: The upload progress bar should be visible
  2. Click the browser back button during upload
    - expect: The upload should be cancelled
    - expect: OR a confirmation dialog should appear asking 'Are you sure you want to leave?'
    - expect: No corrupted order should be created
