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
      const treeFile = path.join(`./extracted`, "tree.txt");
      const concatFile = path.join(`./extracted`, "concatenated.txt");
      fs.mkdirSync(path.dirname(treeFile), { recursive: true });
      fs.mkdirSync(path.dirname(concatFile), { recursive: true });

      // Create streams for writing tree and concatenated data
      const treeStream = fs.createWriteStream(treeFile);
      const concatStream = fs.createWriteStream(concatFile);

      zipEntries.forEach((entry) => {
        const entryName = entry.entryName;
        const entryData = entry.getData();

        treeStream.write(entryName + "\n");

        if (!entry.isDirectory) {
          concatStream.write("//" + entryName + "\n");
          concatStream.write(entryData + "\n");
        }
      });
      treeStream.end();
      concatStream.end();
      let request = `Entrée:`;
      request += fs.readFileSync("extracted/tree.txt", "utf8");
      request += fs.readFileSync("extracted/concatenated.txt", "utf8");
      console.log("Request:", request);
      testAssistant(request);

      res.send("Successfully extracted zip file");
    } catch (error) {
      console.error("Error extracting zip file:", error);
      res.status(500).send("Error extracting zip file");
    }
  } else {
    res.status(400).send("Content-Type must be application/zip");
  }
});
