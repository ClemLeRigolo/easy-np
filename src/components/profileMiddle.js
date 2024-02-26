import React from "react";
import Info from './info'

import Profile from "../images/avatar.png"
import img1 from "../images/banner.jpg"
import img2 from "../images/banner.jpg"
import img3 from "../images/banner.jpg"
import { useEffect, useState } from 'react'

//import ProfileInputPost from './ProfileComponents/ProfileInputPost'

const ProfileMiddle = ({following,
                        search,
                        images,
                        setImages,
                        profileImg,
                        setProfileImg,
                        name,
                        setName,
                        userName,
                        setUserName,
                        modelDetails,
                        setModelDetails}) => {

  const [userPostData ,setUserPostData] =useState(
    [
      //réupérer les données de la base de données
    ]
  )
  const [body,setBody] =useState("")
  const [importFile,setImportFile] =useState("")
  
 

  const handleSubmit =(e)=>{
    e.preventDefault()

  
    const id =userPostData.length ? userPostData[userPostData.length -1].id +1 :1
    const username="Vijay"
    const profilepicture=Profile
    const datetime=(new Date(), 'yyyy/MM/dd kk:mm:ss').local().startOf('seconds').fromNow()
    const img= images ? {img:URL.createObjectURL(images)} : null

   
    const obj ={id:id,
               profilepicture:profilepicture,
               username:username,
               datetime:datetime,
               img:img && (img.img),
               body:body,
               like:0,
               comment:0
              }

    const insert =[...userPostData,obj]
    setUserPostData(insert)
    setBody("")
    setImages(null)
  }


  

  const [searchResults,setSearchResults] =useState("")
    
    useEffect(()=>{
      const searchData = userPostData.filter((val)=>(
        (val.body.toLowerCase().includes(search.toLowerCase()))
       ||
       (val.username.toLowerCase().includes(search.toLowerCase()))
       ))
       setSearchResults(searchData)
       
    },[userPostData,search])

   

    

  return (
    <div className='profileMiddle'>
        <Info 
        modelDetails ={modelDetails}
        setModelDetails={setModelDetails}
        profileImg={profileImg}
        setProfileImg={setProfileImg}
        userPostData={userPostData}
        following={following}
        name={name}
        setName={setName}
        userName={userName}
        setUserName={setUserName}
        />
        
        {/* <ProfileInputPost
        modelDetails={modelDetails}
        profileImg={profileImg}
        handleSubmit={handleSubmit}
        body ={body}
        setBody ={setBody}
        importFile ={importFile}
        setImportFile ={setImportFile}
        images={images}
        setImages={setImages}
        /> */}

    </div>
  )
}

export default ProfileMiddle