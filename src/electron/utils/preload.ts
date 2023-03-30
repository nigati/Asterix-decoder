import { contextBridge, ipcRenderer } from "electron";
import { test1 } from "./ipcMain";

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  


  // we can also expose variables, not just functions
})