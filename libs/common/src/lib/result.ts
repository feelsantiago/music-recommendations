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

/**
 * Binds a function to a specific 'this' context, returning a new function.
 * This function is a type-safe equivalent of the standard JavaScript Function.prototype.bind.
 *
 * @template T A generic representing the function to be bound.
 * @template ThisArg The type of the 'this' argument.
 * @param {T} fn The function to be bound.
 * @param {ThisArg} thisArg The value to be passed as the 'this' parameter to the target function when the bound function is called.
 * @returns {OmitThisParameter<T>} A new function with the 'this' context fixed to thisArg.
 */
function typeSafeBind<T extends (this: any, ...args: any[]) => any, ThisArg>(
  fn: T,
  thisArg: ThisArg,
): OmitThisParameter<T> {
  // We use the standard JavaScript bind implementation at runtime.
  // The TypeScript utility types handle the compile-time type safety.
  return fn.bind(thisArg) as OmitThisParameter<T>;
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

export function safeTryBind<ThisArg, T, E>(
  thisArg: ThisArg,
  body: (
    this: ThisArg,
    $: SafeTryUnwraper,
  ) => AsyncGenerator<Err<E>, Result<T, E>>,
): Promise<Result<T, E>>;
export function safeTryBind<ThisArg, T, E>(
  thisArg: ThisArg,
  body: (
    this: ThisArg,
    $: SafeTryUnwraper,
  ) => AsyncGenerator<Err<E>, Result<T, E>>,
): Result<T, E>;
export function safeTryBind<ThisArg, T, E>(
  thisArg: ThisArg,
  body:
    | ((this: ThisArg, $: SafeTryUnwraper) => Generator<Err<E>, Result<T, E>>)
    | ((
        this: ThisArg,
        $: SafeTryUnwraper,
      ) => AsyncGenerator<Err<E>, Result<T, E>>),
): Result<T, E> | Promise<Result<T, E>> {
  return safeTry(typeSafeBind(body, thisArg) as any);
}
