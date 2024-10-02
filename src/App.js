import React, { useState } from "react";
import { ethers } from "ethers";
import styled from "styled-components";
import Login from "./components/Login";
import CandidateList from "./components/CandidateList";
import useVotingContract from "./customHooks/useVotingContract";

function App() {
  const [provider, setProvider] = React.useState(null);
  const [signer, setSigner] = React.useState(null);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [account, setAccount] = React.useState(null);
  const [error, setError] = useState("");

  const [
    votingContract,
    isVotingActive,
    hasVoted,
    isOwner,
    candidates,
    fetchCandidates,
    voteForCandidate,
    endVote
  ]= useVotingContract(provider,signer, setError);

  async function initWallet() {
    if (!window.ethereum) {
      console.error("Metamask is not detected in the browser");
      setError("Metamask is not detected in the browser")
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      setSigner(signer);
      const address = await signer.getAddress();
      console.log("Metamask connected: ", address);
      setAccount(address);      
      setIsLoggedIn(true);
      
    } catch (error) {
      console.error("Error connecting ", error);
      setError("Error connecting to metamask");
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
      const signer = await provider?.getSigner();
      setSigner(signer);

    }else{
      setIsLoggedIn(false);
      setAccount(null);
    }
  }

    React.useEffect(() => {
    if (votingContract) {
      fetchCandidates();
    }
  }, [votingContract, hasVoted]);

  
  

  return isLoggedIn ? (
    <>
    <Container>
      <Title>Vote for the best candidate</Title>
      <Error> {error} </Error>
      <span> You are connected with: {account} </span>
      <CandidateList candidates={candidates} voteForCandidate={voteForCandidate} hasVoted={hasVoted} isVotingActive={isVotingActive} isOwner={isOwner} endVote={endVote}/>
    </Container>
    </>
  ) : (
    <>
          

    <Login initWallet = {initWallet}/>
    <Error> {error} </Error>
    </>

      
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

const Error = styled.h3`
    font-size: 1.5rem;
    color: #ff3333;
    text-align: center;

`;



export default App;
