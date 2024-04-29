import React, { useState } from 'react'

import {LiaEdit} from "react-icons/lia"

import {IoCameraOutline} from "react-icons/io5"
import { useRef } from 'react';
//import ModelProfile from './modelProfile';
import { postCourseImg, postCoverCourseImg, subscribeToUser, unsubscribeFromUser } from '../utils/firebase'
import fr from '../utils/i18n'
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import { compressImage, cropImage } from '../utils/helpers';

const Info = ({userPostData,
              following,
              modelDetails,
              setModelDetails,
              profileImg,
              setProfileImg,
              name,
              setName,
              userName,
              setUserName,
              canModify,
              uid,
              isSubscribedProps,
              subscribersData,
              subscriptionsData,
              nbPosts,
              coverImg,
              setCoverImg,
              cid
            }) => {

  const importProfile=useRef()
  const importCover =useRef()

  
  const handleFile1 = async (e) => {
    if (e.target.files && e.target.files[0]) {
      let img = e.target.files[0];
      try {
        const croppedImg = await cropImage(img);
        const url = await postCourseImg(cid,croppedImg);
        setProfileImg(url);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleFile2 = async (e)=>{
    if (e.target.files && e.target.files[0]) {
      let img = e.target.files[0];
      try {
        const compressedImg = await compressImage(img);
        const url = await postCoverCourseImg(cid,compressedImg);
        setCoverImg(url);
      } catch (error) {
        console.log(error);
      }
    }
  }

  const setOpenEdit=(value)=>{
    console.log(value)
  }

  /*const [openEdit,setOpenEdit] =useState(false)

  const [countryName,setCountryName]= useState("")
  const [jobName,setJobName]= useState("")
  
  const handleModel=(e)=>{
    e.preventDefault()

    const ModelName =name
    const ModelUserName=userName
    const ModelCountryName=countryName
    const ModelJobName = jobName

    let obj={
          ModelName:ModelName,
          ModelUserName:ModelUserName,
          ModelCountryName:ModelCountryName,
          ModelJobName:ModelJobName,
    }

    setModelDetails(obj)
    setOpenEdit(false)
  }*/



  return (


    <div className='info'>
        <div className="info-cover">
            <img src={coverImg} alt="" />
            <img src={profileImg} alt="" />
            {canModify && 
            <div className='coverDiv'><IoCameraOutline className='coverSvg' onClick={()=>importCover.current.click()}/></div>
            }
            {canModify && 
            <div className='profileDiv'><IoCameraOutline className='profileSvg' onClick={()=>importProfile.current.click()}/></div>
            }
        </div>
      

        
        <input type="file" 
        ref={importProfile}
        onChange={handleFile1}
        style={{display:"none"}}
        />
        
        <input type="file" 
        ref={importCover}
        onChange={handleFile2}
        style={{display:"none"}}
        />
        



        <div className="info-follow">
            <h1>{modelDetails.ModelName}</h1>
            <p>{modelDetails.ModelUserName}</p>

            {/* <Link to="/" className='logout'>
              <BiLogOut />Logout
            </Link> */}

            {canModify && <button onClick={()=>setOpenEdit(true)} className='edit-btn'><LiaEdit />{fr.PROFILE.EDIT}</button>}

            {/* <ModelProfile 
            name={name}
            setName={setName}
            userName={userName}
            setUserName={setUserName}
            countryName={countryName}
            setCountryName={setCountryName}
            jobName={jobName}
            setJobName={setJobName}
            handleModel={handleModel}
            openEdit={openEdit}
            setOpenEdit={setOpenEdit}
            /> */}
          

          <div className="info-details">

            <div className="info-col-2">
              <div>
                <h2>0</h2>
                <span>{fr.PROFILE.FOLLOWERS}</span>
              </div>
              <div>
                <h2>0</h2>
                <span>{fr.PROFILE.POSTS}</span>
              </div>
              <div>
                <h2>0</h2>
                <span>{fr.PROFILE.FOLLOWINGS}</span>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Info