# CompareYUV

A modern, Pinterest-style "Before & After" image comparison platform built with Next.js. Transform your photos into stunning visual comparisons with interactive sliders and share your progress with the world.

![CompareYUV](https://img.shields.io/badge/CompareYUV-v1.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![Supabase](https://img.shields.io/badge/Supabase-2.0-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

## ✨ Features

### 🎨 Core Functionality
- **Interactive Image Comparison**: Drag-to-compare sliders for before/after images
- **Pinterest-Style Grid**: Responsive masonry layout for posts
- **User Authentication**: Secure login/signup with Supabase Auth
- **Image Upload**: Drag-and-drop image upload with validation
- **Favorites System**: Star and filter your favorite comparisons
- **Public Sharing**: Share comparisons with unique URLs
- **Search & Filter**: Find posts by caption or filter by favorites

### 🛡️ Security & Performance
- **Rate Limiting**: Production-ready API protection
- **Input Validation**: Comprehensive client/server-side validation
- **Image Optimization**: Automatic image processing and CDN delivery
- **Error Handling**: Robust error boundaries and user feedback
- **Type Safety**: Full TypeScript coverage with strict typing

### 🎯 User Experience
- **Responsive Design**: Mobile-first design that works on all devices
- **Dark/Light Mode**: System preference detection with manual toggle
- **Loading States**: Skeleton loaders and progress indicators
- **Toast Notifications**: User-friendly feedback for all actions
- **Accessibility**: ARIA labels and keyboard navigation support

### 🔧 Developer Experience
- **Centralized Configuration**: All constants and settings in one place
- **Component Architecture**: Modular, reusable components
- **Custom Hooks**: Optimized data fetching and state management
- **Performance Optimized**: React.memo, useCallback, and useMemo usage

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS with custom design system
- **Components**: Radix UI primitives via shadcn/ui
- **Animations**: Framer Motion (ready for implementation)
- **Icons**: Lucide React
- **Image Comparison**: react-compare-slider

### Backend & Database
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL via Supabase
- **File Storage**: Supabase Storage
- **API**: Next.js API Routes with rate limiting
- **Validation**: Custom validation library

### Development Tools
- **Build Tool**: Next.js with Turbopack
- **Linting**: ESLint with strict configuration
- **Type Checking**: TypeScript with strict mode
- **Code Quality**: Prettier for formatting
- **Git Hooks**: Husky (ready for setup)

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js**: Version 18.0 or higher
- **npm**: Version 8.0 or higher (or yarn/pnpm)
- **Supabase Account**: For database and authentication
- **Git**: For version control

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd compare-yuv
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

   # Optional: Debug Mode
   NEXT_PUBLIC_DEBUG_MODE=false

   # Optional: Analytics
   NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id

   # Optional: Error Reporting
   NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
   ```

4. **Set up Supabase**
   - Create a new project in [Supabase](https://supabase.com)
   - Copy your project URL and API keys to the `.env.local` file
   - Run the SQL migrations in your Supabase dashboard to create the database schema

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public Supabase anonymous key | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key for server-side operations | ✅ |
| `NEXT_PUBLIC_DEBUG_MODE` | Enable debug logging (default: false) | ❌ |
| `NEXT_PUBLIC_ANALYTICS_ID` | Analytics tracking ID | ❌ |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry error tracking DSN | ❌ |

## 📖 Usage

### For Users

1. **Sign Up/Login**: Create an account or sign in with existing credentials
2. **Upload Images**: Click the "+" button to upload before/after image pairs
3. **Add Caption**: Optionally add a description for your comparison
4. **Compare**: Use the interactive slider to compare before and after images
5. **Organize**: Favorite posts and use search to find specific comparisons
6. **Share**: Share comparisons publicly with unique URLs

### For Developers

#### Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── api/posts/         # Posts API routes
│   ├── auth/              # Authentication page
│   ├── share/[id]/        # Public share pages
│   ├── layout.tsx         # Root layout with SEO
│   └── page.tsx           # Main application entry
├── components/            # Reusable UI components
│   ├── ui/                # Base UI components (shadcn/ui)
│   ├── ComparisonSlider.tsx
│   ├── PostsGrid.tsx
│   ├── UploadDialog.tsx
│   └── ...
├── hooks/                 # Custom React hooks
│   └── usePosts.ts        # Posts data management
├── lib/                   # Utility libraries
│   ├── constants.ts       # App configuration
│   ├── rateLimit.ts       # Rate limiting logic
│   ├── supabase.ts        # Supabase client setup
│   ├── utils.ts           # General utilities
│   └── validation.ts      # Input validation
├── types.ts               # TypeScript type definitions
└── utils/supabase/        # Supabase utilities
```

#### Key Components

- **PostsGrid**: Displays posts in a responsive masonry grid
- **UploadDialog**: Handles image upload with validation
- **ComparisonSlider**: Interactive before/after slider
- **SizeSelector**: Grid size preference selector
- **SearchBar**: Real-time search functionality

#### API Routes

- `GET /api/posts`: Fetch user's posts
- `POST /api/posts`: Upload new post with images
- `DELETE /api/posts?id=<id>`: Delete a post
- `PATCH /api/posts`: Update post (favorite, share status)

#### Database Schema

The application uses a simple PostgreSQL schema:

```sql
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  before_image_url TEXT NOT NULL,
  after_image_url TEXT NOT NULL,
  caption TEXT,
  is_favorite BOOLEAN DEFAULT false,
  is_shared BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## 🧪 Testing

```bash
# Run tests (when implemented)
npm run test

# Run tests in watch mode
npm run test:watch

# Run linting
npm run lint

# Run type checking
npm run type-check
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect to Vercel**: Push to GitHub and connect to Vercel
2. **Environment Variables**: Add your environment variables in Vercel dashboard
3. **Deploy**: Automatic deployments on push to main branch

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Commit changes: `git commit -m 'Add feature'`
5. Push to branch: `git push origin feature-name`
6. Create a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow ESLint configuration
- Use functional components with hooks
- Prefer custom hooks for complex logic
- Add proper TypeScript types for all props

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js**: For the amazing React framework
- **Supabase**: For the backend-as-a-service platform
- **shadcn/ui**: For the beautiful component library
- **Tailwind CSS**: For the utility-first CSS framework
- **Lucide React**: For the beautiful icons
- **react-compare-slider**: For the image comparison functionality

## 📞 Support

If you have any questions or need help:

- Create an issue on GitHub
- Check the documentation
- Review the code examples

---

**Made with ❤️ for the developer community**

Transform your photos into stunning before-and-after comparisons with CompareYUV! 📸✨
