import * as R from 'ramda';
import * as React from 'react';
import styled from 'styled-components'

import Formula from './Components/Formula';
import Operation from './Components/Operation';
import { lsystemState, getValidLSystem } from './lsystem';
import { useDraw } from './lsystem/draw';
import { useInUrlState } from './lsystem/serialization';


export default function App() {
  const { state, setState, actions } = lsystemState();
  useInUrlState(state, setState);

  const canvasEl = React.useRef<HTMLCanvasElement>(null);
  const system = getValidLSystem(state.entries);

  useDraw(
    canvasEl,
    system.fold(R.always(undefined), R.identity),
    state.iterations,
    state.start,
  );

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

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
      }}>
      <div
        style={{
          marginRight: "1rem",
        }}
      >
        <h2>LSystem</h2>
        {entries}
        <SpacedRow>
          <div style={{
            display: "flex",
            justifyContent: "center",
            height: "2rem",
            lineHeight: "2rem",
          }}>
            <span>iterations:</span>
            <input
              id="iterations"
              type="number"
              size={1}
              onChange={(ev) => actions.setIterations(parseInt(ev.target.value))}
              value={state.iterations}
              style={{
                marginLeft: '1em',
                width: '4.5em',
              }}
            />
          </div>
        </SpacedRow>
        <SpacedRow style={{
          display: "flex",
          justifyContent: "space-around",
        }}>
          <button onClick={actions.addFormula}>
            Add formula
          </button>
          <button onClick={actions.addOperation}>
            Add operation
          </button>
        </SpacedRow>
        <div>
          {system.fold(
             (err) => err,
             () => '',
          )}
        </div>
          </div>
          <canvas
            style={{
              flexGrow: 1,
              border: "1px solid black",
              cursor: "pointer",
            }}
            ref={canvasEl}
            onClick={(ev) => actions.setStartPosition(
              getCursorPosition(canvasEl.current!, ev)
            )}
          />
      </div>
  );
}


function getCursorPosition(canvas: HTMLCanvasElement, event: any): [number, number] {
  const rect = canvas.getBoundingClientRect();

  console.log(event.clientX, rect.left);

  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  return [x, y];
}


type EntryControlsProps =
  { child: JSX.Element, onRemove: () => any };


function EntryControls(props: EntryControlsProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      {props.child}
    <button
    style={{
      padding: '0px',
    }}
    onClick={props.onRemove}
    >
    x
        </button>
    </div>
  );
}

const SpacedRow = styled.div`
  margin-top: 1rem;
  margin-bottom: 1rem;
`;
