import React from 'react';
import { withRouter } from 'react-router-dom';
import { FormGroup, Button, Container, Row, Col, FormText } from 'react-bootstrap';
import { NotificationManager } from 'react-notifications';
import { serviceConfig } from '../../../appSettings';
import { Typeahead } from 'react-bootstrap-typeahead';
import DateTimePicker from 'react-datetime-picker';

class NewProjection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            projectionTime: '',
            movieId: '',
            auditoriumId: '',
            submitted: false,
            projectionTimeError: '',
            movieIdError: '',
            auditoriumIdError: '',
            movies: [],
            auditoriums: [],
            canSubmit: true
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.getProjections();
        this.getAuditoriums();
    }

    handleChange(e) {
        const { id, value } = e.target;
        this.setState({ [id]: value });
    }

    validate(id, value) {
        console.log(id, value);
        if (id === 'projectionTime') {
            if (!value) {
                this.setState({
                    projectionTimeError: 'Chose projection time',
                    canSubmit: false
                });
            } else {
                this.setState({
                    projectionTimeError: '',
                    canSubmit: true
                });
            }
        } else if (id === 'movieId') {
            if (!value) {
                this.setState({
                    movieIdError: 'Please chose movie from dropdown',
                    canSubmit: false
                });
            } else {
                this.setState({
                    movieIdError: '',
                    canSubmit: true
                });
            }
        } else if (id === 'auditoriumId') {
            if (!value) {
                this.setState({
                    auditoriumIdError: 'Please chose auditorium from dropdown',
                    canSubmit: false
                });
            } else {
                this.setState({
                    auditoriumIdError: '',
                    canSubmit: true
                });
            }
        }
    }

    handleSubmit(e) {
        e.preventDefault();

        this.setState({ submitted: true });
        const { movieId, auditoriumId, projectionTime } = this.state;
        if (movieId && auditoriumId && projectionTime) {
            this.addProjection();
        } else {
            NotificationManager.error('Please fill in data');
            this.setState({ submitted: false });
        }
    }

    addProjection() {
        const { movieId, auditoriumId, projectionTime } = this.state;

        const data = {
            movieId,
            auditoriumId,
            projectionTime
        };

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify(data)
        };

        fetch(`${serviceConfig.baseURL}/api/projections`, requestOptions)
            .then(response => {
                if (!response.ok) {
                    return Promise.reject(response);
                }
                return response.statusText;
            })
            .then(result => {
                NotificationManager.success('New projection added!');
                this.props.history.push(`AllProjections`);
            })
            .catch(response => {
                NotificationManager.error(response.message || response.statusText);
                this.setState({ submitted: false });
            });
    }

    getProjections() {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
        };

        fetch(`${serviceConfig.baseURL}/api/Movies/current`, requestOptions)
            .then(response => {
                if (!response.ok) {
                    return Promise.reject(response);
                }
                return response.json();
            })
            .then(data => {
                if (data) {
                    this.setState({ movies: data });
                }
            })
            .catch(response => {
                NotificationManager.error(response.message || response.statusText);
                this.setState({ submitted: false });
            });
    }

    getAuditoriums() {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
        };

        fetch(`${serviceConfig.baseURL}/api/Auditoriums/all`, requestOptions)
            .then(response => {
                if (!response.ok) {
                    return Promise.reject(response);
                }
                return response.json();
            })
            .then(data => {
                if (data) {
                    this.setState({ auditoriums: data });
                }
            })
            .catch(response => {
                NotificationManager.error(response.message || response.statusText);
                this.setState({ submitted: false });
            });
    }

    onMovieChange(movie) {
        if (movie[0]) {
            this.setState({ movieId: movie[0].id });
            this.validate('movieId', movie[0]);
        } else {
            this.validate('movieId', null);
        }
    }

    onAuditoriumChange(auditorium) {
        if (auditorium[0]) {
            this.setState({ auditoriumId: auditorium[0].id });
            this.validate('auditoriumId', auditorium[0]);
        } else {
            this.validate('auditoriumId', null);
        }
    }

    onDateChange = date => this.setState({ projectionTime: date })

    render() {
        const { auditoriums, movies, submitted, auditoriumIdError, movieIdError, projectionTimeError, canSubmit } = this.state;

        return (
            <Container>
                <Row>
                    <Col>
                        <h1 className="form-header">Add Projection</h1>
                        <form onSubmit={this.handleSubmit}>
                            <FormGroup>
                                <Typeahead
                                    labelKey="title"
                                    options={movies}
                                    placeholder="Choose a movie..."
                                    id="movie"
                                    onChange={e => { this.onMovieChange(e) }}
                                />
                                <FormText className="text-danger">{movieIdError}</FormText>
                            </FormGroup>
                            <FormGroup>
                                <Typeahead
                                    labelKey="name"
                                    options={auditoriums}
                                    placeholder="Choose auditorium..."
                                    id="auditorium"
                                    onChange={e => { this.onAuditoriumChange(e) }}
                                />
                                <FormText className="text-danger">{auditoriumIdError}</FormText>
                            </FormGroup>
                            <FormGroup>
                                <DateTimePicker
                                    className="form-control"
                                    onChange={this.onDateChange}
                                    value={this.state.projectionTime}
                                />
                                <FormText className="text-danger">{projectionTimeError}</FormText>
                            </FormGroup>
                            <Button type="submit" disabled={submitted || !canSubmit} block>Add Projection</Button>
                        </form>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default withRouter(NewProjection);