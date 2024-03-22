import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/fr'; // Importez la locale française de moment
import HeaderBar from '../components/headerBar'
import { authStates, withAuth } from "../components/auth";
import Loader from "../components/loader";
import { withRouter } from 'react-router-dom';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getEvents } from "../utils/firebase";

const localizer = momentLocalizer(moment);

class eventCalendar extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          events: [],
          eventsCollected: false,
      };
    }

    handleViewChange = (view) => {
      this.setState({ view });
    };

    render() {
        const { authState, user } = this.props;

        if (authState === authStates.INITIAL_VALUE) {
          console.log("initial value");
          return <Loader />;
        }

        if (!this.state.eventsCollected) {
          getEvents().then((events) => {
            for (let i = 0; i < Object.values(Object.values(events)[0]).length; i++) {
              Object.values(Object.values(events)[0])[i].start = new Date(Object.values(Object.values(events)[0])[i].start);
              Object.values(Object.values(events)[0])[i].end = new Date(Object.values(Object.values(events)[0])[i].end);
            }

            this.setState({ events: Object.values(Object.values(events)[0]), eventsCollected: true });
          });
          
        }

        moment.locale('fr'); // Définir la locale de moment sur le français
       
        return (
          <div>
            <HeaderBar search={""} setSearch={""} showMenu={false} setShowMenu={false} uid={user.uid} />
            <div>{this.state.view}</div>
            <Calendar
              localizer={localizer}
              events={this.state.events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }} // Ajuste la hauteur selon tes besoins
              onView={this.handleViewChange}
            />
          </div>
        );
    }
}

export default withRouter(withAuth(eventCalendar));