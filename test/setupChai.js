"use strict";

const BN = web3.utils.BN; // BN: Big numbers.
const chai = require("chai");
const chaiBN = require("chai-bn")(BN);
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiBN);
chai.use(chaiAsPromised);

const expect = chai.expect; // To use expect.

// NOTE: Export preconfigured chai so that it can be imported and reused in each 
// test file.
// Why: If there are several test files, chai must be configured only once because 
// doing the same thing to each file gives an error.
module.exports = { chai, expect, BN };

/*
How to use this file:
• In the test file, add the code bellow to use chai with this configuration:
...
const MyContract = artifacts.require("MyContract");
...
//#region Chai init
const { chai, expect, BN } = require("./setup-chai.js"); // Chai preconfiguration.
//#endregion
...
*/