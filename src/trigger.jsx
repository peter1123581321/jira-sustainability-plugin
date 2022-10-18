import ForgeUI, {
    Button,
    Cell,
    CustomField,
    CustomFieldEdit,
    Form,
    Fragment,
    Head,
    IssuePanel,
    ModalDialog,
    Option,
    ProjectPage,
    render,
    Row,
    Select,
    StatusLozenge,
    Table,
    Text,
    TextArea,
    useProductContext,
    useState
} from '@forge/ui';
import api, {route, storage} from "@forge/api";

export async function onInstall(event, context) {


    console.log(context);
    console.log(event);
}
