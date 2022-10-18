import React, {PureComponent, useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {invoke, view} from '@forge/bridge';
import Select from '@atlaskit/select';
import LoadingButton from '@atlaskit/button/loading-button';
import {Col, Container, Row} from "react-bootstrap";
import TableComponent from "./TableComponent";
import ChartsComponent from "./ChartsComponent";

interface Label {
    label: string,
    value: string
}

const statusCategory: Label[] = [
    {label: 'To Do', value: 'To Do'},
    {label: 'In Progress', value: 'In Progress'},
    {label: 'Done', value: 'Done'},
    {label: 'All Issues', value: 'All'}
];

let issueLocation: Label[] = [];

function OverviewPageComponent() {

    const [allIssues, setAllIssues] = useState<any>(null);
    const [issues, setIssues] = useState<any>(null);
    const [context, setContext] = useState<any>(null);
    const [fieldID, setFieldID] = useState<any>(null);
    const [status, setStatus] = useState<any>('All');
    const [boardID, setBoardID] = useState<any>(null);
    const [loading, setLoading] = useState<any>(true);

    useEffect(() => {
        Promise.all([view.getContext(), invoke('getSustainabilityFieldID')])
            .then(resp => {
                setFieldID(resp[1]);
                setContext(resp[0]);
                Promise.all([invoke('getAllAssessedIssues', {projectID: resp[0]}), invoke('getBoardIDs', {projectID: resp[0]})]).then(resp2 => {
                    invoke('getSprintInformation', {boardID: resp2[1]}).then((sprintData: any) => {

                        issueLocation = [
                            {label: 'Backlog', value: 'Backlog'},
                            {label: 'All', value: 'All'}
                        ];

                        if(Array.isArray(sprintData)){
                            sprintData.forEach((sprint:any) =>{
                                issueLocation.push({label: sprint.name, value: sprint.id})
                            })
                        }
                        setBoardID(resp2[1]);
                        setAllIssues(resp2[0]);
                        setIssues(resp2[0]);
                        setLoading(false);
                    });
                })
            }).catch();
    }, []);

    useEffect(() => {
        changeStatus(status);
    }, [allIssues]);

    const updateList = async () => {
        invoke('getAllAssessedIssues', {projectID: context}).then(issueResp => {
            setAllIssues(issueResp);
            setLoading(false);
        });
    }

    const changeStatus = (value: string | number) => {
        setStatus(value);
        if (value === 'All') {
            setIssues(allIssues);
        } else {
            let issuetemp = allIssues.filter((issue: any) => {
                if (issue.fields.status.name === value)
                    return issue;
            });
            setIssues(issuetemp);
        }
    }

    const changeIssueLocation = (value: string | number) => {

        setLoading(true);

        if(value == "Backlog"){
            invoke('getBacklogItems', {boardID: boardID, fieldID: fieldID}).then(issueResp => {
                setAllIssues(issueResp);
                setLoading(false);
            });
        } else if(value == "All"){
            updateList().then();
        } else {
            invoke('getIssuesForSprint', {sprintName: value, fieldID: fieldID}).then(issueResp => {
                setAllIssues(issueResp);
                setLoading(false);
            });
        }


    }

    return (
        <Container style={{margin: "0px", width: "100%"}}>
            <Row>
                <Col md={3}>
                    <Select
                        inputId="issueLocation"
                        className="single-select"
                        classNamePrefix="react-select"
                        options={issueLocation}
                        onChange={value => {
                            changeIssueLocation(value.value);
                        }}
                        placeholder="Choose Backlog/Sprint"
                        isDisabled={loading}
                    >
                    </Select>
                </Col>
                <Col md={3}>
                    <Select
                        inputId="issueStatus"
                        className="single-select"
                        classNamePrefix="react-select"
                        options={statusCategory}
                        onChange={value => {
                            changeStatus(value.value);
                        }}
                        placeholder="Status Category"
                        isDisabled={loading}
                    >
                    </Select>
                </Col>
            </Row>
            <Row>
                <Col md={12}  lg={12}>
                    <TableComponent issues={issues} fieldID={fieldID} parentMethod={updateList}
                                    loadingMethod={setLoading} loadingStatus={loading}/>
                </Col>
            </Row>
            <Row>
                <Col md={12} lg={12}>
                    {issues && <ChartsComponent issues={issues}/>}
                </Col>
            </Row>
        </Container>
    );

}

export default OverviewPageComponent;

