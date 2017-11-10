
import { LangHelper } from "../LangHelper";
import { ClojureStateMachine } from "./ClojureStateMachine";
import { DoubleString, Normal, SemiColonComment } from "./States";

export class ClojureLangHelper implements LangHelper {

    /**
     * Strip Clojure comments
     * @param source
     */
    public stripComments(source: string) {
        let stripped = "";
        const sm = new ClojureStateMachine();
        for (const ch of source) {
            sm.consume(ch);
            switch (sm.state) {
                case SemiColonComment:
                    break;
                case Normal:
                    if (!(ch === "\n" && sm.previousState.comment)) {
                        stripped += ch;
                    }
                    break;
                default:
                    stripped += ch;
            }
        }
        return stripped;
    }

   public stripWhitespace(source: string): string {
        let stripped = "";
        let chunk = "";

        const sm = new ClojureStateMachine();
        for (const s of source) {
            sm.consume(s);
            switch (sm.state) {
                case DoubleString:
                    // If we've just entered a string, add the stripped chunk that preceded it
                    if (sm.previousState !== DoubleString) {
                        stripped += this.strip(chunk);
                        // add a space after partial exp
                        stripped += " ";
                        chunk = "";
                    }
                    // Take all characters from string without stripping whitespace
                    stripped += s;
                    break;
                default:
                    // Add to a chunk that we'll later strip
                    chunk += s;
            }
        }
        stripped += this.strip(chunk);
        return stripped;
    }

    public canonicalize(src: string): string {
        return this.stripWhitespace(this.stripComments(src));
    }

    private strip(src: string): string {
        let stripped = src.replace(/[\s]+/g, " ");
        // Get rid of syntactically unnecessary whitespace
        stripped = stripped.replace(/([{@])\s/g, "$1");
        stripped = stripped.replace(/\s([}@])/g, "$1");

        stripped = stripped.replace(/([\(])\s+/g, "$1");
        stripped = stripped.replace(/\s+([\)])/g, "$1");
        stripped = stripped.trim();
        return stripped;
    }

}
