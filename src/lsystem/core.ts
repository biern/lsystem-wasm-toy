export type Formula = {
  label: string;
  value: string[];
};


export type Operation =
  { label: string } & (
      | { kind: 'forward', value: number }
      | { kind: 'rotate', value: number }
  );


export type LSystemDefinition = {
  operations: Operation[];
  formulas: Formula[];
}
