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


const removeEntry = (
  id: string,
) => (state: State): State => {
  return R.over(R.lensProp('entries'), R.reject((e: Entry) => e.id === id), state);
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


const appState = () => {
  const [state, setState] = useState<State>({
    entries: [
      { kind: 'formula', id: uuid(), value: { label: 'A', value: ['A', 'B']} }
    ],
    lastLabel: 'B',
  });

  return {
    state,
    actions: {
      addFormula: () => R.pipe(
        addFormula,
        updateLastLabel,
        setState,
      )(state),
      updateEntry: (id: string, entry: Entry['value']) => R.pipe(
        updateEntry(id, entry),
        updateLastLabel,
        setState,
      )(state),
      removeEntry: (id: string) => R.pipe(
        removeEntry(id),
        updateLastLabel,
        setState,
      )(state),
    },
  }
}


export default function App() {
  const { state, actions } = appState();

  const entries = state.entries.map(
    (e) => {
      const child =
        e.kind === 'formula'
        ? Formula({ ...e.value, onChange: (f) => actions.updateEntry(e.id, f)})
        : <div />;

      return (
        <EntryControls
          key={e.id}
          child={child}
          onRemove={() => actions.removeEntry(e.id)}
        />
      );
    }
  );

  return (
    <div>
      {entries}
      <button onClick={actions.addFormula}>
        Add formula
      </button>
    </div>
  );
}


type EntryControlsProps =
  { child: JSX.Element, onRemove: () => any };


function EntryControls(props: EntryControlsProps) {
  return (
    <div>
      {props.child}
      <button onClick={props.onRemove}>delete</button>
    </div>
  );
}
