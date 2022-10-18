import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {invoke} from '@forge/bridge';
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Filler,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    RadialLinearScale,
    Title,
    Tooltip
} from 'chart.js';
import {Bar, Radar} from 'react-chartjs-2';
import {Col, Container, Row} from "react-bootstrap";
import Select from "@atlaskit/select";
import {B100, G400, R400, Y200} from "@atlaskit/theme/colors";
import Tabs, {Tab, TabList, TabPanel} from "@atlaskit/tabs";

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
);

type Props = {
    issues: any;
};

const getIndex = (key: string) => {
    switch (key) {
        case "ecological":
            return 0;
        case "economical":
            return 1;
        case "technical":
            return 2;
        case "social":
            return 3;
        case "individual":
            return 4;
    }
    return null;
}

const calcSum = (mode: any, data: any) => {

    let sumPositive: number[] = [0, 0, 0, 0, 0];
    let sumNegative: number[] = [0, 0, 0, 0, 0];
    let sumNeutral: number[] = [0, 0, 0, 0, 0];

    data.forEach((value: number[], key: string) => {
        if (value.length > 0) {
            value.forEach(val => {
                if (val < 0)
                    sumNegative[getIndex(key)]++;
                else if (val > 0)
                    sumPositive[getIndex(key)]++;
                else
                    sumNeutral[getIndex(key)]++;

            })
        }
    })

    switch (mode) {
        case "positive":
            return sumPositive;
        case "negative":
            return sumNegative;
        case "neutral":
            return sumNeutral;
    }

    return [0, 0, 0, 0, 0];
}

const countOccurences = (data: number[]) => {

    const count: any = {};
    let result: number[] = [0,0,0,0,0,0,0]

    for (const element of data) {
        if (count[element]) {
            count[element] += 1;
        } else {
            count[element] = 1;
        }
    }

    Object.entries(count).forEach(([key, value]) => {
        let keyNumber: number = parseInt(key)+3;
        let valueNumber: number = Number(value);
        result[keyNumber] = valueNumber;
    })
    return result;

}

const ChartsComponent = ({issues}: Props) => {

    const [fieldID, setFieldID] = useState<any>(null);
    const [dataPositive, setDataPositive] = useState<number[]>([0, 0, 0, 0, 0]);
    const [dataNegative, setDataNegative] = useState<number[]>([0, 0, 0, 0, 0]);
    const [allImpactValues, setAllImpactValues] = useState<Map<string, number[]>>(new Map([
        ['ecological', []],
        ['economical', []],
        ['technical', []],
        ['social', []],
        ['individual', []]
    ]));
    const [calcMode, setCalcMode] = useState<string>("simple");

    const calcAverages = (mode: any, issues: any, fieldID: any) => {

        let dataPositiveTemp: Map<string, number[]> = new Map<string, number[]>();
        let dataNegativeTemp: Map<string, number[]> = new Map<string, number[]>();

        dataPositiveTemp.set("ecological", []);
        dataPositiveTemp.set("economical", []);
        dataPositiveTemp.set("technical", []);
        dataPositiveTemp.set("social", []);
        dataPositiveTemp.set("individual", []);
        dataNegativeTemp.set("ecological", []);
        dataNegativeTemp.set("economical", []);
        dataNegativeTemp.set("technical", []);
        dataNegativeTemp.set("social", []);
        dataNegativeTemp.set("individual", []);
        allImpactValues.set("ecological", []);
        allImpactValues.set("economical", []);
        allImpactValues.set("technical", []);
        allImpactValues.set("social", []);
        allImpactValues.set("individual", []);

        if (issues != null) {
            issues.forEach((issue: any) => {
                if (issue.fields[fieldID]) {
                    Object.entries(issue.fields[fieldID]).forEach(entry => {
                        let key = entry[0];
                        let value = entry[1];
                        if (key !== 'userID' && key !== 'text') {
                            if (!dataPositiveTemp.get(key))
                                dataPositiveTemp.set(key, []);
                            if (!dataNegativeTemp.get(key))
                                dataNegativeTemp.set(key, []);

                            allImpactValues.get(key).push(Number(value));

                            if (value > 0) {
                                dataPositiveTemp.get(key).push(Number(value));
                                if (mode === "extended") {
                                    dataNegativeTemp.get(key).push(0);
                                }
                            } else if (value < 0) {
                                dataNegativeTemp.get(key).push(Number(value) * -1);
                                if (mode === "extended") {
                                    dataPositiveTemp.get(key).push(0);
                                }
                            } else if (value == 0) {
                                dataNegativeTemp.get(key).push(0);
                                dataPositiveTemp.get(key).push(0);
                            }
                        }
                    })
                }
            })
        }

        let positive: number[] = [0, 0, 0, 0, 0];
        let negative: number[] = [0, 0, 0, 0, 0];

        let index = 0;
        dataPositiveTemp.forEach((value, key) => {
            let length = value.length;
            if (length > 0) {
                let sum = value.reduce((a, b) => a + b);
                positive[index] = sum / length;
            } else
                positive[index] = 0;

            index++;
        })

        index = 0;
        dataNegativeTemp.forEach((value, key) => {
            let length = value.length;
            if (length > 0) {
                let sum = value.reduce((a, b) => a + b);
                negative[index] = sum / length;
            } else
                negative[index] = 0;

            index++;
        })

        setDataPositive(positive);
        setDataNegative(negative);
    }

    useEffect(() => {
        invoke('getSustainabilityFieldID').then(resp => {
            setFieldID(resp);
            calcAverages(calcMode, issues, resp);
        });
    }, []);

    useEffect(() => {
        calcAverages(calcMode, issues, fieldID);
    }, [issues]);

    let dataRadar = {
        labels: ['Ecological', 'Economical', 'Technical', 'Social', 'Individual'],
        datasets: [{
            label: 'Average Positive Impact',
            data: dataPositive,
            fill: true,
            backgroundColor: '#00875A20',
            borderColor: G400,
            pointBackgroundColor: G400,
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: G400
        }, {
            label: 'Average Negative Impact',
            data: dataNegative,
            fill: true,
            backgroundColor: '#DE350B20',
            borderColor: R400,
            pointBackgroundColor: R400,
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: R400
        }]
    };

    let dataBar = {
        labels: ['Ecological', 'Economical', 'Technical', 'Social', 'Individual'],
        datasets: [
            {
                label: 'Positive',
                data: calcSum("positive", allImpactValues),
                backgroundColor: G400,
                stack: 'Stack 0',
            },
            {
                label: 'Negative',
                data: calcSum("negative", allImpactValues),
                backgroundColor: R400,
                stack: 'Stack 1',
            },
            {
                label: 'Neutral',
                data: calcSum("neutral", allImpactValues),
                backgroundColor: Y200,
                stack: 'Stack 2',
            },
        ],
    }

    const dataBarIndividual = (data: any) => {
        return {
            labels: [
                'high negative',
                'medium negative',
                'low negative',
                'no impact',
                'low positive',
                'medium positive',
                'high positive'
            ],
            datasets: [{
                label: 'Distribution',
                data: data,
                backgroundColor: B100,
                stack: 'Stack 0',
            }]
        }
    };

    const optionsRadar = {
        scales: {
            r: {
                suggestedMin: 0,
                suggestedMax: 3,
                ticks: {
                    stepSize: 1,
                    callback: function (value: any) {
                        if (value == 1)
                            return "low impact";
                        if (value == 2)
                            return "medium impact";
                        if (value == 3)
                            return "high impact";
                        return value;
                    }
                }
            }
        }
    }

    const optionsBar = (text: any, legend: boolean) => {
        return {
            plugins: {
                title: {
                    display: true,
                    text: text,
                },
                legend:{
                    display: legend
                }
            },
            scales: {
                y: {
                    suggestedMin: 0,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    };

    return (
        <Container style={{margin: "0px", width: "100%"}}>
            <Row style={{margin: "10px"}}>
                <Col md={12}>
                    <h2>Project Overview</h2>
                </Col>
            </Row>
            <Row>
                <Col md={6}>
                    <Row style={{padding: "15px"}}>
                        {issues &&
                        <Bar options={optionsBar('Number of postive/negative/neutral impacts per dimension', true)}
                             data={dataBar}/>
                        }
                    </Row>
                    <Row style={{marginTop: "10px", padding: "15px"}}>
                        <Tabs onChange={(index) => console.log('Selected Tab', index + 1)}
                              id="default">
                            <TabList>
                                <Tab>Ecological</Tab>
                                <Tab>Economical</Tab>
                                <Tab>Technical</Tab>
                                <Tab>Social</Tab>
                                <Tab>Individual</Tab>
                            </TabList>

                            <TabPanel>
                                <Bar options={optionsBar('Distribution of Ecological impacts', false)}
                                     data={dataBarIndividual(countOccurences(allImpactValues.get('ecological')))}/>
                            </TabPanel>
                            <TabPanel>
                                <Bar options={optionsBar('Distribution of Economical impacts', false)}
                                     data={dataBarIndividual(countOccurences(allImpactValues.get('economical')))}/>
                            </TabPanel>
                            <TabPanel>
                                <Bar options={optionsBar('Distribution of Technical impacts', false)}
                                     data={dataBarIndividual(countOccurences(allImpactValues.get('technical')))}/>
                            </TabPanel>
                            <TabPanel>
                                <Bar options={optionsBar('Distribution of Social impacts', false)}
                                     data={dataBarIndividual(countOccurences(allImpactValues.get('social')))}/>
                            </TabPanel>
                            <TabPanel>
                                <Bar options={optionsBar('Distribution of Individual impacts', false)}
                                     data={dataBarIndividual(countOccurences(allImpactValues.get('individual')))}/>
                            </TabPanel>
                        </Tabs>
                    </Row>
                </Col>
                <Col md={6} style={{marginTop: "20px"}}>
                    <Row>
                        <Col md={4}></Col>
                        <Col md={4}>
                            <Select
                                inputId="averageMode"
                                className="single-select"
                                classNamePrefix="react-select"
                                options={[
                                    {label: 'non-weighted average', value: 'simple'},
                                    {label: 'weighted average', value: 'extended'}
                                ]}
                                onChange={value => {
                                    calcAverages(value.value, issues, fieldID);
                                    setCalcMode(value.value);
                                }}
                                defaultValue={{label: 'non-weighted average', value: 'simple'}}
                            />
                        </Col>
                        <Col md={4}></Col>
                    </Row>
                    <Row style={{padding: "15px"}}>
                        <Radar id="radarChart" data={dataRadar} options={optionsRadar}/>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}

export default ChartsComponent;
