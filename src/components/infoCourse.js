import React, { useState } from 'react'

import {LiaEdit} from "react-icons/lia"

import {IoCameraOutline} from "react-icons/io5"
import { useRef } from 'react';
//import ModelProfile from './modelProfile';
import { postCourseImg, postCoverCourseImg, updateCourse } from '../utils/firebase'
import fr from '../utils/i18n'
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import { compressImage, cropImage } from '../utils/helpers';
import ModelCourse from './modelCourse';
import { useMediaQuery } from '@mantine/hooks';

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
              cid,
              course
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

  const [openEdit,setOpenEdit] =useState(false)

  const handleModel = (data) => {
    const { name, description, school, year, program } = data;
    course.description = description;
    setModelDetails({ ...modelDetails, ModelName: name });

    updateCourse(cid, name, description, year, school, program).then(() => {
      setOpenEdit(false);
    }
    );

  }

  const isMobile = useMediaQuery('(max-width: 50em)');

  return (


    <div className='info'>
        <div className="info-cover">
            <img src={coverImg} alt="" />
            <img src={profileImg} alt="" />
            {canModify && 
            <div className='coverDiv' data-cy='coverImg'><IoCameraOutline className='coverSvg' onClick={()=>importCover.current.click()}/></div>
            }
            {canModify && 
            <div className='profileDiv' data-cy='profileImg'><IoCameraOutline className='profileSvg' onClick={()=>importProfile.current.click()}/></div>
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

            {canModify && <button onClick={()=>setOpenEdit(true)} className='edit-btn' data-cy='edit'><LiaEdit />{fr.COURSES.EDIT}</button>}

            <ModelCourse 
              name={course.name}
              school={course.school}
              year={course.year}
              program={course.program}
              description={course.description}
              handleModel={handleModel}
              openEdit={openEdit}
              setOpenEdit={setOpenEdit}
              isMobile={isMobile}
            />

          {course.description && (
            <div className='bio'>
            <p dangerouslySetInnerHTML={{ __html: course.description }}></p>
          </div>
          )}
          
        </div>
    </div>
  )
}

export default Info
