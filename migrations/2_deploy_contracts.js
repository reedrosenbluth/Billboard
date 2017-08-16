var Billboard = artifacts.require("./Billboard.sol");

module.exports = function(deployer) {
  deployer.deploy(Billboard, {gas: 4500000});
};
