import { useState } from 'react';
import * as R from 'ramda';
import uuid from 'uuid/v4';

import * as lsystem from './core';


export type Entry =
  { id: string } & (
    | ({ kind: 'formula', value: lsystem.Formula })
    | ({ kind: 'operation', value: lsystem.Operation })
  );


export type State = {
  entries: Entry[];
  lastLabel: string;
  iterations: number;
  start?: [number, number];
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


const addOperation = (state: State): State => ({
  ...state,
  entries: [
    ...state.entries, {
      kind: 'operation', id: uuid(), value: {
        label: state.lastLabel,
        kind: 'forward',
        value: 100,
      }
    },
  ],
});


export const lsystemState = () => {
  const [state, setState] = useState<State>({
    entries: [
      { kind: 'formula', id: uuid(), value: { label: 'A', value: ['A', 'B']} },
      { kind: 'operation', id: uuid(), value: { label: 'B', kind: 'forward', value: 100} },
    ],
    lastLabel: 'B',
    iterations: 3,
    start: undefined,
  });

  return {
    state,
    setState,
    actions: {
      addFormula: () => R.pipe(
        addFormula,
        updateLastLabel,
        setState,
      )(state),
      addOperation: () => R.pipe(
        addOperation,
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
      setIterations: (iterations: number) =>
        setState({...state, iterations}),
      setStartPosition: (pos: [number, number]) =>
        setState({ ...state, start: pos }),
    },
  }
}
