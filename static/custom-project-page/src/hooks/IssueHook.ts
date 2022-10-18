import {useEffect, useState} from "react";
import {requestJira} from "@forge/bridge";

type Response = {
    /**
     * Flag to determine if issues are loading.
     */
    loading: boolean,
    /**
     * Collection of issues matching the provided JQL string.
     */
    issues: Object[],
}

export const useIssues = (dimension: string | undefined, grade: number): Response => {
    const [loading, setLoading] = useState(false);
    const [issues, setIssues] = useState<Object[]>([]);

    useEffect(() => {
        if (dimension || grade === undefined) {
            return;
        }

        const jql = '"Sustainability-Assessment.Ecological"=3';

        console.log(jql)
        // Retrieve issues for the provided JQL string
        const fetchIssues = async () => {
            try {
                const response = await requestJira(`/rest/api/3/search?jql=${jql}&fields=status`);
                const data = await response.json();

                if (response.status >= 400) {
                    if (data.errorMessages && data.errorMessages.length > 0) {
                        setIssues([]);
                        // Format error messages to be displayed in the editor
                    } else {
                        throw new Error(`Invalid response code: ${response.status}`);
                    }
                } else {
                    // Map the status category of each issue
                    const issues = data.issues;
                    setIssues(issues);
                }
            } catch (e) {
                console.error("Could not fetch issues", e);
                setIssues([]);
            } finally {
                setLoading(false);
            }
        }
    }, [setLoading, setIssues])

    return {
        loading,
        issues,
    }
}
