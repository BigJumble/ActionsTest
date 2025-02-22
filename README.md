
# Ouroboros Chat

A real-time P2P chat application powered by the Ouroboros server system.

## Overview

Ouroboros Chat is a decentralized chat application that leverages WebRTC and PeerJS for peer-to-peer communication. The app connects to a self-sustaining server network running on GitHub Actions, allowing users to exchange messages in real-time without traditional centralized servers.

## Features

- Real-time P2P messaging
- Persistent message history  
- Automatic reconnection on connection loss
- Responsive design
- Infinite scroll message loading

## Technology Stack

- Frontend: Next.js 15.1
- P2P Communication: PeerJS
- Styling: Tailwind CSS
- Build & Deployment: GitHub Actions

## Getting Started

### Prerequisites

- Node.js v23.x
- npm

### Installation

1. Clone the repository
2. Install dependencies
3. Run development server
4. Build for production

## Architecture

### Communication Layer

The app uses a custom static Communicator class (referenced in src/global/communicator.ts) that handles:

- P2P connection management
- Message sending and receiving
- Server discovery
- Automatic reconnection

### Key Components

#### Message Interface

#### Server Discovery
The app fetches server nodes from a JSON file hosted on GitHub Pages and attempts to connect to the most reliable node.

#### Connection Fallback
If connection to the primary node fails, the system automatically attempts to connect to alternative nodes.

## Deployment

The application is automatically deployed to GitHub Pages using GitHub Actions. The workflow includes:

1. Node.js setup
2. Dependency installation
3. Next.js build
4. Static file deployment

### Configuration

#### Environment Variables
- `ROUTE`: Repository name for GitHub Pages deployment


## Ouroboros Server
For more information about the server infrastructure, visit the Ouroboros Server Repository. https://github.com/BigJumble/Ouroboros

## License

This project is licensed under the MIT License - see the LICENSE file for details.
