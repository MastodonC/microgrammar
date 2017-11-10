import assert = require("power-assert");

import { ClojureLangHelper } from "../../../../src/matchers/lang/clojure/ClojureLangHelper";

describe("Clojure whitespace stripping", () => {

    it("shouldn't change when no whitespace", () => {
        const src =
            `(+ 1 1)`;
        const stripped = new ClojureLangHelper().stripWhitespace(src);
        assert(stripped === src);
    });

    it("should strip leading newline", () => {
        const src =
            `(+ 1 1)`;
        const stripped = new ClojureLangHelper().stripWhitespace("\n" + src);
        assert(stripped === src);
    });

    it("should strip leading tabs and drop trailing newline", () => {
        const src =
            `(+ 1 1)`;
        const stripped = new ClojureLangHelper().stripWhitespace("\t\t" + src + "\n");
        assert(stripped === src);
    });

    it("should replace 3 unnecessary spaces with none", () => {
        const src =
            `(+ 1 1   )`;
        const stripped = new ClojureLangHelper().stripWhitespace(src);
        assert(stripped === "(+ 1 1)");
    });

});
