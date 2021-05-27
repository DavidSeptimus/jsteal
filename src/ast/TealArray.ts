/**
 * Represents a variable length array of objects.
 */
import { Expr } from "./Expr";

export abstract class TealArray<T> {
  /**
   * Get the length of the array.
   */
  public abstract length(): Expr;

  /**
   * Get the value at a given index in this array.
   *
   * @param index
   */
  public abstract getItem(index: number): T;
}
