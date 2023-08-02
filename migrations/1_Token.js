const Token = artifacts.require('ERC20');

module.exports = function(deployer){
    deployer.deploy(Token, 'German', 'GMN', '18', '10000')
}