const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("VotingModule", (m) => {
  // The owner of the contract will be set to the deployer's address
  // const deployer = m.getDeployer();

  // Deploy the Voting contract without constructor arguments
  const voting = m.contract("Voting", [], {
    // from: deployer.address, // Setting the deployer as the owner
  });

  return { voting };
});
