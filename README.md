# ✓ Checkboxes

A modern, interactive playground featuring 1M clickable checkboxes with real-time synchronization across multiple servers using Socket.io and Redis.

<img width="1125" height="603" alt="Screenshot (242)" src="https://github.com/user-attachments/assets/2592e30a-28cf-4971-8943-55a3fb5a5e37" />


## Features

- **1M Checkboxes** - Dynamic grid of interactive checkboxes
- **Live Statistics** - Real-time tracking of checked boxes and progress
- **Real-time Sync** - Multi-server synchronization using Socket.io and Redis
- **Rate Limiting** - 5-second cooldown per checkbox to prevent abuse
- **Persistent State** - Checkbox states stored in Redis
- **Modern UI** - Beautiful gradient backgrounds, animations, and effects
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Real-time Communication**: Socket.io
- **Cache/Database**: Redis
- **Package Manager**: pnpm

## Prerequisites

- Node.js (v18+)
- pnpm (v10+)
- Redis server running

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Checkbox
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Redis connection details
   ```

4. **Start Redis server**
   ```bash
   # Make sure Redis is running
   redis-server
   ```

5. **Run the application**
   ```bash
   node index.js
   ```

6. **Access the app**
   Open your browser and go to: `http://localhost:8000`

## Docker Support

Run with Docker Compose:
```bash
docker-compose up
```

## How It Works

1. **Checkbox Grid** - Checkboxes are loaded from the server on page load
2. **User Interaction** - Clicking a checkbox sends the change via Socket.io
3. **Rate Limiting** - Server enforces 5-second cooldown per checkbox using Redis
4. **Real-time Updates** - All connected clients receive updates instantly
5. **State Persistence** - All checkbox states are stored in Redis

## Project Structure

```
├── index.js                 # Server entry point
├── redis-connection.js      # Redis configuration
├── public/
│   └── index.html          # Frontend UI
├── package.json            # Project dependencies
├── docker-compose.yml      # Docker configuration
└── .gitignore             # Git ignore rules
```

## API Endpoints

- `GET /health` - Health check endpoint
- `GET /checkboxes` - Get all checkbox states
- `POST /socket.io/*` - Socket.io real-time communication

## Socket Events

### Client → Server
- `client:checkbox:change` - User changed a checkbox

### Server → Client
- `server:checkbox:change` - Checkbox changed (by any user)
- `server:error` - Rate limit or error message

## Configuration

### Environment Variables
Create a `.env` file:
```
PORT=8000
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0
```

## Performance

- **Optimistic Updates** - UI updates immediately for better UX
- **Rate Limiting** - Prevents checkbox spamming
- **Efficient Grid** - Auto-fit responsive grid layout
- **Smooth Animations** - CSS transitions and keyframe animations

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

**Redis Connection Error**
- Make sure Redis server is running
- Check Redis host and port in .env

**Port Already in Use**
- Change PORT in .env file
- Or kill process using port 8000

**Checkboxes Not Syncing**
- Check browser console for errors
- Verify Socket.io connection in Network tab


