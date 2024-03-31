/* eslint-disable camelcase */
export type CB = (
  Type: 'progress' | 'count' | 'complete' | 'error' | 'details' | 'warn',
  message: number | boolean | string | null,
) => void;

export default class Logger {
  private Callback!: CB;

  constructor(event_callback: CB) {
    this.Callback = event_callback;
  }

  error(message: number | boolean | string | null) {
    this.Callback('error', message);
  }

  log(message: number | boolean | string | null) {
    this.Callback('details', message);
  }

  warn(message: number | boolean | string | null) {
    this.Callback('warn', message);
  }
}
