import React, {ReactNode} from "react";
import Tabs, {Tab, TabList, TabPanel, useTabPanel} from '@atlaskit/tabs';
import {N20, N200} from '@atlaskit/theme/colors';
import {
    borderRadius as getBorderRadius,
    gridSize as getGridSize,
} from '@atlaskit/theme/constants';

const questionData = require('./questions.json');
import {css, jsx} from '@emotion/core';
import {token} from '@atlaskit/tokens';
import {Button, Cell, Row, Text} from "@forge/ui";

const borderRadius = getBorderRadius();
const gridSize = getGridSize();

const customPanelStyles = css({
    display: 'flex',
    marginTop: `${gridSize * 2}px`,
    marginBottom: `${gridSize}px`,
    padding: `${gridSize * 4}px`,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    flexGrow: 1,
    backgroundColor: token('color.background.neutral', N20),
    borderRadius: `${borderRadius}px`,
    color: token('color.text.subtlest', N200),
    fontSize: '4em',
    fontWeight: 500,
    '&&': {
        padding: `${gridSize * 4}px`,
    },
});

const CustomTabPanel = ({data}: {
    data: any;
}) => {

    return (
        <div>
            {Object.values(data).map((question: any) => (
                <div style={{marginTop: "10px", marginBottom: "10px"}}>
                    <h3>{question.key}</h3>
                    <p style={{marginTop: "0px"}}>{question.text}</p>
                    <ul>
                        {question.question.map((q:any) => (
                            <li>
                                {q}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

function QuestionPageComponent() {

    return (
        <Tabs id="default" css={{width: "400px"}}>
            <TabList>
                <Tab>Ecological</Tab>
                <Tab>Economical</Tab>
                <Tab>Technical</Tab>
                <Tab>Social</Tab>
                <Tab>Individual</Tab>
            </TabList>

            <TabPanel>
                <CustomTabPanel data={questionData["ecological"]}/>
            </TabPanel>
            <TabPanel>
                <CustomTabPanel data={questionData["economical"]}/>
            </TabPanel>
            <TabPanel>
                <CustomTabPanel data={questionData["technical"]}/>
            </TabPanel>
            <TabPanel>
                <CustomTabPanel data={questionData["social"]}/>
            </TabPanel>
            <TabPanel>
                <CustomTabPanel data={questionData["individual"]}/>
            </TabPanel>
        </Tabs>
    );
}

export default QuestionPageComponent;
