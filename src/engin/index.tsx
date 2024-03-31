/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios, {
  AxiosError,
  AxiosResponse,
  RawAxiosRequestHeaders,
} from 'axios';
import axiosRetry from 'axios-retry';
import { Country } from '../Global';
import Logger, { CB } from './Logger';
import JSONWriter from './JSONWriter';

const URL = 'https://www.la-doi-pasi.ro/stores/list_stores';
const headers: RawAxiosRequestHeaders = {
  accept: 'application/json, text/javascript, */*; q=0.01',
  'accept-language': 'en-US,en;q=0.9,si;q=0.8',
  'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
  dnt: '1',
  origin: 'https://www.la-doi-pasi.ro',
  referer: 'https://www.la-doi-pasi.ro/retea-magazine-ladoipasi.html',
  'sec-ch-ua':
    '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Linux"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'same-origin',
  'user-agent':
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
  'x-requested-with': 'XMLHttpRequest',
};

let logger: Logger | null = null;

// eslint-disable-next-line import/prefer-default-export
export function setLoggerCallback(cb: CB): Logger {
  logger = new Logger(cb);
  return logger;
}

axiosRetry(axios, {
  retries: 3,
  retryCondition(error: AxiosError): boolean {
    if (error.response?.status === 400) {
      logger?.warn('Invalid Filter Options');
      return false;
    }
    return true;
  },
  retryDelay(retryCount, error) {
    logger?.warn(`Requets Retry : ${retryCount} Times `);
    return retryCount * 5000;
  },
});

interface StoreData {
  countyName: string;
  id: string | number;
  latitude: number;
  longitude: number;
  link: string;
  name: string;
  photo: string;
  town: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function start(
  contry: string[],
  _town: string,
  onEvent: CB,
  path: string,
) {
  const JsonWriter = new JSONWriter(
    path,
    `${contry.length === 1 ? contry[0] : 'allovercountry'}.json`,
    logger,
  );
  let count = 0;
  for (const i of contry) {
    logger?.log(`getiing ${i}`);
    count += 1;
    const data = new FormData();
    data.append('county', i);
    data.append('city', 'city');

    // eslint-disable-next-line no-await-in-loop
    try {
      let d: AxiosResponse | any = await axios.post(URL, data, {
        maxBodyLength: Infinity,
        headers,
      });

      d = d.data;
      logger?.log(`got ${d}`);

      JsonWriter.appendData(d.pins);
    } catch (e: any) {
      logger?.error(`Errro @ post ${e}`);
      onEvent('error', e);
      onEvent('complete', e);
      return;
    }
    onEvent('progress', Math.round((count / contry.length) * 100));
  }
  logger?.log('wait...... 10s');
  logger?.log('wait...... 10s');
  setTimeout(() => {
    onEvent('progress', 200);
    onEvent('complete', 'done');
    logger?.log('DOne.......');
    logger?.log(`file Saved in ${path}`);
    JsonWriter.close();
  }, 10000);
}
