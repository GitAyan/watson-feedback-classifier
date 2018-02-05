import React from 'react';
import { Container } from 'native-base';
import AuthScreen from './src/components/AuthScreen';


export default class App extends React.Component {
  
  render() {
    console.log("App started")
    return (
      <Container>
        <AuthScreen/>
      </Container>
    );
  }
}
