import React from 'react';
import { withRouter } from 'react-router-dom';
import { FormGroup, FormControl, Button, Container, Row, Col, FormText, } from 'react-bootstrap';
import { NotificationManager } from 'react-notifications';
import { serviceConfig } from '../../../appSettings';
import { Typeahead } from 'react-bootstrap-typeahead';

class NewAuditorium extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cinemaId: 0,
            auditName: '',
            seatRows: 0,
            numberOfSeats: 0,
            cinemas: [],
            cinemaIdError: '',
            auditNameError: '',
            seatRowsError: '',
            numOfSeatsError: '',
            submitted: false,
            canSubmit: true
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.getCinemas();
    }

    handleChange(e) {
        const { id, value } = e.target;
        this.setState({ [id]: value });
        this.validate(id, value);
    }

    handleSubmit(e) {
        e.preventDefault();

        this.setState({ submitted: true });
        const { numberOfSeats, cinemaId, seatRows, auditName } = this.state;
        if (auditName && numberOfSeats && cinemaId && seatRows) {
            this.addAuditorium();
        } else {
            NotificationManager.error('Please fill form with data.');
            this.setState({ submitted: false });
        }
    }

    validate(id, value) {
        if (id === 'auditName') {
            if (value === '') {
                this.setState({
                    auditNameError: 'Fill in auditorium name',
                    canSubmit: false
                })
            } else {
                this.setState({
                    auditNameError: '',
                    canSubmit: true
                });
            }
        } else if (id === 'numberOfSeats') {
            const seatsNum = +value;
            if (seatsNum > 20 || seatsNum < 1) {
                this.setState({
                    numOfSeatsError: 'Seats number can be in between 1 and 20',
                    canSubmit: false
                })
            } else {
                this.setState({
                    numOfSeatsError: '',
                    canSubmit: true
                });
            }
        } else if (id === 'seatRows') {
            const seatsNum = +value;
            if (seatsNum > 20 || seatsNum < 1) {
                this.setState({
                    seatRowsError: 'Seats number can be in between 1 and 20',
                    canSubmit: false
                })
            } else {
                this.setState({
                    seatRowsError: '',
                    canSubmit: true
                });
            }
        } else if (id === 'cinemaId') {
            if (!value) {
                this.setState({
                    cinemaIdError: 'Please chose cineam from dropdown',
                    canSubmit: false
                })
            } else {
                this.setState({
                    cinemaIdError: '',
                    canSubmit: true
                });
            }
        }
    }

    addAuditorium() {
        const { cinemaId, numberOfSeats, seatRows, auditName } = this.state;

        const data = {
            cinemaId: cinemaId,
            numberOfSeats: +numberOfSeats,
            seatRows: +seatRows,
            auditName: auditName
        };

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify(data)
        };

        fetch(`${serviceConfig.baseURL}/api/auditoriums`, requestOptions)
            .then(response => {
                if (!response.ok) {
                    return Promise.reject(response);
                }
                return response.statusText;
            })
            .then(result => {
                NotificationManager.success('Successfuly added new auditorium!');
                this.props.history.push('AllAuditoriums');
            })
            .catch(response => {
                NotificationManager.error(response.message || response.statusText);
                this.setState({ submitted: false });
            });
    }

    getCinemas() {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
        };

        fetch(`${serviceConfig.baseURL}/api/Cinemas/all`, requestOptions)
            .then(response => {
                if (!response.ok) {
                    return Promise.reject(response);
                }
                return response.json();
            })
            .then(data => {
                if (data) {
                    this.setState({ cinemas: data });
                }
            })
            .catch(response => {
                NotificationManager.error(response.message || response.statusText);
                this.setState({ submitted: false });
            });
    }

    onCinemaChange(cinema) {
        if (cinema[0]) {
            this.setState({ cinemaId: cinema[0].id });
            this.validate('cinemaId', cinema[0]);
        } else {
            this.validate('cinemaId', null);
        }
    }

    renderRows(rows, seats) {
        const rowsRendered = [];
        for (let i = 0; i < rows; i++) {
            rowsRendered.push(<tr key={i}>
                {this.renderSeats(seats, i)}
            </tr>);
        }
        return rowsRendered;
    }

    renderSeats(seats, row) {
        let renderedSeats = [];
        for (let i = 0; i < seats; i++) {
            renderedSeats.push(<td key={'row: ' + row + ', seat: ' + i}></td>);
        }
        return renderedSeats;
    }

    render() {
        const { cinemas, numberOfSeats, submitted, seatRows, auditName, auditNameError, numOfSeatsError,
            seatRowsError, cinemaIdError, canSubmit } = this.state;
        const auditorium = this.renderRows(seatRows, numberOfSeats);
        return (
            <Container>
                <Row>
                    <Col>
                        <h1 className="form-header">Add Auditorium</h1>
                        <form onSubmit={this.handleSubmit}>
                            <FormGroup>
                                <FormControl
                                    id="auditName"
                                    type="text"
                                    placeholder="Auditorium Name"
                                    value={auditName}
                                    onChange={this.handleChange}
                                />
                                <FormText className="text-danger">{auditNameError}</FormText>
                            </FormGroup>
                            <FormGroup>
                                <Typeahead
                                    labelKey="name"
                                    options={cinemas}
                                    placeholder="Choose a cinema..."
                                    id="browser"
                                    onChange={e => { this.onCinemaChange(e) }}
                                />
                                <FormText className="text-danger">{cinemaIdError}</FormText>
                            </FormGroup>
                            <FormGroup>
                                <FormControl
                                    id="seatRows"
                                    type="number"
                                    placeholder="Number Of Rows"
                                    value={seatRows}
                                    onChange={this.handleChange}
                                />
                                <FormText className="text-danger">{seatRowsError}</FormText>
                            </FormGroup>
                            <FormGroup>
                                <FormControl
                                    id="numberOfSeats"
                                    type="number"
                                    placeholder="Number Of Seats"
                                    value={numberOfSeats}
                                    onChange={this.handleChange}
                                    max="36"
                                />
                                <FormText className="text-danger">{numOfSeatsError}</FormText>
                            </FormGroup>
                            <Button type="submit" disabled={submitted || !canSubmit} block>Add Auditorium</Button>
                        </form>
                    </Col>
                </Row>
                <Row className="mt-2">
                    <Col className="justify-content-center align-content-center">
                        <h1>Auditorium Preview</h1>
                        <div>
                            <Row className="justify-content-center mb-4">
                                <div className="text-center text-white font-weight-bold cinema-screen">
                                    CINEMA SCREEN
                            </div>
                            </Row>
                            <Row className="justify-content-center">
                                <table className="table-cinema-auditorium">
                                    <tbody>
                                        {auditorium}
                                    </tbody>
                                </table>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default withRouter(NewAuditorium);