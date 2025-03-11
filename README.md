# Capyverse Vibes

A physics-based character controller using Three.js, Rapier, and Vite.

## Features

- A capsule-shaped character that moves with WASD keys
- Physics-based movement using Rapier
- Jumping with the spacebar (only when grounded)
- A simple ground plane
- Camera that follows the character
- Basic collision detection

## Technical Details

- The character is a capsule (1m tall, 0.5m radius)
- Movement speed is 5 units/second
- Jump height reaches about 2-3 meters
- Physics runs at default Rapier settings with gravity (-9.81 m/s²)
- Simple raycasting to detect ground contact for jumping

## Installation

```bash
# Clone the repository
git clone https://github.com/larvuz2/capyverse-vibes.git
cd capyverse-vibes

# Install dependencies
npm install
```

## Development

```bash
# Start the development server
npm run dev
```

## Building for Production

```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

## Controls

- W: Move forward
- A: Move left
- S: Move backward
- D: Move right
- Space: Jump

The character will move smoothly with physics, fall with gravity, and only jump when touching the ground. The camera follows the character automatically. 