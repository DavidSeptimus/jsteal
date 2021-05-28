import {
  And,
  App,
  Assert,
  Btoi,
  Bytes,
  compileTeal,
  Cond,
  Int,
  Mode,
  OnComplete,
  Return,
  Seq,
  Txn,
} from "../src/internal";
import * as fs from "fs";

export function approvalProgram(): Cond {
  const onCreation = new Seq([
    new Assert(Txn.applicationArgs.length().eq(new Int(1))),
    App.globalPut(
      new Bytes(["total supply"]),
      Btoi(Txn.applicationArgs.getItem(0))
    ),
    App.globalPut(new Bytes(["reserve"]), Btoi(Txn.applicationArgs.getItem(0))),
    App.localPut(new Int(0), new Bytes(["admin"]), new Int(1)),
    App.localPut(new Int(0), new Bytes(["balance"]), new Int(0)),
    Return(new Int(1)),
  ]);

  const isAdmin = App.localGet(new Int(0), new Bytes(["admin"]));

  const onCloseout = new Seq([
    App.globalPut(
      new Bytes(["reserve"]),
      App.globalGet(new Bytes(["reserve"])).add(
        App.localGet(new Int(0), new Bytes(["balance"]))
      )
    ),
    Return(new Int(1)),
  ]);

  const register = new Seq([
    App.localPut(new Int(0), new Bytes(["balance"]), new Int(0)),
    Return(new Int(1)),
  ]);

  const newAdminStatus = Btoi(Txn.applicationArgs.getItem(1));
  const setAdmin = new Seq([
    new Assert(And(isAdmin, Txn.applicationArgs.length().eq(new Int(2)))),
    App.localPut(new Int(1), new Bytes(["admin"]), newAdminStatus),
    Return(new Int(1)),
  ]);

  const mintAmount = Btoi(Txn.applicationArgs.getItem(1));
  const mint = new Seq([
    new Assert(Txn.applicationArgs.length().eq(new Int(2))),
    new Assert(mintAmount.le(App.globalGet(new Bytes(["reserve"])))),
    App.globalPut(
      new Bytes(["reserve"]),
      App.globalGet(new Bytes(["reserve"])).sub(mintAmount)
    ),
    App.localPut(
      new Int(1),
      new Bytes(["balance"]),
      App.localGet(new Int(1), new Bytes(["balance"])).add(mintAmount)
    ),
    Return(isAdmin),
  ]);

  const transferAmount = Btoi(Txn.applicationArgs.getItem(1));
  const transfer = new Seq([
    new Assert(Txn.applicationArgs.length().eq(new Int(2))),
    new Assert(
      transferAmount.le(App.localGet(new Int(0), new Bytes(["balance"])))
    ),
    App.localPut(
      new Int(0),
      new Bytes(["balance"]),
      App.localGet(new Int(0), new Bytes(["balance"])).sub(transferAmount)
    ),
    App.localPut(
      new Int(1),
      new Bytes(["balance"]),
      App.localGet(new Int(1), new Bytes(["balance"])).add(transferAmount)
    ),
    Return(new Int(1)),
  ]);

  const program = new Cond([
    [Txn.applicationId().eq(new Int(0)), onCreation],
    [Txn.onCompletion().eq(OnComplete.DeleteApplication), Return(isAdmin)],
    [Txn.onCompletion().eq(OnComplete.UpdateApplication), Return(isAdmin)],
    [Txn.onCompletion().eq(OnComplete.CloseOut), onCloseout],
    [Txn.onCompletion().eq(OnComplete.OptIn), register],
    [Txn.applicationArgs.getItem(0).eq(new Bytes(["set admin"])), setAdmin], // err spot
    [Txn.applicationArgs.getItem(0).eq(new Bytes(["mint"])), mint],
    [Txn.applicationArgs.getItem(0).eq(new Bytes(["transfer"])), transfer],
  ]);

  return program;
}

export function clearStateProgram(): Seq {
  const program = new Seq([
    App.globalPut(
      new Bytes(["reserve"]),
      App.globalGet(new Bytes(["reserve"])).add(
        App.localGet(new Int(0), new Bytes(["balance"]))
      )
    ),
    Return(new Int(1)),
  ]);

  return program;
}

let compiled = compileTeal(approvalProgram(), Mode.Application, 2);
try {
  fs.writeFileSync("asset_approval.teal", compiled);
} catch (err) {
  console.error(err);
}

compiled = compileTeal(clearStateProgram(), Mode.Application, 2);
try {
  fs.writeFileSync("asset_clear_state.teal", compiled);
} catch (err) {
  console.error(err);
}
