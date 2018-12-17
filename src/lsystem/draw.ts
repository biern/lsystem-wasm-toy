import * as React from 'react';


import * as wasmDraw from '../../crate/Cargo.toml';
import { Operation, LSystemDefinition, Formula } from './core';
import { Either } from 'fp-ts/lib/Either';


const buildOperationPointers = (operations: Operation[]): Array<number> => {
  return operations.map((op) => {
    if (op.kind === 'forward') {
      return wasmDraw.op_forward_pointer(op.label, op.value);
    } else if (op.kind === 'rotate') {
      return wasmDraw.op_rotate_pointer(op.label, op.value);
    } else if (op.kind === 'state-pop') {
      return wasmDraw.op_pop_pointer(op.label);
    } else if (op.kind === 'state-push') {
      return wasmDraw.op_push_pointer(op.label);
    } else {
      throw new Error("Operation not supported");
    }
  });
}


const toWasmFormulas = (formulas: Formula[]): string => {
  return JSON.stringify(formulas.map((f) => ({
    symbol: f.label,
    tokens: f.value,
  })));
}


export const useDraw = (
  ref: React.Ref<HTMLCanvasElement>,
  system: LSystemDefinition | undefined,
) => {
  React.useEffect(() => {
    if (system && ref && typeof ref !== 'function' && ref.current) {
      const canvas = ref.current;
      const ctx = canvas.getContext('2d')!;

      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      ctx.save();

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.shadowColor = 'black';
      ctx.shadowBlur = 5;

      const operations = buildOperationPointers(system.operations);

      if (operations.length) {
        const formulas = toWasmFormulas(system.formulas);
        const compiled = wasmDraw.compile(formulas, 3);

        wasmDraw.draw_operations(
          ctx,
          Int32Array.from(operations),
          compiled,
        );
      }

      ctx.restore();
    }
  });
}
