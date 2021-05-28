import {
  Addr,
  App,
  AppField,
  Arg,
  Assert,
  Bytes,
  Cond,
  Err,
  Expr,
  Global,
  GlobalField,
  GtxnExpr,
  If,
  Int,
  MaybeValue,
  NaryExpr,
  Op,
  Seq,
  TealType,
  TernaryExpr,
  TxnExpr,
  TxnField,
  UnaryExpr,
} from "./internal";

export * from "./internal";

export const _Addr = (address: string) => new Addr(address);
export const _App = (field: AppField, ...args: Array<Expr>) =>
  new App(field, args);
export const _Arg = (index: number) => new Arg(index);
export const _Assert = (cond: Expr) => new Assert(cond);
export const _Bytes = (...args: [string, string?]) =>
  new Bytes(args as Array<string>);
export const _Err = () => new Err();
export const _Global = (field: GlobalField) => new Global(field);
export const _Gtxn = (txnIndex: number | Expr, field: TxnField) =>
  new GtxnExpr(txnIndex, field);

export const _Int = (arg: number | bigint) => new Int(arg);
export const _MaybeValue = (
  op: Op,
  type: TealType,
  immediateArgs?: Array<string | number | bigint>,
  ...args: Array<Expr>
) => new MaybeValue(op, type, immediateArgs, args);
export const _Nary = (
  op: Op,
  inputType: TealType,
  outputType: TealType,
  ...args: Array<Expr>
) => new NaryExpr(op, inputType, outputType, args);
export const _Seq = (...exprs: Array<Expr>) => new Seq(exprs);
export const _Ternary = (
  op: Op,
  inputTypes: [TealType, TealType, TealType],
  outputType: TealType,
  firstArg: Expr,
  secondArg: Expr,
  thirdArg: Expr
) => new TernaryExpr(op, inputTypes, outputType, firstArg, secondArg, thirdArg);
export const _Txn = (field: TxnField) => new TxnExpr(field);
export const _Unary = (
  op: Op,
  inputType: TealType,
  outputType: TealType,
  arg: Expr
) => new UnaryExpr(op, inputType, outputType, arg);

export const _If = (cond: Expr, thenBranch: Expr, elseBranch?: Expr) =>
  new If(cond, thenBranch, elseBranch);
export const _Cond = (...args: Array<Array<Expr>>) => new Cond(args);
