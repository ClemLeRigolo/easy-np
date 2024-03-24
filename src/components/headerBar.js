import React from 'react'
import "../styles/headerBar.css"
// import SearchIcon from '@mui/icons-material/Search';
import { Link } from 'react-router-dom';

import { HiMagnifyingGlass } from "react-icons/hi2";
import { AiOutlineHome} from "react-icons/ai"
import { HiOutlineUserGroup } from "react-icons/hi2";
import { IoSchoolOutline } from "react-icons/io5";
import { TbMessage} from "react-icons/tb"
import { BiLogOut} from "react-icons/bi"
import { IoCalendarOutline } from "react-icons/io5";

import { signOut } from '../utils/firebase';
import ProfileImage from './profileImage';

const HeaderBar = ({search,setSearch,setShowMenu,profileImg,uid}) => {
  
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
        <Link to="/home" style={{textDecoration:"none",display:"flex",alignItems:"center",color:"white",marginTop:"8px"}}>
          <AiOutlineHome className='nav-icons'/>
        </Link>

        <Link to="/eventCalendar" id='calendar' style={{marginTop:"10px"}}><IoCalendarOutline className='nav-icons'/></Link>
           
        <TbMessage className='nav-icons' style={{marginTop:"8px"}}/>


        <Link to="/groups" style={{marginTop:"8px"}}>
          <HiOutlineUserGroup className='nav-icons'/>
        </Link>

        <Link to="/courses" style={{marginTop:"8px"}}>
          <IoSchoolOutline className='nav-icons'/>
        </Link>

        <Link to="/login" id='signout' style={{marginTop:"8px"}}>
          <BiLogOut 
          className='nav-icons'
          onClick={()=>signOut()}/>
        </Link>
      </div>


       <div className="n-profile" >
          <Link to={`/profile/${uid}`}> 
            <ProfileImage header={true} />
          </Link>
      </div>
  
    </nav>
  )
}

export default HeaderBar