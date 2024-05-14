import React from 'react';
import {
  Box,
  Container,
  CssBaseline,
  Typography,
} from '@mui/material';

import { withAuth, authStates } from '../components/auth';
import { getUserData, sendMessage, createChatChannel, getCurrentUser, getChatByUsers, getChat, listenForChatMessages, getMostRecentMessagedUser, getUserDataById, getUsersChattedWith, listenForNewUserMessages, getUnreadMessagesNumber, markAllMessagesAsRead, sendMessageWithImages, getGroupById } from '../utils/firebase';
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
import Badge from '@material-ui/core/Badge';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import { FaArrowLeft } from "react-icons/fa";
import InputAdornment from '@material-ui/core/InputAdornment';
import { AiOutlineCamera } from "react-icons/ai";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";
import PinchZoomPan from 'react-responsive-pinch-zoom-pan';

import '../styles/chat.css';
import { formatPostTimestamp, compressImage } from '../utils/helpers';
import ProfileImage from '../components/profileImage';
import { IoMdCloseCircleOutline } from "react-icons/io";



class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.fileInputRef = React.createRef();
    this.state = {
      user: null,
      userData: null,
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
      messagesList: null,
      selectedMessageIndex: null,
      friendsData: [],
      friendsDataSetted: false,
      searchValue: "",
      showSearchResults: false,
      menuOpen: false,
      images: [],
      expandedImage: null,
      expandedImages: [],
      imageIndex: 0,
      isGroupChat: false,
    };
  }

  handleSearchChange = (event) => {
    this.setState({ searchValue: event.target.value });
  };

  handleFocus = () => {
    this.setState({ showSearchResults: true });
  };

  handleBlur = () => {
    setTimeout(() => {
      this.setState({ showSearchResults: false });
    }
    , 200);
  };

  autoScrollMessages() {
    setTimeout(() => {
      const messageArea = document.querySelector('.message-area');
      if (messageArea)
        messageArea.scrollTop = messageArea.scrollHeight;
    }, 10);
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
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

  getFriendsData = () => {
    //keep only the users that are in followers and subscriptions
    if (this.state.friendsDataSetted) {
      return;
    }
    let friends = [];
    let friendsData = [];
    let followers = this.state.userData.followers ? this.state.userData.followers : [];
    let subscriptions = this.state.userData.subscriptions ? this.state.userData.subscriptions : [];
    for (let i = 0; i < followers.length; i++) {
      for (let j = 0; j < subscriptions.length; j++) {
        if (followers[i] === subscriptions[j] && !friends.includes(subscriptions[j])) {
          friends.push(subscriptions[j]);
        }
      }
    }
    let friendsPromises = [];
    for (let i = 0; i < friends.length; i++) {
      let promise = getUserDataById(friends[i]).then((data) => {
        friendsData.push(data);
      });
      friendsPromises.push(promise);
    }
    Promise.all(friendsPromises).then(() => {
      this.setState({ friendsData: friendsData, friendsDataSetted: true });
    });
}

  async componentDidMount() {

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

    this.getChatData();


    listenForNewUserMessages((chats) => {
      // this.setState({ chattingUsers: chats });
      getUsersChattedWith().then(data => {
        //On trie les utilisateurs pour avoir les plus récents en premier
        data.sort((a, b) => {
          return b.lastMessageDate - a.lastMessageDate;
        });
        this.setState({ chattingUsers: data });
      });
    });

    this.setState({
      messagesList: document.querySelector('.message-area')  
    });
  }

  componentDidUpdate(prevProps) {
    // Vérifier si l'identifiant de chat a changé
    if (prevProps.match.params.cid !== this.props.match.params.cid) {
      this.setState({ 
        cid: this.props.match.params.cid,
        menuOpen: false,
        isGroupChat: false,
      });
      this.getChatData();
    }
  }

  async getChatData() {
    const { user } = this.props;
    //Retrieve the user data of the person we are chatting with
    // if cid is more than 13 characters, it is a user id, else it's a group id
    if (!this.props.match.params.cid || this.props.match.params.cid.length > 13) {
      getUserDataById(this.props.match.params.cid).then(data => {
        this.setState({ chattingWith: data });
      });
    } else {
      getGroupById(this.props.match.params.cid).then(data => {
        let members = {};
        const memberIds = data.members;
        const promises = memberIds.map(id => {
          return getUserDataById(id).then(userData => {
            members[id] = userData;
          });
        });
        Promise.all(promises).then(() => {
          const groupDataAsUser = {
            name: Object.values(data)[0].name,
            surname: "",
            profileImg: data.groupImg,
            id: Object.values(data)[0].id,
            school: Object.values(data)[0] !== "all" ? Object.values(data)[0].school : null,
            members: members
          };
          this.setState({ 
            chattingWith: groupDataAsUser,
            isGroupChat: true,
          });
        });
      });
    }
    //Retrieve the users we have chat with
    getUsersChattedWith().then(data => {
      //On trie les utilisateurs pour avoir les plus récents en premier
      data.sort((a, b) => {
        return b.lastMessageDate - a.lastMessageDate;
      });
      this.setState({ chattingUsers: data });
    });

    if (!user || !this.props.match.params.cid) {
      return;
    }

    getChatByUsers(user.uid, this.props.match.params.cid).then(data => {
      if (data) {
        this.setState({ cid: data });
        getChat(data).then(data => {
          if (data.messages) {
            this.setState({ messages: data.messages });
            listenForChatMessages(this.state.cid, (messages,chatId) => {
              if (chatId === this.state.cid) {
                this.setState({ messages: messages });
                this.autoScrollMessages();
              }
            });
            markAllMessagesAsRead(this.state.cid);
          } else {
            this.setState({ messages: [] });
            listenForChatMessages(this.state.cid, (messages,chatId) => {
              if (chatId === this.state.cid) {
                this.setState({ messages: messages });
                this.autoScrollMessages();
              }
            });
          }
        });
      } else {
        createChatChannel(user.uid, this.props.match.params.cid).then(cid => {
          this.setState({ cid: cid });
          getChat(cid).then(data => {
            this.setState({ messages: data.messages ? data.messages : []});
            listenForChatMessages(this.state.cid, (messages) => {
              this.setState({ messages: messages });
              this.autoScrollMessages();
            });
          });
        });
      }
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
          userData: data,
        });
        changeColor(data.school);
      }).then(() => {
        this.getFriendsData();
      });
    }
  }

  handleSendClick = async () => {
    const message = document.getElementById('message-input').value;

    if (!message && this.state.images.length === 0) {
      return;
    }
    //Get text from input
    this.setState({ comment: message });
    // envoyer le message
    //this.sendMessage();
    if (this.state.images.length > 0) {
      const compressedImages = await Promise.all(
        this.state.images.map((image) => compressImage(image.file))
      );

      sendMessageWithImages(this.state.cid, message, compressedImages);
      this.setState({ images: [] });
    } else {
      sendMessage(this.state.cid, message);
    }
    document.getElementById('message-input').value = '';
  }

  handleCameraClick = () => {
    this.fileInputRef.current.click();
  }

  handleImageUpload = (event) => {
    const files = event.target.files;
    const selectedPhotos = [];
  
    if (files.length > 10) {
      return;
    }
  
    for (let i = 0; i < files.length && i < 4; i++) {
      const file = files[i];
      const reader = new FileReader();
  
      reader.onload = (e) => {
        const photoData = {
          name: file.name,
          dataURL: e.target.result,
          file: file,
        };
        selectedPhotos.push(photoData);
  
        if (selectedPhotos.length === files.length) {
          this.setState({ images: selectedPhotos });
        }
      };
  
      reader.readAsDataURL(file);
    }
  }

  handleRemoveImage = (index) => {
    const images = this.state.images;
    images.splice(index, 1);
    this.setState({ images: images });
  }

  handleMessageClick = (index) => {
    if (this.state.selectedMessageIndex === index) {
      this.setState({selectedMessageIndex: null});
    } else {
      this.setState({selectedMessageIndex: index})
    }
  }

  handleImageClick = (images, index) => {
    const image = images ? images[index] : null;
    this.setState({ 
      expandedImage: image,
      imageIndex: index,
      expandedImages: images,
    });
    if (image !== null) {
      //bloquer le scroll
      // Get the current page scroll position
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop;
      let scrollLeft =
        window.pageXOffset ||
        document.documentElement.scrollLeft;

        // if any scroll is attempted,
        // set this to the previous value
        window.onscroll = function () {
            window.scrollTo(scrollLeft, scrollTop);
        };
    } else {
      //débloquer le scroll
      window.onscroll = function () { };
    }
  }

  navigateToImage = (index) => {
    this.setState({ 
      expandedImage: this.state.expandedImages[index],
      imageIndex: index,
    });
  }

  renderChattingWith() {
    if (this.state.chattingWith) {
      return (
        <List style={{overflow:'scroll'}}>
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

  renderChatList() {
    if(this.state.chattingUsers.length > 0) {
      return (
        <Paper style={{height:'62vh', overflow:'auto'}} className='chat-list-users'> 
        <List>
          {this.state.chattingUsers.map((user) => (
            <>
            {!this.state.chattingWith || user.userId !== this.state.chattingWith.id ? (
            <Link to={`/chat/${user.userId}`} key={user.userId} data-cy='chatWith'>
              <ListItem button>
                <ListItemIcon>
                  <ProfileImage uid={user.userId.length > 13 ? user.userId : null} gid={user.userId.length > 13 ? null : user.userId}/>
                </ListItemIcon>
                <ListItemText primary={user.userData.name}>{user.userData.name}</ListItemText>
                {user.unReadedMessages > 0 && (
                  <ListItemSecondaryAction>
                    <Badge badgeContent={user.unReadedMessages} className='badgeMessage' />
                  </ListItemSecondaryAction>
                )}
              </ListItem>
            </Link>
            ) : (
              <ListItem button onClick={() => this.setState({ menuOpen: false })}>
                <ListItemIcon>
                  <ProfileImage uid={user.userId.length > 13 ? user.userId : null} gid={user.userId.length > 13 ? null : user.userId}/>
                </ListItemIcon>
                <ListItemText primary={user.userData.name}>{user.userData.name}</ListItemText>
                {user.unReadedMessages > 0 && (
                  <ListItemSecondaryAction>
                    <Badge badgeContent={user.unReadedMessages} className='badgeMessage' />
                  </ListItemSecondaryAction>
                )}
              </ListItem>
            )}
            </>
          ))}
        </List>
        </Paper>
      );
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

    const filteredUsers = this.state.friendsData
      .filter(user => user.name.includes(this.state.searchValue))
      .slice(0, 5);

    console.log(this.state.chattingWith)

    return (
      <React.Fragment>
        {this.state.chattingWith && (
        <div 
          className={`overlay ${this.state.expandedImage ? 'visible' : ''}`}
          onClick={() => this.handleImageClick(null)}
          >
            <div className="expanded-image-header">
            <Link to={this.state.isGroupChat ? `/group/${this.state.chattingWith.id}` : `/profile/${this.state.chattingWith.id}`} className="expanded-username">
              <ProfileImage uid={this.state.chattingWith.id.length > 13 ? this.state.chattingWith.id : null} gid={this.state.chattingWith.id.length > 13 ? null : this.state.chattingWith.id} />
              <div>
                <p>{this.state.chattingWith.name + ' ' + this.state.chattingWith.surname}</p>
              </div>
            </Link>
            {this.state.chattingWith.school && (
              <img src={require(`../images/écoles/${this.state.chattingWith.school}.png`)} alt="School" className="post-school" />
            )}
            </div>
            <div className={`expanded-image-content ${this.state.expandedImage ? 'visible' : ''}`}>
            <PinchZoomPan position={'center'} initialScale={'auto'} maxScale={4} >
              <img 
                src={this.state.expandedImage}
                className={`expanded-image ${this.state.expandedImage ? 'visible' : ''}`}
                alt="Expanded"
              />
          </PinchZoomPan>
          </div>
          <div 
            className="back-arrow"
            onClick={(e) => {
              e.stopPropagation();
              this.handleImageClick(null);
            }}
            data-cy="return"
          >
            <IoMdArrowBack />
          </div>
          {this.state.expandedImages && this.state.expandedImages.length > 1 && this.state.imageIndex !== 0 && (
          <div 
            className="previous-arrow"
            onClick={(e) => {
              e.stopPropagation();
              this.navigateToImage(this.state.imageIndex - 1);
            }}
            data-cy="return"
          >
            <IoMdArrowBack />
          </div>
          )}
          {this.state.expandedImages && this.state.expandedImages.length > 1 && this.state.imageIndex !== this.state.expandedImages.length - 1 && (
          <div 
            className="next-arrow"
            onClick={(e) => {
              e.stopPropagation();
              this.navigateToImage(this.state.imageIndex + 1);
            }}
            data-cy="return"
          >
            <IoMdArrowForward />
          </div>
          )}
          </div>
          )}
  
        <div className='chat-container'>
          <Grid container component={Paper} className={'chat-section'}>
            {this.state.chattingWith && (
            <div className='chat-header'>
            <IconButton className='back-to-users' onClick={() => this.setState({ menuOpen: true })}>
              <FaArrowLeft />
            </IconButton>
            <ProfileImage uid={this.state.chattingWith.id.length > 13 ? this.state.chattingWith.id : null} gid={this.state.chattingWith.id.length > 13 ? null : this.state.chattingWith.id}/>
            <Typography variant="h5" align="center">
              {this.state.chattingWith.name + " " + this.state.chattingWith.surname}
            </Typography>
            </div>
            )}
            <Grid item xs={0} sm={3} className={`chatting-with-nav ${this.state.menuOpen || !this.state.chattingWith ? 'active' : ''}`}>
              <Grid item xs={12} style={{ padding: '10px' }}>
                <TextField
                  id="outlined-basic-email"
                  label="Chercher"
                  variant="outlined"
                  fullWidth
                  value={this.state.searchValue}
                  onChange={this.handleSearchChange}
                  onFocus={this.handleFocus}
                  onBlur={this.handleBlur}
                  data-cy="search"
                />
                {this.state.showSearchResults && (
                  <div className='search-list'>
                  {this.state.friendsDataSetted ? (
                  <List style={{ position: 'absolute', zIndex: 1, width: '100%', backgroundColor: "white", border: 'solid 1px #ccc', margin: '0', padding: '0' }}>
                    {filteredUsers.map(user => (
                      <>
                      {!this.state.chattingWith || this.state.chattingWith.id !== user.id ? (
                      <Link to={`/chat/${user.id}`} key={user.id} data-cy='resultSearch'>
                      <ListItem key={user.id} style={{ borderBottom: 'solid 1px #ccc', cursor: 'pointer' }}>
                        <ListItemIcon>
                         <ProfileImage uid={user.id}/>
                        </ListItemIcon>
                        <ListItemText primary={user.name}>{user.name}</ListItemText>
                      </ListItem>
                      </Link>
                      ) : 
                      <ListItem key={user.id} style={{ borderBottom: 'solid 1px #ccc', cursor: 'pointer' }} onClick={() => this.setState({ menuOpen: false })}>
                        <ListItemIcon>
                         <ProfileImage uid={user.id}/>
                        </ListItemIcon>
                        <ListItemText primary={user.name}>{user.name}</ListItemText>
                      </ListItem>
                      }
                      </>
                    ))}
                  </List>)
                  : <Loader />}
                  </div>
                )}
              </Grid>
              <Divider />
              <List>
                {/* Add a ListItem for each element in chattingUsers */}
                {this.renderChatList()}
              </List>
            </Grid>
            {this.state.menuOpen && (
            <div className="chatting-nav-overlay" onClick={() => this.setState({ menuOpen: false })}></div>
            )}
            <Grid item xs={12} sm={9} className={`real-message-area`}>
              <List
                // ref={this.messagesListRef}
                className={"message-area"}>
                {this.state.messages && Object.values(this.state.messages).map((message, index) => (
                  <ListItem 
                    key={message.date}
                    style={{ paddingBottom: '3% !important' }}
                    onClick={() => this.handleMessageClick(index)}
                  >
                    <Grid container>
                      <Grid item xs={12}>
                        {this.state.isGroupChat && message.user !== user.uid && (
                          <div className='author-name'>
                            <ProfileImage uid={message.user} />
                            {this.state.chattingWith.members[message.user].name}
                          </div>
                        )}
                        <ListItemText
                          className={`message ${message.user === 'system'
                              ? 'system-message'
                              : message.user === user.uid
                                ? 'user-message'
                                : 'other-user-message'
                            }`}
                          align={message.user === 'system' ? "center" : (message.user === user.uid ? "right" : "left")}
                          primary={message.content}
                        ></ListItemText>
                        {message.images && message.images.length > 0 && (
                          <div className={`message-images ${message.user === user.uid ? 'user-message' : 'other-user-message'}`}>
                            <span className={`image-message-container ${message.images.length > 1 ? 'multiple-image' : ''}`}>
                            {message.images.map((image, index) => (
                              <img key={index} src={image} alt="Preview" className="message-image" onClick={() => this.handleImageClick(Object.values(message.images),index)} />
                            ))}
                            </span>
                          </div>
                        )}
                      </Grid>


                      {(index === Object.values(this.state.messages).length - 1 || this.state.selectedMessageIndex === index) && (
                        
                        <Grid item xs={12}>
                          <ListItemText
                            className={` ${message.user === 'system'
                                ? 'system-timestamp'
                                : message.user === user.uid
                                  ? 'user-timestamp'
                                  : 'other-user-timestamp'
                              }`}
                            align={message.user === 'system' ? "center" : (message.user === user.uid ? "right" : "left")}
                            secondary={formatPostTimestamp(message.date)+(message.read ? ". Lu" : ". Reçu")}
                          ></ListItemText>
                        </Grid>

                      )}
                    </Grid>
                  </ListItem>
                ))}
              </List>

              {this.state.chattingWith && (
              <Grid container id="message-container" >
                {this.state.images.length > 0 && (
                  <div className='images-preview'>
                    {this.state.images.map((image, index) => (
                      <div className='image-imported' key={index} style={{ position: 'relative' }}>
                        <img className='image-imported' src={image.dataURL} alt="Preview" />
                        <button
                          style={{ 
                            position: 'absolute', 
                            top: 0, 
                            right: 0,
                            color: 'red',
                            backgroundColor: 'inherit',
                            fontSize: '20px',
                            padding: '0',
                            border: 'none',
                            borderRadius: '100%',
                            cursor: 'pointer',
                          }}
                          onClick={() => this.handleRemoveImage(index)}
                        >
                          <IoMdCloseCircleOutline />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <Grid item xs={9} align="center" >
                  <TextField 
                    id="message-input" 
                    data-cy="messageInput"
                    onKeyPress={this.handleKeyPress} 
                    label="Ecrire" fullWidth 
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            onClick={this.handleCameraClick}
                          >
                            <AiOutlineCamera />
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              style={{ display: 'none' }}
                              onChange={this.handleImageUpload}
                              ref={this.fileInputRef}
                            />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    />
                </Grid>
                <Grid item xs={1} align="right">
                  <Fab id="send-message-button" onClick={this.handleSendClick} aria-label="add" data-cy='send'><IoSend /></Fab>
                </Grid>
              </Grid>
              )}
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
    );
  }
}

export default withAuth(Chat);
