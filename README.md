# CORE - Crude Oil Risk Engine

CORE (Crude Oil Risk Engine) is a comprehensive, confidential Oil & Energy Intelligence Dashboard. It provides advanced analytics, market overviews, and risk assessment tools for global energy markets, tailored for commodity structure overview and intelligence.

## Features

- **Master Dashboard**: High-level overview of the energy markets.
- **Market Overviews**: Track WTI, Brent, Heating Oil, DXY, OVX, and crack spreads.
- **Advanced Analytics Modules**:
  - Futures Analytics
  - Inventory Analytics
  - Crack Spread Analytics
  - CFTC Analytics
  - Macro Analytics
  - Shipping Analytics
  - Quant Analytics
  - Correlation Analytics
- **Risk Management**: Dedicated modules for general Risk and Portfolio Risk.
- **Market Intelligence**:
  - Geopolitical Risk monitoring
  - News Intelligence
  - Market Summary & Movers
- **Secure Access**: Protected entry with an access password.

## Tech Stack

- **Framework**: [React](https://react.dev/) + [Vite](https://vite.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Data Fetching**: [TanStack React Query](https://tanstack.com/query/latest)
- **Charting**: [Recharts](https://recharts.org/)

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/abhinn05/CORE-dashboard
   cd core-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory and add the required variables.
   ```env
   VITE_ACCESS_PASSWORD=your_secure_password
   ```
   *(If not provided, the default password is `Abhinn14`)*

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to the local URL provided by Vite (usually `http://localhost:5173`).

## Build for Production

To create a production build, run:
```bash
npm run build
# or
yarn build
```

The built files will be located in the `dist` directory, ready to be deployed.
