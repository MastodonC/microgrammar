import { Concat } from "../../../Concat";
import { sexp, sexpContaining } from "./Sexp";
import { CFamilyStateMachine } from "../ClojureStateMachine";

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

export function ClojureSexpContaining(m: Concat) {
    return sexpContaining(m);
}
