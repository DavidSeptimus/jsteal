import {
  And,
  App,
  Btoi,
  compileTeal,
  Cond,
  Mode,
  OnComplete,
  Return,
  Seq,
  Txn,
} from "../src/internal";
import * as fs from "fs";
import { _Assert, _Bytes, _Cond, _Int, _Seq } from "../src";

export function approvalProgram(): Cond {
  const onCreation = _Seq(
    _Assert(Txn.applicationArgs.length().eq(_Int(1))),
    App.globalPut(_Bytes("total supply"), Btoi(Txn.applicationArgs.getItem(0))),
    App.globalPut(_Bytes("reserve"), Btoi(Txn.applicationArgs.getItem(0))),
    App.localPut(_Int(0), _Bytes("admin"), _Int(1)),
    App.localPut(_Int(0), _Bytes("balance"), _Int(0)),
    Return(_Int(1))
  );

  const isAdmin = App.localGet(_Int(0), _Bytes("admin"));

  const onCloseout = _Seq(
    App.globalPut(
      _Bytes("reserve"),
      App.globalGet(_Bytes("reserve")).add(
        App.localGet(_Int(0), _Bytes("balance"))
      )
    ),
    Return(_Int(1))
  );

  const register = _Seq(
    App.localPut(_Int(0), _Bytes("balance"), _Int(0)),
    Return(_Int(1))
  );

  const newAdminStatus = Btoi(Txn.applicationArgs.getItem(1));
  const setAdmin = _Seq(
    _Assert(And(isAdmin, Txn.applicationArgs.length().eq(_Int(2)))),
    App.localPut(_Int(1), _Bytes("admin"), newAdminStatus),
    Return(_Int(1))
  );

  const mintAmount = Btoi(Txn.applicationArgs.getItem(1));
  const mint = _Seq(
    _Assert(Txn.applicationArgs.length().eq(_Int(2))),
    _Assert(mintAmount.le(App.globalGet(_Bytes("reserve")))),
    App.globalPut(
      _Bytes("reserve"),
      App.globalGet(_Bytes("reserve")).sub(mintAmount)
    ),
    App.localPut(
      _Int(1),
      _Bytes("balance"),
      App.localGet(_Int(1), _Bytes("balance")).add(mintAmount)
    ),
    Return(isAdmin)
  );

  const transferAmount = Btoi(Txn.applicationArgs.getItem(1));
  const transfer = _Seq(
    _Assert(Txn.applicationArgs.length().eq(_Int(2))),
    _Assert(transferAmount.le(App.localGet(_Int(0), _Bytes("balance")))),
    App.localPut(
      _Int(0),
      _Bytes("balance"),
      App.localGet(_Int(0), _Bytes("balance")).sub(transferAmount)
    ),
    App.localPut(
      _Int(1),
      _Bytes("balance"),
      App.localGet(_Int(1), _Bytes("balance")).add(transferAmount)
    ),
    Return(_Int(1))
  );

  const program = _Cond(
    [Txn.applicationId().eq(_Int(0)), onCreation],
    [Txn.onCompletion().eq(OnComplete.DeleteApplication), Return(isAdmin)],
    [Txn.onCompletion().eq(OnComplete.UpdateApplication), Return(isAdmin)],
    [Txn.onCompletion().eq(OnComplete.CloseOut), onCloseout],
    [Txn.onCompletion().eq(OnComplete.OptIn), register],
    [Txn.applicationArgs.getItem(0).eq(_Bytes("set admin")), setAdmin],
    [Txn.applicationArgs.getItem(0).eq(_Bytes("mint")), mint],
    [Txn.applicationArgs.getItem(0).eq(_Bytes("transfer")), transfer]
  );

  return program;
}

export function clearStateProgram(): Seq {
  const program = _Seq(
    App.globalPut(
      _Bytes("reserve"),
      App.globalGet(_Bytes("reserve")).add(
        App.localGet(_Int(0), _Bytes("balance"))
      )
    ),
    Return(_Int(1))
  );

  return program;
}

let compiled = compileTeal(approvalProgram(), Mode.Application, 2);
try {
  fs.writeFileSync("asset_approval_simplified.teal", compiled);
} catch (err) {
  console.error(err);
}

compiled = compileTeal(clearStateProgram(), Mode.Application, 2);
try {
  fs.writeFileSync("asset_clear_state_simplified.teal", compiled);
} catch (err) {
  console.error(err);
}
