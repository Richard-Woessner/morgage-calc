import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";

interface MorgageRecord {
    month: number;
    initialBalance: number;
    monthlyPayment: number;
    interestPayment: number;
    principalPayment: number;
    remainingPrincipal: number;
}

function App() {
    const [balanceSheet, setBalanceSheet] = useState<MorgageRecord[]>([]);

    const calculateRemainingLoan = (
        principal: number,
        annualInterestRate: number,
        loanDurationInMonths: number
    ): void => {
        let monthlyInterestRate = annualInterestRate / 12 / 100;
        let monthlyPayment =
            (principal * monthlyInterestRate) /
            (1 - Math.pow(1 + monthlyInterestRate, -loanDurationInMonths));

        let remainingPrincipal = principal;
        const tempBalanceSheet = [];

        for (let month = 1; month <= loanDurationInMonths; month++) {
            let interestPayment = remainingPrincipal * monthlyInterestRate;
            let principalPayment = monthlyPayment - interestPayment;
            // remainingPrincipal -= principalPayment;

            tempBalanceSheet.push({
                month,
                initialBalance: remainingPrincipal,
                monthlyPayment: monthlyPayment,
                interestPayment: interestPayment,
                principalPayment: principalPayment,
                remainingPrincipal: (remainingPrincipal -= principalPayment),
            });

            console.log(
                `Month ${month}: Remaining principal is $${remainingPrincipal.toFixed(
                    2
                )}`
            );
        }

        setBalanceSheet(tempBalanceSheet);
    };

    const handleFormSubmit = (event: any) => {
        event.preventDefault();

        const totalLoanAmount = event.target.totalLoanAmount.value;
        const loanLength = event.target.loanLength.value;
        const totalInterestRate = event.target.totalInterestRate.value;

        const time = new Date();

        const monthlyPayment = calculateRemainingLoan(
            totalLoanAmount,
            totalInterestRate,
            loanLength
        );

        console.log(monthlyPayment);
    };

    const R = (x: number | string) => {
        return Number(x).toFixed(2);
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
                    {balanceSheet.length > 0 ? (
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Month</th>
                                    <th>Initial Balance</th>
                                    <th>Monthly Payment</th>
                                    <th>Interest Payment</th>
                                    <th>Principal Payment</th>
                                    <th>Remaining Principal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {balanceSheet.map((row) => (
                                    <tr key={row.month}>
                                        <td>{row.month}</td>
                                        <td>{R(row.initialBalance)}</td>
                                        <td>{R(row.monthlyPayment)}</td>
                                        <td>{R(row.interestPayment)}</td>
                                        <td>{R(row.principalPayment)}</td>
                                        <td>{R(row.remainingPrincipal)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <p>Submit form to see balance sheet</p>
                    )}
                </Col>
            </Row>
        </Container>
    );
}

export default App;
