import React, { useState } from 'react'
import Info3 from "../images/banner.jpg"

import {LiaEdit} from "react-icons/lia"

import {IoCameraOutline} from "react-icons/io5"
import { useRef } from 'react';
//import ModelProfile from './modelProfile';
import { postProfileImg, subscribeToUser, unsubscribeFromUser } from '../utils/firebase'
import fr from '../utils/i18n'

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
              nbSubscribers,
              nbSubscriptions
            }) => {


  const [coverImg,setCoverImg] =useState(Info3)
  const [isSubscribed,setIsSubscribed] =useState(isSubscribedProps)
  const [isHovered, setIsHovered] = useState(false);

  console.log(isSubscribed)

  const importProfile=useRef()
  const importCover =useRef()

  
  const handleFile1 = async (e) => {
    if (e.target.files && e.target.files[0]) {
      let img = e.target.files[0];
      try {
        console.log(img);
        //const compressedImg = await compressImage(img);
        const croppedImg = await cropImage(img);
        console.log(croppedImg);
        const url = await postProfileImg(croppedImg);
        console.log(url);
        setProfileImg(url);
      } catch (error) {
        console.log(error);
      }
    }
  };
  
  const cropImage = (img) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = (event) => {
        const image = new Image();
        image.src = event.target.result;
  
        image.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
  
          const size = 170;
  
          canvas.width = size;
          canvas.height = size;
  
          let offsetX = 0;
          let offsetY = 0;
  
          if (image.width > image.height) {
            offsetX = (image.width - image.height) / 2;
          } else {
            offsetY = (image.height - image.width) / 2;
          }
  
          ctx.drawImage(image, offsetX, offsetY, image.width - 2 * offsetX, image.height - 2 * offsetY, 0, 0, size, size);
  
          canvas.toBlob((blob) => {
            const croppedFile = new File([blob], img.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(croppedFile);
          }, 'image/jpeg', 0.9);
        };
  
        image.onerror = (error) => {
          reject(error);
        };
      };
  
      reader.onerror = (error) => {
        reject(error);
      };
  
      reader.readAsDataURL(img);
    });
  };

  const handleFile2 =(e)=>{
    if(e.target.files && e.target.files[0]){
      let img =e.target.files[0]
      const imgObj ={image:URL.createObjectURL(img)}
      const coverImg =imgObj.image;
      setCoverImg(coverImg)
    }
  }

  const setOpenEdit=(value)=>{
    console.log(value)
  }

  const handleSubscription=()=>{
    console.log("subscribing...")
    subscribeToUser(uid).then(()=>{
      console.log("subscribed")
      setIsSubscribed(true)
    });
  }

  const handleUnsubscription=()=>{
    console.log("unsubscribing...")
    unsubscribeFromUser(uid).then(()=>{
      console.log("unsubscribed")
      setIsSubscribed(false)
    });
    setIsHovered(false);
  }

  const changeHover=()=>{
    console.log("hovered")
    setIsHovered(true)
  }

  const changeHoverOut=()=>{
    console.log("hovered out")
    setIsHovered(false)
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

  console.log(isHovered)


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

            <button onClick={()=>setOpenEdit(true)} className='edit-btn'><LiaEdit />{fr.PROFILE.EDIT}</button>


            {!canModify && !isSubscribed && <button onClick={()=>handleSubscription()} >{fr.PROFILE.SUBSCRIBE}</button>}
            {!canModify && isSubscribed && isHovered && <button onClick={()=>handleUnsubscription()} onMouseLeave={changeHoverOut} >{fr.PROFILE.UNSUBSCRIBE}</button>}
            {!canModify && isSubscribed && !isHovered && <button onClick={()=>handleSubscription()} onMouseEnter={changeHover} >{fr.PROFILE.SUBSCRIBED}</button>}
            

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
                <h2>{nbSubscribers}</h2>
                <span>{fr.PROFILE.FOLLOWERS}</span>
              </div>
              <div>
                <h2>{userPostData.length}</h2>
                <span>{fr.PROFILE.POSTS}</span>
              </div>
              <div>
                <h2>{nbSubscriptions}</h2>
                <span>{fr.PROFILE.FOLLOWINGS}</span>
              </div>
            </div>

          </div>


        </div>
    </div>
  )
}

export default Info