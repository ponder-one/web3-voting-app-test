# Design Document
This project is a decentralized voting application built using Solidity for the backend and React.js for the frontend. The Ethereum smart contract manages voting, while the React app provides an interface for users to interact with the blockchain.

### Main Components

1. **Solidity Smart Contract (Voting.sol):**
   - Manages candidates, voting, and the election lifecycle.
   - Tracks whether users have voted using a mapping.
   - Provides mechanisms to vote, add candidates (by owner), and end voting.

2. **React Frontend:**
   - Users interact with the voting system using a simple UI.
   - Components for login (`Login`), candidate listing and voting (`CandidateList`), and displaying results (`Results`).
   - A custom hook (`useVotingContract`) abstracts contract interactions via ethers.js.
## Architecture

### Smart Contract (Voting.sol)

- **Owner and Permissions:**
  - The contract owner is set when deployed, and only the owner can add candidates or end voting.
  - Modifiers like `onlyOwner` and `votingActive` enforce permissions and ensure that voting is still open.

- **State Variables:**
  - `owner`: The address of the owner.
  - `votingEnded`: Boolean indicating whether voting has ended.
  - `candidatesCount`: The total number of candidates.
  - `candidates`: A mapping of candidate IDs to a `Candidate` struct (containing ID, name, and vote count).
  - `hasVoted`: A mapping tracking which users have already voted.

- **Key Functions:**
  - `addCandidate`: Allows the owner to add a candidate during an active voting session.
  - `vote`: Enables a user to vote for a candidate by ID if they haven't voted yet.
  - `endVote`: Ends the voting period.
  - `getVotingResults`: Returns the number of votes for each candidate.
  - `getAllCandidates`: Returns the list of all candidates.

### Frontend Architecture

The frontend is broken into multiple components for ease of maintenance:

1. **App.js**
   - Manages user login, interaction with Metamask, and contract connection.
   - Uses the `useVotingContract` hook to interact with the smart contract.
   - Fetches candidate data upon login and tracks voting operations.
   - Renders the appropriate UI based on login status (`Login` screen or `CandidateList`).

2. **useVotingContract.js (Custom Hook)**
   - Abstracts contract interactions via ethers.js.
   - Connects to the contract using the provider and signer.
   - Manages key states like `isVotingActive`, `hasVoted`, `isOwner`, and `candidates`.
   - Fetches candidate data, handles voting, and manages contract owner actions (like ending the vote).

3. **CandidateList.jsx**
   - Displays all candidates and their vote counts.
   - Allows users to vote if they haven’t already and if voting is still active.
   - Shows an `End Vote` button for the contract owner to terminate the voting session.

4. **Results.jsx**
   - Displays the winning candidate once voting has ended.

5. **Login.jsx**
   - Renders a login screen and manages the Metamask connection.

---

## Design Decisions

### 1. State Management with React and Ethers.js

- We separated contract logic from the UI using the `useVotingContract` hook, which keeps the React components clean and abstracts away contract interaction.
- Storing contract state (such as candidates, voting status) inside the hook ensures a single source of truth for contract-related data.

### 2. Dynamic UI Rendering

- The UI dynamically changes based on the user’s state:
  - Before login: the app shows a `Login` screen.
  - After login: the app displays the candidate list.
- Voting buttons are disabled if the user has already voted or if the voting session has ended.
- The contract owner can end the voting session, which is only visible to the owner.

### 3. Security Considerations

- Solidity’s `require` statements are used to prevent unauthorized actions such as double voting or non-owners ending the vote.
- In the frontend, errors (e.g., failed contract calls or connection issues) are caught and displayed to the user.

### 4. Error Handling

- Errors are managed globally via an error state in `App.js` and displayed in the UI.
- Example errors include failed connection to Metamask or failed contract interactions.

### 5. Flexibility for Future Updates

- The smart contract can easily be extended to include more features (e.g., adding a voting time limit).
- The React app’s modular structure makes it easy to integrate new contract methods and UI changes.

---


## Challenges and Solutions

### 1. Handling Metamask Integration

- **Challenge:** Ensuring seamless interaction with Metamask, especially handling account changes.
- **Solution:** We added an `accountsChanged` event listener to detect when the user switches accounts and update the signer and account state accordingly.

### 2. Dynamic UI Updates

- **Challenge:** Ensuring that the UI reflects the most up-to-date contract state (e.g., after a vote).
- **Solution:** We used React’s `useEffect` to fetch and update contract data whenever the contract or state (e.g., voting status) changes.

### 3. Asynchronous Contract Functions

- **Challenge:** Managing asynchronous contract functions and ensuring state updates in sync.
- **Solution:** We used asynchronous functions properly in the `useVotingContract` hook and React's state management to update the UI in sync with contract actions.

---

## Gas Optimizations
### Use of Smaller Data Types

- **Optimization**: Changed `uint256` to smaller types like `uint32` for candidate IDs and vote counts. This reduces gas consumption as smaller data types are cheaper to store and manipulate.
- **Impact**: Gas costs related to candidate creation and vote counting are reduced. Since the number of candidates and votes within the range of `uint32`, this optimization is safe and effective.

### Event-Based Retrieval

- **Optimization**:
  - Added two key events to enable real-time updates in off-chain applications:
    - `CandidateAdded`: Emitted whenever a new candidate is added. External off-chain applications (such as front-end clients) can listen to this event to track candidates without needing to repeatedly fetch all candidate data from the blockchain.
    - `Voted`: Emitted each time a user votes. Front-end applications can listen for this event to dynamically update the vote count for the relevant candidate in real time.

- **Impact**:
  - **Candidate Tracking**: By leveraging the `CandidateAdded` event, off-chain systems do not need to frequently call the `getAllCandidates()` function. This reduces gas usage as it minimizes the need for on-chain data fetching.
  - **Vote Count Updates**: The `Voted` event enables real-time vote tracking. Front-end applications can update the vote count for each candidate based on this event, reducing the number of contract calls required to keep vote counts accurate. This optimization results in fewer interactions with the blockchain and lower gas fees, while ensuring that vote counts are always up to date.