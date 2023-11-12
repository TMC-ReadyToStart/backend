import express from "express";
import bodyParser from "body-parser";
import AdmZip from "adm-zip";
import path from "path";
import fs from "fs";
import { clear, get_infos, testAssistant } from "../services/bardai";
import { add_mooc_exercise, create_mooc_entry } from "../services/db";
import MoocSchemaSCH from "../models/schema/model.schema";

export const router = express.Router();

router.use(bodyParser.raw({ type: "application/zip", limit: "1mb" }));

router.post("/", async (req, res, next) => {
  if (req.is("application/zip")) {
    try {
      const zip = new AdmZip(req.body);
      const zipEntries = zip.getEntries();
      const zipName = zipEntries[0].entryName.split("/")[0];
      const uploadedPath = path.join(`uploaded/${zipName}`);
      console.log("zipName", zipName);
      let file_tree = "";

      if (!fs.existsSync(uploadedPath)) {
        fs.mkdirSync(uploadedPath, { recursive: true });
      }

      zipEntries.forEach(async (entry) => {
        const entryData = entry.getData();
        file_tree += entry.entryName + "\n";
        if (entry.isDirectory) {
          fs.mkdirSync(`uploaded/${entry.entryName}`, { recursive: true });
        }

        if (!entry.isDirectory) {
          {
            console.log(entry.entryName);
            fs.writeFileSync(
              `uploaded/${entry.entryName}`,
              entryData.toString(),
              { flag: "a" }
            );
          }
        }
      });

      let description = await get_infos(file_tree);
      let json = JSON.parse(description!);
      create_mooc_entry(zipName, json["language"], json["description"]);
      clear();

      res.send(`Successfully extracted ${zipName} file`);
    } catch (error) {
      console.error("Error extracting zip file:", error);
      res.status(500).send(`Error extracting zip file`);
    }
  } else {
    res.status(400).send("Content-Type must be application/zip");
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    let level = req.query.level as string;
    if (!level) {
      level = "2";
    }
    const id_number = parseInt(req.params.id);
    const mooc = await MoocSchemaSCH.findOne({ id: id_number });

    if (!mooc) return res.status(404).send("Mooc not found");
    mooc.is_loading = true;
    await mooc.save();

    const directory = mooc.title;
    const questionPath = path.join(`questions/${directory}`);

    if (!fs.existsSync(questionPath)) {
      fs.mkdirSync(questionPath, { recursive: true });
    }

    //list all the entry of the directory "uploaded/request.params.directory"
    const response = [];
    const uploadedPath = path.join(`uploaded/${directory}`);
    for (const file of fs.readdirSync(uploadedPath)) {
      for (let i = 0; i < 1; i++) {
        const res = await testAssistant(
          fs.readFileSync(path.join(uploadedPath, file), "utf8"),
          parseInt(level)
        );
        console.log(res);
        response.push(res);
        fs.writeFileSync(path.join(questionPath, file), res!, { flag: "a" });
        const json = JSON.parse(res!);
        add_mooc_exercise(
          directory,
          file,
          json["description"],
          json["questions"]
        );
        console.log(json);
      }
    }
    mooc.is_loading = false;
    await mooc.save();
    clear();

    res.send(response);
  } catch (error) {
    const mooc = await MoocSchemaSCH.findOne({ id: req.params.id });
    if (mooc) {
      mooc.is_loading = false;
      await mooc.save();
    }
    res.status(500).send(error);
  }
});
