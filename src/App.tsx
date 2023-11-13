import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Button, Col, Container, Form, Row } from "react-bootstrap";

function App() {
    const getMonthlyPayment = (
        totalLoanAmount: number,
        loanLength: number,
        totalInterestRate: number
    ) => {
        const monthlyInterestRate = totalInterestRate / 100 / 12;
        const monthlyPayment =
            (totalLoanAmount * monthlyInterestRate) /
            (1 - (1 + monthlyInterestRate) ** -loanLength);
        return monthlyPayment;
    };

    const handleFormSubmit = (event: any) => {
        event.preventDefault();

        const totalLoanAmount = event.target.totalLoanAmount.value;
        const loanLength = event.target.loanLength.value;
        const totalInterestRate = event.target.totalInterestRate.value;

        const time = new Date();

        const monthlyPayment = getMonthlyPayment(
            totalLoanAmount,
            loanLength,
            totalInterestRate
        );

        console.log(monthlyPayment);
    };

    return (
        <Container>
            <Row>
                <Col>
                    <Form onSubmitCapture={(e) => handleFormSubmit(e)}>
                        <Form.Group
                            className="mb-3"
                            controlId="totalLoanAmount"
                        >
                            <Form.Label>Total loan amount</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter amount"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="loanLength">
                            <Form.Label>Loan Length</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter loan length in months"
                            />
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="totalInterestRate"
                        >
                            <Form.Label>Interest Rate</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter Interest Rate"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="submitForm">
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </Form.Group>
                    </Form>
                </Col>

                <Col>
                    <div>Col 2</div>
                </Col>
            </Row>
        </Container>
    );
}

export default App;
