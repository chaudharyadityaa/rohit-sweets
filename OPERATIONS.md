# Running ROHIT SWEETS Online — Day-to-Day Guide

This is a plain-language guide for managing the website without needing to read code.

## Logging into the admin panel

1. Go to https://rohit-sweets.netlify.app/admin/login
2. Enter your username and password
3. You'll see the Dashboard with today's orders and sales

## Checking and updating orders

1. Click **Orders** in the top menu
2. Use the search box to find an order by number, customer name, or phone
3. Use the filter buttons (Pending / Confirmed / Preparing / etc.) to see only orders at a certain stage
4. Click on any order to see the full details — items, address, landmark, phone number
5. Use the dropdown on the right of each order to change its status as you prepare and deliver it
6. **Cancelling an order** asks you to confirm first — only do this if the customer has been informed

## Adding or changing a product's price

1. Click **Products** in the top menu
2. Find the sweet in the list, click the pencil (edit) icon
3. Enter the price, click **Save product**
4. The change appears on the website immediately — no need to do anything else

## Marking a sweet as sold out for the day

1. Go to **Products**
2. Click the **Available** / **Unavailable** badge next to the sweet — it toggles instantly
3. Customers will see "Currently unavailable" and can't order it until you switch it back

## Adding a new sweet

1. Go to **Products** → **Add product**
2. Fill in the name and category (required). Price, description, and photo are optional
3. Leave price blank if you haven't decided the price yet — it'll show "Price coming soon" and customers can't order it until you add a price later
4. Click **Save product**

## Removing a sweet (without losing its order history)

1. Go to **Products**, find the sweet, click the trash icon, confirm
2. This hides it from the website but keeps it in the system — **it does not delete past orders**
3. To bring it back: tick **Show deleted products**, find it, click **Restore**

## Adding real photos of your sweets

Right now, sweets show a placeholder image. To add real photos:

1. Take a clear, well-lit photo of the sweet (square photos work best)
2. Go to **https://cloudinary.com**, sign up for a free account
3. Upload your photo there (drag and drop onto their Media Library page)
4. Click on the uploaded photo, copy its **URL** (it will look like `https://res.cloudinary.com/.../photo.jpg`)
5. In the admin panel, edit that product, paste the URL into the **Image URL** field, save
6. The photo appears on the website immediately

(Cloudinary's free plan is more than enough for a shop's worth of product photos — no payment needed.)

## If you forget your admin password

There is currently no "forgot password" button. You (or your developer) will need to reset it directly in the database:

1. Go to https://neon.tech, log in, open the `rohit-sweets` project
2. Open the **SQL Editor**
3. Generate a new BCrypt hash for your new password (ask your developer, or use an online BCrypt generator with cost factor 10)
4. Run:
```sql
   UPDATE admin_users SET password_hash = 'paste-the-new-bcrypt-hash-here' WHERE username = 'admin';
```

## If the website seems slow the first time someone visits

This is expected behavior on the current free hosting plan. If there's been no traffic for about 15 minutes, the backend "goes to sleep" to save resources, and the next visitor waits 30-60 seconds while it wakes up. After that, it's fast again until it goes idle once more.

If this becomes a real problem (customers complaining, lost orders), the fix is upgrading the backend hosting to a paid tier (~$5-7/month), which removes this sleep behavior entirely. Ask your developer when you're ready for this.

## Backing up your data

Your order and product data lives in a Neon database. To take a manual backup:

1. Go to https://neon.tech, log into the `rohit-sweets` project
2. Open the **SQL Editor**
3. Neon keeps automatic point-in-time recovery on the free tier for a few days back — check Neon's dashboard under **Backups / Restore** for how far back you can recover
4. For a manual export, ask your developer to run a `pg_dump` against the connection string and save the file somewhere safe

## Who to contact for changes or problems

[ADITYA CHAUDHARY, +91-8824121485]