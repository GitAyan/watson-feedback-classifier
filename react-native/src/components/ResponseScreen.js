
import React, { Component } from 'react';
import {
  Container, Header, Content, Input, Item, Button, Text, Icon,
  Left, Right, Body, List, ListItem, Card, CardItem, Tab, Tabs, TabHeading,
} from 'native-base';
import Expo, { Font } from "expo";

import {
  View, AppRegistry
} from 'react-native';



export default class ResponseScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {     
        responseOutput: props.responseOutput,     
        isReady: false
    };
  }
  async componentWillMount() {
    await Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("native-base/Fonts/Ionicons.ttf")
    });
    this.setState({ isReady: true });
  }

  render() {
    if (!this.state.isReady) {
      return <Expo.AppLoading />;
    }

    return (
      <Container>
        <Header hasTabs />
        <Item style={{ borderBottomWidth: 0 }} >
          <Button style={{ paddingTop: 40 }} transparent onPress={this.props.backToResponseScreenCallback}>
            <Icon name='arrow-back' />
          </Button>
          <Text style={{ paddingLeft: 20, paddingTop: 20, fontWeight: 'bold', fontSize: 25 }}>Response</Text>
        </Item> 
        <Text style={{ paddingLeft: 20, paddingTop: 20, fontWeight: 'bold', fontSize: 15 }}> {this.state.responseOutput}</Text>
      </Container>
    );
  }
}

