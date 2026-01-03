import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post(api.predictions.create.path, async (req, res) => {
    try {
      const input = api.predictions.create.input.parse(req.body);
      
      // Logic: Generate 3-5 random safe spots (Stars)
      // Excluding mines is not really possible since we don't know where the 'real' mines are.
      // We are just simulating a "prediction". 
      // Pick 5 random unique indices from 0-24.
      
      const allSpots = Array.from({ length: 25 }, (_, i) => i);
      // Fisher-Yates shuffle
      for (let i = allSpots.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allSpots[i], allSpots[j]] = [allSpots[j], allSpots[i]];
      }
      
      // Select the number of spots based on user selection
      // But typically "signals" show a few safe spots, not ALL non-mine spots
      // Let's show exactly 5 safe spots if mines < 20, or fewer if mines are high
      const maxPossibleSpots = 25 - input.minesCount;
      const spotsCount = input.minesCount >= 20 ? Math.max(1, maxPossibleSpots) : Math.min(5, maxPossibleSpots);
      
      const predictedSpots = spotsCount > 0 ? allSpots.slice(0, spotsCount) : []; 

      const prediction = await storage.createPrediction({
        minesCount: input.minesCount,
        predictedSpots: predictedSpots
      });
      
      res.status(201).json(prediction);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  return httpServer;
}
