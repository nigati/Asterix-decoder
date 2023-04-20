import { Cat10 } from "../models/cat10";
import { Cat21 } from "../models/cat21";
import { classify_data, block_slicer } from "./classifier";
import { openFile, openTestFile } from "./file_picker";


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