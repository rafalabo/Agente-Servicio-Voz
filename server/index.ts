import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
// Ya no necesitamos la importación estática comentada aquí:
// import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware de logging (como lo tenías)
// Nota: 'log' solo estará disponible en producción si se importa dinámicamente.
// Si quieres loguear también en desarrollo desde aquí, necesitarías importar 'log'
// de alguna manera o usar console.log directamente.
/*
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
      // Necesitarías tener acceso a la función 'log' aquí si la quieres usar siempre.
      // Por simplicidad, vamos a usar console.log aquí por ahora.
      console.log(`[RequestLog] ${logLine}`);
    }
  });

  next();
});
*/ // Comentado temporalmente para simplificar, puedes descomentar si lo necesitas y ajustas el acceso a 'log'

// Función principal asíncrona autoejecutable
(async () => {
  // Registra las rutas API y obtiene el servidor (útil para HMR en dev)
  const server = await registerRoutes(app);

  // Middleware de manejo de errores (como lo tenías)
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error("Error Caught by Middleware:", status, message, err.stack); // Loguear el error completo
    res.status(status).json({ message });
    // No relanzar el error (throw err;) aquí, ya lo estamos manejando.
  });

  // Lógica condicional para Desarrollo vs Producción
  // Esbuild reemplazará process.env.NODE_ENV con "production" durante el build
  if (process.env.NODE_ENV === "development") {
    console.log("Setting up Vite for development...");
    try {
      // Importa dinámicamente el setup de Vite (desde vite.dev.ts compilado)
      const { setupVite } = await import("./vite.dev.js");
      await setupVite(app, server);
      // Nota: Asumimos que setupVite NO inicia el listen, o si lo hace,
      // debemos asegurarnos de que no haya conflicto.
      // Si setupVite no escucha, necesitarías iniciar el listen aquí para dev:
      /*
      const devPort = 5000; // Puerto para desarrollo local
      app.listen(devPort, '0.0.0.0', () => {
        console.log(`[Development] Server listening on port ${devPort}`);
      });
      */
    } catch (e) {
       console.error("Failed to setup Vite:", e);
       process.exit(1);
    }
  } else {
    // Rama de Producción (NODE_ENV no es "development")
    console.log("Setting up static server for production...");
    try {
      // Importa dinámicamente el serveStatic y log (desde vite.ts compilado)
      const { serveStatic, log } = await import("./vite.js");
      // Configura Express para servir los archivos estáticos
      serveStatic(app);

      // Inicia el servidor escuchando en el puerto asignado por Code Engine o el fallback
      const port = process.env.PORT || 5000;
      app.listen(port, '0.0.0.0', () => {
        log(`Server listening on port ${port}`); // Usa la función 'log' importada
      });
    } catch(e) {
       console.error("Failed to setup static server or listen:", e);
       process.exit(1); // Salir si la configuración de producción falla
    }
  }

  // La SEGUNDA llamada a app.listen ha sido ELIMINADA.

})(); // Fin de la función async autoejecutable