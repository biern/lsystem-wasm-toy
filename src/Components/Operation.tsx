import * as R from 'ramda';
import * as React from 'react';

import * as lsystem from '../lsystem/core';


export type OperationProps =
  lsystem.Operation
  & { onChange: (p: lsystem.Operation) => any };


const operationKinds: Array<lsystem.Operation['kind']> =
  ['forward', 'rotate', 'state-push', 'state-pop'];


const defaultOperations: {
  [k in lsystem.Operation['kind']]: lsystem.Operation
} = {
  forward: { kind: 'forward', label: 'A', value: 100 },
  rotate: { kind: 'forward', label: 'A', value: 45 },
  "state-pop": { kind: 'state-pop', label: 'A' },
  "state-push": { kind: 'state-push', label: 'A' },
};



export default function Operation(props: OperationProps) {
  const renderOperationControls = () => {
    if (props.kind === 'forward' || props.kind === 'rotate') {
      return (<input
        type="number"
        value={props.value}
        onChange={(e) => {
          const value = parseFloat(e.target.value);

          props.onChange({ ...props, value });
        }}
      />);
    } else {
      return;
    }
  };

  const onKindChange = (ev: React.ChangeEvent<HTMLSelectElement>) => {
    const kind = ev.target.value as lsystem.Operation['kind'];
    const op = defaultOperations[kind];
    props.onChange({ ...op, label: props.label });
  }

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
      <select
          value={props.kind}
          onChange={onKindChange}
      >
        {operationKinds.map((k) => (<option value={k}>{k}</option>))}
      </select>
      {renderOperationControls()}
    </span>
  );
}
