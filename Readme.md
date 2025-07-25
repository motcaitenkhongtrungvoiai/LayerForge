layerripper
# PSD Layer Ripper 🎨📁

![GitHub](https://img.shields.io/badge/license-ISC-blue)
![Node.js](https://img.shields.io/badge/node-%3E%3D14.x-green)

A web application that extracts layers from PSD files and exports them as individual PNG/GR files packaged in a ZIP archive.

## Features ✨

- Extract layers from PSD files
- Export layers as PNG or GR format
- Package extracted layers in a ZIP file
- Simple web interface for easy uploads
- Fast processing with worker pools

## Installation 🛠️

1. Clone the repository:
```bash
git clone https://github.com/motcaitenkhongtrungvoiai/LayerForge
cd LayerForge
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your configuration:
```env
PORT=3000
# Add other environment variables as needed
```

## Usage 🚀

Start the application:
```bash
npm start
```

Then access the web interface at `http://localhost:3000` (or your configured port).



## Dependencies 📦

- [archiver](https://www.npmjs.com/package/archiver) - ZIP archive creation
- [psd](https://www.npmjs.com/package/psd) - PSD file parsing
- [express](https://www.npmjs.com/package/express) - Web framework
- [multer](https://www.npmjs.com/package/multer) - File upload handling
- [poolifier](https://www.npmjs.com/package/poolifier) - Worker pool management
- [winston](https://www.npmjs.com/package/winston) - Logging

## Contributing 🤝

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

## License 📜

ISC © 2023