//#region Imports

// Contracts.
const MyCoin = artifacts.require("MyCoin");
const MyDAO = artifacts.require("MyDAO");

// Chai.
const { chai, expect, BN } = require("./setupChai.js"); // Chai preconfiguration.

// Truffle assertions.
const truffleAssert = require('truffle-assertions');

// OpenZeppeling test helpers.
const {
    //BN,           // Big Number support.
    constants,      // Common constants, like the zero address and largest integers.
    expectEvent,    // Assertions for emitted events.
    expectRevert,   // Assertions for transactions that should fail.
    time,           // Block time manipulation.
} = require('@openzeppelin/test-helpers');

//#endregion

contract("myDAOTest", async accounts => {

    //#region Declarations.

    // Status for the Proposal.
    const Status = {
        Accepted: 0,
        Rejected: 1,
        Pending: 2
    };

    // Voting options.
    const VotingOptions = {
        Yes: 0,
        No: 1
    };

    const baseDepositAmount = new BN(web3.utils.toWei('20', 'ether')); //20*10^18; //20000000000000000000
    const bigDepositAmount = new BN(web3.utils.toWei('35', 'ether')); //35*10^18; //20000000000000000000
    const lowDepositAmount = new BN(web3.utils.toWei('10', 'ether')); //35*10^18; //10000000000000000000

    let daoAddress;
    let myTokenInstance;
    let myDAOInstance;

    //#endregion

    //#region Hooks.

    // Runs once before the first test in this block.
    before(async function () {
        myTokenInstance = await MyCoin.deployed();
        myDAOInstance = await MyDAO.deployed();
        daoAddress = myDAOInstance.address;

        console.log('MyCoin address: ', myTokenInstance.address);
        console.log('MyDAO address: ', daoAddress);
        console.log('accounts[0]', accounts[0]);
        console.log('accounts[1]', accounts[1]);
        console.log();

        await myTokenInstance.transfer(accounts[1], baseDepositAmount, { from: accounts[0], gas: 3000000 });
        await myTokenInstance.approve(accounts[1], baseDepositAmount, { from: accounts[0], gas: 3000000 });
        await myTokenInstance.approve(daoAddress, baseDepositAmount, { from: accounts[1], gas: 3000000 });

        await myTokenInstance.transfer(accounts[2], bigDepositAmount, { from: accounts[0], gas: 3000000 });
        await myTokenInstance.approve(accounts[2], bigDepositAmount, { from: accounts[0], gas: 3000000 });
        await myTokenInstance.approve(daoAddress, bigDepositAmount, { from: accounts[2], gas: 3000000 });

        await myTokenInstance.transfer(accounts[3], lowDepositAmount, { from: accounts[0], gas: 3000000 });
        await myTokenInstance.approve(accounts[3], lowDepositAmount, { from: accounts[0], gas: 3000000 });
        await myTokenInstance.approve(daoAddress, lowDepositAmount, { from: accounts[3], gas: 3000000 });
    });

    //#endregion

    //#region Tests

    it("myCoin must be initialized", async function () {
        // Arrange.

        // Act.
        const tokenName = await myTokenInstance.name();
        const tokenSymbol = await myTokenInstance.symbol();
        const tokenTotalSupply = await myTokenInstance.totalSupply();
        const amount = new BN(web3.utils.toWei('21000000', 'ether')); //21000000*10^18; //21000000000000000000000000

        console.log(tokenName, tokenSymbol, tokenTotalSupply, BN(tokenTotalSupply).toString());
        console.log();

        // Assert.
        expect(tokenName).to.be.equal('MyCoin');
        expect(tokenSymbol).to.be.equal('MYC');
        return expect(tokenTotalSupply).to.be.bignumber.equal(amount);
    });

    it("when depositing tokens they should be converted into shares", async function () {
        // Arrange.
        const previowsDaoShares = await myDAOInstance.totalShares();

        // Act.
        await myDAOInstance.deposit(baseDepositAmount, { from: accounts[1], gas: 3000000 });
        const shares = await myDAOInstance.shares(accounts[1]);
        const actualDaoShares = await myDAOInstance.totalShares();

        console.log('shares', BN(shares).toString());
        console.log();

        // Assert.
        expect(shares).to.be.bignumber.equal(baseDepositAmount);
        expect(actualDaoShares).to.be.bignumber.equal(previowsDaoShares.add(baseDepositAmount));
    });

    it("with the minimum shares it should be possible to create a proposal", async function () {
        // Arrange.
        const proposalName1 = 'Proposal 1';

        // Act.
        await myDAOInstance.createProposal(proposalName1, { from: accounts[1], gas: 3000000 });
        const proposal = await myDAOInstance.proposals(0);
        //console.log(proposal);

        // Assert.
        expect(proposal).to.have.property('name').that.is.equal(proposalName1);
        expect(proposal).to.have.property('status').that.is.bignumber.equal(new BN(Status.Pending));
    });

    it("if you haven't voted yet and it's within the allowed time period you should be able to vote (yes)", async function () {
        // Arrange.

        // Act.
        await myDAOInstance.vote(0, VotingOptions.Yes, { from: accounts[1], gas: 3000000 });
        const proposal = await myDAOInstance.proposals(0);

        // Assert.
        expect(proposal.status).to.be.bignumber.equal(new BN(Status.Accepted));
    });

    it("if you vote with a higher amount it should change the status of the proposal", async function () {
        // Arrange.

        // Act.
        // Account 2 votes with a bigger amount than Account 1.
        await myDAOInstance.deposit(bigDepositAmount, { from: accounts[2], gas: 3000000 });
        await myDAOInstance.vote(0, VotingOptions.No, { from: accounts[2], gas: 3000000 });
        const proposal = await myDAOInstance.proposals(0);

        // Assert.
        expect(proposal.status).to.be.bignumber.equal(new BN(Status.Rejected));
    });

    it("you should not be able to create a proposal with fewer than the required actions", async function () {
        // Arrange.
        const proposalName = 'Proposal 2';

        // Act.
        await myDAOInstance.deposit(lowDepositAmount, { from: accounts[3], gas: 3000000 });

        // Assert.
        await truffleAssert.fails(
            myDAOInstance.createProposal(proposalName, { from: accounts[3], gas: 3000000 }),
            truffleAssert.ErrorType.REVERT,
            'Not enough shares'
        );
    });

    it("should not be able to vote more than once for the same proposal", async function () {
        // Arrange.

        // Act.

        // Assert.
        await truffleAssert.fails(
            myDAOInstance.vote(0, VotingOptions.Yes, { from: accounts[1], gas: 3000000 }),
            truffleAssert.ErrorType.REVERT,
            'Already voted'
        );
    });

    it("you should be able to withdraw the deposited tokens", async function () {
        // Arrange.

        // Act.
        await myDAOInstance.withdraw(baseDepositAmount, { from: accounts[1], gas: 3000000 });
        const shares = await myDAOInstance.shares(accounts[1]);

        // Assert.
        expect(shares).to.be.bignumber.equal(new BN(0));
    });

    it("you should not be able to withdraw more than the deposited tokens", async function () {
        // Arrange.
        const bigWithdraw = new BN(web3.utils.toWei('100', 'ether'));

        // Act.

        // Assert.
        await truffleAssert.fails(
            myDAOInstance.withdraw(bigWithdraw, { from: accounts[1], gas: 3000000 }),
            truffleAssert.ErrorType.REVERT,
            'Amount exceed'
        );
    });

    it("it must change from Accepted to Rejected if the percentage of positive shares exceed the negative shares", async function () {
        // Arrange.
        const proposalName = 'Proposal 3';

        // Act.
        await myTokenInstance.approve(accounts[1], baseDepositAmount, { from: accounts[0], gas: 3000000 });
        await myTokenInstance.approve(daoAddress, baseDepositAmount, { from: accounts[1], gas: 3000000 });

        // Deposit and create a new proposal (from account[1]).
        await myDAOInstance.deposit(baseDepositAmount, { from: accounts[1], gas: 3000000 });
        await myDAOInstance.createProposal(proposalName, { from: accounts[1], gas: 3000000 });

        // Get the las proposal id created (uint256/BN).
        let lastProposalId = await myDAOInstance.proposalIndex();
        lastProposalId = lastProposalId.sub(new BN(1));

        // Vote for Yes with 2000000000000000000 (approved).
        await myDAOInstance.vote(lastProposalId, VotingOptions.Yes, { from: accounts[1], gas: 3000000 }); // 20000000.
        // Vote for No with 3500000000000000000 (rejected).
        await myDAOInstance.vote(lastProposalId, VotingOptions.No, { from: accounts[2], gas: 3000000 }); // 35000000.

        // Get the proposal to check the status.
        const proposal = await myDAOInstance.proposals(lastProposalId);

        // Assert.
        expect(proposal.status).to.be.bignumber.equal(new BN(Status.Rejected));
    });

    it("it must change from Rejected to Accepted if the percentage of negative shares exceed the positive shares", async function () {
        // Arrange.
        const proposalName = 'Proposal 4';

        await myDAOInstance.createProposal(proposalName, { from: accounts[1], gas: 3000000 });

        // Get the las proposal id created (uint256/BN).
        let lastProposalId = await myDAOInstance.proposalIndex();
        lastProposalId = lastProposalId.sub(new BN(1));

        // Act.
        // Vote for Yes with 2000000000000000000 (approved).
        await myDAOInstance.vote(lastProposalId, VotingOptions.No, { from: accounts[1], gas: 3000000 }); // 20000000.
        // Vote for No with 3500000000000000000 (rejected).
        await myDAOInstance.vote(lastProposalId, VotingOptions.Yes, { from: accounts[2], gas: 3000000 }); // 35000000.

        // Get the proposal to check the status.
        const proposal = await myDAOInstance.proposals(lastProposalId);

        // Assert.
        expect(proposal.status).to.be.bignumber.equal(new BN(Status.Accepted));
    });

    it("you should not be able to vote after the voting period", async function () {
        // Arrange.
        const proposalName = 'Proposal 5';
        await myDAOInstance.createProposal(proposalName, { from: accounts[1], gas: 3000000 });

        // Get the las proposal id created (uint256/BN).
        let lastProposalId = await myDAOInstance.proposalIndex();
        lastProposalId = lastProposalId.sub(new BN(1));

        await time.increase(864000); // Increase 10 days in seconds and mine block.

        // Act.
        
        // Assert.
        // Vote for Yes after the voting time period.
        await truffleAssert.fails(
            myDAOInstance.vote(lastProposalId, VotingOptions.Yes, { from: accounts[1], gas: 3000000 }),
            truffleAssert.ErrorType.REVERT,
            'Voting period is over'
        );
    });

    //#endregion 
});
