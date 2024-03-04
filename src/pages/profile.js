import React from "react";
import { useState } from 'react'
// import Left from '../../Components/LeftSide/Left'
import ProfileMiddle from '../components/profileMiddle'
// import Right from '../../Components/RightSide/Right'
import HeaderBar from '../components/headerBar'
import "../styles/profile.css"
import ProfileImg from "../images/avatar.png"

const Profile = () => {

  const [following,setFollowing] =useState(3)
  const [search,setSearch] =useState("")

  const [showMenu,setShowMenu] =useState(false)

  const [images,setImages] =  useState(null)

  const [name,setName]= useState("")
  const [userName,setUserName]= useState("")
  const [profileImg,setProfileImg] =useState(ProfileImg)

  const [modelDetails,setModelDetails] = useState(
    {
      ModelName:"PlaceHolder",
      ModelUserName:"@PlaceHolder",
    }
  )

  return (
    <div className='interface'>
        <HeaderBar
        search={search}
        setSearch={setSearch}
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        profileImg={profileImg}
        />
      <div className="home">
        {/* <Left 
        following={following}
        setFollowing={setFollowing}
        profileImg={profileImg}
        modelDetails={modelDetails}
        
        /> */}

        <ProfileMiddle 
        following={following}
        search={search}
        images={images}
        setImages={setImages}
        name={name}
        setName={setName}
        userName={userName}
        setUserName={setUserName}
        profileImg={profileImg}
        setProfileImg={setProfileImg}
        modelDetails={modelDetails}
        setModelDetails={setModelDetails}
        />
        
        {/* <Right 
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        following={following}
        setFollowing={setFollowing}
        /> */}
      </div>
    </div>
  )
}

export default Profile