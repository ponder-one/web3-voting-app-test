import React from "react";
import { ethers } from "ethers";
import styled from "styled-components";
// const Voting = require("./artifacts/contracts/Voting.sol/Voting.json");
import {abi} from "./constants";

function App() {
  const [provider, setProvider] = React.useState(null);
  const [signer, setSigner] = React.useState(null);
  const [votingContract, setVotingContract] = React.useState(null);
  const [candidates, setCandidates] = React.useState([]);
  const [hasVoted, setHasVoted] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [account, setAccount] = React.useState(null);
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with your deployed contract address

  async function initBlockchain() {
    if (!window.ethereum) {
      console.error("Metamask is not detected in the browser");
      return;
    }
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
     setProvider(provider);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      setSigner(signer);
      const address = await signer.getAddress();
      console.log("Metamask connected: ", address);
      setAccount(address);
      setIsLoggedIn(true);
      const contract = new ethers.Contract(
        contractAddress,
        abi,
        provider
      );
      // const signedContract = contract.connect(signer);
      // await signedContract.vote(1);
      // console.log("signedContract", signedContract)
      const owner = await contract.owner();
      const hasVoted = await contract.hasVoted(address);
      setHasVoted(hasVoted);
      console.log("hasVoted", hasVoted)
      console.log("owner",owner)
      console.log(contract);
      setVotingContract(contract);
    } catch (error) {
      console.error("Error connecting", error);
    }
  }

  React.useEffect(()=>{
    if(window.ethereum){
      window.ethereum.on('accountsChanged', handleChangeAccount);
    }
    return ()=>{
      if(window.ethereum){
        window.ethereum.removeListener('accountsChanged', handleChangeAccount);
      }
    }
  })

  const handleChangeAccount = async (accounts)=>{
    if(accounts.length>0 && accounts[0]!=account){
      console.log(accounts[0]);
      setAccount(accounts[0]);
      const address = await signer.getAddress();
      const hasVoted = await votingContract.hasVoted(address);
      setHasVoted(hasVoted);
    }else{
      setIsLoggedIn(false);
      setAccount(null);
    }
  }

  // React.useEffect(() => {
  //   async function initBlockchain() {
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     const signer = provider.getSigner();
  //     setProvider(provider);
  //     setSigner(signer);

  //     const contract = new ethers.Contract(contractAddress, Voting.abi, provider);
  //     console.log(contract)
  //     setVotingContract(contract);
  //   }

  //   if (window.ethereum) {
  //     console.log("initializing the blockchain")
  //     initBlockchain();
  //   }else{
  //     console.error("Metamask is not detected in the browser")
  //   }
  // }, []);

  React.useEffect(() => {
    console.log("in1")
    if (votingContract) {
      console.log("in1")

      fetchCandidates();
    }
  }, [votingContract, hasVoted]);

  const fetchCandidates = async () => {
    try {
      console.log("fetching candidates");
      //  const count = await votingContract.candidatesCount();
      // console.log("count", count);
      let candidatesList= await votingContract.getAllCandidates();
      const formattedCandidates = candidatesList.map((candidate) => ({
        id: ethers.BigNumber.from(candidate[0]).toNumber(), 
        name: candidate[1],
        voteCount: ethers.BigNumber.from(candidate[2]).toNumber() // Convert hex to number
    }));
      console.log("setting candidates", formattedCandidates);
      setCandidates(formattedCandidates);
      // const candidatesList = [];

      // for (let i = 1; i <= count; i++) {
      //   const candidate = await votingContract.candidates(i);
      //   console.log(candidate);
      //   candidatesList.push(candidate);
      // }
      
      
      // const signedContract = votingContract.connect(signer);
      // //  await signedContract.addCandidate("Paul");
      // //  await votingContract.vote(1);
      // console.log("added candidate")
      // console.log("getting result", votingContract);

      // const result = await votingContract.getVotingResults(1);
      // console.log("result", result);
      // const code = await provider.getCode(contractAddress);
      // console.log("code",code)
     
    } catch (error) {
      console.error("error fetching candidates", error);
    }
  };

  const voteForCandidate = async (id) => {
    console.log("voting..",id)
    try {
      const signer = provider.getSigner();
      setSigner(signer);
      const address = await signer.getAddress();
      console.log("address", address)
      const contractWithSigner = votingContract.connect(signer);
      console.log("contractWithSigner", contractWithSigner)
      await contractWithSigner.vote(id);
      setHasVoted(true);
    } catch (err) {
      console.error(err);
    }
  };
  return isLoggedIn ? (
    <Container>
      <Title>Vote for the best candidate</Title>
      <span> You are connected with: {account} </span>
      <CandidateList>
        {candidates.map((candidate) => (
          <CandidateItem key={candidate.id}>
            <CandidateInfo>
              <span style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
                {candidate.name}
              </span>
              <span style={{ fontSize: "1rem" }}>
                {candidate.voteCount} Votes
              </span>
            </CandidateInfo>
            <Button
              onClick={() => voteForCandidate(candidate.id)}
              disabled={hasVoted}
            >
              <span style={{ fontSize: "1rem" }}>
                {" "}
                {hasVoted ? "Voted" : "Vote"}{" "}
              </span>
            </Button>
          </CandidateItem>
        ))}
      </CandidateList>
    </Container>
  ) : (
    <Login>
      <Title>Welcome to the voting application</Title>
      <Button onClick={initBlockchain}>
        <span style={{ fontSize: "1rem" }}> Login </span>
      </Button>
    </Login>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;
const Login = styled.div`
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  text-align: center;
`;

const CandidateList = styled.div`
  margin-top: 20px;
`;

const CandidateItem = styled.div`
  margin: 10px 0;
  padding: 10px;
  width: 300px;
  display: flex;
  justify-content: space-between;
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  border-radius: 8px;
  flex-wrap: wrap;
`;

const CandidateInfo = styled.div`
  display: flex;
  flex-direction: column;
  font-family: Tahoma, Verdana, sans-serif;
`;
const Button = styled.button`
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }

  &:disabled {
    border: 1px solid #999999;
    background-color: #cccccc;
    color: #666666;
    cursor: revert;
  }
`;

export default App;
