// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Voting {
    address public owner;
    bool public votingEnded;
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    uint public candidatesCount; // Number of candidates
    mapping(uint => Candidate) public candidates; // Maps candidate ids to Candidates
    mapping(address => bool) public hasVoted; // Keeps track of whether a user has voted

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }
    modifier votingActive() {
        require(!votingEnded, "Voting has already ended");
        _;
    }

    event CandidateAdded(uint indexed candidateId, string candidateName);

    constructor(string[] memory candidateNames) {
        for (uint256 i = 0; i < candidateNames.length; i++) {
        candidatesCount++; 
        candidates[candidatesCount] = Candidate({
            id: candidatesCount,
            name: candidateNames[i],
            voteCount: 0
        });
    }
        owner = msg.sender; // Set the contract deployer as the owner
    }

    // Function to add a candidate
    function addCandidate(string memory name) public onlyOwner votingActive {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, name, 0);
        emit CandidateAdded(candidatesCount, name);
    }

    function vote(uint candidateId) public votingActive {
        require(!hasVoted[msg.sender], "User already voted");
        require(
            candidateId > 0 && candidateId <= candidatesCount,
            "Invalid candidate Id"
        );
        hasVoted[msg.sender] = true;
        candidates[candidateId].voteCount++;
    }

    function getVotingResults(uint candidateId) public view returns (uint) {
        require(
            candidateId > 0 && candidateId <= candidatesCount,
            "Invalid candidate ID"
        );
        return candidates[candidateId].voteCount;
    }

    // Function to get all candidates
    function getAllCandidates() public view returns (Candidate[] memory) {
        Candidate[] memory candidateList = new Candidate[](candidatesCount);
        for (uint i = 1; i <= candidatesCount; i++) {
            candidateList[i - 1] = candidates[i];
        }
        return candidateList;
    }
}
