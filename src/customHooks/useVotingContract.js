import React from "react";
import {abi} from "../constants";
import { ethers } from "ethers";



function useVotingContract(provider,signer){
    const [votingContract, setVotingContract] = React.useState(null);
    const [owner, setOwner] = React.useState(false);
    const [isVotingActive, setIsVotingActive] = React.useState(true);
    const [hasVoted, setHasVoted] = React.useState(false);
    const [isOwner, setIsOwner] = React.useState(false);
    const [candidates, setCandidates] = React.useState([]);

    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with your deployed contract address



    React.useEffect(()=>{
        if(provider){
            const contract = new ethers.BaseContract(
                contractAddress,
                abi,
                provider
              );
              setVotingContract(contract);
            async function runEffect() {
                try {
                    const owner = await contract.owner();
                    setOwner(owner);
                    const votingStatus = await contract.votingEnded();
                    setIsVotingActive(!votingStatus);
              
                    
                } catch (error) {
                    console.error(error);
                    
                }
                
            }
            runEffect();

        }
        
        
          

    },[provider]);
    

    React.useEffect(()=>{
        if(signer){
            hasUserVoted(signer);
            isUserOwner(signer);
    

        }

    },[signer])

    const hasUserVoted = async (signer)=>{
        try {
            const address = await signer.getAddress();
            const hasVoted = await votingContract.hasVoted(address);
            setHasVoted(hasVoted);
            
        } catch (error) {
            console.error(error);

        }

    }

    const isUserOwner= async(signer)=>{
        const address = await signer.getAddress();
        if(owner==address){
            setIsOwner(true);
          }else{
            setIsOwner(false);

          }

    }

    async function fetchCandidates() {
        try {
          console.log("fetching candidates");
          let candidatesList= await votingContract.getAllCandidates();
          const formattedCandidates = candidatesList.map((candidate) => ({
            id: Number(BigInt(candidate[0]).toString()), 
            name: candidate[1],
            voteCount: Number(BigInt(candidate[2]).toString()) 
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
          const contractWithSigner = votingContract.connect(signer);
          const transaction = await contractWithSigner.vote(id);
          await transaction.wait()
          setHasVoted(true);
        } catch (err) {
          console.error(err);
        }
      };

      const endVote=async()=>{
        try {
        //   const signer = provider.getSigner();
        //   setSigner(signer);
          const contractWithSigner = votingContract.connect(signer);
          const transaction = await contractWithSigner.endVote();
          await transaction.wait();
          setIsVotingActive(false);
    
        } catch (err) {
          console.error(err);
          
        }
      }
    

    return[
        votingContract,
        isVotingActive,
        hasVoted,
        isOwner,
        candidates,
        fetchCandidates,
        voteForCandidate,
        endVote
    ]



}

export default useVotingContract;