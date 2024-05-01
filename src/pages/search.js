import React from 'react';
import { withAuth, authStates } from '../components/auth';
import { getUserData } from '../utils/firebase';
import { changeColor } from '../components/schoolChoose';
import { Redirect } from 'react-router-dom';
import Loader from '../components/loader';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      authState: null,
      firstName: null,
      lastName: null,
      school: null,
      search: '',
      isLoading: true, // Add a loading state
    };
  }

  componentDidMount() {
    const { user, authState } = this.props;

    this.setState({
      user: user,
      authState: authState,
    });

    if (authState === authStates.LOGGED_IN) {
      getUserData(user.email)
        .then((data) => {
          this.setState({
            firstName: data.name,
            lastName: data.surname,
            school: data.school,
          });
          changeColor(data.school);
        })
        .finally(() => {
          this.setState({ isLoading: false }); // Set isLoading to false
        });
    } else {
      this.setState({ isLoading: false }); // Set isLoading to false
    }
  }

  render() {
    const { search, isLoading } = this.state;
    const { authState } = this.props;

    if (authState === authStates.INITIAL_VALUE || isLoading) {
      return <Loader />;
    }

    if (authState === authStates.LOGGED_IN && (!search || search !== new URLSearchParams(this.props.location.search).get('s'))) {
      const searchQuery = new URLSearchParams(this.props.location.search).get('s');
      if (searchQuery) {
        this.setState({
          search: searchQuery,
        });
      } else {
        return <Redirect to="/" />;
      }
    }



    return (
        <div>
            {search}
        </div>
    );
  }
}

export default withAuth(Search);