import express from "express";
import bodyParser from "body-parser";
import AdmZip from "adm-zip";
import e from "express";

export const router = express.Router();

router.use(bodyParser.raw({ type: "application/zip", limit: "1mb" })); // Content-Type must be set to application/zip

router.post("/", (req, res, next) => {
  if (req.is("application/zip")) {
    try {
      const zip = new AdmZip(req.body);
      const zipEntries = zip.getEntries();

      zipEntries.forEach((entry) => {
        zip.extractEntryTo(entry.entryName, "./uploads", false, true);
        // Do something with the entry data (entry.getData())
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
