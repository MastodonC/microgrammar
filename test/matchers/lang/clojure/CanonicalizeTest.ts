import assert = require("power-assert");

import { ClojureLangHelper } from "../../../../src/matchers/lang/clojure/ClojureLangHelper";

describe("clojure canonicalize", () => {

    it("shouldn't change when no comments or whitespace", () => {
        const src =
            `(+ 1 1)`;
        const stripped = new ClojureLangHelper().canonicalize(src);
        assert(stripped === src);
    });

    it("should strip out syntactically unnecessary whitespace: space in {}", () => {
        const src =
            `#{ 1 }`;
        const stripped = new ClojureLangHelper().canonicalize(src);
        assert(stripped === `#{1}`);
    });

    it("should strip out comments and whitespace", () => {
        const src =
            `; this is a test
            ( +
                1       1)
            `;
        const expected =
            `(+ 1 1)`;
        const stripped = new ClojureLangHelper().canonicalize(src);
        assert(stripped === expected);
    });

    it("should strip out nested comments and whitespace", () => {
        const src =
            `; this is a test
            ( +
                1      ( +
                ; comment
                 1 1)    )
            `;
        const expected =
            `(+ 1 (+ 1 1))`;
        const stripped = new ClojureLangHelper().canonicalize(src);
        assert(stripped === expected);
    });

    it("should strip out multiple comments and whitespace", () => {
        const src =
            `; this is a test
             (  +
                ; comment
                1 ;comment
           1        )    `;
        const expected =
            `(+ 1 1)`;
        const stripped = new ClojureLangHelper().canonicalize(src);
        assert(stripped === expected);
    });

    it("don't strip whitespace inside strings", () => {
        const src =
            `(str "Some string     with white    space")`;
        const stripped = new ClojureLangHelper().canonicalize(src);
        assert(stripped === src);
    });

    it("isn't fooled by apparent comments within strings", () => {
        const src =
            `(str "Some  string with ; in   it")`;
        const stripped = new ClojureLangHelper().canonicalize(src);
        assert(stripped === src);
    });

});
