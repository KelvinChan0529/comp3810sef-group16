# Food Ordering System

## Group Information

**COMP 3810SEF - Group16**

| Student ID | Name                  |
|------------|-----------------------|
| 13909071   |                       |
| 14083334   | Poon Hung Man         |
| 14029274   | Chan Chun Wa          |
| 13987313   | Leung Cheuk Hang Cairns |

## Project File Introduction

### package.json

| Package          | Version      | Purpose                                              |
|------------------|--------------|------------------------------------------------------|
| express          | ^4.19.2      | Web framework for Node.js                            |
| ejs              | ^3.1.10      | Template engine for rendering views                  |
| body-parser      | * (latest)   | Parse incoming request bodies                        |
| cookie-session   | * (latest)   | Session middleware using cookies                     |
| mongodb          | 6.9.0        | Official MongoDB driver                              |
| mongoose         | ^8.6.0       | ODM for MongoDB                                      |
| method-override  | ^3.0.0       | Allows using HTTP verbs in forms                     |

### server.js

#### User Authentication & Session Management
- Register new account
- Login / Logout
- Session-based authentication (using cookie-session)
- Protected routes — only logged-in users can access menu, ordering, etc.
- Redirects unauthenticated users to /login

#### Menu Management
**Admin/Staff Features (requires login):**
- View all menu items with search, filter by category, price range, availability, and pagination
- Add new food items
- Edit existing items
- Delete items
- View item details
- Web routes: `/menu`, `/menu/new`, `/menu/:id/edit`, etc.
- Full RESTful API available under `/api/menu`:
  - Create, read, update, delete by ID or name

#### Customer Ordering System
- Browse only available food items
- Add items to cart
- Update quantity or remove items from cart
- Clear entire cart
- Submit order to saves to MongoDB with:
  - Username
  - Full cart details
  - Total price
  - Timestamp & "pending" status
- Cart is stored in session

#### Database Setup
- Two MongoDB connections:
  - One for user login (MongoDB driver + login database)
  - One for menu & orders (Mongoose + food-ordering database)
- Uses Mongoose models: `MenuItem` and `Order`

### views folder

- **login.ejs** & **register.ejs**: Complete user onboarding flow (register → login)
- **homepage.ejs**: The main navigation gateway for authenticated users in the food ordering system.
  - Customer Mode: Browse and order food
  - Admin Mode: Manage the menu (CRUD operations)

- **order.ejs**:
  - Browse Menu by Category
  - Visual Item Cards
  - Real-Time Shopping Cart Sidebar
  - Interactive Actions - Add to cart, Update quantity, Remove item, Submit final order, saves to database and clears cart

- **menu folder** (`edit.ejs` & `index.ejs` & `new.ejs` & `show.ejs`)

  - **index.ejs**:
    - Full-featured search & filtering (by name, category, price range, availability, items per page)
    - Pagination with preserved filters
    - Card grid layout with thumbnails
    - Quick Edit and Delete buttons per item
    - Statistics (total items)
    - "Add Dish" button + Reset filters

  - **new.ejs**:
    - Create new menu item form
    - All required fields (name, category, price) + optional image URL, description
    - "Available" checkbox checked by default
    - Layout with placeholders

  - **edit.ejs**:
    - Update existing item form (pre-filled with current data)
    - Same fields as create + current values preserved

  - **show.ejs**:
    - Detailed view of a single dish
    - Large hero image
    - Price, category, availability status, full description
    - Creation & update timestamps
    - Direct Edit and Delete buttons

### UI files

- **style.css**: Used exclusively for `Login` / `Register` / `Homepage` (the public/auth pages)
- **styles.css**: Used for all internal authenticated pages (`/order`, `/menu`, etc.)

### models folder

- **MenuItem.js**: It is a Mongoose model with full validation, smart indexing for blazing-fast queries, and text search support.
- **Order.js**: It is an Order model that perfectly supports a real-world food ordering system. Order model with full lifecycle status tracking, denormalized item snapshots for reliable history, proper referencing, and optimized indexes.

## Live Demo

**The cloud-based server URL**  
https://comp3810sef-group16.onrender.com/

## Operation Guides

### Admin Account
username : guest
password : guest

### 1. Login Steps
- Input username and password.
- If login fails (username or password incorrect), will show "Invalid username or password" on the page.

### 2. After Login
- You will be redirected to the food order page.
- Under the middle shows a Logout button.

### 3. Logout
- Click the "Logout" button in the middle.
- Back to the Login page

### CRUD Web Pages

#### Create
1. Login as an admin user.
2. Click "MENU MANAGEMENT" on the home page.
3. Click “+Add Dish” in MENU MANAGEMENT page.
4. Enter the “Dish Name, Category, Price(USD), Image URL and Description” and click "Create".

#### Read
1. Login as an admin user.
2. Click "MENU MANAGEMENT" on the home page.
3. In the MENU MANAGEMENT page will show all the food
4. You can Search by (FoodName, Categories, min/max price and status).
5. You can Click "Filter" to show the food you want to find.

#### Order (Customer)
1. In the Order Food page will show all the food
2. You can view all the food from top to bottom.
3. You can select different categories to purchase the items you like.
4. You click the “+Add to Cart” button, then you will see the product appear in “Your Cart”.
5. After you have selected your items, you can press the "Place order" button to complete the purchase.

#### Update
1. Login as admin.
2. Click "MENU MANAGEMENT" on the home page.
3. If you want to change the product details, click “Edit”.
4. Modify the data and click "Save".

#### Delete
1. Login as admin.
2. Click "MENU MANAGEMENT" on the home page.
3. On the MENU MANAGEMENT page, choose a food and click the Delete icon.
4. The food will be removed.

## RESTful CRUD Services

> **Note**: All APIs run in a Linux environment, using the Windows command prompt (cmd) directly may cause errors.

### Login
curl -X POST https://comp3810sef-group16.onrender.com/login \
 -d "name=guest&password=guest" \
 -c cookies.txt

### Create - POST
- Create menu item:
curl -b cookies.txt -X POST https://comp3810sef-group16.onrender.com/api/menu \
 -H "Content-Type: application/json" \
 -d '{
  "name": "Apple Juice",
  "category": "Drinks",
  "price": 3.50,
  "description": "Fresh apple juice",
  "imageUrl": "https://www.bellanaija.com/wp-content/uploads/2021/07/maxresdefault-43.jpeg?w=300",
  "available": true
 }' -i

### Read - GET
- Get all menu items:
curl -b cookies.txt -X GET https://comp3810sef-group16.onrender.com/api/menu \
 -H "Accept: application/json" -i

- Get menu item by name:
curl -b cookies.txt -X GET https://comp3810sef-group16.onrender.com/api/menu/name/Apple%20Juice \
 -H "Accept: application/json" -i

### Update - PUT
- Modify an existing menu item:
curl -b cookies.txt -X PUT https://comp3810sef-group16.onrender.com/api/menu/name/Apple%20Juice \
  -H "Content-Type: application/json" \
  -d '{
    "category": "Drinks",
    "price": 10.00,
    "description": "Fresh apple juice (updated)",
    "imageUrl": "https://media.istockphoto.com/id/1419865456/photo/glass-of-apple-cider-with-autumn-background.jpg?s=612x612&w=0&k=20&c=qycAGVA3AUgpO86zAd2eEqgoWoxR0b4s5Uu7RVgmRKw=",
    "available": true
  }' -i

### Delete - DELETE
- Remove a menu item by name
curl -b cookies.txt -X DELETE https://comp3810sef-group16.onrender.com/api/menu/name/Apple%20Juice -i

