import React from 'react'
import "../styles/headerBar.css"
// import SearchIcon from '@mui/icons-material/Search';
import { Link } from 'react-router-dom';

import { HiMagnifyingGlass } from "react-icons/hi2";
import {AiOutlineHome} from "react-icons/ai"
import {LiaUserFriendsSolid} from "react-icons/lia"
import {IoNotificationsOutline} from "react-icons/io5"
import {TbMessage} from "react-icons/tb"
import { FaDoorOpen } from "react-icons/fa";

import Profile from "../images/avatar.png"
import { signOut } from '../utils/firebase';

const HeaderBar = ({search,setSearch,setShowMenu,profileImg}) => {


  
  return (
    <nav>
        <div className="n-logo">
            <Link to="/home" className='logo' style={{color:"black",textDecoration:"none"}}>
              <h1>Easy <span>NP</span></h1>
            </Link>
        </div>

      <div className="n-form-button" >

        <form className='n-form' onSubmit={(e)=>e.preventDefault()} >
          <HiMagnifyingGlass className='search-icon'/>
          <input type="text" 
          placeholder='Search post'
          id='n-search'
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          />
        </form>
      </div>

      <div className="social-icons">
        <Link to="/home" style={{textDecoration:"none",display:"flex",alignItems:"center",color:"white"}}>
          <AiOutlineHome className='nav-icons'/>
        </Link>

        <Link to="/notification" id='notifi' style={{marginTop:"8px"}}><IoNotificationsOutline className='nav-icons'/><span>5</span></Link>
           
        <TbMessage className='nav-icons'/>
        <LiaUserFriendsSolid
        className='nav-icons'
        onClick={()=>setShowMenu(true)}/>

        <Link to="/login" id='signout' style={{marginTop:"8px"}}>
          <FaDoorOpen 
          className='nav-icons'
          onClick={()=>signOut()}/>
        </Link>
      </div>


       <div className="n-profile" >
          <Link to="/profile"> 
            <img src={profileImg ? (profileImg) : Profile} className='n-img' alt='profile' style={{marginBottom:"-7px"} }/>
          </Link>
      </div>
  
    </nav>
  )
}

export default HeaderBar