import React, { Component } from 'react';
import { NotificationManager } from 'react-notifications';
import { serviceConfig } from '../../../appSettings';
import { Row, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Spinner from '../../Spinner';

class ShowAllAuditoriums extends Component {
    constructor(props) {
      super(props);
      this.state = { auditoriums: [], isLoading: true };
      this.editAuditorium = this.editAuditorium.bind(this);
      this.removeAuditorium = this.removeAuditorium.bind(this);
    }

    componentDidMount() {
      this.getAuditoriums();
    }

    getAuditoriums() {
      const requestOptions = {
        method: 'GET',
        headers: {'Content-Type': 'application/json',
                      'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
      };

      this.setState({isLoading: true});
      fetch(`${serviceConfig.baseURL}/api/Auditoriums/all`, requestOptions)
        .then(response => {
          if (!response.ok) {
            return Promise.reject(response);
        }
        return response.json();
        })
        .then(data => {
          if (data) {
            this.setState({ auditoriums: data, isLoading: false });
            }
        })
        .catch(response => {
            NotificationManager.error(response.message || response.statusText);
            this.setState({ isLoading: false });
        });
    }

    removeAuditorium(id) {
      const requestOptions = {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
    };

    fetch(`${serviceConfig.baseURL}/api/auditoriums/${id}`, requestOptions)
        .then(response => {
            if (!response.ok) {
                return Promise.reject(response);
            }
            return response.statusText;
        })
        .then(result => {
            NotificationManager.success('Successfuly removed auditorium with id:', id);
            const newState = this.state.auditoriums.filter(auditorium => {
                return auditorium.id !== id;
            })
            this.setState({auditoriums: newState});
        })
        .catch(response => {
            NotificationManager.error(response.message || response.statusText);
            this.setState({ submitted: false });
        });
    }

    fillTableWithDaata() {
        return this.state.auditoriums.map(auditorium => {
            return <tr key={auditorium.id}>
                        <td width="30%">{auditorium.id}</td>
                        <td width="30%">{auditorium.cinemaId}</td>
                        <td width="30%">{auditorium.name}</td>
                        <td width="5%" className="text-center cursor-pointer" onClick={() => this.editAuditorium(auditorium.id)}><FontAwesomeIcon className="text-info mr-2 fa-1x" icon={faEdit}/></td>
                        <td width="5%" className="text-center cursor-pointer" onClick={() => this.removeAuditorium(auditorium.id)}><FontAwesomeIcon className="text-danger mr-2 fa-1x" icon={faTrash}/></td>
                    </tr>
        })
    }

    editAuditorium(id) {
        // to be implemented
        this.props.history.push(`editAuditorium/${id}`);
    }

    render() {
        const {isLoading} = this.state;
        const rowsData = this.fillTableWithDaata();
        const table = (<Table striped bordered hover size="sm" variant="dark">
                            <thead>
                            <tr>
                                <th>Id</th>
                                <th>Cinema Id</th>
                                <th>Name</th>
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
                    <h1 className="form-header ml-2">All Auditoriums</h1>
                </Row>
                <Row className="no-gutters pr-5 pl-5">
                    {showTable}
                </Row>
            </React.Fragment>
        );
      }
}

export default ShowAllAuditoriums;