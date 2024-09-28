import React from "react";
import styled from "styled-components";
import Results from "./Results";


const CandidateList = ({candidates, voteForCandidate, hasVoted, isVotingActive, isOwner, endVote}) => {
    const getWinner = ()=>{
        return candidates.toSorted((a,b)=> b.voteCount - a.voteCount)[0];
      }
    
    const getTitle=()=>{
        if(!isVotingActive){
            return "Voting has ended."
        }
        if(hasVoted){
            return "You have already voted."
        }
    }
    return (
        <Container>
           <Title>{getTitle()}</Title>
          {!isVotingActive&& (<Results winner={getWinner()}/>)}
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
              onClick={async() => {
                await voteForCandidate(candidate.id)}}
              disabled={hasVoted || !isVotingActive}
            >
              <span style={{ fontSize: "1rem" }}>
                Vote
              </span>
            </Button>
          </CandidateItem>
        ))}
        {isOwner&&isVotingActive&&(<EndVoteButton onClick={async ()=>{await endVote();}}>End Vote</EndVoteButton>)}
      </Container>
    )
}
const Container = styled.div`
  margin-top: 20px;
  text-align: center;
`;
const Title = styled.h2`
    font-size: 1.5rem;
    color: #4caf50;
    text-align: center;
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

const EndVoteButton = styled(Button)`
    width: 80%;
    font-size: 1.5rem;
`;

export default CandidateList;