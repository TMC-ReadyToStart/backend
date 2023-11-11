import express from "express";
import bodyParser from "body-parser";
import AdmZip from "adm-zip";
import path from "path";
import fs from "fs";
import { testAssistant } from "../services/bardai";

export const router = express.Router();

router.use(bodyParser.raw({ type: "application/zip", limit: "1mb" }));

router.post("/", (req, res, next) => {
  if (req.is("application/zip")) {
    try {
      const zip = new AdmZip(req.body);
      const zipEntries = zip.getEntries();
      const zipName = zipEntries[0].entryName.split("/")[0];
      const questionPath = path.join(`questions/${zipName}`);

      if (!fs.existsSync(questionPath)) {
        fs.mkdirSync(questionPath);
      }

      zipEntries.forEach(async (entry) => {
        const entryData = entry.getData();

        if (!entry.isDirectory) {
          fs.writeFileSync(
            questionPath,
            await testAssistant(entryData.toString())
          );
        }
      });

      res.send("Successfully extracted zip file");
    } catch (error) {
      console.error("Error extracting zip file:", error);
      res.status(500).send("Error extracting zip file");
    }
  } else {
    res.status(400).send("Content-Type must be application/zip");
  }
});
