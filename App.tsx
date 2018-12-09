import * as React from 'react';
import { useState } from 'react';

import uuid from 'uuid/v4';
import * as R from 'ramda';

import * as lsystem from './lsystem';
import Formula from './Components/Formula';


type Entry =
  { id: string } & (
    | ({ kind: 'formula', value: lsystem.Formula })
    | ({ kind: 'operation', value: lsystem.Operation })
  );


type State = {
  entries: Entry[];
  lastLabel: string;
};


const updateEntry = <E extends Entry['value']>(
  id: string,
  entry: E,
) => (state: State): State => {
  const index = R.findIndex((e) => e.id === id, state.entries);

  if (index === -1) {
    return state;
  }

  return R.set(R.lensPath(['entries', index, 'value']), entry, state);
}


const updateLastLabel = (state: State): State => {
  const used = state.entries.map(({ value: { label } }) => label);

  const last = R.sortBy((i) => -i.charCodeAt(0), used)[0];

  return {
    ...state,
    lastLabel: last ? String.fromCharCode(last.charCodeAt(0) + 1) : 'A',
  };
};


const addFormula = (state: State): State => ({
  ...state,
  entries: [
    ...state.entries, {
      kind: 'formula', id: uuid(), value: {
        label: state.lastLabel,
        value: [],
      }
    },
  ],
});


export default function App() {
  const [state, setState] = useState<State>({
    entries: [
      { kind: 'formula', id: uuid(), value: { label: 'A', value: ['A', 'B']} }
    ],
    lastLabel: 'B',
  });

  const entries = state.entries.map(
    (e) =>
      e.kind === 'formula'
      ? Formula({
        ...e.value,
        onChange: (f) => R.pipe(
          updateEntry(e.id, f),
          updateLastLabel,
          setState,
        )(state)
      })
      : <div />
  );

  return (
    <div>
      {entries}
      <button onClick={
        () => R.pipe(
          addFormula,
          updateLastLabel,
          setState,
        )(state)
      }>
        Add formula
      </button>
    </div>
  );
}
