import React from 'react';
import { withRouter } from 'react-router-dom';
import { FormGroup, FormControl, Button, Container, Row, Col, FormText, } from 'react-bootstrap';
import { NotificationManager } from 'react-notifications';
import { serviceConfig } from '../../../appSettings';
import DateTimePicker from 'react-datetime-picker';

class EditProjection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auditId: '',
            movieId: '',
            id: '',
            auditoriumId: '',
            projectionTime: '',
            movieIdError: '',
            auditoriumIdError: '',
            projectionTimeError: '',
            submitted: false,
            canSubmit: true,
            currentTime: new Date()
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const { id } = this.props.match.params;
        this.getProjection(id);
    }

    handleChange(e) {
        const { id, value } = e.target;
        this.setState({ [id]: value });
        this.validate(id, value);
    }

    validate(id, value) {
        if (id === 'auditoriumId') {
            if (!value) {
                this.setState({
                    auditoriumIdError: 'Please choose auditorium from dropdown',
                    canSubmit: false
                });
            } else {
                this.setState({
                    auditoriumIdError: '',
                    canSubmit: true
                });
            }
        }

        if (id === 'projectionTime') {
            if (!value) {
                this.setState({
                    projectionTimeError: 'Please choose projection time',
                    canSubmit: false
                });
            } else {
                this.setState({
                    projectionTimeError: '',
                    canSubmit: true
                });
            }
        }
    }

    handleSubmit(e) {

        this.setState({ submitted: true });
        const { auditoriumId, projectionTime } = this.state;
        if (auditoriumId && projectionTime) {
            this.updateProjection();
        } else {
            NotificationManager.error('Please fill in data');
            this.setState({ submitted: false });
        }
    }

    getAuditoriums() {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
        };

        this.setState({ isLoading: true });
        fetch(`${serviceConfig.baseURL}/api/Auditoriums/all`, requestOptions)
            .then(response => {
                if (!response.ok) {
                    return Promise.reject(response);
                }
                return response.json();
            })
            .then(data => {
                if (data) {
                    this.setState({ auditId: data.id, isLoading: false });
                }
            })
            .catch(response => {
                NotificationManager.error(response.message || response.statusText);
                this.setState({ isLoading: false });
            });
    }

    getProjection(id) {

        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
        };
        fetch(`${serviceConfig.baseURL}/api/projections/get/${id}`, requestOptions)
            .then(response => {
                if (!response.ok) {
                    return Promise.reject(response);
                }
                return response.json();
            })
            .then(data => {
                if (data) {
                    this.setState({
                        auditoriumId: data.auditoriumId,
                        projectionTime: data.projectionTime,
                        id: data.id
                    });
                }
            })
            .catch(response => {
                NotificationManager.error(response.message || response.statusText);
                this.setState({ submitted: false });
            });
    }

    updateProjection() {
        const { id, auditoriumId, projectionTime } = this.state;
        console.log("ID IS!!!!: " + id);
        console.log("AUDI ID IS!!!!: " + auditoriumId);
        console.log("PROJECTION TIME!!!!: " + projectionTime);

        const data = {
            AuditoriumId: auditoriumId,
            ProjectionTime: projectionTime
        };

        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify(data)
        };
        fetch(`${serviceConfig.baseURL}/api/projections/update/${id}`, requestOptions)
            .then(response => {
                if (!response.ok) {
                    return Promise.reject(response);
                }
                return response.statusText;
            })
            .then(result => {
                this.props.history.goBack();
                NotificationManager.success('Successfuly edited projection!');
            })
            .catch(response => {
                NotificationManager.error(response.message || response.statusText);
                this.setState({ submitted: false });
            });
    }


    render() {
        const { auditoriumId, auditId, projectionTime, currentTime, submitted, auditoriumIdError, canSubmit, projectionTimeError } = this.state;
        return (
            <Container>
                <Row>
                    <Col>
                        <h1 className="form-header">Edit Existing Projection</h1>
                        <form onSubmit={this.handleSubmit}>
                            <FormGroup>
                                <DateTimePicker
                                    className="form-control"
                                    id="projectionTime"
                                    onChange={e => this.handleSubmit(e)}
                                    value={currentTime}
                                />
                                <FormText className="text-danger">{projectionTimeError}</FormText>
                            </FormGroup>

                        </form>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default withRouter(EditProjection);
