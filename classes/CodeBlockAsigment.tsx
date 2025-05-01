import CodeBlockAsigment from "../components/CodeBlockAsigment";
import { Key } from "react";

interface ICodeBlockAsigment {
    render_: (props: { key: Key }) => React.JSX.Element;
}

class CCodeBlockAsigment implements ICodeBlockAsigment {
    render_ = CodeBlockAsigment;

    render(props: { key: Key }) {
        return this.render_(props);
    }
}

export default CCodeBlockAsigment;

