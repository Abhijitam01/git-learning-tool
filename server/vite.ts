import { Express } from 'express';
import { Server } from 'http';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';

export function log(message: string, source = "express") {
  const time = new Date().toLocaleTimeString();
  console.log(`${time} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
    root: path.resolve(process.cwd()),
  });

  app.use(vite.middlewares);

  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;
    
    try {
      // If the request is for API or other non-page routes, skip
      if (url.startsWith('/api')) {
        return next();
      }

      // Read the index.html file
      let template = fs.readFileSync(
        path.resolve(process.cwd(), 'client/index.html'),
        'utf-8'
      );

      // Apply Vite HTML transforms
      template = await vite.transformIndexHtml(url, template);

      // Send the transformed HTML
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e) {
      // If an error is caught, let Vite fix the stack trace
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });

  return server;
}

export function serveStatic(app: Express) {
  const clientOutDir = path.resolve(process.cwd(), 'dist/client');
  
  app.use('/', express.static(clientOutDir));

  app.get('*', (req, res) => {
    // For SPA routing, serve the index.html for all non-file/non-api paths
    if (!req.path.includes('.') && !req.path.startsWith('/api')) {
      res.sendFile(path.join(clientOutDir, 'index.html'));
    } else {
      res.status(404).send('Not found');
    }
  });
}