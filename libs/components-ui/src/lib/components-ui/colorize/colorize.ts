export abstract class Colorize<T = string> {
  public abstract apply<K = object>(obj: K): K & { severity: T };
}
