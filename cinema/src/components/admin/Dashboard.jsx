import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Switch, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faList, faFilm, faVideo, faTicketAlt, faBinoculars } from '@fortawesome/free-solid-svg-icons';

// Admin actions
import NewMovie from './MovieActions/NewMovie';
import EditMovie from './MovieActions/EditMovie';
import ShowAllMovies from './MovieActions/ShowAllMovies';
import CurrentMovies from './MovieActions/CurrentMovies';
import TopMovies from '../user/TopMovies';
import EditCinema from './CinemaActions/EditCinema';
import NewCinema from './CinemaActions/NewCinema';
import ShowAllCinemas from './CinemaActions/ShowAllCinemas';
import EditAuditorium from './AuditoriumActions/EditAuditorium';
import NewAuditorium from './AuditoriumActions/NewAuditorium';
import ShowAllAuditoriums from './AuditoriumActions/ShowAllAuditoriums';
import EditProjection from './ProjectionActions/EditProjection';
import ShowAllProjections from './ProjectionActions/ShowAllProjections';
import NewProjection from './ProjectionActions/NewProjection';

// higher order component
import { PrivateRouteAdmin } from '../hoc/privateRouteAdmin';

class Dashboard extends Component {
    render() {
        return (

            <Row className="justify-content-center no-gutters">
                <Col lg={2} className="dashboard-navigation">
                    <Row className="justify-content-center mt-2">
                        <span className="fa-2x text-black"><FontAwesomeIcon className="text-black mr-2 fa-1x" icon={faFilm} />Movie</span>
                    </Row>
                    <Row className="justify-content-center mt-2">
                        <NavLink activeClassName="active-link" to='/dashboard/AllMovies'><FontAwesomeIcon className='text-primary mr-1' icon={faList} />All Movies</NavLink>
                    </Row>
                    <Row className="justify-content-center mt-2">
                        <NavLink activeClassName="active-link" to='/dashboard/CurrentMovies'><FontAwesomeIcon className='text-primary mr-1' icon={faList} />Current Movies</NavLink>
                    </Row>
                    <Row className="justify-content-center mt-2">
                        <NavLink activeClassName="active-link" to='/dashboard/TopMovies'><FontAwesomeIcon className='text-primary mr-1' icon={faList} />Top Movies</NavLink>
                    </Row>
                    <Row className="justify-content-center mt-2">
                        <NavLink activeClassName="active-link" to='/dashboard/NewMovie'><FontAwesomeIcon className='text-primary mr-1' icon={faPlus} />Add Movie</NavLink>
                    </Row>
                    <Row className="justify-content-center">
                        <span className="fa-2x text-black"><FontAwesomeIcon className="text-black mr-2 fa-1x" icon={faBinoculars} />Auditorium</span>
                    </Row>
                    <Row className="justify-content-center mt-2">
                        <NavLink activeClassName="active-link" to='/dashboard/AllAuditoriums'><FontAwesomeIcon className='text-primary mr-1' icon={faList} />All Auditoriums</NavLink>
                    </Row>
                    <Row className="justify-content-center mt-2">
                        <NavLink activeClassName="active-link" to='/dashboard/NewAuditorium'><FontAwesomeIcon className='text-primary mr-1' icon={faPlus} />Add Auditorium</NavLink>
                    </Row>
                    <Row className="justify-content-center">
                        <span className="fa-2x text-black"><FontAwesomeIcon className="text-black mr-2 fa-1x" icon={faTicketAlt} />Cinema</span>
                    </Row>
                    <Row className="justify-content-center mt-2">
                        <NavLink activeClassName="active-link" to='/dashboard/AllCinemas'><FontAwesomeIcon className='text-primary mr-1' icon={faList} />All Cinemas</NavLink>
                    </Row>
                    <Row className="justify-content-center mt-2">
                        <NavLink activeClassName="active-link" to='/dashboard/NewCinema'><FontAwesomeIcon className='text-primary mr-1' icon={faPlus} />Add Cinema</NavLink>
                    </Row>
                    <Row className="justify-content-center">
                        <span className="fa-2x text-black"><FontAwesomeIcon className="text-black mr-2 fa-1x" icon={faVideo} />Projection</span>
                    </Row>
                    <Row className="justify-content-center mt-2">
                        <NavLink activeClassName="active-link" to='/dashboard/AllProjections'><FontAwesomeIcon className='text-primary mr-1' icon={faList} />All Projections</NavLink>
                    </Row>
                    <Row className="justify-content-center mt-2">
                        <NavLink activeClassName="active-link" to='/dashboard/NewProjection'><FontAwesomeIcon className='text-primary mr-1' icon={faPlus} />Add Projection</NavLink>
                    </Row>
                </Col>
                <Col className="pt-2 app-content-main">
                    <Switch>
                        <PrivateRouteAdmin path="/dashboard/TopMovies" component={TopMovies} />
                        <PrivateRouteAdmin path="/dashboard/NewMovie" component={NewMovie} />
                        <PrivateRouteAdmin path="/dashboard/AllMovies" component={ShowAllMovies} />
                        <PrivateRouteAdmin path="/dashboard/CurrentMovies" component={CurrentMovies} />
                        <PrivateRouteAdmin path="/dashboard/EditMovie/:id" component={EditMovie} />
                        <PrivateRouteAdmin path="/dashboard/EditCinema/:id" component={EditCinema} />
                        <PrivateRouteAdmin path="/dashboard/NewCinema" component={NewCinema} />
                        <PrivateRouteAdmin path="/dashboard/AllCinemas" component={ShowAllCinemas} />
                        <PrivateRouteAdmin path="/dashboard/EditAuditorium/:id" component={EditAuditorium} />
                        <PrivateRouteAdmin path="/dashboard/NewAuditorium" component={NewAuditorium} />
                        <PrivateRouteAdmin path="/dashboard/AllAuditoriums" component={ShowAllAuditoriums} />
                        <PrivateRouteAdmin path="/dashboard/EditProjection/:id" component={EditProjection} />
                        <PrivateRouteAdmin path="/dashboard/AllProjections" component={ShowAllProjections} />
                        <PrivateRouteAdmin path="/dashboard/NewProjection" component={NewProjection} />
                    </Switch>
                </Col>
            </Row>

        );
    }
}

export default Dashboard;