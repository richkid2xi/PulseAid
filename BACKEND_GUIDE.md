# Backend Integration Guide for PulseAid

Complete guide for setting up form submissions with various backend solutions.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Option 1: Form Services (Easiest - No Code)](#option-1-form-services-easiest---no-code)
3. [Option 2: Google Sheets](#option-2-google-sheets)
4. [Option 3: Node.js + Express](#option-3-nodejs--express)
5. [Option 4: Serverless Functions](#option-4-serverless-functions)
6. [Option 5: PHP Backend](#option-5-php-backend)
7. [Option 6: Python Backend](#option-6-python-backend)
8. [Configuration](#configuration)

---

## Overview

The form is set up to submit to `/api/signup` endpoint. You can use any of the methods below to handle form submissions.

**Form Data Structure:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "role": "Helper (Donor/Volunteer)",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

---

## Option 1: Form Services (Easiest - No Code)

### Method A: Formspree (Recommended)

**Setup (5 minutes):**

1. Sign up at [Formspree](https://formspree.io) (free tier available)
2. Create a new form
3. Copy your form endpoint URL (looks like: `https://formspree.io/f/YOUR_FORM_ID`)

**Update Frontend:**

Create `.env` file in project root:
```env
VITE_API_ENDPOINT=https://formspree.io/f/YOUR_FORM_ID
```

**Restart dev server:**
```bash
npm run dev
```

**That's it!** Form submissions will be sent to Formspree.

**View Submissions:**
- Go to Formspree dashboard
- See all form submissions
- Get email notifications
- Export data as CSV

**Free Tier:**
- 50 submissions/month
- Email notifications
- Spam protection

---

### Method B: Netlify Forms

**Setup (if deploying to Netlify):**

1. Add `data-netlify="true"` to form tag (already in code)
2. Deploy to Netlify
3. Form submissions appear in Netlify dashboard

**No code changes needed!**

**Free Tier:**
- Unlimited submissions
- Email notifications
- Spam protection
- Form analytics

---

### Method C: Web3Forms

**Setup (3 minutes):**

1. Go to [Web3Forms](https://web3forms.com)
2. Enter your email
3. Copy your access key

**Update Frontend:**

Create `.env` file:
```env
VITE_API_ENDPOINT=https://api.web3forms.com/submit
VITE_WEB3FORMS_KEY=your-access-key-here
```

Update `src/App.tsx` (in handleSubmit function):
```typescript
const response = await fetch(API_ENDPOINT, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    ...submissionData,
    access_key: import.meta.env.VITE_WEB3FORMS_KEY,
    subject: 'New PulseAid Signup',
    from_name: submissionData.fullName,
  }),
});
```

**Free Tier:**
- 250 submissions/month
- Email notifications
- No spam

---

## Option 2: Google Sheets

**Setup (10 minutes):**

### Step 1: Create Google Sheet

1. Create a new Google Sheet
2. Add headers in row 1: `Name` | `Email` | `Role` | `Timestamp`
3. Note your sheet ID from the URL (between `/d/` and `/edit`)

### Step 2: Create Google Apps Script

1. In Google Sheets: **Extensions** → **Apps Script**
2. Delete default code and paste:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // Add row to sheet
    sheet.appendRow([
      data.fullName,
      data.email,
      data.role,
      data.timestamp
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true,
        message: 'Data saved successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Save (Ctrl+S or Cmd+S)
4. Name your script: `PulseAid Form Handler`

### Step 3: Deploy as Web App

1. Click **Deploy** → **New deployment**
2. Click gear icon ⚙️ → **Web app**
3. Set:
   - **Description**: PulseAid Form Handler
   - **Execute as**: Me
   - **Who has access**: Anyone
4. Click **Deploy**
5. **Copy the Web App URL** (looks like: `https://script.google.com/macros/s/...`)

### Step 4: Update Frontend

Create `.env` file:
```env
VITE_API_ENDPOINT=your-google-script-url-here
```

**That's it!** Form submissions will appear in your Google Sheet.

---

## Option 3: Node.js + Express

**Setup (15 minutes):**

### Step 1: Create Backend Folder

```bash
mkdir backend
cd backend
npm init -y
```

### Step 2: Install Dependencies

```bash
npm install express cors dotenv
npm install --save-dev nodemon @types/express @types/cors
```

### Step 3: Create Server File

Create `backend/server.js`:

```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (replace with database for production)
const signups = [];

// Form submission endpoint
app.post('/api/signup', (req, res) => {
  const { fullName, email, role, timestamp } = req.body;
  
  // Validate data
  if (!fullName || !email) {
    return res.status(400).json({ 
      error: 'Name and email are required' 
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      error: 'Invalid email format' 
    });
  }

  // Create signup record
  const signup = {
    id: Date.now().toString(),
    fullName,
    email: email.toLowerCase(),
    role,
    timestamp,
    createdAt: new Date().toISOString()
  };

  // Store signup (in production, save to database)
  signups.push(signup);
  
  console.log('New signup:', signup);
  
  // Optional: Send email notification
  // sendEmailNotification(email, fullName);

  res.status(200).json({ 
    success: true,
    message: 'Signup successful',
    id: signup.id
  });
});

// Get all signups (admin endpoint - protect in production!)
app.get('/api/signups', (req, res) => {
  res.json(signups);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### Step 4: Add Scripts to package.json

Update `backend/package.json`:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### Step 5: Run Backend

```bash
cd backend
npm run dev
```

### Step 6: Update Frontend

Create `.env` in project root:
```env
VITE_API_ENDPOINT=http://localhost:3001/api/signup
```

**Restart frontend dev server:**
```bash
npm run dev
```

### Step 7: Add Database (Optional)

**With MongoDB:**

```bash
npm install mongoose
```

Update `server.js`:
```javascript
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pulseaid');

// Define schema
const signupSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  role: String,
  timestamp: String,
  createdAt: Date
});

const Signup = mongoose.model('Signup', signupSchema);

// Update POST endpoint
app.post('/api/signup', async (req, res) => {
  try {
    const signup = new Signup({
      ...req.body,
      createdAt: new Date()
    });
    await signup.save();
    res.status(200).json({ success: true, message: 'Signup successful' });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});
```

**With PostgreSQL:**

```bash
npm install pg
```

---

## Option 4: Serverless Functions

### Method A: Vercel Serverless Functions

**Setup:**

1. Create `api/signup.js` in project root:

```javascript
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fullName, email, role, timestamp } = req.body;

  // Validate
  if (!fullName || !email) {
    return res.status(400).json({ error: 'Name and email required' });
  }

  // Save to database or send email
  // Example: Save to Airtable, SendGrid, etc.

  console.log('New signup:', { fullName, email, role });

  return res.status(200).json({ 
    success: true,
    message: 'Signup successful'
  });
}
```

2. Deploy to Vercel:
```bash
npm install -g vercel
vercel
```

**Free Tier:**
- 100GB bandwidth/month
- Serverless functions
- Automatic HTTPS

---

### Method B: Netlify Functions

**Setup:**

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Create `netlify/functions/signup.js`:

```javascript
exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const data = JSON.parse(event.body);
  const { fullName, email, role, timestamp } = data;

  // Validate and save
  console.log('New signup:', { fullName, email, role });

  return {
    statusCode: 200,
    body: JSON.stringify({ 
      success: true,
      message: 'Signup successful'
    })
  };
};
```

3. Deploy:
```bash
netlify deploy --prod
```

---

## Option 5: PHP Backend

**Setup (10 minutes):**

### Step 1: Create PHP File

Create `api/signup.php`:

```php
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

// Validate
if (empty($data['fullName']) || empty($data['email'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Name and email required']);
    exit;
}

// Validate email
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email']);
    exit;
}

// Save to file (or database)
$signup = [
    'id' => uniqid(),
    'fullName' => $data['fullName'],
    'email' => strtolower($data['email']),
    'role' => $data['role'],
    'timestamp' => $data['timestamp'],
    'createdAt' => date('Y-m-d H:i:s')
];

// Save to JSON file
$signups = file_exists('signups.json') ? json_decode(file_get_contents('signups.json'), true) : [];
$signups[] = $signup;
file_put_contents('signups.json', json_encode($signups, JSON_PRETTY_PRINT));

// Or save to MySQL
// $pdo = new PDO('mysql:host=localhost;dbname=pulseaid', 'user', 'password');
// $stmt = $pdo->prepare('INSERT INTO signups (full_name, email, role, timestamp) VALUES (?, ?, ?, ?)');
// $stmt->execute([$data['fullName'], $data['email'], $data['role'], $data['timestamp']]);

http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Signup successful',
    'id' => $signup['id']
]);
?>
```

### Step 2: Deploy to PHP Host

Upload to any PHP hosting (Shared hosting, VPS, etc.)

### Step 3: Update Frontend

Create `.env`:
```env
VITE_API_ENDPOINT=https://yourdomain.com/api/signup.php
```

---

## Option 6: Python Backend

**Setup (15 minutes):**

### Step 1: Create Python File

Create `backend/app.py`:

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import json
import os

app = Flask(__name__)
CORS(app)

# File to store signups
SIGNUPS_FILE = 'signups.json'

def load_signups():
    if os.path.exists(SIGNUPS_FILE):
        with open(SIGNUPS_FILE, 'r') as f:
            return json.load(f)
    return []

def save_signup(signup):
    signups = load_signups()
    signups.append(signup)
    with open(SIGNUPS_FILE, 'w') as f:
        json.dump(signups, f, indent=2)

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    
    # Validate
    if not data.get('fullName') or not data.get('email'):
        return jsonify({'error': 'Name and email required'}), 400
    
    # Validate email
    import re
    email_pattern = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
    if not re.match(email_pattern, data['email']):
        return jsonify({'error': 'Invalid email'}), 400
    
    # Create signup
    signup = {
        'id': str(datetime.now().timestamp()),
        'fullName': data['fullName'],
        'email': data['email'].lower(),
        'role': data.get('role', 'Helper'),
        'timestamp': data.get('timestamp'),
        'createdAt': datetime.now().isoformat()
    }
    
    save_signup(signup)
    print(f'New signup: {signup}')
    
    return jsonify({
        'success': True,
        'message': 'Signup successful',
        'id': signup['id']
    }), 200

@app.route('/api/signups', methods=['GET'])
def get_signups():
    return jsonify(load_signups())

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'timestamp': datetime.now().isoformat()})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001, debug=True)
```

### Step 2: Install Dependencies

```bash
cd backend
pip install flask flask-cors
```

### Step 3: Run Server

```bash
python app.py
```

### Step 4: Update Frontend

Create `.env`:
```env
VITE_API_ENDPOINT=http://localhost:3001/api/signup
```

---

## Configuration

### Update API Endpoint

The form uses environment variables to set the API endpoint.

**Option 1: Environment Variable**

Create `.env` in project root:
```env
VITE_API_ENDPOINT=https://your-api-endpoint.com/api/signup
```

**Option 2: Default Endpoint**

If no environment variable is set, the form defaults to `/api/signup`.

**For development with local backend:**
```env
VITE_API_ENDPOINT=http://localhost:3001/api/signup
```

**For production:**
```env
VITE_API_ENDPOINT=https://api.yourdomain.com/api/signup
```

### Restart Development Server

After updating `.env`:
```bash
# Stop server (Ctrl+C)
npm run dev
```

---

## Quick Comparison

| Method | Setup Time | Cost | Difficulty | Best For |
|--------|------------|------|------------|----------|
| **Formspree** | 5 min | Free tier | Easy | Quick setup |
| **Google Sheets** | 10 min | Free | Easy | View data in spreadsheet |
| **Node.js + Express** | 15 min | Free (hosting) | Medium | Custom backend |
| **Serverless (Vercel)** | 10 min | Free tier | Medium | Serverless deployment |
| **PHP** | 10 min | Free (hosting) | Easy | Existing PHP hosting |
| **Python** | 15 min | Free (hosting) | Medium | Python expertise |

---

## Recommended: Start with Formspree

**Easiest and fastest:**

1. Sign up at [Formspree.io](https://formspree.io)
2. Create form → Get endpoint URL
3. Add to `.env`: `VITE_API_ENDPOINT=https://formspree.io/f/YOUR_ID`
4. Done! ✅

---

## Troubleshooting

### Form Not Submitting

1. **Check API endpoint:**
   - Verify `.env` has correct `VITE_API_ENDPOINT`
   - Restart dev server after updating `.env`

2. **Check browser console (F12):**
   - Look for error messages
   - Check Network tab for failed requests

3. **Check CORS:**
   - If using custom backend, ensure CORS is enabled
   - Backend must allow requests from your frontend domain

4. **Check backend:**
   - Verify backend is running
   - Check backend logs for errors

---

## Next Steps

After choosing a method:
1. Follow the setup instructions above
2. Test form submission
3. Verify data is being saved
4. Set up email notifications (optional)

---

**Need Help?** Check browser console (F12) for error messages and refer to specific method's documentation.

