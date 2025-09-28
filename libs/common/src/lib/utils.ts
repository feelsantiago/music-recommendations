/* eslint-disable @typescript-eslint/no-explicit-any */
export type AppendParameters<
  TFunction extends (...args: any[]) => any,
  TParameters extends [...args: any],
> = (
  ...args: [...TParameters, ...Parameters<TFunction>]
) => ReturnType<TFunction>;
