import React, {useEffect, useState} from "react";
import {Route, Router, Switch} from "react-router";
import {view} from "@forge/bridge";
import OverviewPageComponent from "./OverviewPage/OverviewPageComponent";
import AssessmentPageComponent from "./AssessmentPage/AssessmentPageComponent";
import QuestionPageComponent from "./QuestionPage/QuestionPageComponent";

function App() {
    const [history, setHistory] = useState(null);

    useEffect(() => {
        view.createHistory().then((newHistory) => setHistory(newHistory));
    }, []);

    return (
        <div>
            {history ? (
                <Router history={history}>
                    <Switch>
                        <Route path="/overview-page">
                            <OverviewPageComponent />
                        </Route>
                        <Route path="/assessment-page">
                            <AssessmentPageComponent />
                        </Route>
                        <Route path="/question-page">
                            <QuestionPageComponent />
                        </Route>
                    </Switch>
                </Router>
            ) : (
                "Loading..."
            )}
        </div>
    );
}

export default App;
