# FocusInst

**Instagram without the noise. Search, don't scroll.**

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Browser: Chrome/Edge](https://img.shields.io/badge/Browser-Chrome%2FEdge-blue.svg)
![Status: Active](https://img.shields.io/badge/status-active-success.svg)

## Table of Contents

- [Why FocusInst?](#why-focusinst)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Permissions](#permissions)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

FocusInst is a browser extension that transforms your Instagram experience by hiding distracting content like the feed, stories, and suggestions. Instead, it provides a clean, focused interface with direct search functionality and a customizable checklist to keep you on track. Great for productivity or focused browsing.

## Why FocusInst?

Social media is designed to keep you scrolling. FocusInst helps you take back control by removing distractions and letting you use Instagram intentionally.

## Features

- **Feed Hiding**: Automatically hides the main Instagram feed, stories, suggested users, and reels to eliminate distractions.
- **Focus Overlay**: Replaces the feed with a clean home screen featuring:
  - Direct Instagram search bar
  - Quick access links to Messages, Explore, Notifications, and Profile
  - Instagram-inspired gradient design
- **Checklist Panel**: A floating panel for creating and managing focus tasks/checklists.
- **Themes**: Dark and light themes to match your preference.
- **Toggle Control**: Easy on/off toggle via the extension popup.

*Screenshots of the extension in action will be added soon. Contributions welcome!*

## Installation

### Quick Start
1. `git clone https://github.com/AsmaaAlrefae/FOCUSINST.git`
2. Go to `chrome://extensions/` and load the extension.
3. Click the icon.
4. Toggle focus mode.

### Chrome/Edge
1. Download or clone this repository
2. Open Chrome/Edge and go to `chrome://extensions/` (or `edge://extensions/`)
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the `focusinst` folder
5. The extension should now appear in your extensions list

### Firefox
FocusInst is currently optimized for Chromium-based browsers (Chrome, Edge). Firefox support may require additional modifications.

## Usage

1. Navigate to [instagram.com](https://www.instagram.com)
2. Click the FocusInst extension icon in your browser toolbar
3. Toggle the extension on/off using the switch
4. Choose your preferred theme (dark/light)
5. When active:
   - The feed is hidden and replaced with a focus overlay
   - Use the search bar to search Instagram directly
   - Use the quick links to navigate Instagram faster
   - Access the checklist panel (bottom right) to manage your tasks

## Permissions

- **Storage**: Saves your settings and checklist items locally so you don't lose progress
- **Host Permission**: Access to instagram.com pages to inject the focus interface (required for the extension to work on Instagram)

## Development

This extension uses:
- Manifest V3
- Content scripts for DOM manipulation
- Chrome Storage API for persistence
- CSS custom properties for theming

To modify: Edit the files and reload the extension in `chrome://extensions/`.

## Contributing

Feel free to submit issues and pull requests for improvements or bug fixes. Please follow standard GitHub pull request guidelines.

## License

MIT License – see [LICENSE](LICENSE) file for details.  
© 2026 Asmaa Alrefae