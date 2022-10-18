import React, {useState} from "react";
import DynamicTableStateless from '@atlaskit/dynamic-table';
import styled from 'styled-components';
import Avatar from '@atlaskit/avatar';
import {ViewIssueModal} from '@forge/jira-bridge';
import Breadcrumbs, {BreadcrumbsItem} from '@atlaskit/breadcrumbs';
import Tooltip from '@atlaskit/tooltip';
import SustainabilityFieldComponent from "./SustainabilityFieldComponent";

type Props = {
    issues: any;
    fieldID: any;
    parentMethod: any;
    loadingMethod: any;
    loadingStatus: boolean;
};

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

const getDimensionKey = (dimension: string, fields: any) => {

    if (fields && fields[dimension] !== undefined) {
        return fields[dimension]
    } else {
        return -100
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

const TableComponent = ({issues, fieldID, parentMethod, loadingStatus, loadingMethod}: Props) => {

    let loading: boolean = loadingStatus;
    // const [rows, setRows] = useState<any>(null);

    let rows: any;
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
                key: "priority",
                content: "PRIORITY",
                isSortable: true,
                width: 3
            },
            {
                key: "ecological",
                content: "ECOLOGICAL",
                isSortable: true,
                width: 5
            },
            {
                key: "economical",
                content: "ECONOMICAL",
                isSortable: true,
                width: 5
            },
            {
                key: "technical",
                content: "TECHNICAL",
                isSortable: true,
                width: 5
            },
            {
                key: "social",
                content: "SOCIAL",
                isSortable: true,
                width: 5
            },
            {
                key: "individual",
                content: "INDIVIDUAL",
                isSortable: true,
                width: 5
            },
            {
                key: "notes",
                content: "NOTES",
                isSortable: false,
                width: 5
            }
        ]
    };

    if (issues) {
        if (issues.length > 0)
            rows = (issues.map((issue: any, index: number) => ({
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
                                            parentMethod();
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
                                        parentMethod();
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
                        key: issue.fields.priority.name,
                        content:
                            <Tooltip content={issue.fields.priority.name}>
                                <img height="16" width="16" alt={issue.fields.priority.name}
                                     src={issue.fields.priority.iconUrl}></img>
                            </Tooltip>
                    },
                    {
                        key: getDimensionKey("ecological", issue.fields[fieldID]),
                        content: <SustainabilityFieldComponent fieldID={"ecological"}
                                                               issues={issue.fields[fieldID]}/>
                    },
                    {
                        key: getDimensionKey("economical", issue.fields[fieldID]),
                        content: <SustainabilityFieldComponent fieldID={"economical"}
                                                               issues={issue.fields[fieldID]}/>
                    },
                    {
                        key: getDimensionKey("technical", issue.fields[fieldID]),
                        content: <SustainabilityFieldComponent fieldID={"technical"}
                                                               issues={issue.fields[fieldID]}/>
                    },
                    {
                        key: getDimensionKey("social", issue.fields[fieldID]),
                        content: <SustainabilityFieldComponent fieldID={"social"} issues={issue.fields[fieldID]}/>
                    },
                    {
                        key: getDimensionKey("individual", issue.fields[fieldID]),
                        content: <SustainabilityFieldComponent fieldID={"individual"}
                                                               issues={issue.fields[fieldID]}/>
                    },
                    {
                        key: "notes",
                        content: <SustainabilityFieldComponent fieldID={"text"} issues={issue.fields[fieldID]}/>
                    },

                ]
            })));
    }

    return (
        <div key={fieldID} style={{padding: "10px"}}>
            <DynamicTableStateless
                head={head}
                rows={rows}
                rowsPerPage={10}
                defaultPage={1}
                loadingSpinnerSize="large"
                isLoading={loading}
                isFixedSize
                defaultSortKey="key"
                defaultSortOrder="DESC"
                onSort={() => console.log('onSort')}
                onSetPage={() => console.log('onSetPage')}
                emptyView={<h2>No Issues found</h2>}
            />
        </div>
    )
}
export default TableComponent;
