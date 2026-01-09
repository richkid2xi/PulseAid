# PulseAid - Connecting Verified Institutions with Donors and Volunteers

A modern, responsive landing page for PulseAid, built with React, TypeScript, and Tailwind CSS.

[PulseAid Landing Page]

## 🌟 Overview

PulseAid connects verified institutions—such as orphanages, hospitals, and care centers—with donors and volunteers. Our mission is to make giving simple, transparent, and impactful, ensuring every act of support reaches the people who need it most.

## ✨ Features

### 🎨 Design & UI
- **Modern, Clean Interface** - Professional design with soft color palette
- **Fully Responsive** - Optimized for mobile, tablet, and desktop devices
- **Smooth Animations** - Hover effects, transitions, and scroll animations
- **Background Images** - Beautiful hero section with gradient overlay
- **Icon Integration** - Lucide React icons throughout

### 📱 Sections

1. **Hero Section**
   - Compelling headline with gradient background
   - Background image with overlay
   - Two primary CTAs: "Support a Cause" and "Register an Institution"
   - Trust banner with verification message

2. **Challenge Section**
   - 3 cards highlighting problems being solved
   - Lack of Visibility, Trust Issues, Unclear Impact
   - Hover animations on cards

3. **About PulseAid**
   - Mission statement and vision
   - 4 core values: Integrity, Transparency, Empathy, Reliability
   - Call-to-action to join waitlist

4. **Meet Our Team**
   - 3 team member profiles
   - Richard Elikem Amenorpe (Founder & CEO)
   - Andy Yaw Nkrumah (Operations Lead)
   - Random (Tech & Design Lead)
   - LinkedIn and email links for each member

5. **Vision & Mission**
   - 4 feature cards showcasing the solution
   - Verified Institutions, Transparent Needs, Visible Impact, Connected Community

6. **How It Works**
   - 3-step process with visual illustrations
   - Clear explanations of the platform workflow

7. **Sign Up Section**
   - Live countdown timer (to February 1, 2026)
   - Early access signup form
   - Form fields: Name, Email, Role (Helper/Institution)
   - Trust badges

8. **Footer**
   - Quick links navigation
   - Contact information
   - Social media links (LinkedIn, Twitter, Facebook, Instagram)
   - Powered by Readdy badge

### ⚡ Functionality

- **Smooth Scroll Navigation** - Click any nav link to smoothly scroll to section
- **Live Countdown Timer** - Real-time countdown to launch date
- **Responsive Mobile Menu** - Hamburger menu with slide-out navigation
- **Backend Integration** - Form submissions to any backend API (see [BACKEND_GUIDE.md](./BACKEND_GUIDE.md))
- **Form Validation** - Client-side validation with error messages
- **Dark Mode** - Toggle between light and dark themes
- **Interactive Elements** - Hover states, focus states, and click animations
- **Scroll Animations** - Elements fade in as you scroll

## 🛠️ Tech Stack

- **React 18** - Modern React with Hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Lightning-fast build tool
- **Lucide React** - Beautiful, consistent icon set

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Backend service account (see BACKEND_GUIDE.md for options)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up Backend (required for form submissions):
   - Follow the [Backend Integration Guide](./BACKEND_GUIDE.md)
   - Choose a backend method (Formspree recommended for quick setup)
   - Create a `.env` file with your API endpoint

3. Run the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## 📂 Project Structure

```
pulseaid/
├── src/
│   ├── App.tsx          # Main application component with all sections
│   ├── main.tsx         # Application entry point
│   └── index.css        # Global styles with Tailwind directives
├── public/              # Static assets
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── tailwind.config.js   # Tailwind configuration with custom colors
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration
```

## 🎨 Customization

### Colors
The primary color palette can be modified in `tailwind.config.js`:
```js
colors: {
  primary: {
    DEFAULT: '#2AA396',  // Main teal color
    50: '#E6F7F5',
    // ... other shades
  }
}
```

### Launch Date
Update the countdown timer target date in `src/App.tsx`:
```typescript
const targetDate = new Date('2026-02-01T00:00:00').getTime();
```

### Team Members
Edit team member details in the "Meet Our Team" section of `src/App.tsx`.

### Content
All content can be updated directly in the component sections in `src/App.tsx`.

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🎯 Key Features Implemented

✅ Hero section with background image and gradient overlay  
✅ Challenge section with 3 problem cards  
✅ About Us section integrated into main page  
✅ Meet the Team section with 3 team members  
✅ Core values showcase  
✅ Vision & Mission with 4 feature cards  
✅ How It Works 3-step process  
✅ Live countdown timer  
✅ Functional signup form  
✅ Footer with all links  
✅ Smooth scroll navigation  
✅ Responsive mobile menu  
✅ Hover animations and transitions  
✅ Fully responsive across all devices  

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📧 Contact

For questions or support:
- Email: richardelikem31@gmail.com
- LinkedIn: [Richard Amenorpe](https://www.linkedin.com/in/richard-elikem-292107309/)

## 📄 License

© 2025 PulseAid. All rights reserved.

---

**Built with ❤️ for making a difference in the world**
