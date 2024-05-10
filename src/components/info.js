import React, { useState } from 'react'

import {LiaEdit} from "react-icons/lia"

import {IoCameraOutline} from "react-icons/io5"
import { IoChatboxEllipsesOutline } from "react-icons/io5";

import { useRef } from 'react';
//import ModelProfile from './modelProfile';
import { postProfileImg, postCoverImg, subscribeToUser, unsubscribeFromUser, updateUserData } from '../utils/firebase'
import fr from '../utils/i18n'
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import { compressImage, cropImage } from '../utils/helpers';
import ModelProfile from './modelProfile';
import { Modal, useMantineTheme } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import UserList from './userList';

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
              userData,
              currentUserData,
            }) => {

  const [isSubscribed,setIsSubscribed] =useState(isSubscribedProps)
  const [isHovered, setIsHovered] = useState(false);
  const [showSubscribers, setShowSubscribers] = useState(false);
  const [showSubscriptions, setShowSubscriptions] = useState(false);

  const importProfile=useRef()
  const importCover =useRef()

  const theme = useMantineTheme();

  
  const handleFile1 = async (e) => {
    if (e.target.files && e.target.files[0]) {
      let img = e.target.files[0];
      try {
        const croppedImg = await cropImage(img);
        const url = await postProfileImg(croppedImg);
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
        const url = await postCoverImg(compressedImg);
        setCoverImg(url);
      } catch (error) {
        console.log(error);
      }
    }
  }

  const handleSubscription=()=>{
    subscribeToUser(uid).then(()=>{
      setIsSubscribed(true)
    });
  }

  const handleUnsubscription=()=>{
    unsubscribeFromUser(uid).then(()=>{
      setIsSubscribed(false)
    });
    setIsHovered(false);
  }

  const changeHover=()=>{
    setIsHovered(true)
  }

  const changeHoverOut=()=>{
    setIsHovered(false)
  }

  const openSubscribers=()=>{
    setShowSubscribers(true)
  }

  const closeSubscribers=()=>{
    setShowSubscribers(false)
  }

  const openSubscriptions=()=>{
    setShowSubscriptions(true)
  }

  const closeSubscriptions=()=>{
    setShowSubscriptions(false)
  }

  const [openEdit,setOpenEdit] =useState(false)
  
  const handleModel = (data) => {
    const { name, surname, username, school, year, major, bio } = data;
    userData.bio = bio;
    setName(name+" "+surname);
    setUserName(username);

    updateUserData(surname,name,username,school,year,major,bio).then(()=>{
      setModelDetails({...modelDetails,ModelName:name+" "+surname,ModelUserName:username})
      setOpenEdit(false)
    })
  }

  const isMobile = useMediaQuery('(max-width: 50em)');

  //get all the subscriptionsData uid and put it into a list
  let subscriptions = []
  subscriptionsData.map((subscription)=>{
    subscriptions.push(subscription.uid)
  }
  )


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
            {!canModify &&
              <Link 
              to={`/chat/${uid}`} 
              className="profileDiv"
              style={{ 
                color: 'black', 
                textDecoration: 'none',
              }}
            >
              <IoChatboxEllipsesOutline 
                className="profileSvg" 
                header={true} 
              />
            </Link>}
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
          <div style={{position: 'absolute', top: '50%', right: '40%'}}>

            </div>
            <h1>{modelDetails.ModelName}</h1>
            <p>{modelDetails.ModelUserName}</p>

            {/* <Link to="/" className='logout'>
              <BiLogOut />Logout
            </Link> */}

            {canModify && <button onClick={()=>setOpenEdit(true)} className='edit-btn' data-cy='editProfile'><LiaEdit />{fr.PROFILE.EDIT}</button>}


            {!canModify && !isSubscribed && <button className='sub-btn' onClick={()=>handleSubscription()} data-cy='follow'>{fr.PROFILE.SUBSCRIBE}</button>}
            {!canModify && isSubscribed && isHovered && <button className='sub-btn' onClick={()=>handleUnsubscription()} onMouseLeave={changeHoverOut} data-cy='unfollow'>{fr.PROFILE.UNSUBSCRIBE}</button>}
            {!canModify && isSubscribed && !isHovered && <button className='sub-btn' onClick={()=>handleSubscription()} onMouseEnter={changeHover} data-cy='unfollow'>{fr.PROFILE.SUBSCRIBED}</button>}
            

            <ModelProfile 
            name={userData.name}
            surname={userData.surname}
            userName={userData.tag}
            school={userData.school}
            year={userData.year}
            major={userData.major}
            bio={userData.bio}
            handleModel={handleModel}
            openEdit={openEdit}
            setOpenEdit={setOpenEdit}
            isMobile={isMobile}
            />

          {userData.bio && (
            <div className='bio'>
            <p dangerouslySetInnerHTML={{ __html: userData.bio }}></p>
          </div>
          )}
          
          

          <div className="info-details">

            {/* <div className="info-col-1">
              {userData.year && (
              <div>
                <h2>{userData.year}</h2>
                <span>{fr.PROFILE.YEAR}</span>
              </div>)}
              {userData.major && (
              <div>
                <h2>{userData.major}</h2>
                <span>{fr.PROFILE.MAJOR}</span>
              </div>)}
            </div> */}

            <div className="info-col-2">
              <div onClick={() => openSubscribers()} data-cy='followers'>
                <h2>{subscribersData.length}</h2>
                <span>{fr.PROFILE.FOLLOWERS}</span>
              </div>
              <div>
                <h2>{nbPosts}</h2>
                <span>{fr.PROFILE.POSTS}</span>
              </div>
              <div onClick={() => openSubscriptions()} data-cy='subscriptions'>
                <h2>{subscriptionsData.length}</h2>
                <span>{fr.PROFILE.FOLLOWINGS}</span>
              </div>
            </div>

          </div>

            <Modal
            radius="8px"
            zIndex="1001"
            size="lg"
            opened={showSubscribers}
            withCloseButton={false}
            onClose={() => closeSubscribers()}
            overlayProps={{
              color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[10],
            }}
            centered
            fullScreen={isMobile}
          >
            <div className='manage-window'>
              <UserList users={subscribersData} subscriptions={currentUserData.subscriptions} title={fr.PROFILE.FOLLOWERS} uid={currentUserData.id} />
              <button className='closeSubscribers' onClick={() => closeSubscribers()} data-cy='closeFollowers' >{fr.PROFILE.CLOSE}</button>
            </div>
          </Modal>


          <Modal
            radius="8px"
            zIndex="1001"
            size="lg"
            opened={showSubscriptions}
            withCloseButton={false}
            onClose={() => closeSubscriptions()}
            overlayProps={{
              color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[10],
            }}
            centered
            fullScreen={isMobile}
          >
            <div className="manage-window">
              <UserList users={subscriptionsData} subscriptions={currentUserData.subscriptions} title={fr.PROFILE.FOLLOWINGS} uid={currentUserData.id} />
              <button onClick={() => closeSubscriptions()} data-cy='closeSubscriptions' >{fr.PROFILE.CLOSE}</button>
            </div>
          </Modal>


        </div>
    </div>
  )
}

export default Info
