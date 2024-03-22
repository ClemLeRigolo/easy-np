import React from "react";
import { Link } from "react-router-dom";
import { authStates, withAuth } from "../components/auth";
import Loader from "../components/loader";
import { getGroups, joinGroup, getUserDataById } from "../utils/firebase"; // Importez la fonction joinGroup
import fr from "../utils/i18n";
import "../styles/groups.css";
import HeaderBar from "../components/headerBar";
import GroupMembership from "../components/groupMembership";
import { changeColor } from "../components/schoolChoose";
import { AiOutlinePlusCircle } from "react-icons/ai";

class Groups extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      profileImg: null,
      dataCollected: false,
    };
    this.handleJoinGroup = this.handleJoinGroup.bind(this); // Liez la méthode handleJoinGroup
  }

  componentDidMount() {
    getGroups().then((groups) => {
      const groups2 = [];
      Object.values(groups).forEach((group) => {
        groups2.push(Object.values(group)[0]);
      });
      this.setState({ groups: groups2 });
    });
  }

  handleJoinGroup(groupId) {
    // Implémentez la fonction pour rejoindre un groupe
    joinGroup(groupId)
      .then(() => {
        console.log("Vous avez rejoint le groupe avec succès !");
      })
      .catch((error) => {
        console.error("Erreur lors de la tentative de rejoindre le groupe :", error);
      });
  }

  render() {
    const { authState, user } = this.props;
    const { groups } = this.state;
    //const userSchool = user.school; // Récupérez l'école de l'utilisateur depuis les props ou l'objet user

    if (authState === authStates.INITIAL_VALUE) {
      console.log("initial value");
      return <Loader />;
    }

    if (authState === authStates.LOGGED_IN && !this.state.dataCollected) {
      getUserDataById(user.uid).then((userData) => {
        console.log("userData", userData);
        this.setState({
          profileImg: userData.profileImg,
          dataCollected: true,
        });
        if (!this.state.profileImg) {
          this.setState({ profileImg: require(`../images/Profile-pictures/${userData.school}-default-profile-picture.png`) });
        }
        changeColor(userData.school);
      }
      );
      return <Loader />;
    }

    return (
      <div className="interface">
        <HeaderBar
          search={""}
          setSearch={""}
          showMenu={false}
          setShowMenu={false}
          profileImg={this.state.profileImg}
          uid={user.uid}
        />
        <div className="group-list">
          <Link to="/createGroup" className="create-group-button">
            <AiOutlinePlusCircle /> {fr.FORM_FIELDS.CREATE_GROUP}
          </Link>
          {groups.map((group) => (
            <div className="group" key={group.id}>
            <Link to={`/group/${group.id}`} >
            <h3>
              {group.name}{" "}
              {!group.isPublic && (
                <img
                  src={require(`../images/écoles/${group.school.toLowerCase()}.png`)}
                  alt={group.school}
                />
              )}
            </h3>
            <p>{group.description}</p>
            </Link>
            <GroupMembership group={group} userSchool={null} />
          </div>
          ))}
        </div>
      </div>
    );
  }
}

export default withAuth(Groups);