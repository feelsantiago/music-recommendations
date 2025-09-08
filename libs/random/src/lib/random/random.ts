export abstract class Random {
  public abstract next(): number;
  public abstract between(min: number, max: number): number;
  public abstract range(length: number): number;
}
