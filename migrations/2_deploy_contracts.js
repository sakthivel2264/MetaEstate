const Land = artifacts.require("Land")

module.exports = async function (deployer) {
    const NAME = 'MetaEstate Buildings'
    const SYMBOL = 'MEB'
    const COST = web3.utils.toWei('1', 'ether')

    await deployer.deploy(Land, NAME, SYMBOL, COST)
}
