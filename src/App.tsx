import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import {
    Button,
    Col,
    Container,
    Dropdown,
    Form,
    Row,
    Table,
} from "react-bootstrap";

interface MorgageRecord {
    month: number;
    initialBalance: number;
    monthlyPayment: number;
    interestPayment: number;
    principalPayment: number;
    remainingPrincipal: number;
}

interface BalanceSheet {
    balanceSheet: MorgageRecord[];
    totalLoanAmount: string;
    loanLength: string;
    totalInterestRate: string;
    date: Date;
}

function App() {
    const [balanceSheet, setBalanceSheet] = useState<MorgageRecord[]>([]);
    const [localBalanceSheets, setLocalBalanceSheets] = useState<
        BalanceSheet[]
    >([]);

    const [initialBalance, setInitialBalance] = useState<number | undefined>(
        undefined
    );
    const [monthlyPayment, setMonthlyPayment] = useState<number | undefined>(
        undefined
    );
    const [interestPayment, setInterestPayment] = useState<number | undefined>(
        undefined
    );

    const calculateRemainingLoan = (
        principal: number,
        annualInterestRate: number,
        loanDurationInMonths: number
    ): MorgageRecord[] => {
        let monthlyInterestRate = annualInterestRate / 12 / 100;
        let monthlyPayment =
            (principal * monthlyInterestRate) /
            (1 - Math.pow(1 + monthlyInterestRate, -loanDurationInMonths));

        let remainingPrincipal = principal;
        const tempBalanceSheet: MorgageRecord[] = [];

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
        }

        return tempBalanceSheet;
    };

    const handleFormSubmit = (event: any) => {
        event.preventDefault();

        const totalLoanAmount = event.target.totalLoanAmount.value;
        const loanLength = event.target.loanLength.value;
        const totalInterestRate = event.target.totalInterestRate.value;

        const monthlyPayments = calculateRemainingLoan(
            totalLoanAmount,
            totalInterestRate,
            loanLength
        );

        setBalanceSheet(monthlyPayments);

        addLocalBalanceSheet(
            totalLoanAmount,
            loanLength,
            totalInterestRate,
            monthlyPayments
        );
    };

    const addLocalBalanceSheet = (
        totalLoanAmount: string,
        loanLength: string,
        totalInterestRate: string,
        bs: MorgageRecord[]
    ) => {
        console.log(localStorage.getItem("balanceSheets"));

        if (localStorage.getItem("balanceSheets") === null) {
            const tempBalanceSheets: BalanceSheet[] = [];

            tempBalanceSheets.push({
                totalLoanAmount: totalLoanAmount,
                loanLength: loanLength,
                totalInterestRate: totalInterestRate,
                balanceSheet: bs,
                date: new Date(),
            });

            localStorage.setItem(
                "balanceSheets",
                JSON.stringify(tempBalanceSheets)
            );
        } else {
            const tempBalanceSheets: BalanceSheet[] = JSON.parse(
                localStorage.getItem("balanceSheets")!
            );

            if (
                tempBalanceSheets.find(
                    (bs) =>
                        bs.totalLoanAmount === totalLoanAmount &&
                        bs.loanLength === loanLength &&
                        bs.totalInterestRate === totalInterestRate
                ) === undefined
            ) {
                tempBalanceSheets.push({
                    totalLoanAmount: totalLoanAmount,
                    loanLength: loanLength,
                    totalInterestRate: totalInterestRate,
                    balanceSheet: bs,
                    date: new Date(),
                });
            }

            localStorage.setItem(
                "balanceSheets",
                JSON.stringify(tempBalanceSheets)
            );
        }

        setLocalBalanceSheets(
            JSON.parse(localStorage.getItem("balanceSheets")!)
        );
    };

    const handleRecordSelect = (bs: BalanceSheet) => {
        setBalanceSheet(bs.balanceSheet);
    };

    const R = (x: number | string) => {
        return Number(x).toFixed(2);
    };

    useEffect(() => {
        if (localStorage.getItem("balanceSheets") !== null) {
            setLocalBalanceSheets(
                JSON.parse(localStorage.getItem("balanceSheets")!)
            );
        }
    }, []);

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
                                value={initialBalance}
                                onChange={(e) =>
                                    setInitialBalance(Number(e.target.value))
                                }
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="loanLength">
                            <Form.Label>Loan Length</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter loan length in months"
                                value={monthlyPayment}
                                onChange={(e) =>
                                    setMonthlyPayment(Number(e.target.value))
                                }
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
                                value={interestPayment}
                                onChange={(e) =>
                                    setInterestPayment(Number(e.target.value))
                                }
                            />
                        </Form.Group>

                        <Row>
                            <Col
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    gap: "10px",
                                }}
                            >
                                <Button variant="primary" type="submit">
                                    Submit
                                </Button>

                                <Dropdown>
                                    <Dropdown.Toggle
                                        variant="success"
                                        id="previousRequests"
                                    >
                                        Previous Requests
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        {localBalanceSheets.length === 0 && (
                                            <Dropdown.Item>
                                                No previous requests
                                            </Dropdown.Item>
                                        )}

                                        {localBalanceSheets.map((bs) => (
                                            <Dropdown.Item
                                                onClick={() => {
                                                    handleRecordSelect(bs);
                                                }}
                                            >
                                                {bs.totalLoanAmount +
                                                    " " +
                                                    bs.loanLength +
                                                    " " +
                                                    bs.totalInterestRate}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
            <Row className="p-2">
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
