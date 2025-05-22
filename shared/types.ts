import CCodeBlockAssignment from "../classes/CodeBlockAssignment";
import TypeBool from "../classes/types/TypeBool";
import TypeNumber from "../classes/types/TypeNumber";
import TypeString from "../classes/types/TypeString";
import TypeVoid from "../classes/types/TypeVoid";

export type Position = { x: number; y: number };
export type ValidTypes = Number | string | boolean;
export type InterpreterTypes = TypeNumber | TypeString | TypeBool | TypeVoid;
export type Class<T> = new (...args: any[]) => T;

