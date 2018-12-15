import * as React from 'react';

import { lsystemState, getValidLSystem } from './src/lsystem';

import Formula from './Components/Formula';
import Operation from './Components/Operation';


export default function App() {
  const { state, actions } = lsystemState();

  const entries = state.entries.map(
    (e) => {
      const child =
        e.kind === 'formula'
        ? Formula({ ...e.value, onChange: (f) => actions.updateEntry(e.id, f)})
        : Operation({ ...e.value, onChange: (op) => actions.updateEntry(e.id, op)});

      return (
        <EntryControls
          key={e.id}
          child={child}
          onRemove={() => actions.removeEntry(e.id)}
        />
      );
    }
  );

  const system = getValidLSystem(state.entries);

  return (
    <div>
      {entries}
      <button onClick={actions.addFormula}>
        Add formula
      </button>
      <button onClick={actions.addOperation}>
        Add operation
      </button>
      {system.fold(
         (err) => err,
         () => 'OK!',
      )}
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
