import React from 'react';
import { getCurrentUserData, getUserDataById, signOut, getGroupById } from '../utils/firebase';
import '../styles/headerBar.css';
import { Link } from 'react-router-dom';
import { HoverCard, Avatar, Text, Group, Anchor, Stack } from '@mantine/core';
import fr from '../utils/i18n';
import { Menu, Button, rem } from '@mantine/core';
import { FaUser } from "react-icons/fa6";
import { BiLogOut } from 'react-icons/bi';
import { CiSearch } from 'react-icons/ci';

class ProfileImage extends React.Component {
  state = {
    user: null,
    loading: true
  };

  async componentDidMount() {
    try {
      console.log(this.props.gid);
    console.log(this.props.uid);
        if (!this.props.uid && !this.props.gid) {
      const user = await getCurrentUserData();
      this.setState({
        user: user,
        loading: false
      });
        } else if (this.props.uid) {
            const user = await getUserDataById(this.props.uid);
            this.setState({
              user: user,
              loading: false
            });
        } else {
            const group = await getGroupById(this.props.gid);
            const groupDataAsUser = {
              name: Object.values(group)[0].name,
              surname: "",
              profileImg: group.groupImg,
              id: Object.values(group)[0].id,
              school: Object.values(group)[0] !== "all" ? Object.values(group)[0].school : null,
            };
            this.setState({
              user: groupDataAsUser,
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
    if (prevProps.gid !== this.props.gid) {
      try {
        const group = await getGroupById(this.props.gid);
        const groupDataAsUser = {
          name: Object.values(group)[0].name,
          surname: "",
          profileImg: group.groupImg,
          id: Object.values(group)[0].id,
          school: Object.values(group)[0] !== "all" ? Object.values(group)[0].school : null,
        };
        this.setState({
          user: groupDataAsUser,
          loading: false
        });
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
          <Menu shadow="md" width={200} transitionProps={{ transition: 'rotate-right', duration: 150 }} withArrow data-cy='profileButton'>
            <Menu.Target>
              <Button style={{ background: 'none', border: 'none', padding: 0, margin: 0, width: 'auto', height: 'auto' }}>
                <img src={user.profileImg} alt="Profile" className='n-img' />
              </Button>
            </Menu.Target>

            <Menu.Dropdown>
                <Link to={`/profile/${user.id}`} style={{ color: 'black', textDecoration: 'none' }} data-cy='gotoProfile'>
              <Menu.Item>
                <FaUser style={{ width: '15px', height: '15px' }}/> Mon Profil
              </Menu.Item>
              </Link>
              <Menu.Item
                data-cy='logout'
                style={{ color: 'red' }}
                onClick={() => signOut()}
              >
                <BiLogOut style={{ width: '20px', height: '20px' }} /> Se déconnecter
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>);
        }

        return (
          <Menu shadow="md" width={200} transitionProps={{ transition: 'rotate-right', duration: 150 }} withArrow data-cy='profileButton'>
            <Menu.Target>
              <Button style={{ background: 'none', border: 'none', padding: 0, margin: 0, width: 'auto', height: 'auto' }}>
              <img src={require(`../images/Profile-pictures/${user.school}-default-profile-picture.png`)} alt="Profile" className='n-img' />
              </Button>
            </Menu.Target>

            <Menu.Dropdown>
              <Link to={`/profile/${user.id}`} style={{ color: 'black', textDecoration: 'none' }} data-cy='gotoProfile'>
              <Menu.Item>
                <FaUser style={{ width: '15px', height: '15px' }}/> Mon Profil
              </Menu.Item>
              </Link>
              <Menu.Item
                data-cy='logout'
                style={{ color: 'red' }}
                onClick={() => signOut()}
              >
                <BiLogOut style={{ width: '20px', height: '20px' }} /> Se déconnecter
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>);
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
