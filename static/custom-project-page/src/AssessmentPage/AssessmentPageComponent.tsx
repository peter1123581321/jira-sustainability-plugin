import React, {useEffect, useState} from "react";
import Tooltip from "@atlaskit/tooltip";
import Breadcrumbs, {BreadcrumbsItem} from "@atlaskit/breadcrumbs";
import {ViewIssueModal} from "@forge/jira-bridge";
import DynamicTableStateless from "@atlaskit/dynamic-table";
import styled from "styled-components";
import Avatar from "@atlaskit/avatar";
import {invoke, Modal, view} from "@forge/bridge";
import {Col, Container, Row} from "react-bootstrap";
import Select from "@atlaskit/select";
import Lozenge from '@atlaskit/lozenge';

const statusCategory = [
    {label: 'To Do', value: 'To Do'},
    {label: 'In Progress', value: 'In Progress'},
    {label: 'Done', value: 'Done'},
    {label: 'All Issues', value: 'All'}
];

const NameWrapper = styled.span`
  display: flex;
  align-items: center;
`;

const AvatarWrapper = styled.div`
  margin-right: 8px;
`;

const getAssigneeName = (assignee: any) => {
    if (assignee == null) {
        return "Unassigned";

    } else {
        return assignee.displayName
    }

}

const getAssignee = (assignee: any) => {
    if (assignee == null) {
        return (<NameWrapper>
            <AvatarWrapper>
                <Avatar
                    size="small"
                />
            </AvatarWrapper>
            Unassigned
        </NameWrapper>);
    } else {
        let url = assignee.avatarUrls["24x24"];
        return (<NameWrapper>
            <AvatarWrapper>
                <Avatar
                    name={assignee.displayName}
                    size="small"
                    src={url}
                />
            </AvatarWrapper>
            {assignee.displayName}
        </NameWrapper>)
    }
}

const isSustainabilityAssessed = (fields: any) => {
    if (fields)
        return "evaluated";
    else
        return "not evaluated";
}

function AssessmentPageComponent() {

    const [issues, setIssues] = useState<any>(null);
    const [context, setContext] = useState<any>(null);
    const [status, setStatus] = useState<any>('All');
    const [allIssues, setAllIssues] = useState<any>(null);
    const [isLoading, setLoading] = useState<boolean>(true);
    const [rows, setRows] = useState<any>(null);
    const [fieldID, setFieldID] = useState<any>(null);

    const head = {
        cells: [
            {
                key: "type",
                content: "Type",
                isSortable: true,
                width: 2
            },
            {
                key: "key",
                content: "KEY",
                isSortable: true,
                width: 5
            },
            {
                key: "summary",
                content: "SUMMARY",
                width: 10
            },
            {
                key: "assignee",
                content: "ASSIGNEE",
                isSortable: true,
                width: 5
            },
            {
                key: "priority",
                content: "PRIORITY",
                isSortable: true,
                width: 3
            },
            {
                key: "sustainability",
                content: "SUSTAINABILITY",
                isSortable: true,
                width: 3
            }]
    };

    useEffect(() => {
        Promise.all([view.getContext(), invoke('getSustainabilityFieldID')])
            .then(resp => {
                setContext(resp[0]);
                setFieldID(resp[1]);
                invoke('getAllNotAssessedIssues', {projectID: resp[0]}).then(issueResp => {
                    setAllIssues(issueResp);
                });
            }).catch();
    }, []);

    useEffect(() => {
        changeStatus(status);
    }, [allIssues]);

    useEffect(() => {
        getRows();
    }, [issues, fieldID]);

    const updateIssues = async () => {
        invoke('getAllNotAssessedIssues', {projectID: context}).then(issueResp => {
            setAllIssues(issueResp);
        });
    }

    const insertDimensions = async (issue: any, dimensions: any) => {
        invoke('updateDimensions',{issueID: issue.id, dimensions: dimensions, fieldID: fieldID}).then(() => {
            updateIssues();
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

    const getRows = () => {
        if (issues) {
            if (issues.length > 0)
                setRows(issues.map((issue: any, index: number) => ({

                    key: `row-${index}-${issue.id}`,
                    cells: [
                        {
                            key: issue.fields.issuetype.name,
                            content:
                                <Tooltip content={issue.fields.issuetype.name}>
                                    <img height="16" width="16" alt={issue.fields.issuetype.name}
                                         src={issue.fields.issuetype.iconUrl}></img>
                                </Tooltip>
                        },
                        {
                            key: issue.key,
                            content:
                                (<Breadcrumbs>
                                    <BreadcrumbsItem text={issue.key} onClick={() => {
                                        const viewIssueModal = new ViewIssueModal({
                                            onClose: () => {
                                                updateIssues();
                                            },
                                            context: {
                                                issueKey: issue.key,
                                            },
                                        });
                                        viewIssueModal.open();
                                    }}/>
                                </Breadcrumbs>)
                        },
                        {
                            key: "summary",
                            content:
                                <a onClick={() => {
                                    const viewIssueModal = new ViewIssueModal({
                                        onClose: () => {
                                            updateIssues();
                                        },
                                        context: {
                                            issueKey: issue.key,
                                        },
                                    });
                                    viewIssueModal.open();
                                }
                                }>{issue.fields.summary}</a>
                        },
                        {
                            key: getAssigneeName(issue.fields.assignee),
                            content: (getAssignee(issue.fields.assignee))
                        },
                        {
                            key: issue.fields.priority.name,
                            content:
                                <Tooltip content={issue.fields.priority.name}>
                                    <img height="16" width="16" alt={issue.fields.priority.name}
                                         src={issue.fields.priority.iconUrl}></img>
                                </Tooltip>
                        },
                        {
                            key: isSustainabilityAssessed(issue.fields[fieldID]),
                            content:
                                <a onClick={() => {
                                    const modal = new Modal({
                                        resource: 'modal-resource',
                                        onClose: (payload) => {
                                            insertDimensions(issue, payload);
                                        },
                                        size: 'medium',
                                        context: {
                                            customKey: 'custom-value',
                                        }
                                    });

                                    modal.open();
                                }}>
                                    <Lozenge appearance="removed">
                                        {isSustainabilityAssessed(issue.fields[fieldID])}
                                    </Lozenge>
                                </a>
                        }
                    ]
                })));
            else
                setRows(null);
            setLoading(false);
        }

    }

    return (
        <Container style={{margin: "0px", width: "100%"}}>
            <Row>
                <Col md={3} style={{margin: "0px"}}>
                    <Select
                        inputId="issueStatus"
                        className="single-select"
                        classNamePrefix="react-select"
                        options={statusCategory}
                        onChange={value => {
                            changeStatus(value.value);
                        }}
                        placeholder="Status Category"
                        isDisabled={isLoading}
                    >
                    </Select>
                </Col>
            </Row>
            <Row>
                <Col md={12}>
                    <div key={fieldID} style={{padding: "10px"}}>
                        <DynamicTableStateless
                            head={head}
                            rows={rows}
                            rowsPerPage={10}
                            defaultPage={1}
                            loadingSpinnerSize="large"
                            isLoading={isLoading}
                            isFixedSize
                            defaultSortKey="key"
                            defaultSortOrder="DESC"
                            onSort={() => console.log('onSort')}
                            onSetPage={() => console.log('onSetPage')}
                            emptyView={<h2>No Issues found</h2>}
                        />
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default AssessmentPageComponent;
