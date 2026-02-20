Here is a comprehensive technical blueprint of the project discussed in this chat. You can paste this directly into Antigravity (or any AI coding assistant) to establish the context without copying code blocks.

### **Project Blueprint: CUET Print Service**

**1. Project Overview**

* **Type:** Hyper-local SaaS / Two-Sided Marketplace.
* **Goal:** A campus printing service where Students upload PDFs and Shop Owners (or students with printers) fulfill orders.
* **Core Workflow:** Student uploads file & configures print → Order created in Database → Shop Owner sees order in Real-time → Owner prints & marks complete.

**2. Technology Stack**

* **Framework:** Next.js 14+ (App Router).
* **Language:** TypeScript.
* **Backend-as-a-Service (BaaS):** Appwrite Cloud (Auth, Database, Storage, Realtime).
* **Styling:** Tailwind CSS.
* **UI Library:** Shadcn/UI (Button, Input, Card, Tabs, Select, Badge, Progress, Sonner for Toasts).
* **Icons:** Lucide React.

**3. Application Architecture (Folder Structure)**
The project uses Next.js Route Groups to separate logic for different user roles:

* **`(auth)` Group:** Contains Login and Signup pages. These pages do not share the main app layout.
* **`(student)` Group:** Contains the Student Dashboard. Uses a dedicated Layout with a Navigation Bar.
* **`(owner)` Group:** Contains the Shop Owner Dashboard. Uses a dedicated Layout with a Sidebar.
* **`lib/`:** Contains the Appwrite Client initialization singleton.
* **`components/`:** Contains UI elements and the custom `FileUploader` component.
* **`hooks/`:** Contains `useAuthRedirect` for protecting routes based on authentication status.

**4. Appwrite Database Schema**
The backend relies on a database named **`PrintingDB`** with two specific collections:

* **Collection A: `shops**`
* **Purpose:** Stores details about available printing locations.
* **Attributes:**
* `shop_name` (String)
* `location` (String)
* `owner_email` (String) - *Used to map the logged-in user to their shop.*
* `is_online` (Boolean)
* `price_bw` (Float)
* `price_color` (Float)


* **Permissions:** Readable by "Any" (Public), Writeable by "Users".


* **Collection B: `orders**`
* **Purpose:** Stores active and past print jobs.
* **Attributes:**
* `student_id` (String)
* `shop_id` (String)
* `file_id` (String) - *Reference to Appwrite Storage.*
* `status` (String) - *Default: 'pending'.*
* `config` (String) - *JSON string containing print settings (e.g., copies, color).*
* `total_price` (Float)


* **Permissions:** Createable by "Any", Readable by "Users".


* **Storage Bucket: `print-files**`
* **Purpose:** Stores the actual PDF files uploaded by students.
* **Permissions:** Create/Read by "Any".



**5. Key Feature Implementations**

* **Authentication & Role Management:**
* Uses Appwrite Email/Password Auth.
* **Signup Logic:**
* *Student Signup:* Creates an Auth account only.
* *Shop Owner Signup:* Creates an Auth account **AND** automatically creates a document in the `shops` collection to initialize their store.




* **File Upload & Order Creation:**
* A transaction-like process occurs on the client side:
1. File is uploaded to Appwrite Storage bucket.
2. Upon success, the `file_id` is retrieved.
3. A document is created in the `orders` collection containing the `file_id`, calculated price, and print configuration.




* **Real-time Dashboard (Owner Side):**
* The Shop Owner dashboard uses `client.subscribe` to listen to the `orders` collection.
* When a new document is created (Student places order), the dashboard updates instantly without a page refresh.
* Includes logic to filter orders so owners only see jobs assigned to their specific `shop_id`.


* **Notifications:**
* Originally used `use-toast`, but migrated to `sonner` for toast notifications (success/error messages).



**6. Environment Variables Required**
The application requires the following keys in `.env.local`:

* Appwrite Endpoint URL.
* Appwrite Project ID.
* Database ID.
* Collection IDs for `shops` and `orders`.
* Storage Bucket ID.