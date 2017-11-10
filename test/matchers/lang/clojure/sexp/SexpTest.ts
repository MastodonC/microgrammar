import { ClojureSexp, ClojureSexpContaining } from "../../../../../src/matchers/lang/clojure/ClojureBody";
import { Microgrammar } from "../../../../../src/Microgrammar";
import { PatternMatch } from "../../../../../src/PatternMatch";
import { Regex } from "../../../../../src/Primitives";

import { inputStateFromString } from "../../../../../src/internal/InputStateFactory";

import * as assert from "power-assert";
import { RestOfInput } from "../../../../../src/matchers/skip/Skip";
import { isSuccessfulMatch } from "../../../../../src/MatchPrefixResult";

describe("ClojureSexp", () => {

    it("match empty block", () => {
        match("()");
    });

    it("match block with statement", () => {
        match("(let [x y])");
    });

    it("match block ignoring terminating } in string", () => {
        match('(str ")")');
    });

    it("match block ignoring ( in string", () => {
        match('(str "()))()(()())(")');
    });

    it("match nested ignoring terminating ) in string", () => {
        match('(str ")")');
    });

    it("match nested ignoring terminating ) in line comment", () => {
        match(`
              (+
               ; comment )
               1 1)`
        );
    });

    it("shouldn't match unbalanced", () => {
        shouldNotMatch("(  ");
    });

    it("should match till balance", () => {
        const balanced = "(let [ x y] (str \"stuff\"))";
        const is = inputStateFromString(balanced + "; comment )");
        const m = ClojureSexp.matchPrefix(is, {}, {}) as PatternMatch;
        if (isSuccessfulMatch(m)) {
            const mmmm = m.match as any;
            assert(mmmm.$matched === balanced);

        } else {
            assert.fail("Didn't match");
        }
    });

    it("should match inner structure", () => {
        const balanced = "(let (x y))";
        const is = inputStateFromString(balanced);
        const inner = Microgrammar.fromDefinitions({
            left: "let",
            equals: " ",
            right: "(x y)",
            _whatever: RestOfInput,
        });
        const m: any = ClojureSexpContaining(inner.matcher).matchPrefix(is, {}, {});
        if (isSuccessfulMatch(m)) {
            const mmmm = m.match as any;
            assert(mmmm.$matched === balanced);
            assert(mmmm.block.left === "let");
            assert(mmmm.block.$valueMatches.left.$offset === 2);
            assert(mmmm.block.right === "(x y)");
            assert(mmmm.block.$valueMatches.right.$offset === 6);

        } else {
            assert.fail("Didn't match");
        }
    });

    function match(what: string) {
        const is = inputStateFromString(what);
        const m = ClojureSexp.matchPrefix(is, {}, {}) as PatternMatch;
        if (isSuccessfulMatch(m)) {
            const mmmm = m.match as any;
            assert(mmmm.$matched === what);
        } else {
            assert.fail("Didn't match");
        }
    }

    function shouldNotMatch(what: string) {
        const is = inputStateFromString(what);
        const m = ClojureSexp.matchPrefix(is, {}, {});
        assert(!isSuccessfulMatch(m));
    }

});
