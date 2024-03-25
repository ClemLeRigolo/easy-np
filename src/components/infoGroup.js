import React, { useState, useEffect } from 'react'

import {LiaEdit} from "react-icons/lia"
import { MdOutlineManageAccounts } from "react-icons/md";
import {IoCameraOutline} from "react-icons/io5"
import { useRef } from 'react';
//import ModelProfile from './modelProfile';
import { postGroupImg, postCoverGroupImg, changeRole } from '../utils/firebase'
import fr from '../utils/i18n'
import '../styles/infoGroup.css'
import Loader from './loader';
import { Link } from 'react-router-dom';

const InfoGroup = ({userPostData,
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
              nbMembers,
              nbPosts,
              coverImg,
              setCoverImg,
              groupId,
              members,
              admins,
              membersData,
              addAdmin,
              removeAdmin,
            }) => {



  const [showManageWindow, setShowManageWindow] = useState(false);

  const importProfile=useRef()
  const importCover =useRef()


  const openManageWindow = () => {
    setShowManageWindow(true);
  };
  
  const closeManageWindow = () => {
    setShowManageWindow(false);
  };

  const handleRoleChange = (memberId, role, index) => {
    changeRole(groupId, memberId, role)
      .then(() => {
        if (role === 'admin') {
          addAdmin(memberId);
        } else {
          removeAdmin(memberId);
        }
      }
      )
      .catch((error) => console.log(error));
  };
    
  
  const handleFile1 = async (e) => {
    if (e.target.files && e.target.files[0]) {
      let img = e.target.files[0];
      try {
        console.log(img);
        const croppedImg = await cropImage(img);
        console.log(croppedImg);
        const url = await postGroupImg(groupId, croppedImg);
        console.log(url);
        setProfileImg(url);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const compressImage = (img) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = (event) => {
        const image = new Image();
        image.src = event.target.result;
  
        image.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
  
          const maxSize = 1024;
  
          let width = image.width;
          let height = image.height;
  
          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height;
              height = maxSize;
            }
          }
  
          canvas.width = width;
          canvas.height = height;
  
          ctx.drawImage(image, 0, 0, width, height);
  
          canvas.toBlob((blob) => {
            const compressedFile = new File([blob], img.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
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
  }
  
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

  const handleFile2 = async (e)=>{
    if (e.target.files && e.target.files[0]) {
      let img = e.target.files[0];
      try {
        console.log(img);
        const compressedImg = await compressImage(img);
        const url = await postCoverGroupImg(groupId, compressedImg);
        setCoverImg(url);
      } catch (error) {
        console.log(error);
      }
    }
  }

  const setOpenEdit=(value)=>{
    console.log(value)
  }


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
            {/*<p>{modelDetails.ModelUserName}</p>*/}

            {/* <Link to="/" className='logout'>
              <BiLogOut />Logout
            </Link> */}

            {canModify && <button onClick={() => openManageWindow()} className='edit-btn2'><MdOutlineManageAccounts />{fr.GROUPS.MANAGE}</button>}
            {canModify && <button onClick={()=>setOpenEdit(true)} className='edit-btn'><LiaEdit />{fr.GROUPS.EDIT}</button>}
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
                <h2>{nbMembers}</h2>
                <span>{fr.GROUPS.MEMBERS_COUNT}</span>
              </div>
              <div>
                <h2>{nbPosts}</h2>
                <span>{fr.GROUPS.POSTS}</span>
              </div>
            </div>

          </div>


        </div>

        {showManageWindow && (membersData.length == members.length) && (
          <div className="manage-window">
            <h3>{fr.GROUPS.MANAGE_MEMBERS}</h3>
            <ul>
              {members.map((member,index) => (
                <li key={member} className='row-member'>
                  <Link to={`/profile/${member}`} className='member-name'>
                  {membersData[index].profileImg ? (
                    <img src={membersData[index].profileImg} alt="" className='post-avatar' />
                  ) : (
                    <img src={require(`../images/Profile-pictures/${membersData[index].school}-default-profile-picture.png`)} alt="" className='post-avatar' />
                  )}
                  <span>{membersData[index].name} {membersData[index].surname}</span>
                  </Link>
                  <select
                    value={admins.includes(member.toString()) ? 'admin' : 'member'}
                    onChange={(e) => handleRoleChange(member, e.target.value)}
                  >
                    <option value="admin">{fr.GROUPS.ADMIN}</option>
                    <option value="member">{fr.GROUPS.MEMBER}</option>
                  </select>
                </li>
              ))}
            </ul>
            <button onClick={closeManageWindow}>{fr.GROUPS.CLOSE}</button>
          </div>
        )}
    </div>
  )
}

export default InfoGroup