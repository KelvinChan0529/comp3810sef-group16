<!DOCTYPE html>
<html lang="en">
<body>

<h1>Food Ordering System</h1>

<div class="group-box center">
    <h2>Group information:</h2>
    <p><strong>COMP 3810SEF - Group16</strong></p>
    <div class="student">
        13909071<br><br>
        14083334<br><br>
        14029274 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Chan Chun Wa<br><br>
        13987313
    </div>
</div>

<h2>Project file introduction</h2>

<h3>package.json</h3>
<table>
    <tr><th>Package</th><th>Version</th><th>Purpose</th></tr>
    <tr><td>express</td><td>^4.19.2</td><td>Web framework for Node.js</td></tr>
    <tr><td>ejs</td><td>^3.1.10</td><td>Template engine for rendering views</td></tr>
    <tr><td>body-parser</td><td>* (latest)</td><td>Parse incoming request bodies</td></tr>
    <tr><td>cookie-session</td><td>* (latest)</td><td>Session middleware using cookies</td></tr>
    <tr><td>mongodb</td><td>6.9.0</td><td>Official MongoDB driver</td></tr>
    <tr><td>mongoose</td><td>^8.6.0</td><td>ODM for MongoDB</td></tr>
    <tr><td>method-override</td><td>^3.0.0</td><td>Allows using HTTP verbs in forms</td></tr>
</table>

<h3>server.js</h3>
<p><strong>User Authentication & Session Management</strong></p>
<ul>
    <li>Register new account</li>
    <li>Login / Logout</li>
    <li>Session-based authentication (using cookie-session)</li>
    <li>Protected routes — only logged-in users can access menu, ordering, etc.</li>
    <li>Redirects unauthenticated users to /login</li>
</ul>

<p><strong>Menu Management</strong></p>
<ul>
    <li>Admin/Staff Features (requires login):</li>
    <li>View all menu items with search, filter by category, price range, availability, and pagination</li>
    <li>Add new food items</li>
    <li>Edit existing items</li>
    <li>Delete items</li>
    <li>View item details</li>
    <li>Web routes: /menu, /menu/new, /menu/:id/edit, etc.</li>
    <li>Full RESTful API available under /api/menu:</li>
    <li>Create, read, update, delete by ID or name</li>
</ul>

<p><strong>Customer Ordering System</strong></p>
<ul>
    <li>Browse only available food items</li>
    <li>Add items to cart</li>
    <li>Update quantity or remove items from cart</li>
    <li>Clear entire cart</li>
    <li>Submit order to saves to MongoDB with:</li>
    <li>Username</li>
    <li>Full cart details</li>
    <li>Total price</li>
    <li>Timestamp & "pending" status</li>
    <li>Cart is stored in session</li>
</ul>

<p><strong>Database Setup</strong></p>
<ul>
    <li>Two MongoDB connections:</li>
    <li>One for user login (MongoDB driver + login database)</li>
    <li>One for menu & orders (Mongoose + food-ordering database)</li>
    <li>Uses Mongoose models: MenuItem and Order</li>
</ul>

<h3>views folder</h3>
<p><strong>login.ejs & register.ejs:</strong><br>Complete user onboarding flow (register → login)</p>

<p><strong>homepage.ejs:</strong><br>The main navigation gateway for authenticated users in the food ordering system.<br>Customer Mode: Browse and order food<br>Admin Mode: Manage the menu (CRUD operations)</p>

<p><strong>order.ejs:</strong><br>Browse Menu by Category<br>Visual Item Cards<br>Real-Time Shopping Cart Sidebar<br>Interactive Actions - Add to cart, Update quantity, Remove item, Submit final order, saves to database and clears cart</p>

<p><strong>menu folder include (edit.ejs & index.ejs & new.ejs & show.ejs)</strong></p>
<p><strong>index.ejs:</strong></p>
<ul>
    <li>Full-featured search & filtering (by name, category, price range, availability, items per page)</li>
    <li>Pagination with preserved filters</li>
    <li>Card grid layout with thumbnails</li>
    <li>Quick Edit and Delete buttons per item</li>
    <li>Statistics (total items)</li>
    <li>"Add Dish" button + Reset filters</li>
</ul>

<p><strong>new.ejs:</strong></p>
<ul>
<ul>
    <li>Create new menu item form</li>
    <li>All required fields (name, category, price) + optional image URL, description</li>
    <li>"Available" checkbox checked by default</li>
    <li>Layout with placeholders</li>
</ul>

<p><strong>edit.ejs:</strong></p>
<ul>
    <li>Update existing item form (pre-filled with current data)</li>
    <li>Same fields as create + current values preserved</li>
</ul>

<p><strong>show.ejs:</strong></p>
<ul>
    <li>Detailed view of a single dish</li>
    <li>Large hero image</li>
    <li>Price, category, availability status, full description</li>
    <li>Creation & update timestamps</li>
    <li>Direct Edit and Delete buttons</li>
</ul>

<h3>UI files include (style.css & styles.css)</h3>
<p><strong>style.css:</strong><br>Used exclusively for Login / Register / Homepage (the public/auth pages)</p>

<p><strong>styles.css:</strong><br>Used for all internal authenticated pages (/order, /menu, etc.)</p>

<h3>models folder</h3>
<p><strong>MenuItem.js:</strong><br>It is a Mongoose model with full validation, smart indexing for blazing-fast queries, and text search support.</p>

<p><strong>Order.js:</strong><br>It is an Order model that perfectly supports a real-world food ordering system. Order model with full lifecycle status tracking, denormalized item snapshots for reliable history, proper referencing, and optimized indexes.</p>

<p style="margin-top:60px;"><strong>The cloud-based server URL</strong><br>
https://github.com/KelvinChan0529/comp3810sef-group16</p>

</body>
</html>
