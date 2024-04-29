import React, { useState } from 'react'

import {LiaEdit} from 'react-icons/lia'
import { MdOutlineManageAccounts } from 'react-icons/md';
import {IoCameraOutline} from 'react-icons/io5'
import { useRef } from 'react';
//import ModelProfile from './modelProfile';
import { postGroupImg, postCoverGroupImg, changeRole, removeMemberFromId, acceptMemberFromId, refuseMemberFromId } from '../utils/firebase'
import fr from '../utils/i18n'
import '../styles/infoGroup.css'
import { Link } from 'react-router-dom';
import { IoPersonRemoveOutline } from 'react-icons/io5';
import { FaCheck } from 'react-icons/fa6';
import { ImCross } from 'react-icons/im';
import GroupMembership from './groupMembership';
import { compressImage, cropImage } from '../utils/helpers';
import { Modal, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import UserList from './userList';

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
              removeMbr,
              group,
              waitingList,
              waitingListData,
              acceptMember,
              refuseMember,
              showManage,
              userData
            }) => {



  const [showManageWindow, setShowManageWindow] = useState(showManage);
  const [windowManageMember, setWindowManageMember] = useState('membres');
  const [showMembers, setShowMembers] = useState(false);

  const importProfile=useRef()
  const importCover =useRef()

  const theme = useMantineTheme();

  const changeManageWindow = (window) => {
    setWindowManageMember(window);
  };

  const openManageWindow = () => {
    setShowManageWindow(true);
  };
  
  const closeManageWindow = () => {
    setShowManageWindow(false);
  };

  const openMembers = () => {
    setShowMembers(true);
  };

  const closeMembers = () => {
    setShowMembers(false);
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

  const removeMember = (memberId) => {
    removeMemberFromId(groupId, memberId)
      .then(() => {
        removeMbr(memberId);
      })
      .catch((error) => console.log(error));
  };  

  const handleAcceptMember = (memberId) => {
    acceptMemberFromId(groupId, memberId)
      .then(() => {
        acceptMember(memberId);
      })
      .catch((error) => console.log(error));
  };

  const handleRefuseMember = (memberId) => {
    refuseMemberFromId(groupId, memberId)
      .then(() => {
        refuseMember(memberId);
      })
      .catch((error) => console.log(error));
  };
  
  const handleFile1 = async (e) => {
    if (e.target.files && e.target.files[0]) {
      let img = e.target.files[0];
      try {
        const croppedImg = await cropImage(img);
        const url = await postGroupImg(groupId, croppedImg);
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

  const isCreator = uid === group.creator;
  const isMobile = useMediaQuery('(max-width: 50em)');

  return (


    <div className='info'>
        <div className='info-cover'>
            <img src={coverImg} alt='' />
            <img src={profileImg} alt='' />
            {canModify && 
            <div className='coverDiv'><IoCameraOutline className='coverSvg' onClick={()=>importCover.current.click()}/></div>
            }
            {canModify && 
            <div className='profileDiv'><IoCameraOutline className='profileSvg' onClick={()=>importProfile.current.click()}/></div>
            }
        </div>
      

        
        <input type='file' 
        ref={importProfile}
        onChange={handleFile1}
        style={{display:'none'}}
        />
        
        <input type='file' 
        ref={importCover}
        onChange={handleFile2}
        style={{display:'none'}}
        />
        



        <div className='info-follow'>
            <h1>{modelDetails.ModelName}</h1>
            {/*<p>{modelDetails.ModelUserName}</p>*/}

            {/* <Link to='/' className='logout'>
              <BiLogOut />Logout
            </Link> */}

            {canModify && <button onClick={() => openManageWindow()} className='edit-btn2' data-cy='manageGroup'><MdOutlineManageAccounts />{fr.GROUPS.MANAGE}</button>}
            {canModify && <button onClick={()=>setOpenEdit(true)} className='edit-btn'><LiaEdit />{fr.GROUPS.EDIT}</button>}
            <GroupMembership group={group} userSchool={null} fromGroup={true} />
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

          {group.description && (
            <div className='bio'>
            <p dangerouslySetInnerHTML={{ __html: group.description }}></p>
          </div>
          )}
          

          <div className='info-details'>

            <div className='info-col-2'>
              <div onClick={() => openMembers()}>
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

        <Modal
            radius="8px"
            zIndex="1001"
            size="lg"
            opened={showMembers}
            withCloseButton={false}
            onClose={() => closeMembers()}
            overlayProps={{
              color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[10],
            }}
            centered
            fullScreen={isMobile}
          >
            <div className='manage-window'>
              <UserList users={membersData} subscriptions={userData.subscriptions} title={fr.GROUPS.MEMBERS} uid={userData.id} />
              <button className='closeSubscribers' onClick={() => closeMembers()}>{fr.PROFILE.CLOSE}</button>
            </div>
          </Modal>

        <Modal
            radius="8px"
            zIndex="1001"
            size="lg"
            opened={showManageWindow}
            title={fr.GROUPS.MANAGE}
            onClose={() => closeManageWindow()}
            overlayProps={{
              color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[10],
            }}
            fullScreen={isMobile}
            centered
          >
          <div className='manage-window' data-cy='manageGroup'>
            <div className='manage-window-buttons'>
              <button
                className={windowManageMember === 'membres' ? 'active' : ''}
                onClick={() => changeManageWindow('membres')} data-cy='member'
              >
                {fr.GROUPS.MEMBERS}
              </button>
              <button
                className={windowManageMember === 'waitingList' ? 'active' : ''}
                onClick={() => changeManageWindow('waitingList')} data-cy='waitingList'
              >
                {fr.GROUPS.WAITING_LIST}
              </button>
            </div>
            {windowManageMember === 'membres' ? (
            <div>
            <h3>{fr.GROUPS.MANAGE}</h3>
            <ul>
              {membersData.map((member,index) => (
                <li key={member.uid} className='row-member'>
                  <Link to={`/profile/${member.uid}`} className='member-name'>
                  {member.profileImg ? (
                    <img src={member.profileImg} alt='' className='post-avatar' />
                  ) : (
                    <img src={require(`../images/Profile-pictures/${member.school}-default-profile-picture.png`)} alt='' className='post-avatar' />
                  )}
                  <span>{member.name} {member.surname}</span>
                  </Link>
                  <div className='member-role'>
                  {member.uid === group.creator ? (
                    <select
                    value='creator'
                  >
                    <option value='creator'>{fr.GROUPS.CREATOR}</option>
                  </select>
                    ) : admins.includes(member.uid.toString()) && !isCreator ? (
                    <select
                    value='admin'
                  >
                    <option value='admin'>{fr.GROUPS.ADMIN}</option>
                  </select>) : (
                    <select
                    value={admins.includes(member.uid.toString()) ? 'admin' : 'member'}
                    onChange={(e) => handleRoleChange(member.uid, e.target.value)}
                  >
                    <option value='member'>{fr.GROUPS.MEMBER}</option>
                    <option value='admin'>{fr.GROUPS.ADMIN}</option>
                  </select>
                  )}
                  {member.uid !== uid && (isCreator || !admins.includes(member.uid.toString())) && (
                    <button onClick={() => removeMember(member.uid)}><IoPersonRemoveOutline /></button>
                  )}
                  </div>
                </li>
              ))}
            </ul>
            </div>
            ) : (
              <div>
              <h3>{fr.GROUPS.WAITING_LIST}</h3>
              <ul data-cy='waitingList'>
                {waitingListData.map((member,index) => (
                  <li key={member.uid} className='row-member'>
                    <Link to={`/profile/${member.uid}`} className='member-name'>
                    {member.profileImg ? (
                      <img src={member.profileImg} alt='' className='post-avatar' />
                    ) : (
                      <img src={require(`../images/Profile-pictures/${member.school}-default-profile-picture.png`)} alt='' className='post-avatar' />
                    )}
                    <span>{member.name} {member.surname}</span>
                    </Link>
                    <button onClick={() => handleAcceptMember(member.uid)} data-cy="accept"> <FaCheck /> </button>
                    <button onClick={() => handleRefuseMember(member.uid)} data-cy="refuse"> <ImCross /> </button>
                  </li>
                ))}
              </ul>
              </div>
            )}
            <button onClick={closeManageWindow} data-cy='closeManageWindow'>{fr.GROUPS.CLOSE}</button>
          </div>
        </Modal>
    </div>
  )
}

export default InfoGroup
