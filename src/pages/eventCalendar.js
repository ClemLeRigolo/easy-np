import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/fr'; // Importez la locale française de moment
import { authStates, withAuth } from "../components/auth";
import Loader from "../components/loader";
import { withRouter } from 'react-router-dom';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getEvents } from "../utils/firebase";
import '../styles/eventCalendar.css';
import { Link } from 'react-router-dom';
import { MdClose } from "react-icons/md";

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
          view: 'month',
          maxTime: new Date().setHours(8, 0, 0)
      };
    }

    handleEventClick = (event, e) => {
      const { clientX, clientY } = e.nativeEvent;
      this.setState((prevState) =>({
        showDetails: prevState.selectedEvent === event ? !prevState.showDetails : true,
        selectedEvent: event,
        clickPosition: { x: clientX, y: clientY },
      }));
    };

    handleViewChange = (view) => {
      this.setState({ 
        view: view,
        selectedEvent: null,
        showDetails: false
      });
    };

    getEventStyle = (event) => {
      let color;
      console.log(event.type);
      console.log(event);
      if (event.type === "Hackaton") {
        color = 'red';
      } else if (event.type === "Soirée") {
        color = "gold";
      } else if (event.type === "MINP") {
        color = "darkOrange";
      } else if (event.type === "Kfet") {
        color = "green";
      } else {
        color = "steelBlue";
      }
      console.log(color);
    
      return {
        style: {
          backgroundColor: color,
        },
      };
    };

    dayPropGetter = (date) => {
      if (this.state.view === "day") {
        return {};
      }

      const currentDate = moment().startOf('day'); // Obtenez la date actuelle sans heure
      const cellDate = moment(date).startOf('day'); // Obtenez la date de la cellule sans heure
    
      if (currentDate.isSame(cellDate)) {
        // Appliquez un style aux cellules de la date actuelle
        return {
          style: {
            border: '1px solid var(--selected-color)', // Remplacez var(--selected-color) par la couleur souhaitée
          },
        };
      }
    
      return {}; // Retourne un objet vide pour les autres cellules
    };

    truncateDescription = (description, maxLength) => {
      if (description.length <= maxLength) {
        return description;
      }
      return description.substr(0, maxLength) + '[...]';
    };

    render() {
        const { authState } = this.props;

        if (authState === authStates.INITIAL_VALUE) {
          console.log("initial value");
          return <Loader />;
        }

        if (!this.state.eventsCollected) {
          getEvents().then((events) => {
            if (!events) {
              return;
            }
            const eventsArray = [];
            for (let i = 0; i < Object.values(events).length; i++) {
              Object.values(Object.values(events)[i])[0].start = new Date(Object.values(Object.values(events)[i])[0].start);
              Object.values(Object.values(events)[i])[0].end = new Date(Object.values(Object.values(events)[i])[0].end);
              eventsArray.push(Object.values(Object.values(events)[i])[0]);
            }

            this.setState({ events: eventsArray, eventsCollected: true });
          })
          .catch((error) => {
            console.error("Erreur lors de la récupération des événements :", error);
          });
          return <Loader />
        }

        moment.locale('fr'); // Définir la locale de moment sur le français

        const fr = {
          week: 'Semaine',
          work_week: 'Semaine de travail',
          day: 'Jour',
          month: 'Mois',
          previous: 'Précédent',
          next: 'Suivant',
          today: `Aujourd'hui`,
          agenda: 'Agenda',
      
          showMore: (total) => `+${total} supplémentaires`,
        }
       
        const { selectedEvent, showDetails, clickPosition } = this.state;

        return (
          <div className='interface'>
            <Calendar
              localizer={localizer}
              events={this.state.events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 550 }}
              onView={this.handleViewChange}
              onNavigate={this.handleViewChange}
              onSelectEvent={this.handleEventClick}
              eventPropGetter={this.getEventStyle}
              dayPropGetter={this.dayPropGetter}
              popup={true}
              messages={fr}
              min={this.state.maxTime}
            />

            {selectedEvent && showDetails && (
              <div
                className="event-details"
                style={{ top: clickPosition.y > 200 ? clickPosition.y - 200 : 0, left: clickPosition.x - 100 }}
              >
                <MdClose
                  className="close-button"
                  onClick={() => this.setState({ showDetails: false, selectedEvent: null})}
                />
                <h3 className='event-title'>{selectedEvent.title}</h3>
                <p>{this.truncateDescription(selectedEvent.description, 60)}</p>
                <p>Date de début : {selectedEvent.start.toLocaleDateString()}</p>
                <p>Date de fin : {selectedEvent.end.toLocaleDateString()}</p>
                <Link to={`/group/${selectedEvent.groupId}/event/${selectedEvent.id}`}>Voir plus</Link>
              </div>
            )}
          </div>
        );
    }
}

export default withRouter(withAuth(eventCalendar));