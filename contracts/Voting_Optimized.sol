// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Voting {
    address public owner;
    bool public votingEnded;
    struct Candidate {
        uint32 id; // Reduced size
        string name;
        uint32 voteCount;
    }

    uint32 public candidatesCount;
    mapping(uint32 => Candidate) public candidates; 
    mapping(address => bool) public hasVoted;
    event CandidateAdded(uint32 indexed id, string name);
    event Voted(address indexed voter, uint32 candidateId);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }
    modifier votingActive() {
        require(!votingEnded, "Voting has already ended");
        _;
    }


    constructor(string[] memory candidateNames) {
        for (uint32 i = 0; i < candidateNames.length; i++) {
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
        //emits event whenever candidate is added
        emit CandidateAdded(candidatesCount, name);
    }

    function vote(uint32 candidateId) public votingActive {
        require(!hasVoted[msg.sender], "User already voted");
        require(
            candidateId > 0 && candidateId <= candidatesCount,
            "Invalid candidate Id"
        );
        hasVoted[msg.sender] = true;
        candidates[candidateId].voteCount++;

        // Emit the Voted event
    emit Voted(msg.sender, candidateId);
    }
    function endVote() public votingActive {
        votingEnded = true;
    }

    function getVotingResults(uint32 candidateId) public view returns (uint32) {
        require(
            candidateId > 0 && candidateId <= candidatesCount,
            "Invalid candidate ID"
        );
        return candidates[candidateId].voteCount;
    }

    // Function to get all candidates
    function getAllCandidates() public view returns (Candidate[] memory) {
        Candidate[] memory candidateList = new Candidate[](candidatesCount);
        for (uint32 i = 1; i <= candidatesCount; i++) {
            candidateList[i - 1] = candidates[i];
        }
        return candidateList;
    }
}
