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
export function typeSafeBind<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends (this: any, ...args: any[]) => any,
  ThisArg,
>(fn: T, thisArg: ThisArg): OmitThisParameter<T> {
  // We use the standard JavaScript bind implementation at runtime.
  // The TypeScript utility types handle the compile-time type safety.
  return fn.bind(thisArg) as OmitThisParameter<T>;
}
