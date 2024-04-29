import React from 'react';
import { getCurrentUserData, getUserDataById } from '../utils/firebase';
import '../styles/headerBar.css';
import { Link } from 'react-router-dom';
import { HoverCard, Avatar, Text, Group, Anchor, Stack } from '@mantine/core';
import fr from '../utils/i18n';

class ProfileImage extends React.Component {
  state = {
    user: null,
    loading: true
  };

  async componentDidMount() {
    try {
        if (!this.props.uid) {
      const user = await getCurrentUserData();
      this.setState({
        user: user,
        loading: false
      });
        } else {
            const user = await getUserDataById(this.props.uid);
            this.setState({
              user: user,
              loading: false
            });
        }
    } catch (error) {
      console.error('Erreur lors de la récupération des données utilisateur :', error);
      this.setState({ loading: false });
    }
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.uid !== this.props.uid) {
      try {
        if (!this.props.uid) {
          const user = await getCurrentUserData();
          this.setState({
            user: user,
            loading: false
          });
            } else {
                const user = await getUserDataById(this.props.uid);
                this.setState({
                  user: user,
                  loading: false
                });
            }
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur :', error);
        this.setState({ loading: false });
      }
    }
  }

  render() {
    const { user, loading } = this.state;
    

    if (loading || user === null) {
      // Afficher un indicateur de chargement pendant la récupération des données
      return (<div className="n-profile" >
      <img src="none" alt="Profile" className='n-img' />
      </div>);
    }

    // Votre code pour afficher l'image de profil
    if (this.props.header) {
        if (user && user.profileImg) {
        return (
            <div className="n-profile" >
                <img src={user.profileImg} alt="Profile" className='n-img' />
                </div>);
        }

        return (
            <div className="n-profile" >
                <img src={require(`../images/Profile-pictures/${user.school}-default-profile-picture.png`)} alt="Profile" className='n-img' />
                </div>);
        } else if (this.props.post) {
        if (user && user.profileImg) {
            return (
              <Group justify="center">
              <HoverCard width={320} shadow="md" withArrow openDelay={200} closeDelay={200}>
                <HoverCard.Target>
                  <Avatar src={user.profileImg} radius="xl" className="post-avatar" />
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <Group>
                    <Avatar src={user.profileImg} radius="xl"/>
                    <Stack>
                      <Text size="sm" fw={700} style={{ lineHeight: 1 }}>
                        {user.name + ' ' + user.surname}
                      </Text>
                      <Anchor
                        href={`/profile/${user.uid}`}
                        c="dimmed"
                        size="xs"
                        style={{ lineHeight: 1 }}
                      >
                        @{user.tag}
                      </Anchor>
                    </Stack>
                  </Group>
        
                  {user.bio && (
                  <Text size="sm" mt="md" dangerouslySetInnerHTML={{ __html: user.bio }} >

                  </Text>
                  )}
        
                  <Group mt="md" gap="xl">
                    <Text size="sm">
                      <b>{user.subscriptions ? user.subscriptions.length : 0}</b> {fr.PROFILE.FOLLOWINGS}
                    </Text>
                    <Text size="sm">
                      <b>{user.followers ? user.followers.length : 0}</b> {fr.PROFILE.FOLLOWERS}
                    </Text>
                  </Group>
                </HoverCard.Dropdown>
              </HoverCard>
            </Group>
                    );
            }
    
            return (
              <Group justify="center">
              <HoverCard width={320} shadow="md" withArrow openDelay={200} closeDelay={200}>
                <HoverCard.Target>
                  <Avatar src={require(`../images/Profile-pictures/${user.school}-default-profile-picture.png`)} radius="xl" className="post-avatar" />
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <Group>
                    <Avatar src={require(`../images/Profile-pictures/${user.school}-default-profile-picture.png`)} radius="xl"/>
                    <Stack>
                      <Text size="sm" fw={700} style={{ lineHeight: 1 }}>
                        {user.name + ' ' + user.surname}
                      </Text>
                      <Anchor
                        href={`/profile/${user.uid}`}
                        c="dimmed"
                        size="xs"
                        style={{ lineHeight: 1 }}
                      >
                        @{user.tag}
                      </Anchor>
                    </Stack>
                  </Group>
        
                  {user.bio && (
                  <Text size="sm" mt="md" dangerouslySetInnerHTML={{ __html: user.bio }} >

                  </Text>
                  )}
        
                  <Group mt="md" gap="xl">
                    <Text size="sm">
                      <b>{user.subscriptions ? user.subscriptions.length : 0}</b> {fr.PROFILE.FOLLOWINGS}
                    </Text>
                    <Text size="sm">
                      <b>{user.followers ? user.followers.length : 0}</b> {fr.PROFILE.FOLLOWERS}
                    </Text>
                  </Group>
                </HoverCard.Dropdown>
              </HoverCard>
            </Group>
                    );
            } else if (this.props.footer) {
              if (user && user.profileImg) {
                  return (
                    <Link to={`/profile/${user.uid}`} style={{ color: 'black', textDecoration: 'none' }}>
                      <div className="n-profile" >
                          <img src={user.profileImg} alt="Profile" className='n-img' />
                          </div>
                          </Link>);
                  } else {
                      return (
                          <Link to={`/profile/${user.uid}`} style={{ color: 'black', textDecoration: 'none' }}>
                          <div className="n-profile" >
                              <img src={require(`../images/Profile-pictures/${user.school}-default-profile-picture.png`)} alt="Profile" className='n-img' />
                              </div>
                              </Link>);
                  }
                } else {
                  if (user && user.profileImg) {
                    return (
                      <Link to={`/profile/${user.uid}`} style={{ color: 'black', textDecoration: 'none' }}>
                        <img src={user.profileImg} alt="Profile" className='post-avatar' />
                            </Link>);
                    } else {
                        return (
                            <Link to={`/profile/${user.uid}`} style={{ color: 'black', textDecoration: 'none' }}>
                            <img src={require(`../images/Profile-pictures/${user.school}-default-profile-picture.png`)} alt="Profile" className='post-avatar' />
                                </Link>);
                    }
                }

        }
  }

export default ProfileImage;