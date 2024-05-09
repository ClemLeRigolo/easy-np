import React from "react";
import InfoCourse from './infoCourse.js'

//import ProfileInputPost from './ProfileComponents/ProfileInputPost'

const CourseMiddle = ({following,
                        profileImg,
                        setProfileImg,
                        name,
                        setName,
                        userName,
                        setUserName,
                        modelDetails,
                        setModelDetails,
                        canModify,
                        uid,
                        coverImg,
                        setCoverImg,
                        cid,
                        course
                      }) => {
    

  return (
    <div className='profileMiddle'>
        <InfoCourse
        modelDetails ={modelDetails}
        setModelDetails={setModelDetails}
        profileImg={profileImg}
        setProfileImg={setProfileImg}
        following={following}
        name={name}
        setName={setName}
        userName={userName}
        setUserName={setUserName}
        canModify={canModify}
        uid={uid}
        coverImg={coverImg}
        setCoverImg={setCoverImg}
        cid={cid}
        course={course}
        />

    </div>
  )
}

export default CourseMiddle