# Velmoor Website

A modern, responsive, bilingual real estate marketing website built with **Next.js, React, TypeScript, and Tailwind CSS**.

Velmoor is designed to showcase real estate properties and projects while providing a smooth experience for visitors and an administrative interface for managing property listings.

---

## 📌 About the Project

Velmoor is a real estate marketing platform focused on residential, commercial, and investment opportunities in Egypt.

The website provides:

- Modern responsive UI
- Arabic and English localization
- RTL/LTR support
- Light and dark themes
- Property listings and details
- Project galleries
- Image viewing and lightbox support
- Property management dashboard
- Property creation, editing, and deletion
- Image upload and storage
- Contact and inquiry functionality
- SEO configuration
- Smooth animations and interactive components

---

## 🚀 Technologies

- **Next.js 16**
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **JavaScript**
- **HTML5**
- **CSS3**
- **Supabase**

---

## 📚 Libraries & Packages

### Next.js

Used as the main application framework.

Main capabilities used in the project:

- App Router
- Dynamic routes
- Server and Client Components
- API Routes
- SEO metadata
- Image optimization
- Static and dynamic rendering
- Production builds and deployment

### React

Used to build the user interface through reusable and interactive components.

### TypeScript

Used for static typing, improved code reliability, maintainability, and developer experience.

### Tailwind CSS

Used for responsive styling and UI development.

It provides utility classes for:

- Layout
- Spacing
- Typography
- Colors
- Responsive breakpoints
- Dark mode
- Animations
- Transitions

### Framer Motion

Used to create animations and interactive effects, including:

- Section reveal animations
- Scroll animations
- Card animations
- Hover effects
- Navbar animations
- Theme transitions

### Swiper

Used for interactive sliders and carousels, including:

- Hero slider
- Project image sliders
- Navigation controls
- Pagination

### next-intl

Used for internationalization (i18n).

The website supports:

- Arabic
- English
- RTL layout
- LTR layout
- Localized routes
- Translated interface content

### next-themes

Used to implement light and dark themes.

Features include:

- Light mode
- Dark mode
- System theme support
- Theme persistence

### Supabase

Used as the backend platform for application data and file storage.

The project uses Supabase for:

- Property database
- Property management
- Property image storage
- Authentication
- Database queries
- Storage operations

### Lucide React

Used for modern SVG icons throughout the interface.

### React Icons

Used for additional icon sets when required.

### Yet Another React Lightbox

Used to display property and project images in an interactive lightbox.

Users can:

- Open images
- View images in a larger format
- Navigate through galleries
- View images in full-screen mode

### @emailjs/browser

Used for frontend email functionality and sending contact or inquiry messages.

### @headlessui/react

Used for accessible, unstyled UI components that can be customized with Tailwind CSS.

### react-country-flag

Used for displaying country flags in the language selection interface.

### Babel React Compiler

Used as part of the React compilation setup to improve application compilation and rendering performance.

---

## 🌍 Localization

Velmoor supports two languages:

### Arabic 🇪🇬

- RTL direction
- Arabic translations
- Tajawal font

### English 🇬🇧

- LTR direction
- English translations
- Manrope font
- Cormorant Garamond for selected headings and branding

The language can be changed using the website language switcher.

---

## 🔤 Fonts

### Arabic

**Tajawal**

Used throughout the Arabic interface.

### English Body

**Manrope**

Used for English body text and navigation.

### English Headings

**Cormorant Garamond**

Used for selected English headings and branding elements.

Fonts are loaded using Next.js `next/font`.

---

## 🎨 Main Features

- Responsive design
- Arabic / English support
- RTL / LTR support
- Light / Dark mode
- Animated UI
- Hero image slider
- Property listings
- Property details pages
- Project galleries
- Image lightbox
- Property management dashboard
- Add property functionality
- Edit property functionality
- Delete property functionality
- Supabase database integration
- Supabase Storage integration
- Image upload and management
- Contact functionality
- Email integration
- SEO optimization
- Mobile navigation
- Smooth scrolling
- Reusable React components
- Optimized images using Next.js Image

---

## 🏢 Property Management

The website includes a company dashboard for managing property listings.

Authorized users can:

- View properties
- Add new properties
- Edit existing properties
- Delete properties
- Upload property images
- Manage property information
- Manage payment information
- Update property status

Property information can include:

- Property name
- Phone number
- Property type
- Location
- Price
- Area
- Rooms
- Bathrooms
- Floor
- Finishing
- View
- Direction
- Elevator availability
- Garage availability
- Furnished status
- Payment method
- Down payment
- Installment duration
- Installment amount
- Payment frequency
- Additional payments
- Negotiation availability
- Description
- Notes
- Images

---

## 🗂️ Main Website Sections

### Navbar

Provides:

- Website navigation
- Logo
- Language switcher
- Light / Dark mode
- Mobile navigation menu

### Hero

Provides:

- Full-screen imagery
- Slider functionality
- Navigation controls
- Project introduction
- Responsive layout

### About

Provides:

- Company introduction
- Company information
- Company features
- Animated content
- Responsive image and text layout

### Projects

Provides:

- Real estate project cards
- Project images
- Project videos
- Project information
- Image galleries
- Interactive image viewing

### Why Choose Us

Provides:

- Reasons to choose Velmoor
- Feature cards
- Icons
- Scroll animations
- Responsive layouts

### Contact

Provides:

- Company contact information
- Contact form
- Email functionality
- Communication options

### Footer

Provides:

- Company information
- Navigation links
- Contact information
- Social links

---

## ✨ Animations

Animations are implemented using **Framer Motion**.

The website includes:

- Fade-in animations
- Slide-in animations
- Scale animations
- Hover animations
- Scroll-based reveal effects
- Interactive icon animations
- Theme transitions

Animations are designed to improve the user experience while maintaining usability.

---

## 🌓 Dark Mode

Dark mode is implemented using **next-themes**.

Users can switch between:

- Light Mode
- Dark Mode
- System Theme

The selected theme is preserved while navigating through the website.

---

## 🔍 SEO

The project includes SEO configuration using Next.js metadata.

SEO features include:

- Page titles
- Meta descriptions
- Keywords
- Open Graph metadata
- Twitter metadata
- Robots configuration
- Sitemap
- Robots.txt
- Localized metadata
- Arabic and English SEO content

---

## 🖼️ Image Handling

Images are handled using the Next.js `Image` component and Supabase Storage.

The project uses image optimization features such as:

- Responsive images
- Lazy loading
- Automatic image sizing
- Optimized image delivery

Property images are stored in the Supabase Storage `property-images` bucket.

---

## 📧 Email Integration

Email functionality is implemented using **EmailJS**.

It can be used for:

- Contact forms
- Customer inquiries
- Sending messages to the company email

The frontend can communicate with EmailJS without requiring a dedicated custom email server.

---

## 📱 Responsive Design

The website is designed to work across:

- Desktop
- Laptop
- Tablet
- Mobile

Different layouts and interactions are applied based on screen size to provide a consistent user experience across devices.

---

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/mvryvmredv-cyber/velmoor-website.git
```

### 2. Navigate to the project directory

```bash
cd velmoor-website
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

---

## 🏗️ Production Build

To create a production build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

---

## 🔐 Environment Variables

The project requires environment variables for services such as Supabase and EmailJS.

Create a `.env.local` file in the project root and add the required configuration.

Example:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

**Do not commit `.env.local` or secret credentials to GitHub.**

---

## ☁️ Deployment

The application is designed to support production deployment on platforms compatible with Next.js.

The project can be deployed using:

- Vercel
- Hostinger
- Other Next.js-compatible hosting providers

The production application uses Supabase for database and storage services.

---

## 🔗 Repository

GitHub repository:

https://github.com/mvryvmredv-cyber/velmoor-website

---

## 📄 License

This project is developed for the Velmoor real estate marketing platform.
