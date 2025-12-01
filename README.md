<!DOCTYPE html>
<html lang="zh-HK">
<body>

<h1>Food Ordering System</h1>

<div class="group-info">
    <h2>COMP 3810SEF - Group16</h2>
    <p><strong>組員學號：</strong></p>
    <p style="font-size:1.3em;">
        13909071<br>
        14083334<br>
        14029274　<span style="margin-left:20px;">Chan Chun Wa</span><br>
        13987313
    </p>
</div>

<h2>Project file introduction</h2>

<h3>package.json</h3>
<table>
    <thead>
        <tr>
            <th>Package</th>
            <th>Version</th>
            <th>Purpose</th>
        </tr>
    </thead>
    <tbody>
        <tr><td>express</td><td>^4.19.2</td><td>Web framework for Node.js</td></tr>
        <tr><td>ejs</td><td>^3.1.10</td><td>Template engine for rendering views</td></tr>
        <tr><td>body-parser</td><td>* (latest)</td><td>Parse incoming request bodies</td></tr>
        <tr><td>cookie-session</td><td>* (latest)</td><td>Session middleware using cookies</td></tr>
        <tr><td>mongodb</td><td>6.9.0</td><td>Official MongoDB driver</td></tr>
        <tr><td>mongoose</td><td>^8.6.0</td><td>ODM for MongoDB</td></tr>
        <tr><td>method-override</td><td>^3.0.0</td><td>Allows using HTTP verbs in forms</td></tr>
    </tbody>
</table>

<h3>server.js 主要功能</h3>

<h4>User Authentication & Session Management</h4>
<ul>
    <li>Register new account</li>
    <li>Login / Logout</li>
    <li>Session-based authentication (using <span class="code">cookie-session</span>)</li>
    <li>Protected routes — only logged-in users can access menu, ordering, etc.</li>
    <li>Redirects unauthenticated users to <span class="code">/login</span></li>
</ul>

<h4>Menu Management（Admin/Staff Features）</h4>
<ul>
    <li>View all menu items with <strong>search, filter by category, price range, availability</strong>, and <strong>pagination</strong></li>
    <li>Add new food items</li>
    <li>Edit existing items</li>
    <li>Delete items</li>
    <li>View item details</li>
    <li>Web routes: <span class="code">/menu</span>, <span class="code">/menu/new</span>, <span class="code">/menu/:id/edit</span>, etc.</li>
    <li>Full RESTful API available under <span class="code">/api/menu</span>:
        <ul>
            <li>Create, read, update, delete by ID or name</li>
        </ul>
    </li>
</ul>

<h4>Customer Ordering System</h4>
<ul>
    <li>Browse only <strong>available</strong> food items</li>
    <li>Add items to cart</li>
    <li>Update quantity or remove items from cart</li>
    <li>Clear entire cart</li>
    <li>Submit order → saves to MongoDB with:
        <ul>
            <li>Username</li>
            <li>Full cart details</li>
            <li>Total price</li>
            <li>Timestamp & "pending" status</li>
        </ul>
    </li>
    <li>Cart is stored in <span class="code">session</span></li>
</ul>

<h4>Database Setup</h4>
<ul>
    <li>Two MongoDB connections:
        <ul>
            <li>One for user login (MongoDB driver + <mark>login</mark> database)</li>
            <li>One for menu & orders (Mongoose + <mark>food-ordering</mark> database)</li>
        </ul>
    </li>
    <li>Uses Mongoose models: <span class="code">MenuItem</span> and <span class="code">Order</span></li>
</ul>

<h3>views folder</h3>

<ul>
    <li><strong>login.ejs & register.ejs</strong>: Complete user onboarding flow (register → login)</li>
    <li><strong>homepage.ejs</strong>: The main navigation gateway for authenticated users
        <ul>
            <li>Customer Mode: Browse and order food</li>
            <li>Admin Mode: Manage the menu (CRUD operations)</li>
        </ul>
    </li>
    <li><strong>order.ejs</strong>:
        <ul>
            <li>Browse Menu by Category</li>
            <li>Visual Item Cards</li>
            <li>Real-Time Shopping Cart Sidebar</li>
            <li>Interactive Actions - Add to cart, Update quantity, Remove item, Submit final order, saves to database and clears cart</li>
        </ul>
    </li>
</ul>

<h4>menu folder include (edit.ejs & index.ejs & new.ejs & show.ejs)</h4>

<ul>
    <li><strong>index.ejs</strong>:
        <ul>
            <li>Full-featured search & filtering (by name, category, price range, availability, items per page)</li>
            <li>Pagination with preserved filters</li>
            <li>Card grid layout with thumbnails</li>
            <li>Quick Edit and Delete buttons per item</li>
            <li>Statistics (total items)</li>
            <li>"Add Dish" button + Reset filters</li>
        </ul>
    </li>
    <li><strong>new.ejs</strong>: Create new menu item form（所有必填欄位 + 圖片 URL、描述、預設可用）</li>
    <li><strong>edit.ejs</strong>: Update existing item form（預填目前資料）</li>
    <li><strong>show.ejs</strong>:
        <ul>
            <li>Detailed view of a single dish</li>
            <li>Large hero image</li>
            <li>Price, category, availability status, full description</li>
            <li>Creation & update timestamps</li>
            <li>Direct Edit and Delete buttons</li>
        </ul>
    </li>
</ul>

<h4>UI files</h4>
<ul>
    <li><span class="code">style.css</span> → 用於 Login / Register / Homepage（公開頁面）</li>
    <li><span class="code">styles.css</span> → 用於所有需要登入的內部頁面（/order, /menu 等）</li>
</ul>

<h3>models folder</h3>
<ul>
    <li><strong>MenuItem.js</strong>: Mongoose model 含完整驗證、高效索引、支援文字搜尋</li>
    <li><strong>Order.js</strong>: 完整訂單生命週期狀態追蹤、物品快照（denormalized）、參照關係、最佳化索引</li>
</ul>

<p style="text-align:center; margin-top:60px; color:#7f8c8d;">
    COMP3810 Software Engineering Fundamentals – Group 16<br>
    Food Ordering System Documentation
</p>

</body>
</html>
