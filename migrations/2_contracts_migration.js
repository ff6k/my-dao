const MyCoin = artifacts.require("MyCoin");
const MyDAO = artifacts.require("MyDAO");

module.exports = async function (deployer) {
    let addresses = await web3.eth.getAccounts();
    const BN = web3.utils.BN; // BN: Big numbers.

    const amount = new BN('21000000000000000000000000'); //21000000*10^18;
    await deployer.deploy(MyCoin, "MyCoin", "MYC", amount, {from: addresses[0]});
    await deployer.deploy(MyDAO, MyCoin.address, {from: addresses[0]});
};
