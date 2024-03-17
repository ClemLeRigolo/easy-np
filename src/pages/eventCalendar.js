import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import HeaderBar from '../components/headerBar'
import { authStates, withAuth } from "../components/auth";
import { Redirect } from "react-router-dom";
import Loader from "../components/loader";
import { withRouter } from 'react-router-dom';
import { changeColor } from "../components/schoolChoose";
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

//const [events, setEvents] = useState([]);
// Fetch events from Firebase here...
/*const fetchEvents = async () => {
    // Fetch events from Firebase
    const events = await getEvents();
    setEvents(events);
};*/

class eventCalendar extends React.Component {



    render() {
        //const [user, setUser] = useState(getCurrentUser());
    
        //const [userData, setUserData] = useState(null);
    
        const { authState, user } = this.props;
    
        if (authState === authStates.INITIAL_VALUE) {
          console.log("initial value");
          return <Loader />;
        }
    
        const events = [
            //Dummy events pour l'instant
            {
            start: new Date(2024, 2, 15, 10, 0), // Date et heure de début
            end: new Date(2024, 2, 15, 12, 0), // Date et heure de fin
            title: 'Soirée étudiante (yaura de la meuf)', // Titre de l'événement
            },
        ];
       
        return (
            <div>
                <HeaderBar search={""} setSearch={""} showMenu={false} setShowMenu={false} uid={user.uid} />
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }} // Ajuste la hauteur selon tes besoins
              />
            </div>
          );

    }


}

export default withRouter(withAuth(eventCalendar));