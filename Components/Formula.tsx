import * as React from 'react';

import * as lsystem from '../lsystem';


type Props =
  lsystem.Formula
  & { onChange: (p: Props) => any };


export default function Formula(props: Props) {
  return (
    <div>
      <input
        size={1}
        value={props.label}
        onChange={(ev) => props.onChange({
            ...props,
            label: ev.target.value.toUpperCase()[0],
        })}
      />
      =
      <input
        value={props.value.join('')}
        onChange={(ev) => props.onChange({
            ...props,
            value: ev.target.value.toUpperCase().split(''),
        })}
      />
    </div>
  );
}
