import React from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineArrowRight, AiOutlineClose } from 'react-icons/ai';
import '../styles/homeNotification.css';
import { Redirect } from 'react-router-dom';

const HomeNotification = ({ message, url, arrow, canClosed }) => {
    const [isOpened, setIsOpened] = React.useState(true);
    const [redirect, setRedirect] = React.useState(false);

    if (!isOpened) {
        return null;
    }

    if (redirect) {
        return <Redirect to={url} />;
    }

    console.log('HomeNotification', message, url, arrow, canClosed);

    return (
        <div className='banner'>
            {canClosed && (<AiOutlineClose onClick={() => setIsOpened(false)} />)}
            <span onClick={() => setRedirect(true)}>{message}</span>
            {arrow && (<AiOutlineArrowRight className='arrow' onClick={() => setRedirect(true)} />)} 
        </div>);
};

export default HomeNotification;