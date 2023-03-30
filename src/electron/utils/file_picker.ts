import { dialog } from "electron";
import {readFile} from 'fs/promises';

import { join } from "path";

export async function openFilePicker() {
  console.log("File picker activated");

  const res = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ name: "Binary", extensions: ["ast"] }],
  });

  if (res.filePaths === undefined) {
    console.log("No file selected");
    return;
  }
  const buffer = await readFile(res.filePaths[0]);

  return buffer;
}

export async function openTestFile() {
  const buffer = await readFile(join(__dirname.replace("build", "src/electron"), "201002-lebl-080001_adsb.ast"));
  return buffer;
}


export async function readFile1(path : string) {
  const buffer = await readFile(path);
  return buffer;
}

export async function saveFileCsv() {
  const res = await dialog.showSaveDialog({ filters: [{ name: "CSV", extensions: ["csv"] }] });
  return res;
}

export async function saveFileKml() {
  const res = await dialog.showSaveDialog({ filters: [{ name: "KML", extensions: ["kml"] }] });
  return res;
}