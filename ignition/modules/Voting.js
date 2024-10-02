const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("VotingModule",  (m) => {
  // Define candidate names
  const candidateNames = ["Alice", "Bob", "Charlie", "Diana", "Eve"];

  const voting = m.contract("Voting", [candidateNames], {
  });
 

  return { voting };
});
