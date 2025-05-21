import CCodeBlockWrapper from "../../classes/CodeBlockWrapper";

export default interface Renderable {
    parent: CCodeBlockWrapper | null;
    render(props: any): JSX.Element;
}

