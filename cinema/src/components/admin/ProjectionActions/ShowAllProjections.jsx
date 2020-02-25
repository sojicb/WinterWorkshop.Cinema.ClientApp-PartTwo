import React, { Component } from 'react';
import { NotificationManager } from 'react-notifications';
import { serviceConfig } from '../../../appSettings';
import { Row, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Spinner from '../../Spinner';

class ShowAllProjections extends Component {
    constructor(props) {
      super(props);
      this.state = {
        projections: [],
        isLoading: true
      };
      this.editProjection = this.editProjection.bind(this);
      this.removeProjection = this.removeProjection.bind(this);
    }

    componentDidMount() {
      this.getProjections();
    }

    getProjections() {
      const requestOptions = {
        method: 'GET',
        headers: {'Content-Type': 'application/json',
                      'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
      };

      this.setState({isLoading: true});
      fetch(`${serviceConfig.baseURL}/api/Projections/all`, requestOptions)
        .then(response => {
          if (!response.ok) {
            return Promise.reject(response);
        }
        return response.json();
        })
        .then(data => {
          if (data) {
            this.setState({ projections: data, isLoading: false });
            }
        })
        .catch(response => {
            this.setState({isLoading: false});
            NotificationManager.error(response.message || response.statusText);
        });
    }

    removeProjection(id) {
      const requestOptions = {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
    };

    fetch(`${serviceConfig.baseURL}/api/projections/delete/${id}`, requestOptions)
        .then(response => {
            if (!response.ok) {
                return Promise.reject(response);
            }
            return response.statusText;
        })
        .then(result => {
            NotificationManager.success('Successfuly removed projection with id:', id);
            const newState = this.state.projections.filter(projection => {
                return projection.id !== id;
            })
            this.setState({projection: newState});
        })
        .catch(response => {
            NotificationManager.error(response.message || response.statusText);
            this.setState({ submitted: false });
        });
    }

    fillTableWithDaata() {
        return this.state.projections.map(projection => {
            return <tr key={projection.id}>
                        <td width="18%">{projection.id}</td>
                        <td width="18%">{projection.movieId}</td>
                        <td width="18%">{projection.movieTitle}</td>
                        <td width="18%">{projection.auditoriumId}</td>
                        <td width="18%">{projection.projectionTime}</td>
                        <td width="5%" className="text-center cursor-pointer" onClick={() => this.editProjection(projection.id)}><FontAwesomeIcon className="text-info mr-2 fa-1x" icon={faEdit}/></td>
                        <td width="5%" className="text-center cursor-pointer" onClick={() => this.removeProjection(projection.id)}><FontAwesomeIcon className="text-danger mr-2 fa-1x" icon={faTrash}/></td>
                    </tr>
        })
    }

    editProjection(id) {
        // to be implemented
        this.props.history.push(`editProjection/${id}`);
    }

    render() {
        const {isLoading} = this.state;
        const rowsData = this.fillTableWithDaata();
        const table = (<Table striped bordered hover size="sm" variant="dark">
                            <thead>
                            <tr>
                                <th>Id</th>
                                <th>Movie Id</th>
                                <th>Movie Title</th>
                                <th>Auditorium Id</th>
                                <th>Projection Time</th>
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
                    <h1 className="form-header ml-2">All Projections</h1>
                </Row>
                <Row className="no-gutters pr-5 pl-5">
                    {showTable}
                </Row>
            </React.Fragment>
        );
      }
}

export default ShowAllProjections;