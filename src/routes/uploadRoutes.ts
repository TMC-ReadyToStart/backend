import express from "express";
import bodyParser from "body-parser";
import AdmZip from "adm-zip";
import path from "path";
import fs from "fs";

export const router = express.Router();

router.use(bodyParser.raw({ type: "application/zip", limit: "1mb" }));

router.post("/", (req, res, next) => {
  if (req.is("application/zip")) {
    try {
      const zip = new AdmZip(req.body);
      const zipEntries = zip.getEntries();

      zipEntries.forEach((entry) => {
        const entryName = entry.entryName;
        const entryData = entry.getData();
        const filePath = path.join(__dirname, "./extracted", entryName);
        if (entry.isDirectory) fs.mkdirSync(filePath, { recursive: true });
        else fs.writeFileSync(filePath, entryData);
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
