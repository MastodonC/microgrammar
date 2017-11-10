import { InputState } from "../../../InputState";
import { inputStateFromString } from "../../../internal/InputStateFactory";
import { MatchingLogic } from "../../../Matchers";
import { MatchPrefixResult, matchPrefixSuccess } from "../../../MatchPrefixResult";
import { TerminalPatternMatch } from "../../../PatternMatch";
import { Concat } from "../../Concat";
import { LangStateMachine } from "../LangStateMachine";
import { ClojureStateMachine } from "./ClojureStateMachine";

/**
 * The rest of a C family block, going to a matching depth of +1 curlies or braces.
 * Does not read final curly
 */
export class Sexp implements MatchingLogic {

    public $id: "Clojure.sexp";

    private push: string;

    private pop: string;

    constructor(private stateMachineFactory: () => LangStateMachine,
                private kind: "sexp", private inner?: MatchingLogic) {
        switch (kind) {
            case "sexp":
                [this.push, this.pop] = ["(", ")"];
                break;
        }
    }

    public matchPrefix(is: InputState, thisMatchContext, parseContext): MatchPrefixResult {
        const sm = this.stateMachineFactory();
        let depth = 1;
        let currentIs = is;
        let matched = "";
        while (depth > 0) {
            const next = currentIs.peek(1);
            if (next.length === 0) {
                break;
            }
            sm.consume(next);
            if (sm.state.normal()) {
                switch (next) {
                    case this.push:
                        depth++;
                        break;
                    case this.pop:
                        depth--;
                        break;
                    default:
                }
            }
            if (depth > 0) {
                matched += next;
                currentIs = currentIs.advance();
            }
        }
        if (!this.inner) {
            return matchPrefixSuccess(new TerminalPatternMatch(
                this.$id,
                matched,
                is.offset,
                matched));
        }

        // We supply the offset to preserve it in this match
        return this.inner.matchPrefix(inputStateFromString(matched, undefined, is.offset), thisMatchContext, parseContext);
    }
}

/**
 * Match an Sexp including ()
 * @type {Concat}
 */
export function sexp(stateMachineFactory: () => LangStateMachine = () => new ClojureStateMachine()) {
    return Concat.of({
        $id: "(...)",
        _lp: "(",
        block: new Sexp(stateMachineFactory, "sexp"),
        _rp: ")",
    });
}

export function sexpContaining(m: Concat,
                               stateMachineFactory: () => LangStateMachine = () => new ClojureStateMachine()) {
    return Concat.of({
        $id: "(...)",
        _lp: "(",
        block: new Sexp(stateMachineFactory, "sexp", m),
        _rp: ")",
    });
}
