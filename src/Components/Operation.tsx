import * as React from 'react';

import * as lsystem from '../lsystem/core';


export type OperationProps =
  lsystem.Operation
  & { onChange: (p: OperationProps) => any };


const operationKinds: Array<lsystem.Operation['kind']> = ['forward', 'rotate'];


export default function Operation(props: OperationProps) {
  const renderOperationControls = () => (
    <input
      type="number"
      value={props.value}
      onChange={(e) => {
        const value = parseFloat(e.target.value);

        props.onChange({...props, value });
      }}
    />
  );

  return (
    <span
      style={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      <input
        size={1}
        value={props.label}
        onChange={(ev) => props.onChange({
          ...props,
          label: ev.target.value.toUpperCase()[0],
        })}
      />
      =
      <select>
        {operationKinds.map((k) => (<option value={k} selected={props.kind === k}>{k}</option>))}
      </select>
      {renderOperationControls()}
    </span>
  );
}
