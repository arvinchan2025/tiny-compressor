# TinyCompressor

A modern, fast, and secure image compression and conversion tool built with Next.js 14 and TypeScript.

## ✨ Features

- 🚀 **Lightning Fast**: Compress images in seconds with optimized algorithms
- 🔒 **100% Secure**: Images are processed locally and never stored on servers
- ⭐ **High Quality**: Maintain image quality while reducing file size significantly
- 🎁 **Completely Free**: No registration required, no hidden costs, no limits
- 🌍 **Multilingual**: Support for 11 languages (EN, ZH, JA, KO, AR, DE, ES, FR, IT, PT, RU)
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- 🎨 **Modern UI**: Beautiful, clean interface with dark mode support
- 🔄 **Format Conversion**: Convert between PNG, JPEG, WebP, AVIF, GIF, BMP formats

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Image Processing**: Squoosh library for compression
- **Video Processing**: FFmpeg.wasm for video compression
- **File Upload**: react-dropzone
- **Internationalization**: Custom translation system
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/tinycompressor.git
cd tinycompressor
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
tinycompressor/
├── app/                    # Next.js App Router pages
├── components/             # React components
│   ├── compressor/        # Image compression components
│   ├── converter/         # Image conversion components
│   ├── ui/               # Reusable UI components
│   └── shared/           # Shared components
├── lib/                   # Utility libraries
│   ├── i18n/             # Internationalization
│   ├── image-processing/ # Image processing utilities
│   └── video-processing/ # Video processing utilities
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
├── public/               # Static assets
└── docs/                 # Documentation
```

## 🌍 Supported Languages

- 🇺🇸 English (EN)
- 🇨🇳 Chinese (ZH)
- 🇯🇵 Japanese (JA)
- 🇰🇷 Korean (KO)
- 🇸🇦 Arabic (AR)
- 🇩🇪 German (DE)
- 🇪🇸 Spanish (ES)
- 🇫🇷 French (FR)
- 🇮🇹 Italian (IT)
- 🇵🇹 Portuguese (PT)
- 🇷🇺 Russian (RU)

## 🎯 Supported Formats

### Image Compression
- PNG, JPEG, WebP, AVIF, GIF, BMP

### Image Conversion
- PNG ↔ JPEG
- PNG ↔ WebP
- PNG ↔ AVIF
- JPEG ↔ WebP
- JPEG ↔ AVIF
- WebP ↔ AVIF

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e

# Run all tests
npm run test:all
```

## 🚀 Deployment

The project is ready for deployment on Vercel:

```bash
# Build for production
npm run build

# Start production server
npm run start
```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.