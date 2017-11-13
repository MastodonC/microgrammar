import { LangState, LangStateMachine } from "../LangStateMachine";
import { DoubleString, Normal, SemiColonComment } from "./States";

/**
 * State machine for recognizing C family strings and comments.
 * Directly usable for Java, C and C++
 */
export class ClojureStateMachine extends LangStateMachine {

    constructor(state: LangState = Normal) {
        super(state);
    }

    public clone(): ClojureStateMachine {
        return new ClojureStateMachine(this.state);
    }

    public consume(ch: string): void {
        this.previousState = this.state;
        switch (this.state) {
            case SemiColonComment:
                if (ch === "\n") {
                    this.state = Normal;
                }
                break;
            case Normal:
                switch (ch) {
                    case '"':
                        this.state = DoubleString;
                        break;
                    case ";":
                        this.state = SemiColonComment;
                        break;
                    default:
                }
                break;
        }
        this.previousChar = ch;
    }
}
