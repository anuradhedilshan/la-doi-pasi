/* eslint-disable default-case */
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Select from './componets/Select';
import { Country } from '../Global';
import LoggerView from './componets/loggerView';
import './App.css';

function padTo2Digits(num: number) {
  return num.toString().padStart(2, '0');
}
function formatDate(date: Date) {
  return `${[
    date.getFullYear(),
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDate()),
  ].join('-')} ${[
    padTo2Digits(date.getHours()),
    padTo2Digits(date.getMinutes()),
    padTo2Digits(date.getSeconds()),
  ].join(':')}`;
}
function parseLog(
  type: 'error' | 'warn' | 'details',
  message: string | number,
) {
  return `   <span class='${type} log'><span align="left" style="color:grey">${formatDate(
    new Date(),
  )} : </span> ${message}</span> <br />`;
}

export default function App() {
  const [path, SetPath] = useState('');
  const [logger, setLogger] = useState('');
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(true);
  const [country, setCountry] = useState('*');

  useEffect(() => {
    window.electronHandler.onEvent = (
      Type: 'progress' | 'count' | 'complete' | 'error' | 'details' | 'warn',
      message: number | boolean | string | null,
    ) => {
      switch (Type) {
        case 'count':
          break;
        case 'progress':
          // console.log('Progress++++++++++++++++++++++++', message);
          if ((message as number) === 200) {
            setProgress(100);
            setDone(true);
          } else {
            setProgress(message as number);
          }
          break;
        case 'complete':
          setDone(true);
          setProgress(0);
          break;
        case 'error':
        case 'warn':
        case 'details':
          setLogger(logger + parseLog(Type, message as string));
          break;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, done, logger]);
  return (
    <div className="app p-3">
      <section className="d-flex flex-column  align-items-center ">
        <Select
          onChange={(e) => {
            setCountry(e.target.value);
          }}
          value={country}
          values={Country}
          label="Country (*)"
        />
        {/* <Select disabled values={Country} label="town" /> */}
        <InputGroup className="p-2 m-3">
          <Form.Control
            size="sm"
            placeholder="FilePath"
            aria-label="File Path"
            aria-describedby="basic-addon2"
            value={path}
          />
          <Button
            variant="outline-secondary"
            id="button-addon2"
            onClick={async () => {
              const e = await window.electronHandler.openPathDialog();
              SetPath(e[0]);
            }}
          >
            SetFilePath
          </Button>
        </InputGroup>
      </section>
      <section>
        <ProgressBar className="my-3" animated now={progress} />
        <LoggerView logger_Data={logger} />
      </section>
      <section className="d-flex  mt-3 align-items-center ">
        {/* <Button variant="danger ml-3">Stop</Button> */}
        <Button
          variant="primary ml-3"
          className="px-3"
          disabled={!done}
          onClick={async () => {
            if (path !== '') {
              window.electronHandler.startAll(country, '', path);
            } else {
              const e = await window.electronHandler.openPathDialog();
              SetPath(e[0]);
            }
          }}
        >
          Start
        </Button>
      </section>
    </div>
  );
}
