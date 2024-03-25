import React from 'react';
import { getCurrentUserData, getUserDataById } from '../utils/firebase';
import '../styles/headerBar.css';
import { Link } from 'react-router-dom';

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
    

    if (loading) {
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
                
                    <img src={user.profileImg} alt="Profile" className="post-avatar" />
                    );
            }
    
            return (
                    <img src={require(`../images/Profile-pictures/${user.school}-default-profile-picture.png`)} alt="Profile" className="post-avatar" />
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
                }

        }
  }

export default ProfileImage;