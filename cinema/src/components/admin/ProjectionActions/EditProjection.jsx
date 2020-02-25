import React from 'react';
import { withRouter } from 'react-router-dom';
import { FormGroup, FormControl, Button, Container, Row, Col, FormText, } from 'react-bootstrap';
import { NotificationManager } from 'react-notifications';
import { serviceConfig } from '../../../appSettings';

class EditProjection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            id: '',
            auditoriumId: '',
            projectionTime: '',
            titleError: '',
            auditoriumIdError: '',
            projectionTimeError: '',
            submitted: false,
            canSubmit: true
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
        if (id === 'title') {
            if (value === '') {
                this.setState({titleError: 'Fill in movie title', 
                                canSubmit: false});
            } else {
                this.setState({titleError: '',
                                canSubmit: true});
            }
        }
        
        if(id === 'auditoriumId') {
            if(!value){
                this.setState({auditoriumIdError: 'Please chose auditorium from dropdown',
                                canSubmit: false});
            } else {
                this.setState({auditoriumIdError: '',
                                canSubmit: true});
            }
        }

        if (id === 'projectionTime') {
            if (!value) {
                this.setState({projectionTimeError: 'Chose projection time',
                                canSubmit: false});
            } else {
                this.setState({projectionTimeError: '',
                                canSubmit: true});
            }
        }
    }

    handleSubmit(e) {
        e.preventDefault();

        this.setState({ submitted: true });
        const { title, auditoriumId, projectionTime } = this.state;
        if (title && auditoriumId && projectionTime) {
            this.updateProjection();
        } else {
            NotificationManager.error('Please fill in data');
            this.setState({ submitted: false });
        }
    }

    getProjection(id) {
    const requestOptions = {
        method: 'GET',
        headers: {'Content-Type': 'application/json',
                      'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
    };

    fetch(`${serviceConfig.baseURL}/api/projections/` + id, requestOptions)
        .then(response => {
        if (!response.ok) {
            return Promise.reject(response);
        }
        return response.json();
        })
        .then(data => {
            if (data) {
                this.setState({title: data.title, 
                               auditoriumId: data.auditoriumId, 
                               projectionTime: data.projectionTime,
                               id: data.id});
            }
        })
        .catch(response => {
            NotificationManager.error(response.message || response.statusText);
            this.setState({ submitted: false });
        });
    }

    updateProjection() {
        const { title, auditoriumId, projectionTime, id } = this.state;

        const data = {
            Title: title,
            auditoriumId: auditoriumId,
            projectionTime: projectionTime
        };

        const requestOptions = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json',
                      'Authorization': 'Bearer ' + localStorage.getItem('jwt')},
            body: JSON.stringify(data)
        };

        fetch(`${serviceConfig.baseURL}/api/projections/${id}`, requestOptions)
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
        const { title, auditoriumId, projectionTime, submitted, titleError, canSubmit } = this.state;
        return (
            <Container>
                <Row>
                    <Col>
                        <h1 className="form-header">Edit Existing Projection</h1>
                        <form onSubmit={this.handleSubmit}>
                            <FormGroup>
                                <FormControl
                                    id="title"
                                    type="text"
                                    placeholder="Movie Title"
                                    value={title}
                                    onChange={this.handleChange}
                                />
                                <FormText className="text-danger">{titleError}</FormText>
                            </FormGroup>
                            <FormGroup>
                                <FormControl 
                                as="select" 
                                placeholder="Auditorium Id" 
                                id="auditoriumId" 
                                value={auditoriumId} 
                                onChange={this.handleChange}>
                                </FormControl>
                            </FormGroup>
                            <FormGroup>
                                <FormControl 
                                as="select" 
                                placeholder="Projection Time" 
                                id="projectionTime" 
                                value={projectionTime} 
                                onChange={this.handleChange}>
                                </FormControl>
                            </FormGroup>
                            <Button type="submit" disabled={submitted || !canSubmit} block>Edit Projection</Button>
                        </form>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default withRouter(EditProjection);