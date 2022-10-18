import React, {useState} from "react";
import Tooltip from "@atlaskit/tooltip";
import CrossCircleIcon from "@atlaskit/icon/glyph/cross-circle";
import {DN200A, G400, R400, Y200} from "@atlaskit/theme/colors";
import MediaServicesPreselectedIcon from "@atlaskit/icon/glyph/media-services/preselected";
import AddCircleIcon from "@atlaskit/icon/glyph/add-circle";
import Popup from "@atlaskit/popup";
import Button from "@atlaskit/button/standard-button";
import QuestionCircleIcon from "@atlaskit/icon/glyph/question-circle";
import parse from "html-react-parser";

type Props = {
    issues: any;
    fieldID: any;
};

const SustainabilityFieldComponent = ({issues, fieldID}: Props) => {
    const [isOpen, setIsOpen] = useState(false);

    if (issues[fieldID] !== undefined) {
        switch (issues[fieldID]) {
            case -3:
                return (
                    <Tooltip content={"high negative impact"}>
                        <div>
                            <CrossCircleIcon primaryColor={R400} label=""/>
                            <CrossCircleIcon primaryColor={R400} label=""/>
                            <CrossCircleIcon primaryColor={R400} label=""/>
                        </div>
                    </Tooltip>
                );
            case -2:
                return (
                    <Tooltip content={"medium negative impact"}>
                        <div>
                            <CrossCircleIcon primaryColor={R400} label=""/>
                            <CrossCircleIcon primaryColor={R400} label=""/>
                        </div>
                    </Tooltip>
                );
            case -1:
                return (
                    <Tooltip content={"low negative impact"}>
                        <div>
                            <CrossCircleIcon primaryColor={R400} label=""/>
                        </div>
                    </Tooltip>
                );
            case 0:
                return (
                    <Tooltip content={"no impact"}>
                        <MediaServicesPreselectedIcon primaryColor={Y200} label="">-</MediaServicesPreselectedIcon>
                    </Tooltip>
                );
            case 1:
                return (
                    <Tooltip content={"low positive impact"}>
                        <div>
                            <AddCircleIcon primaryColor={G400} label=""/>
                        </div>
                    </Tooltip>
                );
            case 2:
                return (
                    <Tooltip content={"medium positive impact"}>
                        <div>
                            <AddCircleIcon primaryColor={G400} label=""/>
                            <AddCircleIcon primaryColor={G400} label=""/>
                        </div>
                    </Tooltip>
                );
            case 3:
                return (
                    <Tooltip content={"high positive impact"}>
                        <div>
                            <AddCircleIcon primaryColor={G400} label=""/>
                            <AddCircleIcon primaryColor={G400} label=""/>
                            <AddCircleIcon primaryColor={G400} label=""/>
                        </div>
                    </Tooltip>
                );
        }
        if(fieldID == "text"){
            if(issues[fieldID].length > 0) {
                return (
                    <Popup
                        isOpen={isOpen}
                        onClose={() => setIsOpen(false)}
                        placement="bottom-start"
                        content={() => <div style={{margin: "5px", width: "600px"}}>{parse(issues[fieldID])}</div>}
                        trigger={(triggerProps) => (
                            <Button
                                {...triggerProps}
                                appearance="primary"
                                isSelected={isOpen}
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                {isOpen ? 'Close' : 'View'} Notes{' '}
                            </Button>
                        )}
                    />
                );
            } else
                return <div/>
        }
        return issues[fieldID];
    } else
        return (
            <Tooltip content={"not assessed"}>
                <QuestionCircleIcon primaryColor={DN200A} label=""/>
            </Tooltip>
        );
}
export default SustainabilityFieldComponent;
