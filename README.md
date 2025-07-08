# Mini E-Commerce

A simple and modern mini e-commerce application built with Next.js, React, and Zustand for state management.

## Features

- Browse products fetched from an API
- Add products to the shopping cart with quantity management
- Persistent cart state using Zustand with localStorage
- Cart sidebar with real-time updates and smooth animations
- Checkout modal with order form and validation
- Responsive and accessible UI with Tailwind CSS
- Image optimization with Next.js Image component

## Tech Stack

- Next.js (React framework)
- React (Functional components, hooks)
- Zustand (State management)
- Tailwind CSS (Styling)
- Axios (HTTP requests)
- TypeScript (Type safety)
- Lucide Icons (Icon library)

## Folder Structure

```
mini-e-com-console/
├── public/                      # Static assets
│   ├── images/                  # Global images
│   └── favicon.ico
│
├── src/
│   ├── app/                     # App router
│   │   ├── (main)/              # Main layout
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx         # Home page
│   │   ├── products/
│   │   │   └── [id]/
│   │   │       └── page.tsx     # Product detail
│   │   ├── checkout/
│   │   │   ├── page.tsx         # Checkout page
│   │
│   ├── components/
│   │   ├── AddToCartButton.tsx  # Button with cart logic           
│   │   ├── CartHydrate.tsx      # Ensure cart Hydrate
│   │   ├── CartSidebar.tsx      # Side-out cart panel
│   │   ├── CheckoutModel.tsx    # Checkout dialog
│   │   ├── Navbar.tsx           # Navbar component
│   │   └── ProductCard.tsx      # Product card
│   │
│   ├── lib/
│   │   ├── api/
│   │   │   ├── api.ts                 #  API calls
│   │   │   └── productService.ts      # Product API calls
│   │
│   ├── stores/
│   │   ├── cartStore.ts         # Zustand cart store
│
├── next.config.js               # Next.js config
├── tsconfig.json                # TypeScript config
├── tailwind.config.js           # Tailwind config
├── postcss.config.js            # PostCSS config
└── package.json
```

## Deployment

This project is configured for deployment on [Vercel](https://vercel.com). The `vercel.json` file ensures that all routes are rewritten to `index.html` for a single-page application.
The live project is available at: `https://`

To deploy:

1. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy the project:
   ```bash
   vercel
   ```

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- Access to mini-e-com-core backend API
- npm or yarn

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/roysreejan/mini-e-com-console
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env` to `.env.local` and fill in your credentials.

4. **Run the development server:**
   ```sh
   npm run dev
   ```

   The app will run on `http://localhost:3000` by default.

## Environment Variables

See `.env.example` for all required environment variables:

- `NEXT_PUBLIC_BACKEND_API`

## License

ISC

## Author

Sreejan