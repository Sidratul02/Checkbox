import http from 'node:http';
import path from 'node:path';

import express from 'express';
import { Server } from 'socket.io';

import { publisher, subscriber, redis } from './redis-connection.js';

const CHECKBOX_SIZE = 1000000;
const CHECKBOX_STATE_KEY = 'checkbox-state';

const rateLimitingHashMap = new Map();


async function main() {
  const PORT = process.env.PORT ?? 8000;

  const app = express();
  const server = http.createServer(app);

  const io = new Server();
  io.attach(server);

  await subscriber.subscribe('internal-server:checkbox:change');
    subscriber.on('message', (channel, message) => {
    if (channel === 'internal-server:checkbox:change') {
      const { index, checked } = JSON.parse(message);
      io.emit('server:checkbox:change', { index, checked });
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected`, { id: socket.id });
    
    socket.on('client:checkbox:change', async (data) => {
    console.log(`[Socket:${socket.id}] checkbox change`, data); 

    // Check per-checkbox cooldown in Redis
    const cooldownKey = `checkbox-cooldown:${data.index}`;
    const lastOperationTime = await redis.get(cooldownKey);
    
    if (lastOperationTime) {
        const timeElapsed = Date.now() - parseInt(lastOperationTime);

        if (timeElapsed < 5 * 1000) {
          const remainingTime = Math.ceil((5000 - timeElapsed) / 1000);
          socket.emit('server:error',{index: data.index, error:`Checkbox locked! Please wait ${remainingTime} second${remainingTime > 1 ? 's' : ''} before clicking again`});
          return;
        }
      } 
    // Set cooldown for this specific checkbox
    await redis.setex(cooldownKey, 5, Date.now());
      
    const existingState = await redis.get(CHECKBOX_STATE_KEY);

    if (existingState) {
      const remoteData = JSON.parse(existingState);
      remoteData[data.index] = data.checked;

      await redis.set(
        CHECKBOX_STATE_KEY,
        JSON.stringify(remoteData)
      );
    } else {
      const initialState = new Array(CHECKBOX_SIZE).fill(false);

      await redis.set(
        CHECKBOX_STATE_KEY,
        JSON.stringify(initialState)
      );
    }

    await publisher.publish(
      'internal-server:checkbox:change',
      JSON.stringify(data)
    );
    });
  });

  app.use(express.static(path.resolve('./public')));

  app.get('/health', (req, res) => res.json({ healthy: true }));

  app.get('/checkboxes', async (req, res) => {
    const existingState = await redis.get(CHECKBOX_STATE_KEY);

    if (existingState) {
      return res.json({ checkboxes: JSON.parse(existingState) });
    }

    return res.json({ checkboxes: new Array(CHECKBOX_SIZE).fill(false)});
  });

  server.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`);
  });
}

main();