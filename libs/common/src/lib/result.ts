import { Err, Result, ResultError } from '@sapphire/result';
import { typeSafeBind } from './type-safe-bind';
export * from '@sapphire/result';

export type ResultAsync<T, E = unknown> = Promise<Result<T, E>>;
export type ResultGenerator<T, E = unknown> = Generator<Err<E>, Result<T, E>>;
export type ResultAsyncGenerator<T, E = unknown> = AsyncGenerator<
  Err<E>,
  Result<T, E>
>;

export type ResultGeneratorFunc<T, E> = (
  $: SafeTryUnwraper,
) => ResultGenerator<T, E>;
export type ResultGeneratorFuncWithThis<ThisArg, T, E> = (
  this: ThisArg,
  ...args: [...Parameters<ResultGeneratorFunc<T, E>>]
) => ReturnType<ResultGeneratorFunc<T, E>>;

export type ResultAsyncGeneratorFunc<T, E> = (
  $: SafeTryUnwraper,
) => ResultAsyncGenerator<T, E>;
export type ResultAsyncGeneratorFuncWithThis<ThisArg, T, E> = (
  this: ThisArg,
  ...args: [...Parameters<ResultAsyncGeneratorFunc<T, E>>]
) => ReturnType<ResultAsyncGeneratorFunc<T, E>>;

export interface SafeTryUnwraper {
  $: <T, E>(result: Result<T, E>) => Generator<Err<E, T>, T>;
  $async: <T, E>(result: ResultAsync<T, E>) => AsyncGenerator<Err<E, T>, T>;
}

function* unwrap<T, E>(result: Result<T, E>): Generator<Err<E, T>, T> {
  if (result.isOk()) {
    return result.unwrap();
  }

  yield result as Err<E>;
  throw new ResultError('', result);
}

async function* unwrapAsync<T, E>(
  result: ResultAsync<T, E>,
): AsyncGenerator<Err<E, T>, T> {
  const _result = await result;
  return yield* unwrap(_result);
}

export function safeTry<T, E>(body: ResultGeneratorFunc<T, E>): Result<T, E>;
export function safeTry<T, E>(
  body: ResultAsyncGeneratorFunc<T, E>,
): Promise<Result<T, E>>;
export function safeTry<T, E>(
  body:
    | (($: SafeTryUnwraper) => ResultGenerator<T, E>)
    | (($: SafeTryUnwraper) => ResultAsyncGenerator<T, E>),
): Result<T, E> | Promise<Result<T, E>> {
  const n = body({ $: unwrap, $async: unwrapAsync }).next();

  if (n instanceof Promise) {
    return n.then((r) => r.value);
  }

  return n.value;
}

export function safeTryBind<ThisArg, T, E>(
  thisArg: ThisArg,
  body: ResultGeneratorFuncWithThis<ThisArg, T, E>,
): Result<T, E>;
export function safeTryBind<ThisArg, T, E>(
  thisArg: ThisArg,
  body: ResultAsyncGeneratorFuncWithThis<ThisArg, T, E>,
): Promise<Result<T, E>>;
export function safeTryBind<ThisArg, T, E>(
  thisArg: ThisArg,
  body:
    | ResultGeneratorFuncWithThis<ThisArg, T, E>
    | ResultAsyncGeneratorFuncWithThis<ThisArg, T, E>,
): Result<T, E> | Promise<Result<T, E>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return safeTry(typeSafeBind(body, thisArg) as any);
}
