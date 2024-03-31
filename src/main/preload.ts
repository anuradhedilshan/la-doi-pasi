// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { ipcRenderer } from 'electron';

export type Channels = 'ipc-example';

const electronHandler = {
  openPathDialog: async () => {
    const e = await ipcRenderer.invoke('openPathDialog');
    return e.filePaths;
  },
  onEvent: null,
  startAll: (country: string, town: string, filepath: string) => {
    ipcRenderer.send('start', { country, town, filepath });
  },
};

window.electronHandler = electronHandler;

function sendEvent(
  Type: 'progress' | 'count' | 'complete' | 'error' | 'details' | 'warn',
  message: number | boolean | string | null,
) {
  if (window.electronHandler.onEvent)
    window.electronHandler.onEvent(Type, message);
}

ipcRenderer.on('event', (_e, arg) => {
  // console.log('onEvent');

  sendEvent(arg.Type, arg.p);
});
