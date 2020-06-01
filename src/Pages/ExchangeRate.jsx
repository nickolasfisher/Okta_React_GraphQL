import React, { Component } from 'react';

import Header from '../Components/Header'
import { Container, Row, Col, Table, Form, Button } from 'react-bootstrap'

import axios from 'axios';

class ExchangeRates extends Component {

    constructor(props, context) {
        super(props, context);


        this.state = {
            loading: false,
            currencies: [],
            user: {
                username: 'nik',
                currentCurrencyIso: 'USD',
                currentAmount: 50.00,
                currentCurrency: {}
            },
            targetIso: 'AUD',
            targetAmount: 0.00,
            countries: []
        }
    }

    componentDidMount() {

        this.setState({
            loading: true
        });

        var c = this.sendQuery(this.getCurrenciesQuery())
            .then(response => {
                var u = this.state.user;
                u.currentCurrency = response.data.data.currencies.filter(currency => currency.isoCode == this.state.user.currentCurrencyIso)[0];

                this.setState({
                    currencies: response.data.data.currencies.filter(currency => currency.convert != null),
                    loading: false,
                    user: u
                });

                this.updateTarget('AUD');

            })
            .catch(err => {
                console.log(err);
            });
    }

    sendQuery(query, variables) {
        return axios.post('https://api.everbase.co/graphql?apikey=' +  process.env.REACT_APP_EVERBASE_API_KEY, {
            query
        });
    }

    getCurrenciesQuery() {

        return '{                       \
            currencies                  \
                {                       \
                    id                  \
                    isoCode             \
                    name                \
                    unitSymbols         \
                    convert(to: "USD")  \
                }                       \
        }';
    }

    getCurrencyCountryQuery(isoCode) {
        return '{                                                       \
            currencies(where: {isoCode: {eq: "' + isoCode + '"}}) {     \
              countries {                                               \
                capitalName                                             \
                population                                              \
                name                                                    \
                vatRate                                                 \
              }                                                         \
            }                                                           \
          }';
    }

    handleTargetChange(e) {
        var isoCode = e.target.value;
        this.updateTarget(isoCode);
    }

    updateTarget(isoCode) {
        var t = this.state.currencies.filter(c => c.isoCode === isoCode)[0];

        if (t) {
            var amt = this.state.user.currentAmount / t.convert;

            this.setState({
                targetIso: t.isoCode,
                targetAmount: amt.toFixed(2)
            });

            this.sendQuery(this.getCurrencyCountryQuery(t.isoCode))
                .then(resp => {
                    console.log(resp);

                    this.setState({
                        countries: resp.data.data.currencies[0].countries
                    });
                })
        }
    }

    render() {

        if (this.state.loading) {
            return <Container>
                <Header></Header>
                <h4>Loading, please wait.</h4>
            </Container>

        }

        return (
            <Container>
                <Header></Header>

                <Row>
                    <Col>
                        <h3>{this.state.user.username} - {this.state.user.currentCurrency.unitSymbols} {this.state.user.currentAmount}</h3>
                        <h4>Current Currency: {this.state.user.currentCurrency.isoCode} - {this.state.user.currentCurrency.name}</h4>
                    </Col>
                </Row>

                <Row>
                    <Col lg="3">
                        <Form.Control type="text" value={this.state.user.currentAmount} readonly="readonly"></Form.Control>
                    </Col>
                    <Col lg="1">
                        In
                    </Col>
                    <Col lg="6">
                        <Form.Control disabled as="select" value={this.state.user.currentCurrency.isoCode}>
                            {this.state.currencies.map((currency, i) => {
                                return (
                                    <option key={currency.isoCode} value={currency.isoCode}>
                                        {currency.isoCode} - { currency.name}
                                    </option>
                                )
                            })}

                        </Form.Control>
                    </Col>
                </Row>
                <Row>
                    <Col lg="1" >To</Col>
                </Row>
                <Row>
                    <Col lg="3">
                        <Form.Control type="text" readonly="readonly" value={this.state.targetAmount}></Form.Control>
                    </Col>
                    <Col lg="1">
                        In
                    </Col>
                    <Col lg="6">
                        <Form.Control as="select" onChange={this.handleTargetChange.bind(this)}>
                            {this.state.currencies.map((currency, i) => {
                                return (
                                    <option key={currency.isoCode} value={currency.isoCode}>
                                        {currency.isoCode} - { currency.name}
                                    </option>
                                )
                            })}

                        </Form.Control>
                    </Col>
                </Row>
                <Row className="pt-4">
                    <Col>

                        <h4>Country Facts</h4>

                        <Table>
                            <thead>
                                <tr>
                                    <th>Country</th>
                                    <th>Capital</th>
                                    <th>Population</th>
                                    <th>Vat Rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.countries.map((country, i) => {
                                    return (
                                        <tr>
                                            <td>{country.name}</td>
                                            <td>{country.capitalName}</td>
                                            <td>{country.population}</td>
                                            <td>{country.vatRate}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container >
        );
    }
}

export default ExchangeRates;