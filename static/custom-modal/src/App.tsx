import {view} from '@forge/bridge';
import React, {useEffect, useState} from 'react';
import {Field, FormFooter, FormHeader} from '@atlaskit/form';
import Button from '@atlaskit/button/standard-button';
import Select, {components} from '@atlaskit/select';
import type {OptionProps, SingleValueProps,} from '@atlaskit/select/types';
import {ButtonGroup} from "@atlaskit/button";
import {DN200A, G400, R400, Y200} from '@atlaskit/theme/colors';
import CrossCircleIcon from "@atlaskit/icon/glyph/cross-circle";
import MediaServicesPreselectedIcon from "@atlaskit/icon/glyph/media-services/preselected";
import AddCircleIcon from "@atlaskit/icon/glyph/add-circle";
import QuestionCircleIcon from "@atlaskit/icon/glyph/question-circle";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {Popup} from "@atlaskit/popup";
import QuestionPageComponent from "./QuestionPageComponent";

const IconBox = ({icon}: { icon: string }) => {

    switch (icon) {
        case "high negative impact":
            return (
                <div style={{display: "inline"}}>
                    <CrossCircleIcon primaryColor={R400} label=""/>
                    <CrossCircleIcon primaryColor={R400} label=""/>
                    <CrossCircleIcon primaryColor={R400} label=""/>
                </div>
            );
        case "medium negative impact":
            return (
                <div style={{display: "inline"}}>
                    <CrossCircleIcon primaryColor={R400} label=""/>
                    <CrossCircleIcon primaryColor={R400} label=""/>
                </div>
            );
        case "low negative impact":
            return (
                <div style={{display: "inline"}}>
                    <CrossCircleIcon primaryColor={R400} label=""/>
                </div>
            );
        case "no impact":
            return (
                <div style={{display: "inline"}}>
                    <MediaServicesPreselectedIcon primaryColor={Y200} label=""></MediaServicesPreselectedIcon>

                </div>
            );
        case "low positive impact":
            return (
                <div style={{display: "inline"}}>
                    <AddCircleIcon primaryColor={G400} label=""/>
                </div>
            );
        case "medium positive impact":
            return (
                <div style={{display: "inline"}}>
                    <AddCircleIcon primaryColor={G400} label=""/>
                    <AddCircleIcon primaryColor={G400} label=""/>
                </div>
            );
        case "high positive impact":
            return (
                <div style={{display: "inline"}}>
                    <AddCircleIcon primaryColor={G400} label=""/>
                    <AddCircleIcon primaryColor={G400} label=""/>
                    <AddCircleIcon primaryColor={G400} label=""/>
                </div>
            );
    }
    return (
        <div style={{display: "inline"}}>
            <QuestionCircleIcon primaryColor={DN200A} label=""/>
        </div>
    );
};

type ColorOption = typeof impacts[number];

const CustomSelectOption: React.FC<OptionProps<ColorOption>> = ({children, ...props}) => (
    <components.Option {...props}>
        <div style={{display: "flex"}}>
            <IconBox icon={children as string}/>
            <div style={{display: "flex", marginLeft: "5px", alignItems: "center"}}>
                {children}
            </div>
        </div>
    </components.Option>
);

const CustomValueOption: React.FC<SingleValueProps<ColorOption>> = ({children, ...props}) => (
    <components.SingleValue {...props}>
        <div style={{display: "flex"}}>
            <IconBox icon={children as string}/>
            <div style={{display: "flex", marginLeft: "5px", alignItems: "center"}}>
                {children}
            </div>
        </div>
    </components.SingleValue>
);

interface Assessment {
    ecological?: number,
    economical?: number,
    technical?: number,
    social?: number,
    individual?: number,
    text?: string,
    userID?: string
}

const impacts = [
    {label: 'high positive impact', value: 3},
    {label: 'medium positive impact', value: 2},
    {label: 'low positive impact', value: 1},
    {label: 'no impact', value: 0},
    {label: 'low negative impact', value: -1},
    {label: 'medium negative impact', value: -2},
    {label: 'high negative impact', value: -3},
    {label: 'not assessed', value: undefined}
];

function App() {

    const [context, setContext] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [dataOld, setdataOld] = useState<Assessment>({});
    const [data, setData] = useState<Assessment>({});
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        view.getContext().then((resp: any) => {
            if (resp.extension.fieldValue) {
                setdataOld(resp.extension.fieldValue);
                setData(resp.extension.fieldValue);
            }
            setContext(resp);
            setLoading(true);
        }).catch();
    }, []);

    const submitData = (): any => {

        // if (data == {})
        //    return null;

        data.userID = context.accountId;

        if (!data.text)
            data.text = "";

        if (context.extension.fieldId) {
            view.submit(data).then(data => {
                view.close();
            });
        } else {
            view.close(data);
        }
        return null;
    }

    const getDefaultValue = (dimension: string): any => {

        let label: any = {label: 'not assessed', value: undefined};

        impacts.forEach(impact => {
            if (impact.value == data[dimension as keyof Assessment]) {
                label = impact;
                return;
            }
        })

        return label;
    }

    const modules = {
        toolbar: [
            [{'header': [1, 2, false]}],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
            ['clean']
        ],
    };

    return (
        <div style={{
            display: 'flex',
            margin: '0 auto',
            flexDirection: 'column',
            padding: '15px',
            height: '480px',
        }}>
            <div style={{flexGrow: 0}}>
                <FormHeader title={'Sustainability Assessment'}>
                </FormHeader>
            </div>
            {loading && <div style={{flexGrow: 1, overflow: 'auto'}}>
                <Field
                    name="ecological"
                    label="Ecological Sustainability">
                    {({fieldProps}: any) => (
                            <div style={{width: "50vw"}}>
                                <Select options={impacts}
                                        onChange={change => {
                                            data.ecological = change.value;
                                        }}
                                        components={{
                                            Option: CustomSelectOption,
                                            SingleValue: CustomValueOption,
                                        }}
                                        defaultValue={getDefaultValue("ecological")}
                                />
                            </div>
                    )}
                </Field>
                <Field
                    name="economical"
                    label="Economical Sustainability">
                    {({fieldProps}: any) => (
                        <div style={{width: "50vw"}}>
                            <Select options={impacts}
                                    onChange={change => {
                                        data.economical = change.value;
                                    }}
                                    components={{
                                        Option: CustomSelectOption,
                                        SingleValue: CustomValueOption,
                                    }}
                                    defaultValue={getDefaultValue("economical")}
                            />
                        </div>
                    )}
                </Field>
                <Field
                    name="technical"
                    label="Technical Sustainability">
                    {({fieldProps}: any) => (
                        <div style={{width: "50vw"}}>
                            <Select options={impacts}
                                    onChange={change => {
                                        data.technical = change.value;
                                    }}
                                    components={{
                                        Option: CustomSelectOption,
                                        SingleValue: CustomValueOption,
                                    }}
                                    defaultValue={getDefaultValue("technical")}
                            />
                        </div>
                    )}
                </Field>
                <Field
                    name="social"
                    label="Social Sustainability"
                    defaultValue={undefined}
                >
                    {({fieldProps: {id, ...rest}}) => (
                        <div style={{width: "50vw"}}>
                            <Select options={impacts}
                                    onChange={change => {
                                        data.social = change.value;
                                    }}
                                    components={{
                                        Option: CustomSelectOption,
                                        SingleValue: CustomValueOption,
                                    }}
                                    defaultValue={getDefaultValue("social")}
                            />
                        </div>
                    )}
                </Field>
                <Field
                    name="individual"
                    label="Individual Sustainability">
                    {({fieldProps}: any) => (
                        <div style={{width: "50vw"}}>
                            <Select options={impacts}
                                    onChange={change => {
                                        data.individual = change.value;
                                    }}
                                    components={{
                                        Option: CustomSelectOption,
                                        SingleValue: CustomValueOption,
                                    }}
                                    defaultValue={getDefaultValue("individual")}
                            />
                        </div>
                    )}
                </Field>
                <Field label="Notes (optional)" name="text">
                    {({fieldProps}: any) => (
                        <ReactQuill theme="snow" value={data.text || ''}
                                    onChange={change => {
                                        data.text = change
                                    }}
                                    modules={modules}
                        />
                    )}
                </Field>
            </div>}
            <div style={{flexGrow: 0, display: "flex", paddingTop: "15px", justifyContent: "space-between"}}>
                    <Popup
                        isOpen={isOpen}
                        onClose={() => setIsOpen(false)}
                        placement="bottom-start"
                        content={() =>
                            <div style={{width: "400px", height: "250px"}}><QuestionPageComponent></QuestionPageComponent></div>
                        }
                        trigger={(triggerProps) => (
                            <Button
                                style={{width: "180px"}}
                                {...triggerProps}
                                appearance="primary"
                                isSelected={isOpen}
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                {isOpen ? 'Close' : ''} Assessment Help{' '}
                            </Button>
                        )}
                    />
                    <ButtonGroup>
                        <Button type="reset" appearance="default" onClick={click => view.close()}>
                            Cancel
                        </Button>
                        <Button type="submit" appearance="primary" onClick={submitData}>
                            Submit
                        </Button>
                    </ButtonGroup>
            </div>
        </div>
    );
}

export default App;
