import { workerData, parentPort } from "node:worker_threads";
import {classify_data} from "../utils/classifier";

work();

async function work() {
  const FRAGMENTS = 1000;
  let i = 0;
  let L = workerData.items.length > 5000000 ? 300000 : workerData.items.length;

  while (i < L) {
    const decodedMsg = await classify_data(workerData.items.slice(i, i + FRAGMENTS), -1, i);
    parentPort?.postMessage(decodedMsg);
    i += FRAGMENTS;
  }
}