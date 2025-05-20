import CCodeBlockAssignment from "../classes/CodeBlockAssignment";
import TypeNumber from "../classes/types/TypeNumber";
import TypeString from "../classes/types/TypeString";

export type Position = { x: number; y: number };
export type ValidTypes = number | string | boolean;
export type InterpreterTypes = TypeNumber | TypeString;
export type Class<T> = new (...args: any[]) => T;

