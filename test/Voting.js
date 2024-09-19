const { expect } = require("chai");

describe("Voting", function () {
  it("Should deploy the contract", async function () {
    const Voting = await ethers.getContractFactory("Voting");
    const voting = await Voting.deploy();
    await voting.deployed();

    expect(await voting.address).to.be.properAddress;
  });
});