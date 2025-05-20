import CCodeBlock from "../../classes/CodeBlock";

export default interface Renderable {
    parent: CCodeBlock | null;
    render(props: any): JSX.Element;
}

