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
import '../styles/eventCalendar.css';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

const localizer = momentLocalizer(moment);

class eventCalendar extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          events: [],
          eventsCollected: false,
          selectedEvent: null,
          showDetails: false,
          clickPosition: { x: 0, y: 0 },
      };
    }

    handleEventClick = (event, e) => {
      const { clientX, clientY } = e.nativeEvent;
      this.setState((prevState) =>({
        selectedEvent: event,
        showDetails: !prevState.showDetails,
        clickPosition: { x: clientX, y: clientY },
      }));
    };

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
       
        const { selectedEvent, showDetails, clickPosition } = this.state;

        return (
          <div>
            <HeaderBar search={""} setSearch={""} showMenu={false} setShowMenu={false} uid={user.uid} />

            <div>{this.state.view}</div>
            <Calendar
              localizer={localizer}
              events={this.state.events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
              onView={this.handleViewChange}
              onSelectEvent={this.handleEventClick}
            />

            {selectedEvent && showDetails && (
              <div
                className="event-details"
                style={{ top: clickPosition.y - 250, left: clickPosition.x - 100 }}
              >
                <h3>{selectedEvent.title}</h3>
                <p>Date de début : {selectedEvent.start.toString()}</p>
                <p>Date de fin : {selectedEvent.end.toString()}</p>
                <Link to={`/event/${selectedEvent.id}`}>Voir plus</Link>
              </div>
            )}
          </div>
        );
    }
}

export default withRouter(withAuth(eventCalendar));