import {
  Add,
  And,
  BinaryExpr,
  BitwiseAnd,
  BitwiseNot,
  BitwiseOr,
  BitwiseXor,
  CompiledExpr,
  CompileOptions,
  Div,
  Eq,
  Ge,
  Gt,
  Le,
  Lt,
  Minus,
  Mod,
  Mul,
  Neq,
  Or,
  TealType,
  UnaryExpr,
} from "../internal";

/**
 * Abstract base class for PyTeal expressions.
 */
export abstract class Expr {
  public stack = "";

  /**
   * Captures a stack trace to provide users with more useful output regarding compile-time errors
   * @protected
   */
  protected constructor() {
    // Non-standard V8-only feature (i.e. works in Node and Chromium-based browsers)
    //https://nodejs.org/api/errors.html#errors_error_capturestacktrace_targetobject_constructoropt
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this);
      const stackArr = this.stack.split("\n");
      stackArr.splice(0, 2);
      this.stack = stackArr.join("\n"); // removes new Expr() from the stack trace
    }
  }

  public abstract typeOf(): TealType;

  public abstract teal(options: CompileOptions): CompiledExpr;

  public lt(other: Expr): BinaryExpr {
    return Lt(this, other);
  }

  public gt(other: Expr): BinaryExpr {
    return Gt(this, other);
  }

  public le(other: Expr): BinaryExpr {
    return Le(this, other);
  }

  public ge(other: Expr): BinaryExpr {
    return Ge(this, other);
  }

  public eq(other: Expr): BinaryExpr {
    return Eq(this, other);
  }

  public ne(other: Expr): BinaryExpr {
    return Neq(this, other);
  }

  public add(other: Expr): BinaryExpr {
    return Add(this, other);
  }

  public sub(other: Expr): BinaryExpr {
    return Minus(this, other);
  }

  public mul(other: Expr): BinaryExpr {
    return Mul(this, other);
  }

  public truediv(other: Expr): BinaryExpr {
    return Div(this, other);
  }

  public mod(other: Expr): BinaryExpr {
    return Mod(this, other);
  }

  public invert(): UnaryExpr {
    return BitwiseNot(this);
  }

  public and(other: Expr): BinaryExpr {
    return BitwiseAnd(this, other);
  }

  public or(other: Expr): BinaryExpr {
    return BitwiseOr(this, other);
  }

  public xor(other: Expr): BinaryExpr {
    return BitwiseXor(this, other);
  }

  /**
   * Take the logical And of this expression and another one.
   *
   * This expression must evaluate to uint64.
   *
   * This is the same as using `And()` with two arguments.
   *
   *
   * @param {Expr} other
   * @return {Expr}
   */
  public And(other: Expr): Expr {
    return And(this, other);
  }

  /**
   * Take the logical Or of this expression and another one.
   *
   * This expression must evaluate to uint64.
   *
   * This is the same as using `Or()` with two arguments.

   * @param {Expr} other
   * @return {Expr}
   */
  public Or(other: Expr): Expr {
    return Or(this, other);
  }
}

export default Expr;
