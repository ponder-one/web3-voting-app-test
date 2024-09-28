const { expect } = require("chai");
const hre = require("hardhat");

describe("Voting", function () {
  let voting;
  beforeEach(async function () {
    const candidateNames = ["Alice", "Bob", "Charlie", "Diana", "Eve"];
    voting = await hre.ethers.deployContract("Voting", [candidateNames]);
  });

  it("Should deploy the contract", async function () {
    expect(voting.target).to.be.properAddress;
  });

  it("Should retrieve all candidates", async function () {
    let candidates = await voting.getAllCandidates();
    const formattedCandidates = candidates.map((candidate) => ({
      id: BigInt(candidate[0]).toString(),
      name: candidate[1],
      voteCount: BigInt(candidate[2]).toString(),
    }));

    expect(JSON.stringify(formattedCandidates)).to.be.equal(
      '[{"id":"1","name":"Alice","voteCount":"0"},{"id":"2","name":"Bob","voteCount":"0"},{"id":"3","name":"Charlie","voteCount":"0"},{"id":"4","name":"Diana","voteCount":"0"},{"id":"5","name":"Eve","voteCount":"0"}]'
    );
  });

  it("Should retrieve vote", async function () {
    const [owner, otherAccount] = await hre.ethers.getSigners();
    const connectedContract= voting.connect(otherAccount);
    await connectedContract.vote(1);
    let candidates = await voting.getAllCandidates();
    const formattedCandidates = candidates.map((candidate) => ({
      id: BigInt(candidate[0]).toString(),
      name: candidate[1],
      voteCount: BigInt(candidate[2]).toString(),
    }));

    expect(JSON.stringify(formattedCandidates)).to.be.equal(
      '[{"id":"1","name":"Alice","voteCount":"1"},{"id":"2","name":"Bob","voteCount":"0"},{"id":"3","name":"Charlie","voteCount":"0"},{"id":"4","name":"Diana","voteCount":"0"},{"id":"5","name":"Eve","voteCount":"0"}]'
    );
    // await connectedContract.vote(2);
    await expect(connectedContract.vote(2)).to.be.revertedWith(
      "User already voted"
    );


  });
});
