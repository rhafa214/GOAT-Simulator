import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// Initialize AI services
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;
  
  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", backend: "Modular Express Architecture" });
  });

  // Generate route (can use Gemini)
  app.post("/api/generate", async (req, res) => {
    try {
      const { prompt, systemInstruction, schema } = req.body;
      
      let config: any = {
        systemInstruction,
        temperature: 0.8
      };
      
      if (schema) {
         config.responseMimeType = "application/json";
      }
      
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config
      });
      
      res.json({ text: response.text });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to generate content" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
