import ForgeUI, {
    CustomField,
    CustomFieldEdit,
    Option,
    render,
    Select,
    StatusLozenge,
    Text,
    TextArea,
    useProductContext
} from '@forge/ui';

const Edit = () => {
    const {
        extensionContext: {fieldValue},
        accountId
    } = useProductContext();

    const onSubmit = async (values) => {
        values = {...values, "userID": accountId};

        return values;
    }

    function isDefault(dimension, value) {

        if(fieldValue === null || fieldValue === undefined)
            return false;
        else if(fieldValue[dimension] === value)
            return true;
        else
            return false;
    }

    function getText() {

        if(fieldValue === null || fieldValue === undefined || fieldValue.text === undefined)
            return "";
        else
            return fieldValue.text;
    }


    return (
        <CustomFieldEdit onSubmit={onSubmit} width="medium" header="Sustainability Dimensions">
            <Select name="ecological" label="Ecological Sustainability" isRequired="true">
                <Option label="high positive impact" value={3} defaultSelected={isDefault("ecological", 3)}/>
                <Option label="medium positive impact" value={2} defaultSelected={isDefault("ecological", 2)}/>
                <Option label="low positive impact" value={1} defaultSelected={isDefault("ecological", 1)}/>
                <Option label="no impact" value={0} defaultSelected={isDefault("ecological", 0)}/>
                <Option label="low negative impact" value={-1} defaultSelected={isDefault("ecological", -1)}/>
                <Option label="medium negative impact" value={-2} defaultSelected={isDefault("ecological", -2)}/>
                <Option label="high negative impact" value={-3} defaultSelected={isDefault("ecological", -3)}/>
                <Option label="not assessable" value={undefined} defaultSelected={isDefault("ecological", undefined)}/>
            </Select>
            <Select name="economical" label="Economical Sustainability" isRequired="true">
                <Option label="high positive impact" value={3} defaultSelected={isDefault("economical", 3)}/>
                <Option label="medium positive impact" value={2} defaultSelected={isDefault("economical", 2)}/>
                <Option label="low positive impact" value={1} defaultSelected={isDefault("economical", 1)}/>
                <Option label="no impact" value={0} defaultSelected={isDefault("economical", 0)}/>
                <Option label="low negative impact" value={-1} defaultSelected={isDefault("economical", -1)}/>
                <Option label="medium negative impact" value={-2} defaultSelected={isDefault("economical", -2)}/>
                <Option label="high negative impact" value={-3} defaultSelected={isDefault("economical", -3)}/>
                <Option label="not assessable" value={undefined} defaultSelected={isDefault("economical", undefined)}/>
            </Select>
            <Select name="technical" label="Technical Sustainability" isRequired="true">
                <Option label="high positive impact" value={3} defaultSelected={isDefault("technical", 3)}/>
                <Option label="medium positive impact" value={2} defaultSelected={isDefault("technical", 2)}/>
                <Option label="low positive impact" value={1} defaultSelected={isDefault("technical", 1)}/>
                <Option label="no impact" value={0} defaultSelected={isDefault("technical", 0)}/>
                <Option label="low negative impact" value={-1} defaultSelected={isDefault("technical", -1)}/>
                <Option label="medium negative impact" value={-2} defaultSelected={isDefault("technical", -2)}/>
                <Option label="high negative impact" value={-3} defaultSelected={isDefault("technical", -3)}/>
                <Option label="not assessable" value={undefined} defaultSelected={isDefault("technical", undefined)}/>
            </Select>
            <Select name="social" label="Social Sustainability" isRequired="true">
                <Option label="high positive impact" value={3} defaultSelected={isDefault("social", 3)}/>
                <Option label="medium positive impact" value={2} defaultSelected={isDefault("social", 2)}/>
                <Option label="low positive impact" value={1} defaultSelected={isDefault("social", 1)}/>
                <Option label="no impact" value={0} defaultSelected={isDefault("social", 0)}/>
                <Option label="low negative impact" value={-1} defaultSelected={isDefault("social", -1)}/>
                <Option label="medium negative impact" value={-2} defaultSelected={isDefault("social", -2)}/>
                <Option label="high negative impact" value={-3} defaultSelected={isDefault("social", -3)}/>
                <Option label="not assessable" value={undefined} defaultSelected={isDefault("social", undefined)}/>
            </Select>
            <Select name="individual" label="Individual Sustainability" isRequired="true">
                <Option label="high positive impact" value={3} defaultSelected={isDefault("individual", 3)}/>
                <Option label="medium positive impact" value={2} defaultSelected={isDefault("individual", 2)}/>
                <Option label="low positive impact" value={1} defaultSelected={isDefault("individual", 1)}/>
                <Option label="no impact" value={0} defaultSelected={isDefault("individual", 0)}/>
                <Option label="low negative impact" value={-1} defaultSelected={isDefault("individual", -1)}/>
                <Option label="medium negative impact" value={-2} defaultSelected={isDefault("individual", -2)}/>
                <Option label="high negative impact" value={-3} defaultSelected={isDefault("individual", -3)}/>
                <Option label="not assessable" value={undefined} defaultSelected={isDefault("individual", undefined)}/>
            </Select>
            <TextArea name="text" label="Notes (optional)" defaultValue={getText()}/>
        </CustomFieldEdit>
    );
}

const SustainabilityFieldView = () => {

    let {
        extensionContext: {fieldValue},
    } = useProductContext();

    let fieldEvaluation;

    if (fieldValue == null) {
        fieldEvaluation = 'not evaluated';
    } else
        fieldEvaluation = 'evaluated';

    const fieldAppearance = (value) => {

        switch (value) {
            case "evaluated":
                return "success";
            case "not evaluated":
            default:
                return "removed";
        }
    };

    return (
        <CustomField>
            <Text>
                <StatusLozenge
                    text={fieldEvaluation}
                    appearance={fieldAppearance(fieldEvaluation)}
                />
            </Text>
        </CustomField>
    );
}

export const renderFieldEdit = render(
    <Edit/>
)

export const renderFieldView = render(
    <SustainabilityFieldView/>
);
