import React from "react";
import { Link } from "react-router-dom";
import { authStates, withAuth } from "../components/auth";
import Loader from "../components/loader";
import { getUserDataById, getCoursesBySchool } from "../utils/firebase";
import fr from "../utils/i18n";
import "../styles/courses.css";
import { changeColor } from "../components/schoolChoose";
import { AiOutlinePlusCircle } from "react-icons/ai";

class Courses extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: null,
      profileImg: null,
      dataCollected: false,
      admin: false,
      school: "",
      firstYearCourses: [],
      secondYearCommonCourses: [], // Cours du tronc commun
      secondYearISICourses: [], // Cours de la filière ISI
      secondYearIFCourses: [], // Cours de la filière IF
      secondYearMMISCourses: [], // Cours de la filière MMIS
      thirdYearCommonCourses: [], // Cours du tronc commun
      thirdYearISICourses: [], // Cours de la filière ISI
      thirdYearIFCourses: [], // Cours de la filière IF
      thirdYearMMISCourses: [], // Cours de la filière MMIS
      showFirstYearCourses: false,
      showSecondYearCourses: false,
      showSecondYearCommonCourses: false,
      showSecondYearISICourses: false,
      showSecondYearIFCourses: false,
      showSecondYearMMISCourses: false,
      showThirdYearCourses: false,
        showThirdYearCommonCourses: false,
        showThirdYearISICourses: false,
        showThirdYearIFCourses: false,
        showThirdYearMMISCourses: false,
      coursesSetted: false,
    };
  }

  render() {
    const { authState, user } = this.props;

    if (authState === authStates.INITIAL_VALUE) {
      return <Loader />;
    }

    if (authState === authStates.LOGGED_IN && !this.state.dataCollected) {
      getUserDataById(user.uid).then((userData) => {
        this.setState({
          profileImg: userData.profileImg,
          dataCollected: true,
          admin: userData.admin ? true : false,
          school: userData.school,
        });
        if (!this.state.profileImg) {
          this.setState({
            profileImg: require(`../images/Profile-pictures/${userData.school}-default-profile-picture.png`),
          });
        }
        changeColor(userData.school);
      });
      return <Loader />;
    }

    if (!this.state.coursesSetted) {
      getCoursesBySchool(this.state.school).then((courses) => {
        if (!courses) {
          return;
        }

        const firstYearCourses = [];
        const secondYearCommonCourses = [];
        const secondYearISICourses = [];
        const secondYearIFCourses = [];
        const secondYearMMISCourses = [];
        const thirdYearCommonCourses = [];
        const thirdYearISICourses = [];
        const thirdYearIFCourses = [];
        const thirdYearMMISCourses = [];

        Object.values(courses).forEach((course) => {
          if (course.year === "1") {
            firstYearCourses.push(course);
          } else if (course.year === "2") {
            if (course.program === "Common") {
              secondYearCommonCourses.push(course);
            } else if (course.program === "ISI") {
              secondYearISICourses.push(course);
            } else if (course.program === "IF") {
              secondYearIFCourses.push(course);
            } else if (course.program === "MMIS") {
              secondYearMMISCourses.push(course);
            }
          } else if (course.year === "3") {
            if (course.program === "Common") {
              thirdYearCommonCourses.push(course);
            } else if (course.program === "ISI") {
              thirdYearISICourses.push(course);
            } else if (course.program === "IF") {
              thirdYearIFCourses.push(course);
            } else if (course.program === "MMIS") {
              thirdYearMMISCourses.push(course);
            }
          }
        });

        this.setState({
          firstYearCourses,
          secondYearCommonCourses,
          secondYearISICourses,
          secondYearIFCourses,
          secondYearMMISCourses,
          thirdYearCommonCourses,
          thirdYearISICourses,
          thirdYearIFCourses,
          thirdYearMMISCourses,
          coursesSetted: true,
        });
      });
    }

    if (this.state.school !== "ensimag") {
      return (
        <div className="interface">
          <h1>{fr.COURSES.NO_COURSES_ATM}</h1>
        </div>
      );
    }

    return (
      <div className="interface">
        <div className="course-list">
          {this.state.admin && (
           <Link to="/createCourse" className="create-course-button" data-cy='createCourse'>
              <AiOutlinePlusCircle /> {fr.FORM_FIELDS.CREATE_COURSE}
            </Link>
          )}
          <div className="year-courses">
            <h2
              data-cy="firstYear"
              className="year-title"
              onClick={() =>
                this.setState((prevState) => ({
                  showFirstYearCourses: !prevState.showFirstYearCourses,
                }))
              }
            >
              {fr.COURSES.FIRST_YEAR}
            </h2>
            {this.state.showFirstYearCourses &&
              this.state.firstYearCourses.map((course) => (
                <Link to={`/course/${course.id}`} className="course" key={course.id}>
                  <h3>{course.name}</h3>
                  <p>{course.description}</p>
                </Link>
              ))}
            {this.state.showFirstYearCourses && this.state.firstYearCourses.length === 0 && (
                <p>{fr.COURSES.NO_COURSES}</p>
            )}
            <h2
              data-cy="secondYear"
              className="year-title"
              onClick={() =>
                this.setState((prevState) => ({
                  showSecondYearCourses: !prevState.showSecondYearCourses,
                  showSecondYearCommonCourses: false,
                  showSecondYearISICourses: false,
                  showSecondYearIFCourses: false,
                  showSecondYearMMISCourses: false,
                }))
              }
            >
              {fr.COURSES.SECOND_YEAR}
            </h2>
            {this.state.showSecondYearCourses && (
              <>
                <h2
                  data-cy="secondYearCommon"
                  className="program-title" onClick={() => this.setState((prevState) => ({ showSecondYearCommonCourses: !prevState.showSecondYearCommonCourses }))}>{fr.COURSES.COMMON}</h2>
                {this.state.showSecondYearCommonCourses && this.state.secondYearCommonCourses.map((course) => (
                  <Link to={`/course/${course.id}`} className="course" key={course.id}>
                    <h3>{course.name}</h3>
                    <p>{course.description}</p>
                  </Link>
                ))}
                {this.state.showSecondYearCommonCourses && this.state.secondYearCommonCourses.length === 0 && (
                    <p>{fr.COURSES.NO_COURSES}</p>
                )}
                <h2
                  data-cy="secondYearISI"
                  className="program-title" onClick={() => this.setState((prevState) => ({ showSecondYearISICourses: !prevState.showSecondYearISICourses }))}>{fr.COURSES.ISI}</h2>
                {this.state.showSecondYearISICourses && this.state.secondYearISICourses.map((course) => (
                  <Link to={`/course/${course.id}`} className="course" key={course.id} data-cy='course'>
                    <h3>{course.name}</h3>
                    <p>{course.description}</p>
                  </Link>
                ))}
                {this.state.showSecondYearISICourses && this.state.secondYearISICourses.length === 0 && (
                    <p>{fr.COURSES.NO_COURSES}</p>
                )}
                <h2
                  data-cy="secondYearIF"
                  className="program-title" onClick={() => this.setState((prevState) => ({ showSecondYearIFCourses: !prevState.showSecondYearIFCourses }))}>{fr.COURSES.IF}</h2>
                {this.state.showSecondYearIFCourses && this.state.secondYearIFCourses.map((course) => (
                  <Link to={`/course/${course.id}`} className="course" key={course.id}>
                    <h3>{course.name}</h3>
                    <p>{course.description}</p>
                  </Link>
                ))}
                {this.state.showSecondYearIFCourses && this.state.secondYearIFCourses.length === 0 && (
                    <p>{fr.COURSES.NO_COURSES}</p>
                )}
                <h2
                  data-cy="secondYearMMIS"
                  className="program-title" onClick={() => this.setState((prevState) => ({ showSecondYearMMISCourses: !prevState.showSecondYearMMISCourses }))}>{fr.COURSES.MMIS}</h2>
                {this.state.showSecondYearMMISCourses && this.state.secondYearMMISCourses.map((course) => (
                  <Link to={`/course/${course.id}`} className="course" key={course.id}>
                    <h3>{course.name}</h3>
                    <p>{course.description}</p>
                  </Link>
                ))}
                {this.state.showSecondYearMMISCourses && this.state.secondYearMMISCourses.length === 0 && (
                    <p>{fr.COURSES.NO_COURSES}</p>
                )}
              </>
            )}

            <h2
              data-cy="thirdYear"
              className="year-title"
              onClick={() =>
                this.setState((prevState) => ({
                  showThirdYearCourses: !prevState.showThirdYearCourses,
                  showThirdYearCommonCourses: false,
                  showThirdYearISICourses: false,
                  showThirdYearIFCourses: false,
                  showThirdYearMMISCourses: false,
                }))
              }
            >
              {fr.COURSES.THIRD_YEAR}
            </h2>
            {this.state.showThirdYearCourses && (
              <>
                <h2 
                  data-cy="thirdYearCommonCourses"
                  className="program-title" onClick={() => this.setState((prevState) => ({ showThirdYearCommonCourses: !prevState.showThirdYearCommonCourses }))}>{fr.COURSES.COMMON}</h2>
                {this.state.showThirdYearCommonCourses && this.state.thirdYearCommonCourses.map((course) => (
                  <Link to={`/course/${course.id}`} className="course" key={course.id}>
                    <h3>{course.name}</h3>
                    <p>{course.description}</p>
                  </Link>
                ))}
                {this.state.showThirdYearCommonCourses && this.state.thirdYearCommonCourses.length === 0 && (
                    <p>{fr.COURSES.NO_COURSES}</p>
                )}
                <h2
                  data-cy="thirdYearISI"
                  className="program-title" onClick={() => this.setState((prevState) => ({ showThirdYearISICourses: !prevState.showThirdYearISICourses }))}>{fr.COURSES.ISI}</h2>
                {this.state.showThirdYearISICourses && this.state.thirdYearISICourses.map((course) => (
                  <Link to={`/course/${course.id}`} className="course" key={course.id}>
                    <h3>{course.name}</h3>
                    <p>{course.description}</p>
                  </Link>
                ))}
                {this.state.showThirdYearISICourses && this.state.thirdYearISICourses.length === 0 && (
                    <p>{fr.COURSES.NO_COURSES}</p>
                )}
                <h2
                  data-cy="thirdYearIF"
                  className="program-title" onClick={() => this.setState((prevState) => ({ showThirdYearIFCourses: !prevState.showThirdYearIFCourses }))}>{fr.COURSES.IF}</h2>
                {this.state.showThirdYearIFCourses && this.state.thirdYearIFCourses.map((course) => (
                  <Link to={`/course/${course.id}`} className="course" key={course.id}>
                    <h3>{course.name}</h3>
                    <p>{course.description}</p>
                  </Link>
                ))}
                {this.state.showThirdYearIFCourses && this.state.thirdYearIFCourses.length === 0 && (
                    <p>{fr.COURSES.NO_COURSES}</p>
                )}
                <h2
                  data-cy="thirdYearMMIS"
                  className="program-title" onClick={() => this.setState((prevState) => ({ showThirdYearMMISCourses: !prevState.showThirdYearMMISCourses }))}>{fr.COURSES.MMIS}</h2>
                {this.state.showThirdYearMMISCourses && this.state.thirdYearMMISCourses.map((course) => (
                  <Link to={`/course/${course.id}`} className="course" key={course.id}>
                    <h3>{course.name}</h3>
                    <p>{course.description}</p>
                  </Link>
                ))}
                {this.state.showThirdYearMMISCourses && this.state.thirdYearMMISCourses.length === 0 && (
                    <p>{fr.COURSES.NO_COURSES}</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default withAuth(Courses);
