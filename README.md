# Web3 Voting Application Test

Welcome to the Web3 Voting Application test project! This repository contains a series of tasks designed to assess your skills in web development and your ability to learn and apply Web3 concepts. You'll be building a simple decentralized voting application using Solidity, React, and Web3 technologies.

## Project Overview

The goal is to create a basic decentralized voting application where users can:
1. View a list of candidates
2. Cast votes for candidates
3. View the current vote counts

## Tasks

### 1. Smart Contract Development

Create a Solidity smart contract named `Voting.sol` with the following functionality:
- Add candidates
- Cast votes
- Retrieve voting results

**Requirements:**
- Use Solidity version 0.8.0 or higher
- Implement proper access control (only contract owner can add candidates)
- Ensure each address can only vote once

### 2. Frontend Development

Set up a React application with the following components:
- CandidateList: Displays all candidates
- VotingForm: Allows users to cast votes
- Results: Shows current vote counts

**Requirements:**
- Use functional components and hooks
- Implement basic styling (CSS or styled-components)
- Ensure responsive design

### 3. Web3 Integration

Integrate Web3 functionality into your React app:
- Connect to the Ethereum network (you can use a local testnet like Hardhat Network)
- Load the deployed smart contract
- Implement functions to interact with the smart contract

**Requirements:**
- Use either Web3.js or ethers.js library
- Handle connection states (connecting, connected, disconnected)
- Implement error handling for failed transactions

### 4. Testing and Debugging

Write tests and implement debugging strategies:
- Create unit tests for the smart contract
- Add error handling in the frontend
- Use console.log statements to aid debugging

**Requirements:**
- Use a testing framework like Hardhat or Truffle for smart contract tests
- Implement at least 3 test cases for the smart contract
- Add meaningful error messages and console logs

### 5. Documentation and Explanation

Document your code and explain your design decisions:
- Add comments to your code explaining complex logic
- Create a DESIGN.md file explaining your architecture and any important decisions
- Document any challenges you faced and how you overcame them

### Bonus Task: Gas Optimization

Optimize your smart contract to reduce gas costs:
- Identify areas where gas usage can be reduced
- Implement optimizations
- Explain your optimizations in the DESIGN.md file

## Getting Started

1. Fork this repository
2. Clone your forked repository locally
3. Install dependencies (you may need to initialize a new npm project)
4. Complete the tasks in order, committing your changes frequently
5. Push your changes to your forked repository
6. Create a pull request to this repository when you're finished

## Evaluation Criteria

Your submission will be evaluated based on:
1. Code quality and organization
2. Understanding and implementation of Web3 concepts
3. Problem-solving approach and ability to learn new technologies
4. Testing and debugging skills
5. Documentation and communication of ideas
6. Git usage and commit history

## Resources

- [Solidity Documentation](https://docs.soliditylang.org/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Web3.js Documentation](https://web3js.readthedocs.io/)
- [ethers.js Documentation](https://docs.ethers.io/)
- [Hardhat Documentation](https://hardhat.org/getting-started/)

Good luck, and we look forward to seeing your solution!