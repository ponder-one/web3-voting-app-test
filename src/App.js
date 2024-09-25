import React from "react";
import { ethers } from "ethers";
import styled from "styled-components";
import {abi} from "./constants";
import Login from "./components/Login";
import CandidateList from "./components/CandidateList";

function App() {
  const [provider, setProvider] = React.useState(null);
  const [signer, setSigner] = React.useState(null);
  const [votingContract, setVotingContract] = React.useState(null);
  const [candidates, setCandidates] = React.useState([]);
  const [hasVoted, setHasVoted] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [account, setAccount] = React.useState(null);
  const [isOwner, setIsOwner] = React.useState(false);
  const [isVotingActive, setIsVotingActive] = React.useState(true);
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with your deployed contract address

  async function initWallet() {
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
      const owner = await contract.owner();
      if(owner==address){
        setIsOwner(true);
      }
      

      const hasVoted = await contract.hasVoted(address);
      setHasVoted(hasVoted);
      setVotingContract(contract);
      
    } catch (error) {
      console.error("Error connecting ", error);
    }
  }

  const initContract = async()=>{
    try {
      const contract = new ethers.Contract(
        contractAddress,
        abi,
        provider
      );
      const votingStatus = await contract.votingEnded();
      setIsVotingActive(!votingStatus);
      const hasVoted = await contract.hasVoted(address);
      setHasVoted(hasVoted);
      setVotingContract(contract);
    } catch (error) {
      console.error("Error initializing contract ", error);
      
    }

  }

  React.useEffect(()=>{
    if(isLoggedIn){
      initContract();
    }

  },[isLoggedIn])

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
      const owner = await votingContract.owner();
      if(owner==address){
        setIsOwner(true);
      }else{
        setIsOwner(false);
      }
    }else{
      setIsLoggedIn(false);
      setAccount(null);
    }
  }

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
      let candidatesList= await votingContract.getAllCandidates();
      const formattedCandidates = candidatesList.map((candidate) => ({
        id: ethers.BigNumber.from(candidate[0]).toNumber(), 
        name: candidate[1],
        voteCount: ethers.BigNumber.from(candidate[2]).toNumber() 
    }));
      console.log("setting candidates", formattedCandidates);
      setCandidates(formattedCandidates);
     
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
      const transaction = await contractWithSigner.vote(id);
      await transaction.wait()
      setHasVoted(true);
    } catch (err) {
      console.error(err);
    }
  };

  const endVote=async()=>{
    try {
      const signer = provider.getSigner();
      setSigner(signer);
      const contractWithSigner = votingContract.connect(signer);
      console.log("contractWithSigner", contractWithSigner)
      const transaction = await contractWithSigner.endVote();
      await transaction.wait();
      setIsVotingActive(false);

    } catch (err) {
      console.error(err);
      
    }
  }
  return isLoggedIn ? (
    <Container>
      <Title>Vote for the best candidate</Title>
      <span> You are connected with: {account} </span>
      <CandidateList candidates={candidates} voteForCandidate={voteForCandidate} hasVoted={hasVoted} isVotingActive={isVotingActive} isOwner={isOwner} endVote={endVote}/>
    </Container>
  ) : (
    <Login initWallet = {initWallet}/>
      
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;


const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  text-align: center;
`;



export default App;
