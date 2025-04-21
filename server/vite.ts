import express, { type Express } from "express";
import fs from "fs";
import path, { dirname } from "path"; // 'dirname' importado aquí si se usa directamente
import { fileURLToPath } from "url";
import { type Server } from "http";
import viteConfig from "../vite.config"; // Asume que viteConfig está en la raíz del proyecto
import { nanoid } from "nanoid";

// --- Definiciones Globales para este Módulo ---
const __filename = fileURLToPath(import.meta.url);
// Usamos path.dirname para asegurar consistencia
const currentDir = path.dirname(__filename); // Directorio actual del archivo vite.ts (dentro de server)
// parentDirOfCompiledCode será 'dist' cuando se ejecute el código compilado (desde dist/index.js -> dist/vite.js)
// Nota: Esto asume que el archivo compilado vite.js estará en la misma carpeta que index.js (dist)
const parentDirOfCompiledCode = path.dirname(__filename);

const viteLogger = createLogger();

// --- Funciones Auxiliares ---
export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}


// --- Servir Archivos Estáticos para Producción ---
export function serveStatic(app: Express) {
  // Construimos la ruta a la carpeta 'public' DENTRO de 'dist'
  // parentDirOfCompiledCode apunta a 'dist'
  const publicFolderPath = path.join(parentDirOfCompiledCode, 'public');

  // Comprobamos si existe el index.html dentro de 'dist/public'
  const indexPath = path.join(publicFolderPath, 'index.html');
  if (!fs.existsSync(indexPath)) {
    throw new Error(
      `Could not find index.html in the public build directory: ${indexPath}. Make sure 'vite build' outputs assets to 'dist/public'.`
    );
  }

  // Sirve archivos estáticos DESDE 'dist/public'
  app.use(express.static(publicFolderPath));

  // Ruta fallback para servir 'dist/public/index.html'
  app.get('*', (_req, res) => {
    res.sendFile(indexPath);
  });
}