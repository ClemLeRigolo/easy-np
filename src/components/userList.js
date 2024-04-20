import React from "react";
import { Link } from "react-router-dom";
import fr from "../utils/i18n";
import { subscribeToUser, unsubscribeFromUser } from "../utils/firebase";
import ProfileImage from "./profileImage";

class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      subscriptions: []
    };
  }

  handleSubscriptionToUser = (uid) => {
    subscribeToUser(uid).then(() => {
        this.setState({
            subscriptions: [...this.state.subscriptions, uid]
        });
    });
  }

  handleUnsubscriptionToUser = (uid) => {
    unsubscribeFromUser(uid).then(() => {
        this.setState({
            subscriptions: this.state.subscriptions.filter(subscription => subscription !== uid)
        });
    });
  }

  componentDidMount() {
    this.setState({
        users: this.props.users,
        subscriptions: this.props.subscriptions
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.users !== this.props.users) {
      this.setState({
        users: this.props.users,
        subscriptions: this.props.subscriptions
      })
    }
  }

  render() {
    return (
        <div className="subscribers-list">
        {this.state.users.map((subscription,index) => (
          <div key={subscription.uid} className="member-name">
            <Link to={`/profile/${subscription.uid}`} className='member-name-displayed link-to-profile'>
            <ProfileImage uid={subscription.uid} />
            <span>{subscription.name} {subscription.surname}</span>
            </Link>
            {this.state.subscriptions.includes(subscription.uid) ? <button className='follow-btn' onClick={()=> this.handleUnsubscriptionToUser(subscription.uid)}>{fr.PROFILE.UNSUBSCRIBE}</button> : <button className='follow-btn' onClick={()=> this.handleSubscriptionToUser(subscription.uid)}>{fr.PROFILE.SUBSCRIBE}</button>}
          </div>
        ))}
      </div>
    );
  }
}

export default UserList;