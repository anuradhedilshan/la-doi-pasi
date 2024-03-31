/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/require-default-props */
import Form from 'react-bootstrap/Form';
import React = require('react');

type Props = {
  label: string;
  value: string | ReadonlyArray<string> | number | undefined;
  onChange?: React.ChangeEventHandler<HTMLSelectElement> | undefined;
  values: {
    name: string;
    value: string | number;
  }[];
  disabled?: boolean;
};

function Select({ label, values, disabled = false, value, onChange }: Props) {
  return (
    <Form.Select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="p-2 mt-2"
      aria-label={label}
    >
      <option value="*">{label}</option>
      {values.map((e) => (
        <option key={e.value} value={e.value}>
          {e.value}
        </option>
      ))}
    </Form.Select>
  );
}

export default Select;

// log file goes herec
