import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

console.log("=".repeat(60));
console.log("MongoDB Connection Test");
console.log("=".repeat(60));

// Check if MONGODB_URI exists
if (!process.env.MONGODB_URI) {
    console.error("❌ ERROR: MONGODB_URI is not defined in .env file");
    console.log("\nPlease make sure your .env file contains:");
    console.log("MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database");
    process.exit(1);
}

// Parse the connection string (without showing the full password)
const uri = process.env.MONGODB_URI;
console.log("\n✓ MONGODB_URI is defined");

// Extract info from connection string
try {
    const urlPattern = /mongodb\+srv:\/\/([^:]+):([^@]+)@([^\/]+)\/(.+)/;
    const match = uri.match(urlPattern);

    if (match) {
        const [, username, password, cluster, database] = match;
        console.log("\n📋 Connection String Details:");
        console.log(`   Username: ${username}`);
        console.log(`   Password: ${"*".repeat(password.length)} (${password.length} characters)`);
        console.log(`   Cluster: ${cluster}`);
        console.log(`   Database: ${database.split('?')[0]}`);

        // Check for special characters that need encoding
        const specialChars = ['@', '#', '$', '%', '^', '&', '+', '=', ':', ';', ',', '?', '/', '\\', ' '];
        const hasUnencoded = specialChars.some(char => password.includes(char) && !password.includes('%'));

        if (hasUnencoded) {
            console.log("\n⚠️  WARNING: Password may contain special characters that need URL encoding!");
            console.log("   Special characters like @, #, $, %, etc. must be URL-encoded");
            console.log("   Example: @ becomes %40, # becomes %23");
        }
    } else {
        console.log("\n⚠️  WARNING: Connection string format doesn't match expected pattern");
        console.log("   Expected: mongodb+srv://username:password@cluster/database");
    }
} catch (error) {
    console.log("\n⚠️  Could not parse connection string");
}

console.log("\n" + "=".repeat(60));
console.log("Attempting to connect to MongoDB...");
console.log("=".repeat(60) + "\n");

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("✅ SUCCESS: MongoDB connected successfully!");
        console.log("\nYour credentials are correct and the connection is working.");
        console.log("You can now start your server with: npm start");
        process.exit(0);
    })
    .catch((err) => {
        console.error("❌ FAILED: MongoDB connection error\n");

        if (err.message.includes("bad auth")) {
            console.log("🔴 Authentication Failed - Possible causes:");
            console.log("   1. Username or password is incorrect");
            console.log("   2. The database user doesn't exist in MongoDB Atlas");
            console.log("   3. Password contains special characters that aren't URL-encoded");
            console.log("   4. You're using the old compromised credentials");
            console.log("\n💡 Solution:");
            console.log("   1. Go to MongoDB Atlas: https://cloud.mongodb.com/v2/6925b7563846df025e150f7d#/security/database");
            console.log("   2. Create a NEW database user (delete the old one if it exists)");
            console.log("   3. Use a strong password (you can auto-generate one)");
            console.log("   4. Update your .env file with the new credentials");
            console.log("   5. If password has special chars, URL-encode them");
        } else if (err.message.includes("ENOTFOUND")) {
            console.log("🔴 DNS/Network Error - Possible causes:");
            console.log("   1. Cluster hostname is incorrect");
            console.log("   2. No internet connection");
            console.log("   3. DNS resolution issues");
        } else if (err.message.includes("IP")) {
            console.log("🔴 IP Whitelist Error - Possible causes:");
            console.log("   1. Your IP address is not whitelisted in MongoDB Atlas");
            console.log("   2. Go to Network Access and add your current IP");
        }

        console.log("\n📋 Full error details:");
        console.error(err);
        process.exit(1);
    });
