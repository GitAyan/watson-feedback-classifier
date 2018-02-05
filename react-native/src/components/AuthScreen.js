import React from 'react';
import { Container, Header, Title, Content, Button, Left, Body, Text, Form, Item, Label, Input, Right, Spinner } from 'native-base';
import { View, Alert ,Keyboard} from 'react-native';
import { tryLogin } from '../hasuraApi';
import Watson from './Watson';


export default class AuthScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      usernameTextBox: '',
      user_id: '',
      email: '',
      passwordTextBox: '',
      loading: true,
      isLoading: false,
      fontsAreLoaded: false,
    }
    this.handleLogout = this.handleLogout.bind(this);

  }

  async componentWillMount() {
    await Expo.Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
    });
    this.setState({ ...this.state, fontsAreLoaded: true });

  }

  handleLoginPressed = async () => {
              // Hide that keyboard!
    Keyboard.dismiss()
    console.log("check username" + this.state.usernameTextBox);
    console.log("check password" + this.state.passwordTextBox);
    // Set loading to true when the search starts to display a Spinner
    this.setState({
      isLoading: true
    });
    if (this.state.usernameTextBox === "") {
      this.setState({
        isLoading: false
      });
      Alert.alert("Enter username")
    }
    else if (this.state.passwordTextBox === "") {
      this.setState({
        isLoading: false
      });
      Alert.alert("Enter password")
    }
    else {
      let resp = await tryLogin(this.state.usernameTextBox, this.state.passwordTextBox);
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
          Alert.alert("Error", "Unauthorized, Invalid username or password.")
        }
      } else {
        this.setState({
          isLoading: false
        });
        //parse response to get userid, username and email
        let parsedObj = JSON.parse(resp._bodyInit);
        console.log("parsedObj......: " + parsedObj.user_id);
        console.log("parsedObj......: " + parsedObj.email_id);
        console.log("parsedObj......: " + parsedObj.user_name);
        this.state.user_id = parsedObj.user_id;
        this.state.email = parsedObj.email_id;
        this.setState({ isLoggedIn: true })
      }

    }
  }

  handleUsernameChange = usernameTextBox => {
    this.setState({
      ...this.state,
      usernameTextBox: usernameTextBox
    })
  }

  handlePasswordChange = passwordTextBox => {
    this.setState({
      ...this.state,
      passwordTextBox: passwordTextBox
    })
  }



  handleLogout = () => {

    this.state.usernameTextBox = "";
    this.state.user_id = "";
    this.state.email = "";
    this.state.passwordTextBox = "";
    this.state.user_id = "";
    this.state.isLoggedIn = false;

    this.setState({
      ...this.state,
      isLoggedIn: false
    })

  }


  render() {
    if (this.state.fontsAreLoaded == true) {
      if (this.state.isLoggedIn === true) {
        return (
          <Watson username={this.state.usernameTextBox} email={this.state.email} user_id={this.state.user_id} logoutCallback={this.handleLogout} />
        );
      }

      return (

        <Container>
          <Header>
            <Left />
            <Body>
              <Title>Watson</Title>
            </Body>
            <Right />
          </Header>
          <Content contentContainerStyle={{ justifyContent: 'center', margin: 20 }}>
            <Text style={{ paddingLeft: 15 }}>For registered users only</Text>
            <Form>
              <Item floatingLabel>
                <Label>Username</Label>
                <Input value={this.state.usernameTextBox} onChangeText={this.handleUsernameChange} />
              </Item>
              <Item floatingLabel>
                <Label>Password</Label>
                <Input value={this.state.passwordTextbox} onChangeText={this.handlePasswordChange} secureTextEntry />
              </Item>
            </Form>
            <View style={{ height: 10 }} />
            {
              this.state.isLoading ?
                <Button disabled block title="Next" onPress={this.handleLoginPressed} >
                  <Text> Log in</Text>
                </Button>
                : <Button style={{ backgroundColor: '#3F51B5' }} block title="Next" onPress={this.handleLoginPressed} >
                  <Text> Log in </Text>
                </Button>
            }

            {
              this.state.isLoading ? <Spinner color='green' /> : null
            }
          </Content>
        </Container>
      )
    }
    return (
      <Container>
        <Header />
        <Content>
          <Spinner color='black' />
        </Content>
      </Container>
    );
  }
}
