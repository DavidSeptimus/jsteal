# JsTeal [![CI](https://github.com/DavidSeptimus/jsteal/actions/workflows/main.yml/badge.svg)](https://github.com/DavidSeptimus/jsteal/actions/workflows/main.yml)

#### A community project providing TypeScript and JavaScript bindings for Algorand's TEAL contract language based on PyTeal.

> ⚠️ **This library is a work in progress and is not ready for use!**


All types and the core test suite have been implemented.

This module has not been packaged for or tested in any real-world environments.

The API has been changed where necessary to accommodate differences between Python and JavaScript language features.

* Mathematical operations on expressions are completed via method calls since JavaScript doesn't support
operator overloading.

Examples
* Verbose JS syntax: [Asset.ts](./examples/Asset.ts)
* Simplied with _Functions and spread arguments: [AssetSimplified.ts](./examples/AssetSimplified.ts)

