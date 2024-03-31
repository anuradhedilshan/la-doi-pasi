/* eslint-disable camelcase */
/* eslint-disable react/no-danger */
import { useState } from 'react';
import { Card } from 'react-bootstrap';

function LoggerView({ logger_Data }: { logger_Data: string }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [expand, setExpand] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <div>
        <Card
          style={{
            padding: '1.25rem',
            border: '1px solid black',
            marginTop: '1.25rem',
            position: 'relative',
            display: 'block',
            minHeight: expand ? '500px' : '300px',
            maxHeight: '200px',
            overflowY: 'auto',
            backgroundColor: '#1f2937',
            fontSize: '13px',
            textAlign: 'left',
          }}
        >
          <Card.Body
            className="console-content"
            style={{
              lineHeight: '1.5',
              fontSize: '12px',
              fontFamily: 'Courier New, monospace',
              overflowWrap: 'anywhere',
              wordBreak: 'break-all',
            }}
          >
            <div
              dangerouslySetInnerHTML={{
                __html: logger_Data === '' ? 'no log here' : logger_Data,
              }}
            />
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default LoggerView;
