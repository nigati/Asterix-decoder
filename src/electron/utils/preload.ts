import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  send: (channel: string, data: any) => {
    ipcRenderer.send(channel, data);
  },
  sendSync: (channel: string, data: any) => {
    ipcRenderer.sendSync(channel, data);
  },
  sendAndReceive: async (channel: string, data: any) => ipcRenderer.invoke(channel, data),
 
  pushNotification: (callback: any) => ipcRenderer.on("push-notification", callback),
});