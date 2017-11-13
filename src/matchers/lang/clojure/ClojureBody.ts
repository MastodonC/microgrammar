import { Concat } from "../../Concat";
import { sexp, sexpContaining, keyword, vector, vectorContaining } from "./Sexp";
import { ClojureStateMachine } from "./ClojureStateMachine";

/**
 * Match a Java block with balanced curlies
 * @type {Term}
 */
export const ClojureBody = sexp(() => new ClojureStateMachine());

/**
 * Match a parenthesized Java expression with ()
 * @type {Concat}
 */
export const ClojureSexp =
    sexp();

export const ClojureKeyword =
    keyword();

export const ClojureVector =
    vector();

export function ClojureVectorContaining(m: Concat) {
    return vectorContaining(m);
}

export function ClojureSexpContaining(m: Concat) {
    return sexpContaining(m);
}
