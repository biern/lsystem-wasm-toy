export type Formula = {
  label: string;
  value: string[];
};


export type Operation =
  { label: string } & (
      | { kind: 'forward', value: number }
      | { kind: 'rotate', value: number }
      | { kind: 'state-push' }
      | { kind: 'state-pop' }
  );


export type LSystemDefinition = {
  operations: Operation[];
  formulas: Formula[];
}
