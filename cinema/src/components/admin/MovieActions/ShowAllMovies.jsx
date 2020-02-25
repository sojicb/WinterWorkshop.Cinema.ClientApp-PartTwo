import React, { Component } from 'react';
import { NotificationManager } from 'react-notifications';
import { serviceConfig } from '../../../appSettings';
import { Row, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faCheck } from '@fortawesome/free-solid-svg-icons';
import Spinner from '../../Spinner';
import Switch from "react-switch";

class ShowAllMovies extends Component {
    constructor(props) {
      super(props);
      this.state = { checked: false };
      this.handleChange = this.handleChange.bind(this);
      this.state = { movies: [], isLoading: true };
      this.editMovie = this.editMovie.bind(this);
      this.removeMovie = this.removeMovie.bind(this);
    }

    componentDidMount() {
      this.getProjections();
    }

    handleChange(checked) {
        this.setState({ checked });
      }

    getProjections() {
      const requestOptions = {
        method: 'GET',
        headers: {'Content-Type': 'application/json',
                      'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
      };

      this.setState({isLoading: true});
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
            this.setState({isLoading: false});
            NotificationManager.error(response.message || response.statusText);
            this.setState({ submitted: false });
        });
    }

    removeMovie(id) {
        const requestOptions = {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json',
                      'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
        };

        fetch(`${serviceConfig.baseURL}/api/movies/${id}`, requestOptions)
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
                this.setState({movies: newState});
            })
            .catch(response => {
                NotificationManager.error(response.message || response.statusText);
                this.setState({ submitted: false });
            });
    }

    isCurrent(id)
    {
        const requestOptions = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json',
                      'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
        };

        fetch(`${serviceConfig.baseURL}/api/movies/change/${id}`, requestOptions)
        .then(response => {
            if(!response.ok) {
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
             this.setState({movies : newState});
            })
        .catch(response => {
            NotificationManager.error(response.message || response.statusText);
            this.setState({ submitted: false });
        });    
    }

    fillTableWithDaata() {
        return this.state.movies.map(movie => {
            return <tr key={movie.id}>
                        <td>{movie.id}</td>
                        <td>{movie.title}</td>
                        <td>{movie.year}</td>
                        <td>{Math.round(movie.rating)}/10</td>
                        <td>{<Switch onChange={() => this.isCurrent(movie.id)} checked={movie.current === true } onColor = '#00FFFF' offColor = '#8B0000' />}</td>
                        <td className="text-center cursor-pointer" onClick={() => this.editMovie(movie.id)}><FontAwesomeIcon className="text-info mr-2 fa-1x" icon={faEdit}/></td>
                        <td className="text-center cursor-pointer" onClick={() => this.removeMovie(movie.id)}><FontAwesomeIcon className="text-danger mr-2 fa-1x" icon={faTrash}/></td>
                    </tr>
        })
    }

    editMovie(id) {
        this.props.history.push(`editmovie/${id}`);
    }

    render() {
        const {isLoading} = this.state;
        const rowsData = this.fillTableWithDaata();
        const table = (<Table striped bordered hover size="sm" variant="dark">
                            <thead>
                            <tr>
                                <th>Id</th>
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
            <React.Fragment>
                <Row className="no-gutters pt-2">
                    <h1 className="form-header ml-2">All Movies</h1>
                </Row>
                <Row className="no-gutters pr-5 pl-5">
                    {showTable}
                </Row>
            </React.Fragment>
        );
      }
}

export default ShowAllMovies;