import { Cat10 } from "../models/cat10";
import { Cat21 } from "../models/cat21";
import { classify_data, block_slicer } from "./classifier";
import { openFile, openTestFile, saveFileKml } from "./file_picker";
import { Worker } from "node:worker_threads";


let buffer: Buffer | undefined;
let items: Buffer[];
let decodedItems: (Cat10 | Cat21)[];
let itemsDelivered = 0;


export async function test1(){
  let messageq= loadFileIpc();
  decodedItems = await classify_data(items, items.length,0);
  console.log(decodedItems);
  return decodedItems;

}
export async function loadFileIpc() {

  //const res = await openFilePicker();
  const res = await openFile();
  if (!res) return;
  buffer = res;
  items = [];
  decodedItems = [];
  itemsDelivered = 0;

  if (!buffer) {
    console.log("No file opened");
    return;
  }

  items = await block_slicer(buffer);
  let L = items.length > 5000000 ? 300000 : items.length;;
  return L;
}

export async function loadItems(event: any, itemQuantity: number) {
  decodedItems = await classify_data(items, itemQuantity, 0);
  console.log(decodedItems);
  const readyItems = decodedItems.slice(itemsDelivered, itemsDelivered +itemQuantity);
  return await JSON.stringify(readyItems);
  
}

export function sliceItems() {
  const FRAGMENTS = 1000;
  const result = JSON.stringify(decodedItems.slice(itemsDelivered, itemsDelivered + FRAGMENTS));
  itemsDelivered += FRAGMENTS;
  if (itemsDelivered > decodedItems.length) itemsDelivered = 0;
  return result;
}

export async function writeKmlFile() {
  const picker = await saveFileKml();
  if (!picker.filePath) return;
  await runWorkerkml({ messagesLength: decodedItems.length, filePath: picker.filePath });
  console.log(`${picker.filePath} written`);
}


export async function loadItemsSlave(_event: any, _messageQuantity: number) {
  const result = (await runSlave({ items })) as (Cat10 | Cat21)[];

  decodedItems = result;

  return [];
}

function runWorkerkml(workerData: any) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(__dirname + "/kml_worker.js", { workerData });
    let result: any;
    worker.on("message", (val: any) => {
      result = val;
    });
    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0) {
        console.log(new Error("Exit worker with code: " + code));
      } else {
        resolve(result);
      }
    });
    if (decodedItems.length > 300000) {
      worker.postMessage(decodedItems.slice(0, 300000));
      worker.postMessage(decodedItems.slice(300000, decodedItems.length));
    } else {
      worker.postMessage(decodedItems);
    }
  });
}

function runSlave(workerData: any) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(__dirname + "/worker.js", { workerData });
    let result: (Cat10 | Cat21)[] = [];
    worker.on("message", (val: any) => {
      result = result.concat(val);
    });
    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0) {
        console.log(new Error("Exit worker with code: " + code));
      } else {
        resolve(result);
      }
    });
  });
}