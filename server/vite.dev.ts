import { createServer as createViteServer, createLogger } from "vite";
import express, { type Express } from "express";
import fs from "fs";
import path, { dirname } from "path"; // 'dirname' importado aquí si se usa directamente
import { fileURLToPath } from "url";
import { type Server } from "http";
import viteConfig from "../vite.config"; // Asume que viteConfig está en la raíz del proyecto
import { nanoid } from "nanoid";
// --- Configuración de Vite para Desarrollo ---
export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      // Ruta al index.html original en la carpeta 'client'
      // path.resolve(currentDir, "..", "client", "index.html") -> server/../client/index.html
      const clientTemplatePath = path.resolve(
        currentDir, // Directorio del archivo vite.ts (en server)
        "..",       // Sube un nivel (a la raíz del proyecto)
        "client",   // Entra a la carpeta client
        "index.html"
      );

      let template = await fs.promises.readFile(clientTemplatePath, "utf-8");
      // Añade un query param para evitar caché HMR?
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}
