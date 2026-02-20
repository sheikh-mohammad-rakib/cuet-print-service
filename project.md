# CUET Print Service

## Project Overview

**CUET Print Service** is a hyper-local SaaS platform designed for campus printing services. It operates as a two-sided marketplace connecting students who need printing services with shop owners who have printers on campus.

### Core Workflow
1. **Student** uploads a PDF file and configures print settings (color mode, number of copies)
2. **System** creates an order in the database and stores the file in cloud storage
3. **Shop Owner** receives the order in real-time on their dashboard
4. **Shop Owner** downloads the PDF, prints it, and marks the order as complete
5. **Student** picks up the printed documents and pays at the shop

---

## Technology Stack

### Frontend
- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn/UI (Radix UI primitives)
- **Icons**: Lucide React
- **Notifications**: Sonner (Toast notifications)

### Backend
- **BaaS Provider**: Appwrite Cloud
  - **Authentication**: Email/Password + OAuth (Google)
  - **Database**: NoSQL document store
  - **Storage**: File storage with CDN
  - **Realtime**: WebSocket subscriptions
  - **Server SDK**: Node Appwrite (for server actions)

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint 9
- **Type Checking**: TypeScript 5

---

## Architecture

### Directory Structure

```
cuet-print-service/
├── app/
│   ├── (auth)/              # Authentication routes
│   │   ├── login/           # Login page (Student/Owner tabs)
│   │   ├── signup/          # Signup page (Student/Owner tabs)
│   │   ├── forgot-password/ # Password recovery request
│   │   ├── recovery/        # Password reset with token
│   │   └── verify/          # Email verification handler
│   ├── (student)/           # Student-facing routes
│   │   ├── dashboard/       # Main student dashboard
│   │   └── layout.tsx       # Student layout with navbar
│   ├── (owner)/             # Shop owner routes
│   │   ├── manage/          # Order management dashboard
│   │   ├── settings/        # Shop settings page
│   │   └── layout.tsx       # Owner layout with sidebar
│   ├── (admin)/             # Admin routes
│   │   ├── admin-panel/     # Shop approval interface
│   │   └── layout.tsx       # Admin layout
│   └── actions/             # Server actions
│       └── approveShop.ts   # Shop approval logic
├── components/
│   ├── ui/                  # Shadcn UI components
│   └── FileUploader.tsx     # Custom file upload component
├── hooks/
│   └── useAuthRedirect.ts   # Authentication & role-based routing
├── lib/
│   ├── appwrite.ts          # Client-side Appwrite config
│   ├── server-appwrite.ts   # Server-side Appwrite config
│   └── constants.ts         # Admin email list
└── public/                  # Static assets
```

### Route Groups

- **(auth)**: Public authentication pages (no layout wrapper)
- **(student)**: Student dashboard with top navigation bar
- **(owner)**: Shop owner dashboard with sidebar navigation
- **(admin)**: Admin panel for shop approvals

---

## Database Schema

### Database: `PrintingDB`

#### Collection: `shops`
Stores information about print shops on campus.

**Attributes:**
- `shopName` (String) - Display name of the shop
- `location` (String) - Physical location on campus
- `ownerEmail` (String) - Email of the shop owner (used for querying)
- `isOnline` (Boolean) - Whether the shop is currently accepting orders
- `is_active` (Boolean) - Whether the shop is approved by admin
- `price_bw` (Float) - Price per page for black & white printing (default: 2.0)
- `price_color` (Float) - Price per page for color printing (default: 5.0)
- `createdAt` (DateTime) - Shop registration timestamp
- `updatedAt` (DateTime) - Last update timestamp

**Permissions:**
- Read: Any (public can see active shops)
- Create/Update: Users (authenticated)

#### Collection: `orders`
Stores print job orders.

**Attributes:**
- `studentId` (String) - User ID of the student
- `shopId` (String) - Reference to the selected shop
- `fileId` (String) - Reference to file in Appwrite Storage
- `status` (String) - Order status: `pending` | `completed`
- `config` (String) - JSON string containing print settings
  ```json
  {"type": "bw", "copies": "2"}
  ```
- `totalAmount` / `totalPrice` (Float) - Calculated total price
- `orderDate` (DateTime) - Order creation timestamp

**Permissions:**
- Read: Any (shop owners can see orders)
- Create: Any (students can create orders)
- Update: User who created the order

#### Storage Bucket: `print-files`
Stores uploaded PDF files.

**Configuration:**
- Max file size: 50MB
- Allowed formats: `.pdf`
- Permissions: Create/Read by Any (temporary for demo)

---

## Key Features

### 1. Authentication & User Management

#### Email/Password Authentication
- Students and shop owners sign up with email and password
- Email verification flow implemented
- Password recovery via email link

#### OAuth Integration
- Google Sign-In available
- Callback handling at `/auth/callback`

#### Role-Based Access Control
- **Student Role**: Access to `/dashboard`
- **Owner Role**: Access to `/manage` and `/settings`
- **Admin Role**: Access to `/admin-panel` (hardcoded email list)
- Role stored in user preferences: `user.prefs.role`

#### Route Protection
Custom hook: [`useAuthRedirect(requiredRole)`](hooks/useAuthRedirect.ts)
- Checks if user is authenticated
- Validates role matches the required role
- Redirects to appropriate dashboard if role mismatch
- Redirects to login if not authenticated

### 2. Student Features

#### Shop Selection
- Browse available shops filtered by `is_active: true`
- View shop details: name, location, pricing
- See real-time availability (online/offline status)

#### Print Configuration
- **Color Mode**: Black & White or Color
- **Copies**: Select 1-20 copies
- **Price Calculation**: Automatically calculated based on shop rates

#### File Upload & Order Creation
Implemented in [`FileUploader`](components/FileUploader.tsx):
1. Student selects a PDF file (max 50MB)
2. Upload progress tracked with visual progress bar
3. File uploaded to Appwrite Storage
4. Order document created with file reference
5. Real-time notification sent to shop owner

#### Email Verification
- Unverified users see a banner with "Verify Email" button
- Verification link sent to email
- Verification handled at `/verify` page

### 3. Shop Owner Features

#### Real-Time Order Dashboard
Implemented in [`manage/page.tsx`](app/(owner)/manage/page.tsx):
- Displays all orders for the owner's shop
- Real-time updates using Appwrite subscriptions
- Filters orders by `shopId`
- Shows order details: student ID, file, config, price, timestamp

#### Order Management
- **Download PDF**: Direct download link from storage
- **Mark Complete**: Update order status to `completed`
- **Order Queue**: Visual card-based layout with status badges

#### Shop Settings
Implemented in [`settings/page.tsx`](app/(owner)/settings/page.tsx):
- Update shop name and location
- Set pricing for B&W and Color prints
- Toggle shop online/offline status
- Changes saved to database in real-time

#### Email Verification
- Unverified shop owners see a banner
- Must verify email to ensure account security

### 4. Admin Features

#### Shop Approval System
Implemented in [`admin-panel/page.tsx`](app/(admin)/admin-panel/page.tsx):
- View all shops with `is_active: false`
- Review shop details: name, location, pricing, owner email
- Approve shops using server action (bypasses RLS)
- Only accessible to emails in [`ADMIN_EMAILS`](lib/constants.ts)

#### Server Action for Approval
Implemented in [`actions/approveShop.ts`](app/actions/approveShop.ts):
- Uses server-side Appwrite client with API key
- Updates `is_active` field to `true`
- Bypasses client-side permission restrictions

---

## Technical Implementation Details

### Real-Time Functionality

#### Appwrite Realtime Subscriptions
Used in shop owner dashboard:
```typescript
const unsubscribe = client.subscribe(
  `databases.${dbId}.collections.${orderCollectionId}.documents`,
  (response) => {
    if (response.events.includes("databases.*.collections.*.documents.*.create")) {
      fetchOrders(); // Refresh order list
      toast({ title: "Queue Updated" });
    }
  }
);
```

### File Upload with Progress Tracking

```typescript
const fileUpload = await storage.createFile(
  bucketId,
  ID.unique(),
  file,
  permissions,
  (progressEvent) => {
    const percent = Math.round((progressEvent.progress / progressEvent.total) * 100);
    setProgress(percent);
  }
);
```

### Price Calculation Logic

```typescript
const calculatePrice = (type: string, copies: string) => {
  const rate = type === 'color' ? priceColor : priceBw;
  return rate * parseInt(copies);
};
```

### Permission Model

All database operations use explicit permission rules:
```typescript
[
  Permission.read(Role.user(user.$id)),
  Permission.update(Role.user(user.$id)),
  Permission.read(Role.any()) // Temporary for shop owner access
]
```

---

## Environment Variables

Required in `.env.local`:

```bash
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
NEXT_PUBLIC_APPWRITE_DEV_KEY=your-api-key

# Database IDs
NEXT_PUBLIC_DB_ID=your-database-id
NEXT_PUBLIC_COLLECTION_SHOPS=shops-collection-id
NEXT_PUBLIC_COLLECTION_ORDERS=orders-collection-id

# Storage IDs
NEXT_PUBLIC_BUCKET_FILES=files-bucket-id
```

---

## User Flows

### Student Sign-Up Flow
1. Navigate to `/signup`
2. Select "Student" tab
3. Enter name, email, password
4. Submit → Account created
5. Session created automatically
6. Role saved to preferences: `{role: "student"}`
7. Redirect to `/dashboard`
8. Email verification banner displayed (if not verified)

### Shop Owner Sign-Up Flow
1. Navigate to `/signup`
2. Select "Shop Owner" tab
3. Enter name, email, password, shop name, location
4. Submit → Account created
5. Session created automatically
6. Role saved to preferences: `{role: "owner"}`
7. **Shop document created** in database with `is_active: false`
8. Redirect to `/manage`
9. Shop appears in admin panel for approval

### Admin Shop Approval Flow
1. Admin logs in with authorized email
2. Navigate to `/admin-panel`
3. View pending shops (filtered by `is_active: false`)
4. Click "Approve" button
5. Server action updates `is_active: true`
6. Shop now visible to students in shop selection

### Print Order Flow
1. Student logs in and goes to `/dashboard`
2. Select a shop from dropdown
3. Configure print settings (color/BW, copies)
4. Upload PDF file
5. System calculates total price
6. Click "Pay & Print"
7. File uploads to storage (progress shown)
8. Order document created in database
9. Shop owner's dashboard updates in real-time
10. Shop owner downloads PDF
11. Shop owner prints and marks as complete
12. Student picks up and pays at counter

---

## Security Considerations

### Current Implementation
- Email/password authentication with Appwrite
- OAuth with Google Sign-In
- Role-based access control via `user.prefs.role`
- Protected routes with `useAuthRedirect` hook
- Server-side API key for admin operations
- Permission rules on database and storage

### Known Limitations
- File and order permissions set to `Role.any()` for demo purposes
- Should implement proper RLS (Row Level Security)
- Payment is manual (cash/bKash at counter)
- No automated notification system (email/SMS)

### Recommended Improvements
1. **Implement proper permission model**:
   - Students can only read their own orders
   - Shop owners can only read orders for their shop
   - Use Appwrite Teams for better access control

2. **Add payment integration**:
   - Integrate bKash/Nagad API
   - Add SSL Commerz for card payments
   - Implement escrow system (pay → print → release)

3. **Add notification system**:
   - Email notifications for order updates
   - SMS alerts for order ready
   - Push notifications (web push API)

4. **Enhance security**:
   - Rate limiting on uploads
   - File type validation server-side
   - Virus scanning for uploaded files
   - CSRF protection

---

## Deployment

### Prerequisites
- Node.js 18+ installed
- Appwrite Cloud project configured
- Environment variables set

### Build & Deploy
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Hosting Recommendations
- **Vercel**: Seamless Next.js deployment
- **Netlify**: Good for static exports
- **Railway**: Full-stack hosting
- **DigitalOcean App Platform**: Managed containers

---

## Future Enhancements

### Phase 1: Core Improvements
- [ ] Implement proper permission model
- [ ] Add order history for students
- [ ] Add shop analytics dashboard
- [ ] Implement search and filter for shops
- [ ] Add order cancellation feature

### Phase 2: Payment Integration
- [ ] Integrate bKash payment gateway
- [ ] Add SSL Commerz for cards
- [ ] Implement digital wallet
- [ ] Add refund system

### Phase 3: Advanced Features
- [ ] Email/SMS notifications
- [ ] Push notifications
- [ ] QR code for order pickup
- [ ] Review and rating system
- [ ] Loyalty points program
- [ ] Bulk order discounts

### Phase 4: Mobile App
- [ ] React Native mobile app
- [ ] Native push notifications
- [ ] Offline order queue
- [ ] Mobile payment integration

---

## Development Notes

### Design Patterns Used
- **Route Groups**: Organize pages by user role
- **Server Actions**: Handle privileged operations server-side
- **Custom Hooks**: Reusable authentication logic
- **Component Composition**: Shadcn/UI pattern

### State Management
- React useState for local component state
- Appwrite Realtime for distributed state
- No Redux/Zustand needed (simple app)

### Error Handling
- Try-catch blocks for async operations
- Toast notifications for user feedback
- Console logging for debugging

### Code Organization
- Colocation: Components near their usage
- Separation: API logic in `lib/`, UI in `components/`
- Type safety: TypeScript for all files

---

## Contributing

### Development Workflow
1. Clone the repository
2. Copy `.env.local.example` to `.env.local`
3. Fill in Appwrite credentials
4. Run `npm install`
5. Run `npm run dev`
6. Make changes and test locally
7. Submit pull request

### Code Style
- Follow ESLint rules
- Use Prettier for formatting
- Write TypeScript types
- Add comments for complex logic

---

## License

This project is developed for educational purposes as part of CUET campus services.

---

## Credits

**Developed by**: CUET Print Service Team  
**Framework**: Next.js by Vercel  
**Backend**: Appwrite Cloud  
**UI Components**: Shadcn/UI  

---

## Support

For issues, questions, or feature requests, please contact the development team or create an issue in the repository.