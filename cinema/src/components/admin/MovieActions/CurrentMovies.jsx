import React, { Component } from 'react';
import { NotificationManager } from 'react-notifications';
import { serviceConfig } from '../../../appSettings';
import { Row, Table, Container, FormGroup, Col, FormText } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Spinner from '../../Spinner';
import Switch from "react-switch";
import { Typeahead } from 'react-bootstrap-typeahead';

class CurrentMovies extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tag: '',
            tagId: '',
            tags: [],
            tagError: '',
            tagIdErrog: '',
            movies: [],
            isLoading: true,
            submitted: false,
            canSubmit: true
        };
        this.handleChange = this.handleChange.bind(this);
        this.editMovie = this.editMovie.bind(this);
        this.removeMovie = this.removeMovie.bind(this);
    }

    componentDidMount() {
        this.getProjections();
        this.getTags();
    }

    handleChange(checked) {
        this.setState({ checked });
    }

    validate(id, value) {
        if (id === 'tagId') {
            if (!value) {
                this.setState({
                    tagIdErrog: 'Please chose tag from dropdown',
                    canSubmit: false
                })
            } else {
                this.setState({
                    tagIdErrog: '',
                    canSubmit: true
                });
            }
        }
    }

    getProjections() {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
        };

        this.setState({ isLoading: true });
        fetch(`${serviceConfig.baseURL}/api/Movies/current`, requestOptions)
            .then(response => {
                if (!response.ok) {
                    return Promise.reject(response);
                }
                return response.json();
            })
            .then(data => {
                if (data) {
                    this.setState({ movies: data, isLoading: false });
                }
            })
            .catch(response => {
                this.setState({ isLoading: false });
                NotificationManager.error(response.message || response.statusText);
                this.setState({ submitted: false });
            });
    }

    removeMovie(id) {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
        };

        fetch(`${serviceConfig.baseURL}/api/movies/delete/${id}`, requestOptions)
            .then(response => {
                if (!response.ok) {
                    return Promise.reject(response);
                }
                return response.statusText;
            })
            .then(result => {
                NotificationManager.success('Successfuly removed movie with id:', id);
                const newState = this.state.movies.filter(movie => {
                    return movie.id !== id;
                })
                this.setState({ movies: newState });
            })
            .catch(response => {
                NotificationManager.error(response.message || response.statusText);
                this.setState({ submitted: false });
            });
    }

    isCurrent(id) {
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
        };

        fetch(`${serviceConfig.baseURL}/api/movies/change/${id}`, requestOptions)
            .then(response => {
                if (!response.ok) {
                    return Promise.reject(response);
                }
                return response.statusText;
            })
            .then(result => {
                NotificationManager.success('Successfuly toggled movie!');
                const newState = this.state.movies.filter(movie => {
                    return movie.id === id;
                })
                newState[0].current = false;
                this.setState({ movies: newState });
            })
            .catch(response => {
                NotificationManager.error("This movie has projections in the future");
                this.setState({ submitted: false });
            });
    }

    getTags() {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
        };

        this.setState({ isLoading: true });
        fetch(`${serviceConfig.baseURL}/api/Tags/all`, requestOptions)
            .then(response => {
                if (!response.ok) {
                    return Promise.reject(response);
                }
                return response.json();
            })
            .then(data => {
                if (data) {
                    this.setState({ tags: data, isLoading: false });
                }
            })
            .catch(response => {
                this.setState({ isLoading: false });
                NotificationManager.error(response.message || response.statusText);
            });
    }

    fillTableWithDaata() {
        return this.state.movies.map(movie => {
            return <tr key={movie.id}>
                <td>{movie.title}</td>
                <td>{movie.year}</td>
                <td>{Math.round(movie.rating)}/10</td>
                <td>{<Switch onChange={() => this.isCurrent(movie.id)} checked={movie.current === true} onColor='#00FFFF' offColor='#8B0000' />}</td>
                <td className="text-center cursor-pointer" onClick={() => this.editMovie(movie.id)}><FontAwesomeIcon className="text-info mr-2 fa-1x" icon={faEdit} /></td>
                <td className="text-center cursor-pointer" onClick={() => this.removeMovie(movie.id)}><FontAwesomeIcon className="text-danger mr-2 fa-1x" icon={faTrash} /></td>
            </tr>
        })
    }

    editMovie(id) {
        this.props.history.push(`editmovie/${id}`);
    }

    render() {
        const { tags, tagIdError, isLoading } = this.state;
        const rowsData = this.fillTableWithDaata();
        const table = (<Table striped bordered hover size="bg" data-colors='red,green,blue' variant="dark">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Year</th>
                    <th>Rating</th>
                    <th>Current</th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {rowsData}
            </tbody>
        </Table>);
        const showTable = isLoading ? <Spinner></Spinner> : table;
        return (
            <div>
                <React.Fragment>
                    <Row className="no-gutters pt-2">
                        <h1 className="form-header ml-2">Current Movies</h1>
                    </Row>
                    <Row className="no-gutters pr-5 pl-5">
                        {showTable}
                    </Row>
                </React.Fragment>
            </div>
        );
    }
}

export default CurrentMovies;