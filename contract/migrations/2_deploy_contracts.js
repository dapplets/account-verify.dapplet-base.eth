const DappletRegistry = artifacts.require("IdRegistry");

module.exports = function (deployer) {
  deployer.deploy(DappletRegistry);
};