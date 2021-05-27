import "jasmine";
import { TealOp } from "../ir/TealOp";
import {
  createConstantBlocks,
  extractAddrValue,
  extractBytesValue,
  extractIntValue,
} from "./Constants";
import { Ops } from "../ir/Ops";
import base32 from "hi-base32";
import { Buffer } from "buffer/";

function bytes(str: string, encoding: BufferEncoding = "ascii"): Uint8Array {
  return Uint8Array.from(Buffer.from(str, encoding));
}

describe("Constants Tests", function () {
  describe("extraction tests", function () {
    it("test_extractIntValue", function () {
      const tests = [
        [new TealOp(undefined, Ops.int, [0n]), 0n],
        [new TealOp(undefined, Ops.int, [5]), 5n],
        [new TealOp(undefined, Ops.int, ["pay"]), 1n],
        [new TealOp(undefined, Ops.int, ["NoOp"]), 0n],
        [new TealOp(undefined, Ops.int, ["UpdateApplication"]), 4n],
        [new TealOp(undefined, Ops.int, ["TMPL_NAME"]), "TMPL_NAME"],
      ];

      tests.forEach(([op, expected]) => {
        const actual = extractIntValue(op as TealOp);
        expect(actual).toEqual(expected as any);
      });
    });

    it("test_extractBytesValue", function () {
      const tests = [
        [new TealOp(undefined, Ops.byte, ['""']), bytes("")],
        [new TealOp(undefined, Ops.byte, ['"test"']), bytes("test")],
        [
          new TealOp(undefined, Ops.byte, ['"\\n \\xf0\\x9f\\x98\\x80"']),
          bytes("\\n 😀", "utf8"),
        ],
        [
          new TealOp(undefined, Ops.byte, ['"\\t\\n\\\\\\""']),
          bytes('\\t\\n\\\\"', "utf8"),
        ],
        [new TealOp(undefined, Ops.byte, ["0x"]), bytes("")],
        [new TealOp(undefined, Ops.byte, ["0x00"]), bytes("00", "hex")],
        [new TealOp(undefined, Ops.byte, ["0xFF00"]), bytes("FF00", "hex")],
        [new TealOp(undefined, Ops.byte, ["0xff00"]), bytes("ff00", "hex")],
        [new TealOp(undefined, Ops.byte, ["base32()"]), bytes("")],
        [new TealOp(undefined, Ops.byte, ["base32(ORSXG5A)"]), bytes("test")],
        [new TealOp(undefined, Ops.byte, ["base32(ORSXG5A=)"]), bytes("test")],
        [new TealOp(undefined, Ops.byte, ["base64()"]), bytes("")],
        [new TealOp(undefined, Ops.byte, ["base64(dGVzdA==)"]), bytes("test")],
        [new TealOp(undefined, Ops.byte, ["TMPL_NAME"]), "TMPL_NAME"],
      ];

      tests.forEach(([op, expected]) => {
        const actual = extractBytesValue(op as TealOp);
        expect(actual).toEqual(expected as any);
      });
    });

    it("test_extractAddrValue", function () {
      const tests = [
        [
          new TealOp(undefined, Ops.byte, [
            "WSJHNPJ6YCLX5K4GUMQ4ISPK3ABMS3AL3F6CSVQTCUI5F4I65PWEMCWT3M",
          ]),
          Uint8Array.from(
            base32.decode.asBytes(
              "WSJHNPJ6YCLX5K4GUMQ4ISPK3ABMS3AL3F6CSVQTCUI5F4I65PWA===="
            )
          ),
        ],
        [new TealOp(undefined, Ops.addr, ["TMPL_NAME"]), "TMPL_NAME"],
      ];

      tests.forEach(([op, expected]) => {
        const actual = extractAddrValue(op as TealOp);
        expect(actual).toEqual(expected as any);
      });
    });
  });

  it("test_createConstantBlocks_empty", function () {
    const ops: Array<TealOp> = [];

    const expected = ops.slice();

    const actual = createConstantBlocks(ops);
    expect(actual).toEqual(expected);
  });

  it("test_createConstantBlocks_no_consts", function () {
    const ops = [
      new TealOp(undefined, Ops.txn, ["Sender"]),
      new TealOp(undefined, Ops.txn, ["Receiver"]),
      new TealOp(undefined, Ops.eq),
    ];

    const expected = ops.slice();

    const actual = createConstantBlocks(ops);
    expect(actual).toEqual(expected);
  });

  describe("int tests", function () {
    it("test_createConstantBlocks_pushint", function () {
      const ops = [
        new TealOp(undefined, Ops.int, [0]),
        new TealOp(undefined, Ops.int, ["OptIn"]),
        new TealOp(undefined, Ops.add),
      ];

      const expected = [
        new TealOp(undefined, Ops.pushint, [0, "//", 0]),
        new TealOp(undefined, Ops.pushint, [1, "//", "OptIn"]),
        new TealOp(undefined, Ops.add),
      ];

      const actual = createConstantBlocks(ops);
      expect(actual).toEqual(expected);
    });

    it("test_createConstantBlocks_intblock_single", function () {
      const ops = [
        new TealOp(undefined, Ops.int, [1]),
        new TealOp(undefined, Ops.int, ["OptIn"]),
        new TealOp(undefined, Ops.add),
      ];

      const expected = [
        new TealOp(undefined, Ops.intcblock, [1]),
        new TealOp(undefined, Ops.intc_0, ["//", 1]),
        new TealOp(undefined, Ops.intc_0, ["//", "OptIn"]),
        new TealOp(undefined, Ops.add),
      ];

      const actual = createConstantBlocks(ops);
      expect(actual).toEqual(expected);
    });

    it("test_createConstantBlocks_intblock_multiple", function () {
      const ops = [
        new TealOp(undefined, Ops.int, [1]),
        new TealOp(undefined, Ops.int, ["OptIn"]),
        new TealOp(undefined, Ops.add),
        new TealOp(undefined, Ops.int, [2]),
        new TealOp(undefined, Ops.int, ["keyreg"]),
        new TealOp(undefined, Ops.add),
        new TealOp(undefined, Ops.int, [3]),
        new TealOp(undefined, Ops.int, ["ClearState"]),
        new TealOp(undefined, Ops.add),
      ];

      const expected = [
        new TealOp(undefined, Ops.intcblock, [3, 2, 1]),
        new TealOp(undefined, Ops.intc_2, ["//", 1]),
        new TealOp(undefined, Ops.intc_2, ["//", "OptIn"]),
        new TealOp(undefined, Ops.add),
        new TealOp(undefined, Ops.intc_1, ["//", 2]),
        new TealOp(undefined, Ops.intc_1, ["//", "keyreg"]),
        new TealOp(undefined, Ops.add),
        new TealOp(undefined, Ops.intc_0, ["//", 3]),
        new TealOp(undefined, Ops.intc_0, ["//", "ClearState"]),
        new TealOp(undefined, Ops.add),
      ];

      const actual = createConstantBlocks(ops);
      expect(actual).toEqual(expected);
    });

    it("test_createConstantBlocks_intblock_pushint", function () {
      const ops = [
        new TealOp(undefined, Ops.int, [1]),
        new TealOp(undefined, Ops.int, ["OptIn"]),
        new TealOp(undefined, Ops.add),
        new TealOp(undefined, Ops.int, [2]),
        new TealOp(undefined, Ops.int, [3]),
        new TealOp(undefined, Ops.add),
        new TealOp(undefined, Ops.int, [3]),
        new TealOp(undefined, Ops.int, ["ClearState"]),
        new TealOp(undefined, Ops.add),
      ];

      const expected = [
        new TealOp(undefined, Ops.intcblock, [3, 1]),
        new TealOp(undefined, Ops.intc_1, ["//", 1]),
        new TealOp(undefined, Ops.intc_1, ["//", "OptIn"]),
        new TealOp(undefined, Ops.add),
        new TealOp(undefined, Ops.pushint, [2, "//", 2]),
        new TealOp(undefined, Ops.intc_0, ["//", 3]),
        new TealOp(undefined, Ops.add),
        new TealOp(undefined, Ops.intc_0, ["//", 3]),
        new TealOp(undefined, Ops.intc_0, ["//", "ClearState"]),
        new TealOp(undefined, Ops.add),
      ];

      const actual = createConstantBlocks(ops);
      expect(actual).toEqual(expected);
    });
  });

  describe("bytes tests", function () {
    it("test_createConstantBlocks_pushbytes", function () {
      const ops = [
        new TealOp(undefined, Ops.byte, ["0x0102"]),
        new TealOp(undefined, Ops.byte, ["0x0103"]),
        new TealOp(undefined, Ops.concat),
      ];

      const expected = [
        new TealOp(undefined, Ops.pushbytes, ["0x0102", "//", "0x0102"]),
        new TealOp(undefined, Ops.pushbytes, ["0x0103", "//", "0x0103"]),
        new TealOp(undefined, Ops.concat),
      ];

      const actual = createConstantBlocks(ops);
      expect(actual).toEqual(expected);
    });

    it("test_createConstantBlocks_byteblock_single", function () {
      const ops = [
        new TealOp(undefined, Ops.byte, ["0x0102"]),
        new TealOp(undefined, Ops.byte, ["base64(AQI=)"]),
        new TealOp(undefined, Ops.concat),
        new TealOp(undefined, Ops.byte, ["base32(AEBA====)"]),
        new TealOp(undefined, Ops.concat),
      ];

      const expected = [
        new TealOp(undefined, Ops.bytecblock, ["0x0102"]),
        new TealOp(undefined, Ops.bytec_0, ["//", "0x0102"]),
        new TealOp(undefined, Ops.bytec_0, ["//", "base64(AQI=)"]),
        new TealOp(undefined, Ops.concat),
        new TealOp(undefined, Ops.bytec_0, ["//", "base32(AEBA====)"]),
        new TealOp(undefined, Ops.concat),
      ];

      const actual = createConstantBlocks(ops);
      expect(actual).toEqual(expected);
    });

    it("test_createConstantBlocks_byteblock_multiple", function () {
      const ops = [
        new TealOp(undefined, Ops.byte, ["0x0102"]),
        new TealOp(undefined, Ops.byte, ["base64(AQI=)"]),
        new TealOp(undefined, Ops.concat),
        new TealOp(undefined, Ops.byte, ["base32(AEBA====)"]),
        new TealOp(undefined, Ops.concat),
        new TealOp(undefined, Ops.byte, ['"test"']),
        new TealOp(undefined, Ops.concat),
        new TealOp(undefined, Ops.byte, ["base32(ORSXG5A=)"]),
        new TealOp(undefined, Ops.concat),
        new TealOp(undefined, Ops.byte, [
          "0xb49276bd3ec0977eab86a321c449ead802c96c0bd97c2956131511d2f11eebec",
        ]),
        new TealOp(undefined, Ops.concat),
        new TealOp(undefined, Ops.addr, [
          "WSJHNPJ6YCLX5K4GUMQ4ISPK3ABMS3AL3F6CSVQTCUI5F4I65PWEMCWT3M",
        ]),
        new TealOp(undefined, Ops.concat),
      ];

      const expected = [
        new TealOp(undefined, Ops.bytecblock, [
          "0x0102",
          "0xb49276bd3ec0977eab86a321c449ead802c96c0bd97c2956131511d2f11eebec",
          "0x74657374",
        ]),
        new TealOp(undefined, Ops.bytec_0, ["//", "0x0102"]),
        new TealOp(undefined, Ops.bytec_0, ["//", "base64(AQI=)"]),
        new TealOp(undefined, Ops.concat),
        new TealOp(undefined, Ops.bytec_0, ["//", "base32(AEBA====)"]),
        new TealOp(undefined, Ops.concat),
        new TealOp(undefined, Ops.bytec_2, ["//", '"test"']),
        new TealOp(undefined, Ops.concat),
        new TealOp(undefined, Ops.bytec_2, ["//", "base32(ORSXG5A=)"]),
        new TealOp(undefined, Ops.concat),
        new TealOp(undefined, Ops.bytec_1, [
          "//",
          "0xb49276bd3ec0977eab86a321c449ead802c96c0bd97c2956131511d2f11eebec",
        ]),
        new TealOp(undefined, Ops.concat),
        new TealOp(undefined, Ops.bytec_1, [
          "//",
          "WSJHNPJ6YCLX5K4GUMQ4ISPK3ABMS3AL3F6CSVQTCUI5F4I65PWEMCWT3M",
        ]),
        new TealOp(undefined, Ops.concat),
      ];

      const actual = createConstantBlocks(ops);
      expect(actual).toEqual(expected);
    });

    it("test_createConstantBlocks_byteblock_pushbytes", function () {
      const ops = [
        new TealOp(undefined, Ops.byte, ["0x0102"]),
        new TealOp(undefined, Ops.byte, ["base64(AQI=)"]),
        new TealOp(undefined, Ops.concat),
        new TealOp(undefined, Ops.byte, ["base32(AEBA====)"]),
        new TealOp(undefined, Ops.concat),
        new TealOp(undefined, Ops.byte, ['"test"']),
        new TealOp(undefined, Ops.concat),
        new TealOp(undefined, Ops.byte, ["base32(ORSXG5A=)"]),
        new TealOp(undefined, Ops.concat),
        new TealOp(undefined, Ops.addr, [
          "WSJHNPJ6YCLX5K4GUMQ4ISPK3ABMS3AL3F6CSVQTCUI5F4I65PWEMCWT3M",
        ]),
        new TealOp(undefined, Ops.concat),
      ];

      const expected = [
        new TealOp(undefined, Ops.bytecblock, ["0x0102", "0x74657374"]),
        new TealOp(undefined, Ops.bytec_0, ["//", "0x0102"]),
        new TealOp(undefined, Ops.bytec_0, ["//", "base64(AQI=)"]),
        new TealOp(undefined, Ops.concat),
        new TealOp(undefined, Ops.bytec_0, ["//", "base32(AEBA====)"]),
        new TealOp(undefined, Ops.concat),
        new TealOp(undefined, Ops.bytec_1, ["//", '"test"']),
        new TealOp(undefined, Ops.concat),
        new TealOp(undefined, Ops.bytec_1, ["//", "base32(ORSXG5A=)"]),
        new TealOp(undefined, Ops.concat),
        new TealOp(undefined, Ops.pushbytes, [
          "0xb49276bd3ec0977eab86a321c449ead802c96c0bd97c2956131511d2f11eebec",
          "//",
          "WSJHNPJ6YCLX5K4GUMQ4ISPK3ABMS3AL3F6CSVQTCUI5F4I65PWEMCWT3M",
        ]),
        new TealOp(undefined, Ops.concat),
      ];

      const actual = createConstantBlocks(ops);
      expect(actual).toEqual(expected);
    });

    it("test_createConstantBlocks_all", function () {
      const ops = [
        new TealOp(undefined, Ops.byte, ["0x0102"]),
        new TealOp(undefined, Ops.byte, ["base64(AQI=)"]),
        new TealOp(undefined, Ops.concat),
        new TealOp(undefined, Ops.byte, ["base32(AEBA====)"]),
        new TealOp(undefined, Ops.concat),
        new TealOp(undefined, Ops.byte, ['"test"']),
        new TealOp(undefined, Ops.concat),
        new TealOp(undefined, Ops.byte, ["base32(ORSXG5A=)"]),
        new TealOp(undefined, Ops.concat),
        new TealOp(undefined, Ops.addr, [
          "WSJHNPJ6YCLX5K4GUMQ4ISPK3ABMS3AL3F6CSVQTCUI5F4I65PWEMCWT3M",
        ]),
        new TealOp(undefined, Ops.concat),
        new TealOp(undefined, Ops.int, [1]),
        new TealOp(undefined, Ops.int, ["OptIn"]),
        new TealOp(undefined, Ops.add),
        new TealOp(undefined, Ops.int, [2]),
        new TealOp(undefined, Ops.int, [3]),
        new TealOp(undefined, Ops.add),
        new TealOp(undefined, Ops.int, [3]),
        new TealOp(undefined, Ops.int, ["ClearState"]),
        new TealOp(undefined, Ops.add),
      ];

      const expected = [
        new TealOp(undefined, Ops.intcblock, [3, 1]),
        new TealOp(undefined, Ops.bytecblock, ["0x0102", "0x74657374"]),
        new TealOp(undefined, Ops.bytec_0, ["//", "0x0102"]),
        new TealOp(undefined, Ops.bytec_0, ["//", "base64(AQI=)"]),
        new TealOp(undefined, Ops.concat),
        new TealOp(undefined, Ops.bytec_0, ["//", "base32(AEBA====)"]),
        new TealOp(undefined, Ops.concat),
        new TealOp(undefined, Ops.bytec_1, ["//", '"test"']),
        new TealOp(undefined, Ops.concat),
        new TealOp(undefined, Ops.bytec_1, ["//", "base32(ORSXG5A=)"]),
        new TealOp(undefined, Ops.concat),
        new TealOp(undefined, Ops.pushbytes, [
          "0xb49276bd3ec0977eab86a321c449ead802c96c0bd97c2956131511d2f11eebec",
          "//",
          "WSJHNPJ6YCLX5K4GUMQ4ISPK3ABMS3AL3F6CSVQTCUI5F4I65PWEMCWT3M",
        ]),
        new TealOp(undefined, Ops.concat),
        new TealOp(undefined, Ops.intc_1, ["//", 1]),
        new TealOp(undefined, Ops.intc_1, ["//", "OptIn"]),
        new TealOp(undefined, Ops.add),
        new TealOp(undefined, Ops.pushint, [2, "//", 2]),
        new TealOp(undefined, Ops.intc_0, ["//", 3]),
        new TealOp(undefined, Ops.add),
        new TealOp(undefined, Ops.intc_0, ["//", 3]),
        new TealOp(undefined, Ops.intc_0, ["//", "ClearState"]),
        new TealOp(undefined, Ops.add),
      ];

      const actual = createConstantBlocks(ops);
      expect(actual).toEqual(expected);
    });
  });

  describe("template tests", function () {
    it("test_createConstantBlocks_tmpl_int", function () {
      const ops = [
        new TealOp(undefined, Ops.int, ["TMPL_INT_1"]),
        new TealOp(undefined, Ops.int, ["TMPL_INT_1"]),
        new TealOp(undefined, Ops.eq),
        new TealOp(undefined, Ops.int, ["TMPL_INT_2"]),
        new TealOp(undefined, Ops.add),
      ];

      const expected = [
        new TealOp(undefined, Ops.intcblock, ["TMPL_INT_1"]),
        new TealOp(undefined, Ops.intc_0, ["//", "TMPL_INT_1"]),
        new TealOp(undefined, Ops.intc_0, ["//", "TMPL_INT_1"]),
        new TealOp(undefined, Ops.eq),
        new TealOp(undefined, Ops.pushint, ["TMPL_INT_2", "//", "TMPL_INT_2"]),
        new TealOp(undefined, Ops.add),
      ];

      const actual = createConstantBlocks(ops);
      expect(actual).toEqual(expected);
    });

    it("test_createConstantBlocks_tmpl_int_mixed", function () {
      const ops = [
        new TealOp(undefined, Ops.int, ["TMPL_INT_1"]),
        new TealOp(undefined, Ops.int, ["TMPL_INT_1"]),
        new TealOp(undefined, Ops.eq),
        new TealOp(undefined, Ops.int, ["TMPL_INT_2"]),
        new TealOp(undefined, Ops.add),
        new TealOp(undefined, Ops.int, [0]),
        new TealOp(undefined, Ops.int, [0]),
        new TealOp(undefined, Ops.add),
        new TealOp(undefined, Ops.int, [1]),
        new TealOp(undefined, Ops.add),
      ];

      const expected = [
        new TealOp(undefined, Ops.intcblock, ["TMPL_INT_1", 0]),
        new TealOp(undefined, Ops.intc_0, ["//", "TMPL_INT_1"]),
        new TealOp(undefined, Ops.intc_0, ["//", "TMPL_INT_1"]),
        new TealOp(undefined, Ops.eq),
        new TealOp(undefined, Ops.pushint, ["TMPL_INT_2", "//", "TMPL_INT_2"]),
        new TealOp(undefined, Ops.add),
        new TealOp(undefined, Ops.intc_1, ["//", 0]),
        new TealOp(undefined, Ops.intc_1, ["//", 0]),
        new TealOp(undefined, Ops.add),
        new TealOp(undefined, Ops.pushint, [1, "//", 1]),
        new TealOp(undefined, Ops.add),
      ];

      const actual = createConstantBlocks(ops);
      expect(actual).toEqual(expected);
    });

    it("test_createConstantBlocks_tmpl_bytes", function () {
      const ops = [
        new TealOp(undefined, Ops.byte, ["TMPL_BYTES_1"]),
        new TealOp(undefined, Ops.byte, ["TMPL_BYTES_1"]),
        new TealOp(undefined, Ops.eq),
        new TealOp(undefined, Ops.byte, ["TMPL_BYTES_2"]),
        new TealOp(undefined, Ops.concat),
      ];

      const expected = [
        new TealOp(undefined, Ops.bytecblock, ["TMPL_BYTES_1"]),
        new TealOp(undefined, Ops.bytec_0, ["//", "TMPL_BYTES_1"]),
        new TealOp(undefined, Ops.bytec_0, ["//", "TMPL_BYTES_1"]),
        new TealOp(undefined, Ops.eq),
        new TealOp(undefined, Ops.pushbytes, [
          "TMPL_BYTES_2",
          "//",
          "TMPL_BYTES_2",
        ]),
        new TealOp(undefined, Ops.concat),
      ];

      const actual = createConstantBlocks(ops);
      expect(actual).toEqual(expected);
    });

    it("test_createConstantBlocks_tmpl_bytes_mixed", function () {
      const ops = [
        new TealOp(undefined, Ops.byte, ["TMPL_BYTES_1"]),
        new TealOp(undefined, Ops.byte, ["TMPL_BYTES_1"]),
        new TealOp(undefined, Ops.eq),
        new TealOp(undefined, Ops.byte, ["TMPL_BYTES_2"]),
        new TealOp(undefined, Ops.concat),
        new TealOp(undefined, Ops.byte, ["0x00"]),
        new TealOp(undefined, Ops.byte, ["0x00"]),
        new TealOp(undefined, Ops.concat),
        new TealOp(undefined, Ops.byte, ["0x01"]),
        new TealOp(undefined, Ops.concat),
      ];

      const expected = [
        new TealOp(undefined, Ops.bytecblock, ["TMPL_BYTES_1", "0x00"]),
        new TealOp(undefined, Ops.bytec_0, ["//", "TMPL_BYTES_1"]),
        new TealOp(undefined, Ops.bytec_0, ["//", "TMPL_BYTES_1"]),
        new TealOp(undefined, Ops.eq),
        new TealOp(undefined, Ops.pushbytes, [
          "TMPL_BYTES_2",
          "//",
          "TMPL_BYTES_2",
        ]),
        new TealOp(undefined, Ops.concat),
        new TealOp(undefined, Ops.bytec_1, ["//", "0x00"]),
        new TealOp(undefined, Ops.bytec_1, ["//", "0x00"]),
        new TealOp(undefined, Ops.concat),
        new TealOp(undefined, Ops.pushbytes, ["0x01", "//", "0x01"]),
        new TealOp(undefined, Ops.concat),
      ];

      const actual = createConstantBlocks(ops);
      expect(actual).toEqual(expected);
    });

    it("test_createConstantBlocks_tmpl_all", function () {
      const ops = [
        new TealOp(undefined, Ops.byte, ["TMPL_BYTES_1"]),
        new TealOp(undefined, Ops.byte, ["TMPL_BYTES_1"]),
        new TealOp(undefined, Ops.eq),
        new TealOp(undefined, Ops.byte, ["TMPL_BYTES_2"]),
        new TealOp(undefined, Ops.concat),
        new TealOp(undefined, Ops.byte, ["0x00"]),
        new TealOp(undefined, Ops.byte, ["0x00"]),
        new TealOp(undefined, Ops.concat),
        new TealOp(undefined, Ops.byte, ["0x01"]),
        new TealOp(undefined, Ops.concat),
        new TealOp(undefined, Ops.len),
        new TealOp(undefined, Ops.int, ["TMPL_INT_1"]),
        new TealOp(undefined, Ops.int, ["TMPL_INT_1"]),
        new TealOp(undefined, Ops.eq),
        new TealOp(undefined, Ops.int, ["TMPL_INT_2"]),
        new TealOp(undefined, Ops.add),
        new TealOp(undefined, Ops.int, [0]),
        new TealOp(undefined, Ops.int, [0]),
        new TealOp(undefined, Ops.add),
        new TealOp(undefined, Ops.int, [1]),
        new TealOp(undefined, Ops.add),
        new TealOp(undefined, Ops.eq),
      ];

      const expected = [
        new TealOp(undefined, Ops.intcblock, ["TMPL_INT_1", 0]),
        new TealOp(undefined, Ops.bytecblock, ["TMPL_BYTES_1", "0x00"]),
        new TealOp(undefined, Ops.bytec_0, ["//", "TMPL_BYTES_1"]),
        new TealOp(undefined, Ops.bytec_0, ["//", "TMPL_BYTES_1"]),
        new TealOp(undefined, Ops.eq),
        new TealOp(undefined, Ops.pushbytes, [
          "TMPL_BYTES_2",
          "//",
          "TMPL_BYTES_2",
        ]),
        new TealOp(undefined, Ops.concat),
        new TealOp(undefined, Ops.bytec_1, ["//", "0x00"]),
        new TealOp(undefined, Ops.bytec_1, ["//", "0x00"]),
        new TealOp(undefined, Ops.concat),
        new TealOp(undefined, Ops.pushbytes, ["0x01", "//", "0x01"]),
        new TealOp(undefined, Ops.concat),
        new TealOp(undefined, Ops.len),
        new TealOp(undefined, Ops.intc_0, ["//", "TMPL_INT_1"]),
        new TealOp(undefined, Ops.intc_0, ["//", "TMPL_INT_1"]),
        new TealOp(undefined, Ops.eq),
        new TealOp(undefined, Ops.pushint, ["TMPL_INT_2", "//", "TMPL_INT_2"]),
        new TealOp(undefined, Ops.add),
        new TealOp(undefined, Ops.intc_1, ["//", 0]),
        new TealOp(undefined, Ops.intc_1, ["//", 0]),
        new TealOp(undefined, Ops.add),
        new TealOp(undefined, Ops.pushint, [1, "//", 1]),
        new TealOp(undefined, Ops.add),
        new TealOp(undefined, Ops.eq),
      ];

      const actual = createConstantBlocks(ops);
      expect(actual).toEqual(expected);
    });
  });
});
