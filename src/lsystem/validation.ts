import { Either, either, fromPredicate, right, left } from 'fp-ts/lib/Either';
import { array } from 'fp-ts/lib/Array';

import { State, Entry } from './state';
import { LSystemDefinition, Formula, Operation } from './core';


export const getValidLSystem = (
  entries: Entry[],
): Either<String, LSystemDefinition> => {
  const allLabels = entries.map((e) => e.value.label);

  const formulas =
    entries
    .filter(({ kind }) => kind === 'formula')
    .map((e) => e.value) as Formula[];

  const operations =
    entries
    .filter(({ kind }) => kind === 'operation')
    .map((e) => e.value) as Operation[];

  if (formulas.length === 0) {
    return left('At least one formula is required');
  }

  if (operations.length === 0) {
    return left('At least one operation is required');
  }

  const validateFormula = (f: Formula): Either<string, Formula> => {
    return array.traverse(either)(
      f.value,
      fromPredicate(
        (label) => allLabels.includes(label),
        (label) => `Formula ${f.label} uses undefined label ${label}`,
      ))
      .map(() => f)
  };

  const validatedFormulas = array.traverse(either)(formulas, validateFormula);

  const buildLSystemDefinition =
    (formulas: Formula[]) =>
    (operations: Operation[]): LSystemDefinition => ({
      formulas,
      operations,
    });

  return either
    .of<string, typeof buildLSystemDefinition>(buildLSystemDefinition)
    .ap_(validatedFormulas)
    .ap_(right(operations));
}
