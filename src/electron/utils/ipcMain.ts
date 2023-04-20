import { Cat10 } from "../models/cat10";
import { Cat21 } from "../models/cat21";
import { classify_data, block_slicer } from "./classifier";
import { openFile, openTestFile } from "./file_picker";


let buffer: Buffer | undefined;
let messages: Buffer[];
let decodedMsg: (Cat10 | Cat21)[];
let msgDelivered = 0;


export async function test1(){
  let messageq= loadFileIpc();
  decodedMsg = await classify_data(messages, messages.length,0);
  console.log(decodedMsg);
  return decodedMsg;

}
export async function loadFileIpc() {

  //const res = await openFilePicker();
  const res = await openFile();
  if (!res) return;
  buffer = res;
  messages = [];
  decodedMsg = [];
  msgDelivered = 0;

  if (!buffer) {
    console.log("No file opened");
    return;
  }

  messages = await block_slicer(buffer);
  let L = messages.length > 5000000 ? 300000 : messages.length;;
  return L;
}

export async function loadMessages(event: any, messageQuantity: number) {
  decodedMsg = await classify_data(messages, messageQuantity, 0);
  console.log(decodedMsg);
}