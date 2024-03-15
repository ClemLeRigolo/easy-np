import React, { useState } from 'react'
import Info3 from "../images/banner.jpg"

import {LiaEdit} from "react-icons/lia"

import {IoCameraOutline} from "react-icons/io5"
import {BiLogOut} from "react-icons/bi"
import { useRef } from 'react';
//import ModelProfile from './modelProfile';
import { Link } from 'react-router-dom';
import { postProfileImg } from '../utils/firebase'
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
              setUserName}) => {


  const [coverImg,setCoverImg] =useState(Info3)

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

  const [openEdit,setOpenEdit] =useState(false)

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
  }

  console.log(profileImg)


  return (


    <div className='info'>
        <div className="info-cover">
            <img src={coverImg} alt="" />
            <img src={profileImg} alt="" />
            <div className='coverDiv'><IoCameraOutline className='coverSvg' onClick={()=>importCover.current.click()}/></div>
            <div className='profileDiv'><IoCameraOutline className='profileSvg' onClick={()=>importProfile.current.click()}/></div>
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

            <button onClick={()=>setOpenEdit(true)}><LiaEdit />{fr.PROFILE.EDIT}</button>
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
                <h2>7 852 665</h2>
                <span>{fr.PROFILE.FOLLOWERS}</span>
              </div>
              <div>
                <h2>{userPostData.length}</h2>
                <span>{fr.PROFILE.POSTS}</span>
              </div>
              <div>
                <h2>{following}</h2>
                <span>{fr.PROFILE.FOLLOWINGS}</span>
              </div>
            </div>

          </div>


        </div>
    </div>
  )
}

export default Info