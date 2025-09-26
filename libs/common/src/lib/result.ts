import { Err, Result, ResultError } from '@sapphire/result';
export * from '@sapphire/result';

export type ResultAsync<T, E = unknown> = Promise<Result<T, E>>;
export type ResultGenerator<T, E = unknown> = Generator<Result<T, E>, void>;
export type ResultAsyncGenerator<T, E = unknown> = AsyncGenerator<Err<E, T>, T>;

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

export function safeTry<T, E>(
  body: ($: SafeTryUnwraper) => Generator<Err<E>, Result<T, E>>,
): Result<T, E>;
export function safeTry<T, E>(
  body: ($: SafeTryUnwraper) => AsyncGenerator<Err<E>, Result<T, E>>,
): Promise<Result<T, E>>;
export function safeTry<T, E>(
  body:
    | (($: SafeTryUnwraper) => Generator<Err<E>, Result<T, E>>)
    | (($: SafeTryUnwraper) => AsyncGenerator<Err<E>, Result<T, E>>),
): Result<T, E> | Promise<Result<T, E>> {
  const n = body({ $: unwrap, $async: unwrapAsync }).next();

  if (n instanceof Promise) {
    return n.then((r) => r.value);
  }

  return n.value;
}
