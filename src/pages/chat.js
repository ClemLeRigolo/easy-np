import React from 'react';
import {
  Box,
  Container,
  CssBaseline,
  Typography,
} from '@mui/material';

import { withAuth, authStates } from '../components/auth';
import { getUserData, sendMessage, createChatChannel, getCurrentUser, getChatByUsers, getChat, listenForChatMessages, getUserDataById, getUsersChattedWith } from '../utils/firebase';
import Loader from '../components/loader';
import { changeColor } from '../components/schoolChoose';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Fab from '@material-ui/core/Fab';
import { IoSend } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { Grid } from '@mui/material';
import { TextField } from '@mui/material';

import '../styles/chat.css';
import { formatPostTimestamp } from '../utils/helpers';



class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      authState: null,
      id: null,
      firstName: null,
      lastName: null,
      school: null,
      cid: null,
      accomodation: null,
      activeStep: 0,
      chattingWith: null,
      chattingUsers: [],
    };
  }

  handleKeyPress = (e) => {
    if(e.key === 'Enter') {
      this.handleSendClick(); 
    }
  }

  setProfileData = (data) => {
    this.setState({
      name: data.name + " " + data.surname,
      userName: data.name + "_" + data.surname,
      modelDetails: {
        ModelName: data.name + " " + data.surname,
        ModelUserName: "@" + data.name + "_" + data.surname,
      },
    });
  }



    async  componentDidMount() {

        try {
            const user = await getCurrentUser();
            this.setState({
            user: user,
            loading: false
            });
            
        } catch (error) {
            console.error('Erreur lors de la récupération des données utilisateur :', error);
            this.setState({ loading: false });
        }
    }

    componentDidUpdate(prevProps) {
        // Vérifier si l'identifiant de chat a changé
        if (prevProps.match.params.cid !== this.props.match.params.cid) {
          this.getChatData();
        }
      }

    async getChatData() {
        const { user} = this.props;
        
        //Retrieve the user data of the person we are chatting with
        getUserDataById(this.props.match.params.cid).then(data => {
            this.setState({ chattingWith: data });
        });

        //Retrieve the users we have chat with
        getUsersChattedWith(user.uid).then(data => {
            this.setState({ chattingUsers: data });
        });


        if(!user || !this.props.match.params.cid){
            return;
        }
        getChatByUsers(user.uid, this.props.match.params.cid).then(data => {

            if(data){
                this.setState({ cid: data });
            }else{
                createChatChannel(user.uid, this.props.match.params.cid).then(cid => {
                    this.setState({ cid: cid });
                    getChat(data).then(data => {
                        if(data.messages){
                            this.setState({ messages: data.messages });
                            listenForChatMessages(this.state.cid, (messages) => {
                                this.setState({ messages: messages });
                            });
                        }
                    });
                });    
            }

            getChat(data).then(data => {
                if(data.messages){
                    this.setState({ messages: data.messages });
                    listenForChatMessages(this.state.cid, (messages) => {
                        this.setState({ messages: messages });
                    });
                }
            });
        });
    }

    getUserProfileData() {
    const { user, authState } = this.props;

    if (
        authState === authStates.LOGGED_IN &&
        !this.state.firstName
    ) {
        getUserData(user.email).then(data => {
        this.setState({
            firstName: data.name,
            lastName: data.surname,
            school: data.school,
            id: data.id,
        });
        changeColor(data.school);
        });
    }
    }

  handleSendClick = () => {
    const message = document.getElementById('message-input').value;

    if(!message) {
        return;
    }
    //Get text from input
    this.setState({ comment: message });
    // envoyer le message
    //this.sendMessage();
    sendMessage(this.state.cid, message);
    document.getElementById('message-input').value = '';
  }

  renderChattingWith() {
    if (this.state.chattingWith) {
      return (
        <List>
          <ListItem button key="ChattingWith">
            <ListItemIcon>
              <Avatar alt="Chatting with" src={this.state.chattingWith.profileImg} />
            </ListItemIcon>
            <ListItemText primary={this.state.chattingWith.name}></ListItemText>
          </ListItem>
        </List>
      );
    } else {
      return null;
    }
  }

  render() {
    const { user, authState } = this.props;

    if (authState === authStates.INITIAL_VALUE) {
      return <Loader />;
    }

    if (authState === authStates.LOGGED_IN && !this.state.firstName) {
      this.getUserProfileData();
      return <Loader />;
    }
    return (
        <React.Fragment>
        <CssBaseline />
        <div>
        <Grid container component={Paper} className={'chat-section'}>
            <Grid item xs={3} className={'borderRight500'}>
                {this.renderChattingWith()}
                <Divider />
                <Grid item xs={12} style={{padding: '10px'}}>
                    <TextField id="outlined-basic-email" label="Chercher" variant="outlined" fullWidth />
                </Grid>
                <Divider />
                <List>
                {/* Add a ListItem for each element in chattingUsers */}
                {this.state.chattingUsers &&
                    Object.values(this.state.chattingUsers).map(
                        (user) =>
                        user.userData !== null && (
                            <Link to={`/chat/${user.userId}`} key={user.userId}>
                            <ListItem button>
                                <ListItemIcon>
                                <Avatar alt={user.userData.name} src={user.userData.profileImg} />
                                </ListItemIcon>
                                <ListItemText primary={user.userData.name}>{user.userData.name}</ListItemText>
                            </ListItem>
                            </Link>
                        )
                    )}
                </List>
            </Grid>
            <Grid item xs={9}>
                <List 
                // ref={this.messagesListRef}
                className={"message-area"}>
                    {this.state.messages && Object.values(this.state.messages).map(message => (
                        <ListItem key={message.id}>
                            <Grid container>
                                <Grid item xs={12}>
                                    <ListItemText 
                                        align={message.user === 'system' ? "center" : (message.user === user.uid ? "right" : "left")} 
                                        primary={message.content}
                                    ></ListItemText>
                                </Grid>
                                <Grid item xs={12}>
                                    <ListItemText 
                                        align={message.user === 'system' ? "center" : (message.user === user.uid ? "right" : "left")} 
                                        secondary={formatPostTimestamp(message.date)}
                                    ></ListItemText> 
                                </Grid>
                            </Grid>
                        </ListItem>
                    ))}
                </List>
                <Divider />
                <Grid container style={{padding: '20px'}}>
                    <Grid item xs={11}>
                        <TextField id="message-input" onKeyPress={this.handleKeyPress} label="Ecrire" fullWidth />
                    </Grid>
                    <Grid xs={1} align="right">
                        <Fab color="primary" onClick={this.handleSendClick} aria-label="add"><IoSend  /></Fab>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
      </div>
      </React.Fragment>
    );
  }
}

export default withAuth(Chat);