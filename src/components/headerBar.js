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

import { getuserHistory, addHistory, addGlobalHistory, getGlobalHistory } from '../utils/firebase';
import ProfileImage from './profileImage';
import { Redirect } from 'react-router-dom';
import { CiSearch } from "react-icons/ci";
import { GiBackwardTime } from "react-icons/gi";

import "../utils/responsiveScript.js";

class HeaderBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: '',
      search: '',
      history: [],
      globalHistory: [],
      redirect: false,
      query: '',
      showHistory: false,
      searchBarPresent: false,
      selectedHistoryIndex: -1,
      searchFromhist: false,
    };
  }

  handleKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      this.setState(prevState => ({
        selectedHistoryIndex: Math.min(prevState.selectedHistoryIndex + 1, this.state.history.length - 1)
      }));
    } else if (event.key === 'ArrowUp') {
      this.setState(prevState => ({
        selectedHistoryIndex: Math.max(prevState.selectedHistoryIndex - 1, -1)
      }));
    }
  };

  handleInputFocus = () => {
    this.setState({ showHistory: true });
  };

  handleInputBlur = () => {
    //On récupère l'événement de click sur l'élément
    const clickEvent = (e) => {
      //Si l'élément cliqué n'est pas l'élément de recherche
      if (!e.target.closest('.n-form-button')) {
        //On enlève l'écouteur d'événement
        document.removeEventListener('click', clickEvent);
        //On cache l'historique

        this.setState({ showHistory: false });
        if (this.state.searchBarPresent) {
          this.setState({ searchBarPresent: false });
        }
      }
    }
    document.addEventListener('click', clickEvent);
  };

  componentDidMount() {
    this.updateUrl();
    this.unlisten = this.props.history.listen((location) => {
      this.updateUrl(location);
    });

    getGlobalHistory()
      .then((data) => {
        this.setState({ globalHistory: data !== null ? data : []});
      })

    getuserHistory()
      .then((data) => {
        this.setState({ history: data !== null ? data : []});
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération de l'historique de l'utilisateur :", error);
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

  setSearch = (value) => {
    this.setState({ 
      search: value,
      selectedHistoryIndex: -1,
      searchFromhist: false,
    });
  }


  updateUrl() {
    const url = window.location.href.split('/')[3];
    this.setState({ url });
  }

  searchFromHistory = (search) => {
    addHistory(search).then((newHistory) => {
      addGlobalHistory(search).then((newGlobalHistory) => {
        this.setState({ 
          redirect: true,
          query: search,
          search: '',
          history: newHistory,
          globalHistory: newGlobalHistory,
          showHistory: false,
        });
      });
    });
  }

  search = (e) => {
    e.preventDefault();
    const { search } = this.state;
    if (search === '') {
      return;
    }
    addHistory(search).then((newHistory) => {
      addGlobalHistory(search).then((newGlobalHistory) => {
        this.setState({ 
          redirect: true,
          query: search,
          search: '',
          history: newHistory,
          globalHistory: newGlobalHistory,
          showHistory: false,
        });
      });
    }
    );
  }

  toggleSearch = () => {
    // set the visibility of the search bar and dont display the logo
    this.setState({ searchBarPresent: true });

    //add a delay to focus on the search bar
    setTimeout(() => {
      document.getElementById('n-search').focus();
    }, 300);
  }

  render() {
    const { toggleMenu, uid } = this.props;
    const { url, query, search } = this.state;

    if (url === 'login' || url === 'signup' || url === 'verify' || url === 'reset') {
      return null;
    }

    if (this.state.redirect) {
      this.setState({ redirect: false });
      return <Redirect to={`/search?s=${query}`} />;
    }

    //garder uniquement les éléments de l'historique qui ont les mêmes premières lettres
    const historyFromSearch = this.state.searchFromhist ? this.state.history : this.state.history.filter((item) => item.search.startsWith(search));

    const history = historyFromSearch
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    const numberhistory = history.length;

    //garder uniquement les item.search qui ne sont pas dans historyFromSearch
    const globalHistoryWithoutHistory = this.state.globalHistory.filter((item) => !historyFromSearch.map((item) => item.search).includes(item.search));

    const globalHistoryFromSearch = this.state.searchFromhist ? globalHistoryWithoutHistory : globalHistoryWithoutHistory.filter((item) => item.search.startsWith(search));

    const globalHistory = globalHistoryFromSearch
      .sort((a, b) => b.count - a.count)
      .slice(0, 5 - numberhistory);

    if (this.state.selectedHistoryIndex !== -1) {
      if (this.state.selectedHistoryIndex < numberhistory) {
        this.state.search = history[this.state.selectedHistoryIndex].search;
      } else {
        this.state.search = globalHistory[this.state.selectedHistoryIndex - numberhistory].search;
      }
      this.state.searchFromhist = true;
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
         <Link to ="/" className={`logo-mobile ${!this.state.searchBarPresent ? 'active' : ''}`} style={{ color: "black", textDecoration: "none" }} id='logo'>
            <img src={require("../images/easy-np_logo.png")} alt="logo" className="logo-img" />
        </Link>
        </div>

        <div className={`n-form-button search-bar ${this.state.searchBarPresent ? 'active' : ''}`} id='search-bar' onKeyDown={this.handleKeyDown} >
          <form className='n-form' onSubmit={(e) => e.preventDefault()} >
            <HiMagnifyingGlass className='search-icon' />
            <input type="text"
              placeholder='Rechercher quelque chose ...'
              id='n-search'
              value={this.state.search}
              onChange={(e) => this.setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && this.search(e)}
              onFocus={this.handleInputFocus}
              onBlur={this.handleInputBlur}
            />
            {this.state.showHistory && (history.length > 0 || globalHistory.length > 0) && (
            <div className="search-history">
              {history.map((item, index) => (
                <div className={this.state.selectedHistoryIndex === index ? 'active' : ''} onClick={() => this.searchFromHistory(item.search)} key={index}><GiBackwardTime />{item.search}</div>
              ))}
              {globalHistory.map((item, index) => (
                <div className={this.state.selectedHistoryIndex === index + numberhistory ? 'active' : ''} onClick={() => this.searchFromHistory(item.search)} key={index}><CiSearch />{item.search}</div>
              ))}
            </div>
          )}
          </form>
        </div>

        <div className="social-icons">
          <Link to="/home" style={{ textDecoration: "none", display: "flex", alignItems: "center", color: "white", marginTop: "8px" }}>
            <AiOutlineHome className='nav-icons' />
          </Link>

          <Link to="/eventCalendar" id='calendar' style={{ marginTop: "10px" }}><IoCalendarOutline className='nav-icons' /></Link>

          <Link to="/groups" style={{ marginTop: "8px" }}>
            <HiOutlineUserGroup className='nav-icons' />
          </Link>

          <Link to="/courses" style={{ marginTop: "8px" }}>
            <IoSchoolOutline className='nav-icons' />
          </Link>

          <Link to="/chat" style={{ marginTop: "2px" }}>
            <TbMessage className='nav-icons' style={{ marginTop: "8px" }} />
          </Link>
        </div>


        <div className="n-profile" >
          <ProfileImage header={true} toggleSearch={this.toggleSearch} />
        </div>

      </nav>
    );
  }
}

export default withRouter(HeaderBar);