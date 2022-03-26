# MyDAO

[![.github/workflows/ci.yml](https://github.com/ehsomma/mydao/actions/workflows/myDAO.yml/badge.svg)](https://github.com/ehsomma/mydao/actions/workflows/myDAO.yml)
[![Coverage Status](https://coveralls.io/repos/github/ehsomma/mydao/badge.svg?branch=master)](https://coveralls.io/github/ehsomma/mydao?branch=master)
[![Solhint](https://img.shields.io/badge/solhint-checked-success?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAuElEQVR42o3SsQ3CMBCFYVNABTVNSjrEANQsxABIGQYGYAWGSJggsAT+H4VtZDtnCUuvsORPvjudk+RmgaXgKuglLaw3FloJbgIRToGBHbA2kE8o5YeBLfg33t9bP9UBOEd8AU7/IAEvwUGwSWWnQdToY6AOGFLZLk4vRw/BEZiAKUNj3rMT9PGS4Bgf7hWSflIJQ8M1HgRdC4VSw1Qt/IyZoXoBLGwia3MsPEP2ypXYRC2Y4+aSfwGpKaEjgWMgaAAAAABJRU5ErkJggg==)](https://github.com/ehsomma/mydao/actions/workflows/myDAO.yml)
[![Slither](https://img.shields.io/badge/slither-checked-success?logoWidth=27&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAOCAYAAADez2d9AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAB50lEQVR42qXUTYiOURQH8Hd4x8dkFsqUZCEfZTOzMVJGFrKgfIREiaxkpexslJowTYSyIqWUsCNNUzRZKdE0G0rSFMoYjFlomlH3dy3mPm/X43nHwlO3p3vPOf//Of9z7q3FGGv/tcQWrMEunMQdjGEG73APm2KMtUYQ2nEOw5gUwhchPEB3FQlW4iI+IDZZLxNeQG8R2IE3lQEhBPRjfvJdiiuYnoOkWFMYxFOMF2Q3MoePqfShlFEUQsRDnMDXEuB79OEgurEaW/EKTyLz0ll3QfYpBY5gUSbVloZMs4QxpH9S4kBkXhOZ23EVZ9CFemEYSwDPY4wtWcAKIdwXQoMsVXsarZnfYuzAcexEW4m4H53F5m4myxB6k2wzTXpxIcW14SwmSvZx7M7IWhvTmDT9PkejR3A0gUSzX18a7dzvZ7LFlGhXXmENRxLhWjzKpmwKA9hX9AUbMVmRzAA2JJ91GE3nN8tkh7A3K3lBugqtFU3vwIsS0e0Kv+vJ9qxMVsc1nMfCZi8F9uBzRVUBl7AsYfVk033rD7IE1IUfeItTWJ8qXJKma7AEfhnbsikuzn9l++m/epZl3onX/3gRhtGTxSxPkxxKfqPYXlanLFUdx1Il3xLIBB5jv+YXeBUOp9jNqFf5/QZ0yR1YZEEXfAAAAABJRU5ErkJggg==)](https://github.com/ehsomma/mydao/actions/workflows/myDAO.yml)
[![GitHub Issues](https://img.shields.io/github/issues/ehsomma/mydao)](https://github.com/ehsomma/mydao/issues)
[![License](https://img.shields.io/badge/license-MIT-informational)](/LICENSE)

This project implements a basic voting DAO smart contract for research purposes to understand its inner workings. This is by no means a complete implementation. It also includes an ERC-20 contract to be used as a DAO governance token.

## Technical features and used tools
* **Truffle**
* **Ganache-cli**
* **Unit/Integration tests**
* **Chai** (expect)
* **truffle-assertions** (revert assertions)
* **openzeppelin/test-helpers** (time and block manipulation)
* **eth-gas-reporter**
* **solidity-coverage** (code coverage)
* **coveralls** (code coverage report)
* **solhint** (linter for Solidity)
* **slither** (vulnerability analyzer)
* **Full contract documentation** (NatSpec Format)
* **Solidity coding conventions**

## Main functions of the DAO
* Deposit governance tokens to be able to create a proposal.
* Create a proposal.
* Vote a proposal (only one time an in a time period).
* Withdraw the tokens.

> **NOTE:** For more information see code comments in [`MyDAO.sol`](./contracts/MyDAO.sol).

## Reports

### Solhint
`
solhint 'contracts/**/*.sol' -f table
`

<img src="./assets/screenshots/solhint-report.png?raw=true"/>

### Tests
`
truffle test
`

<img src="./assets/screenshots/test-report.png?raw=true"/>

### Code coverage
`
truffle run coverage
`

<img src="./assets/screenshots/coverage-report.png?raw=true)"/>

### Gas
`
truffle test --reporter eth-gas-reporter
`

<img src="./assets/screenshots/gas-report.png?raw=true)"/>

### Slither
`
slither --exclude-dependencies .
`

<img src="./assets/screenshots/slither-report.png?raw=true)"/>