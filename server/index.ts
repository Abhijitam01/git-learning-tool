import express, { Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import path from 'path';
import { registerRoutes } from './routes';
import { setupVite, serveStatic, log } from './vite';

async function main() {
  const app = express();
  app.use(express.json());

  const server = createServer(app);

  // Register API routes
  await registerRoutes(app);

  // Set up Vite development server in development mode
  if (process.env.NODE_ENV !== 'production') {
    await setupVite(app, server);
  } else {
    // Serve static files in production mode
    serveStatic(app);
  }

  // Error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  // Start server
  const port = process.env.PORT || 5000;
  server.listen(port, () => {
    log(`serving on port ${port}`);
  });
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});