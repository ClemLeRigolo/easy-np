import React, { Component } from 'react';
import "../styles/headerBar.css"
import { Link, withRouter } from 'react-router-dom';

import { HiMagnifyingGlass } from "react-icons/hi2";
import { AiOutlineHome} from "react-icons/ai"
import { HiOutlineUserGroup } from "react-icons/hi2";
import { IoSchoolOutline } from "react-icons/io5";
import { TbMessage} from "react-icons/tb"
import { BiLogOut} from "react-icons/bi"
import { IoCalendarOutline } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";

import { signOut } from '../utils/firebase';
import ProfileImage from './profileImage';

import "../utils/responsiveScript.js";

class HeaderBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: ''
    };
  }

  componentDidMount() {
    const { history } = this.props;
    this.updateUrl(history.location);

    this.unlisten = history.listen((location) => {
      this.updateUrl(location);
    });
  }

  componentWillUnmount() {
    this.unlisten();
  }

  updateUrl(location) {
    const url = location.pathname.split('/')[1];
    this.setState({ url });
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.updateUrl();
    }
  }

  updateUrl() {
    const url = window.location.href.split('/')[3];
    this.setState({ url });
  }

  render() {
    const { search, setSearch, toggleMenu, profileImg, uid } = this.props;
    const { url } = this.state;

    if (url === 'login' || url === 'signup' || url === 'verify' || url === 'reset') {
      return null;
    }

    return (
      <nav>
        <div className="menu-icon" style={{ marginTop: "8px" }}>
          <RxHamburgerMenu
            className='nav-icons'
            onClick={() => toggleMenu()}
          />
        </div>

        <div className="n-logo">
          <Link to="/home" className='logo' style={{ color: "black", textDecoration: "none" }}>
            <h1>Easy <span>NP</span></h1>
         </Link>
        </div>

        <div className="n-form-button search-bar" >

          <form className='n-form' onSubmit={(e) => e.preventDefault()} >
            <HiMagnifyingGlass className='search-icon' />
            <input type="text"
              placeholder='Rechercher quelque chose ...'
              id='n-search'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
        </div>

        <div className="social-icons">
          {/* <Link to="/home" style={{ textDecoration: "none", display: "flex", alignItems: "center", color: "white", marginTop: "8px" }}>
            <AiOutlineHome className='nav-icons' />
          </Link> */}

          <Link to="/eventCalendar" id='calendar' style={{ marginTop: "10px" }}><IoCalendarOutline className='nav-icons' /></Link>

          <Link to="/chat" style={{ marginTop: "2px" }}>
            <TbMessage className='nav-icons' style={{ marginTop: "8px" }} />
          </Link>

          <Link to="/groups" style={{ marginTop: "8px" }}>
            <HiOutlineUserGroup className='nav-icons' />
          </Link>

          <Link to="/courses" style={{ marginTop: "8px" }}>
            <IoSchoolOutline className='nav-icons' />
          </Link>

          <Link to="/login" id='signout' style={{ marginTop: "8px" }}>
            <BiLogOut
              className='nav-icons'
              onClick={() => signOut()}
            />
          </Link>
        </div>


        <div className="n-profile" >
          <Link to={`/profile/${uid}`}>
            <ProfileImage header={true} />
          </Link>
        </div>

      </nav>
    );
  }
}

export default withRouter(HeaderBar);