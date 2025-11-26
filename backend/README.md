# Backend Environment Setup

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn

## Initial Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your configuration:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.kvjy9ez.mongodb.net/krishi_connect?appName=Cluster0
   ```

   **Important:** 
   - Replace `YOUR_USERNAME` and `YOUR_PASSWORD` with your actual MongoDB Atlas credentials
   - Never commit the `.env` file to version control
   - Use strong, unique passwords

### 3. MongoDB Atlas Setup

1. **Create a Database User:**
   - Go to: https://cloud.mongodb.com/v2/6925b7563846df025e150f7d#/security/database
   - Click "Add New Database User"
   - Choose a strong username and password
   - Grant appropriate permissions (e.g., "Read and write to any database")

2. **Configure Network Access:**
   - Go to: Network Access in MongoDB Atlas
   - Add your IP address or configure as needed
   - For development, you can allow access from anywhere (0.0.0.0/0), but this is NOT recommended for production

3. **Get Your Connection String:**
   - Go to: Database → Connect → Connect your application
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Add it to your `.env` file as `MONGODB_URI`

### 4. Start the Server

```bash
npm start
# or for development with auto-reload:
npm run dev
```

The server should start on `http://localhost:5000`

## Environment Variables Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `PORT` | Server port | No (defaults to 5000) | `5000` |
| `MONGODB_URI` | MongoDB connection string | Yes | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Secret for JWT tokens | Recommended | `your-secret-key-here` |

## Security Best Practices

### ✅ DO:
- Use environment variables for all sensitive data
- Keep `.env` file in `.gitignore`
- Use strong, unique passwords
- Rotate credentials regularly
- Enable MongoDB Atlas IP whitelisting
- Use HTTPS in production
- Enable MongoDB Atlas monitoring and alerts

### ❌ DON'T:
- Commit `.env` files to version control
- Hardcode credentials in source code
- Use weak or default passwords
- Share credentials in chat/email
- Allow unrestricted database access (0.0.0.0/0) in production

## Troubleshooting

### "MONGODB_URI is not defined in environment variables"
- Make sure you created a `.env` file in the `backend` directory
- Verify the `.env` file contains `MONGODB_URI=...`
- Restart the server after creating/modifying `.env`

### "MongoDB connection error"
- Verify your MongoDB Atlas credentials are correct
- Check that your IP address is whitelisted in MongoDB Atlas
- Ensure your MongoDB cluster is running
- Check your internet connection

### "Server won't start"
- Check if port 5000 is already in use
- Try changing the `PORT` in `.env`
- Check for syntax errors in `.env`

## Additional Resources

- [MongoDB Atlas Documentation](https://www.mongodb.com/docs/atlas/)
- [Express.js Documentation](https://expressjs.com/)
- [dotenv Documentation](https://github.com/motdotla/dotenv)

## Support

For security issues, please refer to `SECURITY_INCIDENT_RESPONSE.md` in the root directory.
