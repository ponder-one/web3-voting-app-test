import React from "react";
import styled from "styled-components";

const Results = ({ winner }) => {
  return (
    <Container>
      <h1>The winner is {winner?.name} </h1>
    </Container>
  );
};

const Container = styled.div`
  margin-top: 20px;
`;

export default Results;
