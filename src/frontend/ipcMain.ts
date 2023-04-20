export async function initIpcMain(event: string) {
    return await window.electron.sendAndReceive(event);
  }
  
  export async function ipcMainBi(event: string, data?: any) {
    return await window.electron.sendAndReceive(event, data);
  }
  
  export function ipcMainOD(event: string) {
    window.electron.send(event);
  }
  export async function parseInitIpcMain(msg: string) {
    console.log(`Loaded ${msg} messages!`);
  }
  
  export async function parseIpcMainReceiveMessage(msg: string) {
    const messages = await JSON.parse(msg);
    return messages;
  }