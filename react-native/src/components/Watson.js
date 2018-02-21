import React from 'react';
import { StyleSheet, View, Alert, Keyboard } from 'react-native';
import Expo, { Font } from "expo";
import {
  Container, Header, Content, Input, Item, Button, Text,
  Left, Right, Body, List, ListItem, Card, CardItem, Tab, Tabs, TabHeading, Spinner,
} from 'native-base';
import { tryAsk, sendEmail } from '../hasuraApi';
import TabScreen from './TabScreen';
import ResponseScreen from './ResponseScreen'


export default class Watson extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: props.username,
      email: props.email,
      user_id: props.user_id,
      sampleQuestion: '',
      jsonOutput: '',
      responseOutput: 'Thank you for your feedback',
      feedback: '',
      isReady: false,
      displayLabels: '',
      initialText: '',
      labelsArr: [],
      sentimentlabelsArr: [],
      entitiessentimentlabelsArr: [],
      isLoading: false,
      score: '',
      isTab: false,
      isResponse: false
    }
    this.backToWatsonScreen = this.backToWatsonScreen.bind(this);
    this.backToResponseScreen = this.backToResponseScreen.bind(this);
  }
  async componentWillMount() {
    await Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("native-base/Fonts/Ionicons.ttf")
    });
    this.setState({ isReady: true });
  }


  handleQuestionChange = sampleQuestion => {
    this.setState({
      ...this.state,
      sampleQuestion: sampleQuestion
    })    
  }

  handleAskPressed = async () => {
    // Hide that keyboard!
    Keyboard.dismiss()
    this.setState({
      isLoading: true
    });
    if (this.state.sampleQuestion == '') {
      this.setState({
        isLoading: false
      });
      Alert.alert("Enter Question")
    }
    else {
      let resp = await tryAsk(this.state.sampleQuestion, this.state.username);
      if (resp.status !== 200) {
        if (resp.status === 504) {
          this.setState({
            isLoading: false
          });
          Alert.alert("Network Error", "Check your internet connection")
        } else {
          this.setState({
            isLoading: false
          });
          Alert.alert("Error", "Unauthorized, Invalid sample question")
        }
      } else {
        console.log("json respons......: " + resp);
        const myObjStr = JSON.stringify(resp);
        this.setState({
          ...this.state,
          jsonOutput: myObjStr
        })
        let response = JSON.parse(myObjStr);
        console.log(response._bodyText);
        if (response._bodyText.includes("error: Error:")) {
          this.setState({
            isLoading: false
          });
          Alert.alert("Not enough text or wrong text provided for language detection")
        }
        else {
          let parse = JSON.parse(response._bodyText);
          var itemsLength = parse.categories.length;
          if (itemsLength === 0) {
            Alert.alert("No categories found")
          }
          else {
            console.log("itemsLength" + itemsLength);
            //added code to display labels
            var arr = Object.values(parse.categories);
            var labels = [];
            let sc;
            parse.categories.forEach(function (lab) {
              sc = parseFloat(((lab.score) * 100).toFixed(2));
              labels.push('[' + sc + '%]   ' + lab.label);
            });
            console.log("Display labels......: " + labels.toString());
            this.state.displayLabels = labels.toString();
            this.state.initialText = "Natural Language Classifier is confident that the question submitted is related to ---";
            this.state.labelsArr = labels;
            console.log("Display labels this.state.labelsArr......: " + this.state.labelsArr);
            //setting for passing to other page
            this.setState({ ...this.state, isTab: true });
            this.setState({
              isLoading: false
            });
          }
        }
      }
    }
  }


  handlefeedback = async () => {
    // Hide that keyboard!
    Keyboard.dismiss()
    this.setState({
      isLoading: true
    });

    if (this.state.sampleQuestion == '') {
      this.setState({
        isLoading: false
      });
      Alert.alert("Enter Feedback")
    }
    else {
      let resp = await tryAsk(this.state.sampleQuestion, this.state.username);
      if (resp.status !== 200) {
        if (resp.status === 504) {
          this.setState({
            isLoading: false
          });
          Alert.alert("Network Error", "Check your internet connection")
        }else if(resp.status === 500) {
          this.setState({
            isLoading: false
          });
          Alert.alert("Error", "We are having issues connecting. Please try again later.")
        }
         else {
          this.setState({
            isLoading: false
          });
          Alert.alert("Error", "Unauthorized, Invalid Feedback")
        }
      } else {
        const myObjStr = JSON.stringify(resp);
        let response = JSON.parse(myObjStr);
        if (response._bodyText.includes("error: Error:")) {
          this.setState({
            isLoading: false
          });
          Alert.alert("Not enough feedback or wrong feedback provided for analysis")
        }
        else {
          let parse = JSON.parse(response._bodyText);
          var itemsLength = parse.keywords.length;
          var itemsentitiesLength = parse.entities.length;
          if (itemsLength === 0) {
            Alert.alert("Watson cannot process the feedback")//no keywords found
          }
          else {
            //added code to display labels
            var arrkey = Object.values(parse.keywords);
            console.log("Disp......: " + arrkey.toString());
            var labelentities = [];
            var labelskeywords = [];
            parse.keywords.forEach(function (senti) {
              labelskeywords.push(senti.sentiment.label);
            });
            console.log("Display keywords labels......: " + labelskeywords.toString());
            this.state.sentimentlabelsArr = labelskeywords;
            console.log("Display labels this.state.labelsArrkeywords......: " + this.state.sentimentlabelsArr);
            var neu = this.state.sentimentlabelsArr.indexOf("neutral"); //keywrd neutral
            var p = this.state.sentimentlabelsArr.indexOf("positive");
            var n = this.state.sentimentlabelsArr.indexOf("negative");
            var e;
            if (itemsentitiesLength !== 0) {
              parse.entities.forEach(function (sentim) {
                labelentities.push(sentim.sentiment.label);
              });
              console.log("Display entities labels......: " + labelentities.toString());
              this.state.entitiessentimentlabelsArr = labelentities;
              console.log("Display labels this.state.entitiessentimentlabelsArr......: " + this.state.entitiessentimentlabelsArr);
              //for entities
              e = this.state.entitiessentimentlabelsArr.indexOf("neutral");
              en = this.state.entitiessentimentlabelsArr.indexOf("negative");
              ep = this.state.entitiessentimentlabelsArr.indexOf("positive");
              console.log("Check e......: " + e);
              //keywrd neutral/pos/neg entity neutral or no keywrd and entity neutral
              if ((e !== -1 && neu !== -1) || (e !== -1 && p !== -1) || (e !== -1 && n !== -1) || (e !== -1 && itemsLength === 0)) {
                this.state.score = "10";              
              }
              else if (en !== -1) { // if entity negative
                this.state.score = "30";               
              }
              else {
                if (ep !== -1) { //if entity positive
                  this.state.score = "20";                
                }
              }
            }

            console.log("Check n......................" + n);
            console.log("Check p......................" + p);
            console.log("Check neu......................" + neu);
            console.log("Check e......................" + e);
            //for keywords 
            if (e === undefined) {
              //negative-neutral or positive-neutral 
              if (((n !== -1 && neu !== -1)) || ((p !== -1 && neu !== -1))) {
                this.state.score = "10";              
              }
              else if (p !== -1) {  //for positive keyword
                this.state.score = "20";             
              }
              else if (n !== -1) { // for negative   keywrd 
                this.state.score = "30";               
              }
              else if (neu !== -1) { // for neutral  keywrd 
                this.state.score = "10";              
              }
              else {
                this.state.score = "0";
                this.state.responseOutput = "No Feedback";
                this.setState({ ...this.state, isResponse: true });
              }
            }


            //send email to customer
            if (this.state.score !== 0) {
              let respemail = await sendEmail(this.state.sampleQuestion, this.state.username, this.state.email, this.state.score, this.state.user_id);
              if (respemail.status !== 200) {
                if (respemail.status === 504) {
                  this.setState({
                    isLoading: false
                  });
                  Alert.alert("Network Error", "Check your internet connection")
                } else if(respemail.status === 502){
                  this.setState({
                    isLoading: false
                  });
                  Alert.alert("Network Error", "Bad Gateway")
                }else if(respemail.status === 500) {
                  this.setState({
                    isLoading: false
                  });
                  Alert.alert("Error", "We are having issues connecting. Please try again later.")
                }                
                else {
                  this.setState({
                    isLoading: false
                  });
                  Alert.alert("Error", "Unauthorized, Invalid Feedback")//invalid credentials
                }
              } else {
                this.setState({ ...this.state, isResponse: true });
              }
            }

            this.setState({
              isLoading: false
            });
          }
        }
      }
    }
  }

  backToWatsonScreen() {
    this.setState({
      isTab: false
    })
  }

  backToResponseScreen() {
    
    this.setState({
      isResponse: false
    })

  }

  render() {
    if (!this.state.isReady) {
      return <Expo.AppLoading />;
    }
    if (this.state.isTab) {
      return (
        <TabScreen initialText={this.state.initialText}
          jsonOutput={this.state.jsonOutput} labelsArr={this.state.labelsArr} backToWatsonScreenCallback={this.backToWatsonScreen} />
      );
    }
    else if (this.state.isResponse) {
      return (
        <ResponseScreen
          responseOutput={this.state.responseOutput} backToResponseScreenCallback={this.backToResponseScreen} />
      );
    }
    else {
      return (
        <Container>
          <Header>
            <Content>
              {
                this.state.isLoading ?
                  <Button transparent disabled onPress={this.props.logoutCallback}>
                    <Text style={{ paddingTop: 20, fontSize: 15, color: 'white', textDecorationLine: 'underline' }} > logout</Text>
                  </Button>
                  : <Button transparent onPress={this.props.logoutCallback}>
                    <Text style={{ paddingTop: 20, fontSize: 15, color: 'white', textDecorationLine: 'underline' }} > logout</Text>
                  </Button>
              }

            </Content>
          </Header>
          <Content>
            <Text style={{ paddingLeft: 20, paddingTop: 10, fontWeight: 'bold', fontSize: 20 }}> Watson Language Classifier &</Text>
            <Text style={{ paddingLeft: 20, paddingTop: 0, fontWeight: 'bold', fontSize: 20 }}> Feedback Analyser</Text>
            <Left style={{ paddingTop: 10 }} >
              <Item regular>
                <Input multiline={true} numberOfLines={8} placeholder='Ask sample question/Give feedback.' value={this.state.sampleQuestion} onChangeText={this.handleQuestionChange} />
              </Item>
            </Left>

            <Right style={{ paddingTop: 15 }} >
              {
                this.state.isLoading ?
                  <Button disabled rounded onPress={this.handleAskPressed}>
                    <Text>Categories</Text>
                  </Button>
                  : <Button rounded style={{ backgroundColor: '#3F51B5' }} onPress={this.handleAskPressed}>
                    <Text>Categories</Text>
                  </Button>
              }
            </Right>
            <Right style={{ paddingTop: 35 }} >
              {
                this.state.isLoading ?
                  <Button disabled rounded onPress={this.handlefeedback}>
                    <Text>Submit feedback</Text>
                  </Button>
                  : <Button rounded style={{ backgroundColor: '#3F51B5' }} onPress={this.handlefeedback}>
                    <Text>Submit feedback</Text>
                  </Button>
              }
            </Right>
            {
              this.state.isLoading ? <Spinner color='green' /> : null
            }

          </Content>
        </Container>
      );
    }//else close
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


