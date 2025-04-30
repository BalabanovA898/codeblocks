import CodeBlockAsigment from "../components/CodeBlockAsigment";
import { Key } from "react";

interface ICodeBlockAsigment {
    render_: (props: { key: Key }) => React.JSX.Element;
}

class CCodeBlockAsigment implements ICodeBlockAsigment {
    render_ = CodeBlockAsigment;

    get render() {
        return this.render_;
    }
}

export default CCodeBlockAsigment;

