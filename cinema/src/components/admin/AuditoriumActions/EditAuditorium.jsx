import React from 'react';
import { withRouter } from 'react-router-dom';
import { FormGroup, FormControl, Button, Container, Row, Col, FormText, } from 'react-bootstrap';
import { NotificationManager } from 'react-notifications';
import { serviceConfig } from '../../../appSettings';

class EditAuditorium extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            id: '',
            auditoriumId: '',
            nameError: '',
            submitted: false,
            canSubmit: true
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleYearChange = this.handleYearChange.bind(this);
    }

    componentDidMount() {
        const { id } = this.props.match.params; 
        this.getAuditorium(id);
    }

    handleChange(e) {
        const { id, value } = e.target;
        this.setState({ [id]: value });
        this.validate(id, value);
    }

    validate(id, value) {
        if (id === 'name') {
            if (value === '') {
                this.setState({nameError: 'Fill in Auditorium name', 
                                canSubmit: false});
            } else {
                this.setState({nameError: '',
                                canSubmit: true});
            }
        }
    }

    handleSubmit(e) {
        e.preventDefault();

        this.setState({ submitted: true });
        const { name } = this.state;
        if (name) {
            this.updateAuditorium();
        } else {
            NotificationManager.error('Please fill in name of the auditorium');
            this.setState({ submitted: false });
        }
    }


    getAuditorium(auditoriumId) {
    const requestOptions = {
        method: 'GET',
        headers: {'Content-Type': 'application/json',
                      'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
    };

    fetch(`${serviceConfig.baseURL}/api/auditoriums/` + auditoriumId, requestOptions)
        .then(response => {
        if (!response.ok) {
            return Promise.reject(response);
        }
        return response.json();
        })
        .then(data => {
            if (data) {
                this.setState({name: data.name});
            }
        })
        .catch(response => {
            NotificationManager.error(response.message || response.statusText);
            this.setState({ submitted: false });
        });
    }

    updateAuditorium() {
        const { name } = this.state;

        const data = {
            Name: name
        };

        const requestOptions = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json',
                      'Authorization': 'Bearer ' + localStorage.getItem('jwt')},
            body: JSON.stringify(data)
        };

        fetch(`${serviceConfig.baseURL}/api/auditoriums/${id}`, requestOptions)
            .then(response => {
                if (!response.ok) {
                    return Promise.reject(response);
                }
                return response.statusText;
            })
            .then(result => {
                this.props.history.goBack();
                NotificationManager.success('Successfuly edited auditorium!');
            })
            .catch(response => {
                NotificationManager.error(response.message || response.statusText);
                this.setState({ submitted: false });
            });
    }

    render() {
        const { name, nameError, submitted, canSubmit } = this.state;
        return (
            <Container>
                <Row>
                    <Col>
                        <h1 className="form-header">Edit Existing Auditorium</h1>
                        <form onSubmit={this.handleSubmit}>
                            <FormGroup>
                                <FormControl
                                    id="name"
                                    type="text"
                                    placeholder="Auditorium Name"
                                    value={name}
                                    onChange={this.handleChange}
                                />
                                <FormText className="text-danger">{nameError}</FormText>
                            </FormGroup>
                            <Button type="submit" disabled={submitted || !canSubmit} block>Edit Auditorium</Button>
                        </form>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default withRouter(EditAuditorium);