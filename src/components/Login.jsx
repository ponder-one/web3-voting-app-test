import React from "react";
import styled from "styled-components";

const Login = ({initWallet}) => {
  return (
    <Container>
      <Title>Welcome to the voting application</Title>
      <Button onClick={initWallet}>
        <span style={{ fontSize: "1rem" }}> Login </span>
      </Button>
    </Container>
  );
};

const Container = styled.div`
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  text-align: center;
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

export default Login;
