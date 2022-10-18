import Resolver from '@forge/resolver';
import api, {route, storage} from '@forge/api';
import ForgeUI, {
    useProductContext
} from '@forge/ui';

const resolver = new Resolver();

// /rest/api/3/search?jql="Sustainability-Assessment.Ecological"=3
resolver.define('getIssues', async function ({payload, context}) {

    const jql = `"Sustainability-Assessment.${payload.dimension}"=${payload.grade}`;
    const response = await api.asApp().requestJira(route`/rest/api/3/search?jql=${jql}`);
    const data = await response.json();

    return data.issues;

});

resolver.define('getAllAssessedIssues', async function ({payload}) {

    const projectKey = payload.projectID.extension.project.key;
    const response = await api.asApp().requestJira(route`/rest/api/3/search?jql=project=${projectKey} AND "Sustainability-Assessment" is not empty AND issuetype = Story`);
    const data = await response.json();

    return data.issues;

});

resolver.define('getAllNotAssessedIssues', async function ({payload}) {

    const projectKey = payload.projectID.extension.project.key;
    const response = await api.asApp().requestJira(route`/rest/api/3/search?jql=project=${projectKey} AND "Sustainability-Assessment" is empty AND issuetype = Story`);
    const data = await response.json();

    return data.issues;

});

resolver.define('getSustainabilityFieldID', async function () {

    const fields = await api
        .asApp()
        .requestJira(route`/rest/api/3/field`);

    const fieldData = await fields.json();
    let id = null;

    fieldData.forEach(data => {
        if (data.name === "Sustainability-Assessment") {
            id = data.id;
        }
    })
    return id;

});

resolver.define('getStatusCategories', async function () {

    const response = await api.asApp().requestJira(route`/rest/api/3/statuscategory/`);
    const data = await response.json();

    return data;

});

resolver.define('updateDimensions', async function ({payload}) {

    let data = {
        "fields":{
            "customfield_10042":payload.dimensions
        }
    };

    const response = await api.asApp().requestJira(route`/rest/api/3/issue/${payload.issueID}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    return true;

});

resolver.define('getBoardIDs', async function ({payload}) {

    const projectKey = payload.projectID.extension.project.key;
    // more boards possible -- TODO let user select board in future version
    const response = await api.asApp().requestJira(route`/rest/agile/1.0/board?projectKeyOrId=${projectKey}`);

    const data = await response.json();

    return data.values[0].id;

});

resolver.define('getSprintInformation', async function ({payload}) {

    const response = await api.asApp().requestJira(route`/rest/agile/1.0/board/${payload.boardID}/sprint`);

    const data = await response.json();

    return data.values;

});

resolver.define('getIssuesForSprint', async function ({payload}) {

    const response = await api.asApp().requestJira(route`/rest/agile/1.0/sprint/${payload.sprintName}/issue`);

    let data = await response.json();

    data = data.issues.filter(issue => issue.fields[payload.fieldID] != null)

    return data;

});

resolver.define('getBacklogItems', async function ({payload}) {

    const response = await api.asApp().requestJira(route`/rest/agile/1.0/board/${payload.boardID}/backlog`);

    let data = await response.json();

    data = data.issues.filter(issue => issue.fields[payload.fieldID] != null)

    return data;

});




export const handler = resolver.getDefinitions();
