import React from "react";
import { getAllUsers, subscribeToUser, unsubscribeFromUser } from "../utils/firebase";
import Loader from "./loader";
import fr from "../utils/i18n";
import ProfileImage from "./profileImage";
import { Link } from "react-router-dom";
import "../styles/suggestionUser.css";

class SuggestionUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            usersData: [],
            usersId: [],
            suggestedUsers: [],
            suggestedUsersSetted: false,
            subscribed: []
        };
    }

    handleSubscription = (uid) => {
        if (this.state.subscribed.includes(uid)) {
            unsubscribeFromUser(uid).then(() => {
                this.setState((prevState) => ({
                    subscribed: prevState.subscribed.filter((id) => id !== uid),
                }));
            });
        } else {
            subscribeToUser(uid).then(() => {
                this.setState((prevState) => ({
                    subscribed: [...prevState.subscribed, uid],
                }));
            });
        }
    }

    componentDidMount() {
        getAllUsers().then((usersData) => {
            this.setState({ usersData: Object.values(usersData) });
            Object.values(usersData).forEach((user) => {
                this.setState((prevState) => ({
                    usersId: [...prevState.usersId, user.id],
                }));
            });
            this.getSuggestedUsers();
        });
    }

    //suggest users to follow based on the number of mutual followers, and the number of followers of the user, and the school of the user and the major of the user
    getSuggestedUsers = () => {
        const { usersData, usersId } = this.state;
        const { userData: user } = this.props;
        const suggestedUsers = [];
        if (user === undefined) {
            return;
        }
        usersData.forEach((userData) => {
            if (userData.id === user.id) {
                return;
            }
            let mutualFollowers = 0;
            let userFollowers = 0;
            let userDataSchool = "";
            let userDataMajor = "";
            if (userData.followers) {
                userFollowers = userData.followers.length;
            }
            if (userData.school) {
                userDataSchool = userData.school;
            }
            if (userData.major) {
                userDataMajor = userData.major;
            }
            if (user.subscriptions && user.subscriptions.includes(userData.id)) {
                return;
            }
            if (user.subscriptions) {
                user.subscriptions.forEach((following) => {
                    if (userData.followers) {
                        userData.followers.forEach((follower) => {
                            if (following === follower) {
                                mutualFollowers++;
                            }
                        });
                    }
                });
            }
            const sameSchool = userDataSchool === user.school;
            const sameMajor = userDataMajor === user.major;
            userData.score = mutualFollowers * 10 + userFollowers * 5 + (sameSchool ? 5 : 0) + (sameMajor ? 5 : 0);
            suggestedUsers.push(userData);
        });
        //sort the suggested users based on the score
        suggestedUsers.sort((a, b) => b.score - a.score);
        //get the first 6 suggested users
        suggestedUsers.splice(6);
        this.setState({ suggestedUsers });
    }

    troncateName = (name) => {
        if (name.length > 8) {
            return name.substring(0, 8) + "...";
        }
        return name;
    }

    render() {

        if (this.state.suggestedUsersSetted === false && this.props.userData !== undefined) {
            this.getSuggestedUsers();
            this.setState({ suggestedUsersSetted: true });
            return <Loader />;
        }

        return (
            <div className="suggested-users" data-cy='suggestedUsers'>
                <h1>{fr.HOME.YOU_MAY_KNOW}</h1>
                <div className="suggested-users-container">
                    {this.state.suggestedUsers.map((user) => (
                        <div className="suggested-user" key={user.id}>
                            <Link to={`/profile/${user.id}`} className="link-to-profile">
                            <ProfileImage uid={user.id} post={true} />
                            <h2>{user.name + " " + this.troncateName(user.surname)}</h2>
                            </Link>
                            <button className="follow-btn" onClick={() => this.handleSubscription(user.id)} data-cy='follow'>{this.state.subscribed.includes(user.id) ? fr.PROFILE.UNSUBSCRIBE : fr.PROFILE.SUBSCRIBE}</button>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default SuggestionUser;
