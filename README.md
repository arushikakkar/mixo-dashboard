# Mixo Ads Campaign Monitoring Dashboard

A functional campaign monitoring dashboard built for Mixo Ads to track and visualize advertising campaign performance across multiple platforms.

## Features

### Overview Dashboard
- **Real-time Insights**: Comprehensive overview statistics with all campaign metrics
- **Performance Metrics**:
  - Total campaigns (active, paused, completed breakdown)
  - Total spend and average CPC
  - Total impressions and clicks
  - Average CTR and conversion rates
  - Total conversions with conversion rate tracking

### Campaign Management
- **Grid View**: Visual card-based layout with expandable campaign details
- **List View**: Traditional table view for quick scanning
- **Campaign Cards**: Each card displays:
  - Campaign name, brand, and status
  - Platform badges (Meta, Google, LinkedIn, etc.)
  - Budget and daily budget
  - Real-time performance metrics (impressions, clicks, conversions, spend)
  - Expandable section showing CTR, CPC, and conversion rate
  - Creation date

### Campaign Details Modal
- **Detailed View**: Click any campaign to see comprehensive insights
- **Performance Breakdown**:
  - Visual metrics cards for impressions, clicks, conversions, and spend
  - CTR, CPC, and conversion rate analytics
  - Real-time timestamp of last update
  - Full campaign information

### Real-time Streaming (Beta)
- **Live Insights Stream**: Real-time data streaming capability for active campaigns
- **Event Stream Support**: Server-Sent Events (SSE) integration ready

### User Experience
- **Responsive Design**: Fully responsive on desktop, tablet, and mobile devices
- **Interactive Elements**: Hover states, expandable sections, and modal overlays
- **Color-Coded Status**: Visual indicators for campaign status (active/paused/completed)
- **Loading States**: Smooth loading indicators for async data

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment Ready**: Optimized for Vercel deployment

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mixo-campaign-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - The API base URL is already configured: `https://mixo-fe-backend-task.vercel.app`

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
mixo-campaign-dashboard/
├── app/
│   ├── page.tsx              # Main dashboard page
│   ├── layout.tsx            # Root layout
│   ├── loading.tsx           # Loading state component
│   └── error.tsx             # Error boundary component
├── components/
│   ├── OverviewStats.tsx     # Dashboard overview statistics
│   ├── CampaignsGrid.tsx     # Campaign grid/list view with toggle
│   ├── CampaignCard.tsx      # Individual campaign card with insights
│   ├── CampaignModal.tsx     # Detailed campaign view modal
│   └── StreamingInsights.tsx # Real-time streaming component (beta)
├── lib/
│   └── api.ts                # API integration utilities
├── types/
│   └── campaign.ts           # TypeScript type definitions
├── .env.local                # Environment variables (not committed)
├── .env.example              # Example environment variables
└── README.md
```

## API Integration

The dashboard connects to the Mixo Ads backend API with the following endpoints:

- **Base URL**: `https://mixo-fe-backend-task.vercel.app`

### Implemented Endpoints

1. **GET `/campaigns`**
   - Returns list of all campaigns with basic details
   - Used for: Campaign list and overview

2. **GET `/campaigns/{campaignId}`**
   - Returns detailed information for a specific campaign
   - Used for: Campaign detail modal

3. **GET `/campaigns/insights`**
   - Returns overall insights across all campaigns
   - Metrics: total campaigns, impressions, clicks, conversions, spend, CTR, CPC, conversion rate
   - Used for: Dashboard overview statistics

4. **GET `/campaigns/{campaignId}/insights`**
   - Returns performance insights for a specific campaign
   - Metrics: impressions, clicks, conversions, spend, CTR, CPC, conversion rate
   - Used for: Campaign cards and detail view

5. **GET `/campaigns/{campaignId}/insights/stream`**
   - Server-Sent Events (SSE) endpoint for real-time insights
   - Used for: Streaming insights component (beta)

## Design Decisions

1. **Server-Side Rendering**: Uses Next.js server components for initial data load - optimal performance and SEO
2. **Client-Side Interactivity**: Client components for dynamic features (modals, view toggling, streaming)
3. **Type Safety**: Full TypeScript implementation with comprehensive type definitions for all API responses
4. **Minimal Dependencies**: Leverages Next.js and Tailwind CSS without additional heavy libraries
5. **Production-Ready**: Clean, maintainable code ready for real-world use
6. **Component Architecture**: Reusable, modular components following React best practices
7. **Async Data Loading**: Parallel API calls with Promise.all for optimal loading times
8. **Error Handling**: Comprehensive error handling with user-friendly error messages
9. **Responsive Design**: Mobile-first approach with responsive grid layouts

## Component Architecture

### Server Components
- [page.tsx](app/page.tsx) - Main dashboard, fetches initial data
- [OverviewStats.tsx](components/OverviewStats.tsx) - Displays aggregated metrics

### Client Components
- [CampaignsGrid.tsx](components/CampaignsGrid.tsx) - Manages view mode and campaign selection
- [CampaignCard.tsx](components/CampaignCard.tsx) - Fetches and displays individual campaign insights
- [CampaignModal.tsx](components/CampaignModal.tsx) - Detailed campaign view with full metrics
- [StreamingInsights.tsx](components/StreamingInsights.tsx) - Real-time data streaming

## Usage Examples

### Viewing Campaign Details
1. Navigate to the dashboard
2. Click on any campaign card (Grid View) or "View Details" button (List View)
3. Modal opens with comprehensive campaign insights
4. View real-time metrics including CTR, CPC, and conversion rates

### Switching Views
- Click "Grid View" for visual card layout
- Click "List View" for traditional table format

### Expanding Card Details
- In Grid View, click "Show More Details" on any campaign card
- View additional metrics like CTR, CPC, and conversion rate inline

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## License

MIT
