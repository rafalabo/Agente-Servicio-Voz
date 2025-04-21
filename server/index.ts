import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "development") { // Usar process.env directamente es más seguro aquí
    // Importa setupVite solo cuando sea necesario
    const { setupVite } = await import("./vite.dev.js"); // Nota la extensión .js (porque se ejecutará después de compilar)
    await setupVite(app, server); // 'server' debe estar disponible aquí
  } else {
    // serveStatic ya no necesita importar 'vite'
    const { serveStatic } = await import("./vite.js"); // Importa desde el vite.ts limpio (compilado a .js)
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = process.env.PORT || 5000; // Usa PORT de Code Engine o 5000 localmente
  // En lugar de usar server.listen (que viene de registerRoutes),
  // usaremos app.listen, que es lo más típico en Express.
  // Si registerRoutes devuelve el servidor solo para HMR de Vite,
  // podemos simplemente usar app.listen para el modo producción.

  app.listen(port, '0.0.0.0', () => { // Escucha en todas las interfaces
    log(`Server listening on port ${port}`); // Mensaje ligeramente diferente para confirmar el cambio
  });

// NOTA: Si la variable 'server' devuelta por registerRoutes era ESENCIAL
// por alguna otra razón, necesitaríamos investigar más. Pero para
// simplemente escuchar, app.listen es lo estándar.
})();
