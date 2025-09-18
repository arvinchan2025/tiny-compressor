# TinyCompressor

A modern, fast, and secure image compression tool built with Next.js and TypeScript.

## Features

- 🚀 **Lightning Fast**: Compress images in seconds with optimized algorithms
- 🔒 **100% Secure**: Images are processed locally and never stored on servers
- ⭐ **High Quality**: Maintain image quality while reducing file size significantly
- 🎁 **Completely Free**: No registration required, no hidden costs, no limits
- 🌍 **Internationalization**: Support for multiple languages (currently English)
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- 🎨 **Modern UI**: Beautiful, clean interface with smooth animations

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Image Compression**: browser-image-compression
- **File Upload**: react-dropzone
- **Internationalization**: next-intl
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/tinycompressor.git
cd tinycompressor
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with one click

The project is already configured for Vercel deployment with the included `vercel.json` file.

### Other Platforms

The project can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Render

## Usage

1. **Upload Images**: Drag and drop your images or click to browse
2. **Adjust Settings**: Configure quality, dimensions, and output format
3. **Compress**: Click the compress button to process your images
4. **Download**: Download individual files or all compressed images at once

## Supported Formats

- **Input**: JPEG, PNG, WebP, GIF, BMP
- **Output**: JPEG, PNG, WebP
- **Max File Size**: 10MB per image

## Configuration

### Compression Settings

- **Quality**: 10% - 100% (adjustable slider)
- **Max Width**: 100px - 4000px
- **Max Height**: 100px - 4000px
- **Output Format**: JPEG, PNG, or WebP

### Internationalization

To add support for additional languages:

1. Create a new JSON file in `messages/` (e.g., `messages/es.json`)
2. Add the locale to the `locales` array in `middleware.ts`
3. Update the `i18n.ts` configuration

## Performance

- Client-side processing ensures fast compression
- Web Workers for non-blocking compression
- Optimized algorithms for maximum efficiency
- Lazy loading and code splitting for faster initial load

## Security

- All processing happens in the browser
- No images are uploaded to external servers
- No data is stored or logged
- Complete privacy protection

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

## Acknowledgments

- [browser-image-compression](https://github.com/Donaldcwl/browser-image-compression) for the compression library
- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) for smooth animations

