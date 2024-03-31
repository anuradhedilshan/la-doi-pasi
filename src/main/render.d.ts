import { CB } from '../engin/Logger';

export {};
export interface electronHandler {
  openPathDialog: () => Promise<any>;
  onEvent: CB | null;
  startAll: (country: string, town: string, filepath: string) => void;
}
declare global {
  interface Window {
    electronHandler: electronHandler;
  }
}
