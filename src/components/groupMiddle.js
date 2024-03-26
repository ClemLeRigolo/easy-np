import React from "react";
import InfoGroup from './infoGroup'

//import ProfileInputPost from './ProfileComponents/ProfileInputPost'

const GroupMiddle = ({following,
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
                        setModelDetails,
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
                        removeMbr,
                        group,
                        waitingList,
                        waitingListData,
                        acceptMember,
                        refuseMember,
                      }) => {

  /*const [userPostData ,setUserPostData] =useState(
    [
      //réupérer les données de la base de données
    ]
  )
  const [body,setBody] =useState("")
  //const [importFile,setImportFile] =useState("")
  
 

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
*/
   
  const userPostData = [];
    

  return (
    <div className='profileMiddle'>
        <InfoGroup
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
        canModify={canModify}
        uid={uid}
        nbMembers={nbMembers}
        nbPosts={nbPosts}
        coverImg={coverImg}
        setCoverImg={setCoverImg}
        groupId={groupId}
        members={members}
        admins={admins}
        membersData={membersData}
        addAdmin={addAdmin}
        removeAdmin={removeAdmin}
        removeMbr={removeMbr}
        group={group}
        waitingList={waitingList}
        waitingListData={waitingListData}
        acceptMember={acceptMember}
        refuseMember={refuseMember}
        />

    </div>
  )
}

export default GroupMiddle