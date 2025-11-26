# Advanced Personal Portfolio Website

A modern, high-performance personal portfolio website built with cutting-edge web technologies and best practices.

## 🚀 Features

### Frontend Technologies
- **Modern JavaScript (ES2024)** - Latest ECMAScript features with modules
- **Advanced CSS** - Custom properties, Grid, Flexbox, animations
- **Three.js** - Interactive 3D background animations
- **GSAP** - Professional-grade animations and scroll triggers
- **Service Worker** - Offline functionality and caching strategies
- **Progressive Web App** - Installable with manifest and service worker

### Backend Technologies
- **Node.js & Express.js** - RESTful API server
- **SQLite Database** - Lightweight, serverless database
- **Winston Logging** - Structured logging with multiple transports
- **Rate Limiting** - API protection against abuse
- **Security Headers** - Helmet.js for security best practices
- **Compression** - Gzip compression for better performance

### Development Tools
- **Vite** - Lightning-fast build tool and dev server
- **Vitest** - Modern testing framework
- **ESLint** - Code quality and consistency
- **Prettier** - Code formatting
- **GitHub Actions** - CI/CD pipeline
- **TypeScript Support** - Type safety (optional)

### Performance Features
- **Code Splitting** - Automatic bundle optimization
- **Lazy Loading** - Images and components loaded on demand
- **Caching Strategies** - Multiple levels of caching
- **Performance Monitoring** - Real-time performance tracking
- **Analytics** - Custom analytics with privacy focus
- **SEO Optimization** - Meta tags, structured data, sitemap

## 📁 Project Structure

```
├── server/                 # Backend API server
│   ├── database/          # Database schema and initialization
│   ├── routes/            # API route handlers
│   ├── middleware/        # Custom middleware
│   └── data/             # SQLite database files
├── src/                   # Frontend source code
│   ├── utils/            # Utility functions and API client
│   ├── animations/       # Three.js and GSAP animations
│   └── components/       # Reusable components
├── tests/                # Test files
├── .github/workflows/    # CI/CD configuration
├── dist/                 # Built files (generated)
└── public/              # Static assets
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jabelo-personal-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

   This starts both the frontend (port 3000) and backend (port 3001) servers.

### Available Scripts

```bash
# Development
npm run dev              # Start both frontend and backend in development mode
npm run client:dev       # Start only frontend development server
npm run server:dev       # Start only backend development server

# Building
npm run build           # Build for production
npm run client:build    # Build frontend only
npm run server:build    # Build backend only

# Testing
npm run test            # Run all tests
npm run test:ui         # Run tests with UI
npm run lint            # Run ESLint
npm run format          # Format code with Prettier

# Production
npm start               # Start production server
```

## 🎨 Customization

### Styling
The project uses CSS custom properties for easy theming:

```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --accent-color: #f093fb;
  /* ... more variables */
}
```

### Content
1. **Projects**: Edit `projects.json` or use the API to manage projects
2. **Personal Info**: Update the HTML content in `index.html`
3. **Images**: Add your images to the `images/` directory

### API Configuration
The backend API provides endpoints for:
- `/api/projects` - Project management
- `/api/analytics` - Usage analytics
- `/api/contact` - Contact form submissions
- `/api/health` - Health check

## 📊 Analytics & Monitoring

The website includes built-in analytics that track:
- Page views and user interactions
- Performance metrics (load times, page size)
- Error tracking and debugging
- User engagement patterns

All analytics data is stored locally in SQLite and respects user privacy.

## 🔒 Security Features

- **Content Security Policy** - Prevents XSS attacks
- **Rate Limiting** - Protects against API abuse
- **Input Validation** - Sanitizes all user inputs
- **HTTPS Enforcement** - Secure connections only
- **Security Headers** - Comprehensive security headers

## 🚀 Performance Optimizations

- **Bundle Splitting** - Separate vendor and app bundles
- **Image Optimization** - Lazy loading and responsive images
- **Caching Strategy** - Multi-level caching (browser, service worker, CDN)
- **Compression** - Gzip compression for all assets
- **Critical CSS** - Inline critical styles for faster rendering

## 🧪 Testing

The project includes comprehensive testing:

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test -- --coverage

# Run tests in watch mode
npm run test -- --watch
```

Test coverage includes:
- API endpoint testing
- Frontend component testing
- Integration testing
- Performance testing

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables
Required environment variables for production:
- `NODE_ENV=production`
- `PORT=3001`
- `DATABASE_URL=./server/data/portfolio.db`

### CI/CD Pipeline
The project includes GitHub Actions workflows for:
- Automated testing on pull requests
- Security vulnerability scanning
- Automated deployment to production
- Performance monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Three.js** - 3D graphics library
- **GSAP** - Animation library
- **Express.js** - Web framework
- **Vite** - Build tool
- **Inter Font** - Typography

## 📞 Contact

Jabelo Pitso - jabelopitso630@gmail.com

Project Link: [https://github.com/jabelopitso/portfolio](https://github.com/jabelopitso/portfolio)

---

Built with ❤️ using modern web technologies