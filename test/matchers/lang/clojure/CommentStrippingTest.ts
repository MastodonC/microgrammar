import assert = require("power-assert");

import { ClojureLangHelper } from "../../../../src/matchers/lang/clojure/ClojureLangHelper";

describe("Clojure comment stripping", () => {

    it("shouldn't change when no comments", () => {
        const src =
            `(inc 100)`;
        const stripped = new ClojureLangHelper().stripComments(src);
        assert(stripped === src);
    });

    it("should strip out trailing comment", () => {
        const comment = "; commenting";
        const block =
            `(+ 1 1)
`;
        const src = comment + "\n" + block;
        const stripped = new ClojureLangHelper().stripComments(src);
        assert(stripped === block);
    });

    it("should strip multiple comments", () => {
        const comment1 = "; this is a test";
        const comment2 = "; this is another test";
        const block =
            `(+ 1 1)
`;
        const src = comment1 + "\n" + comment2 + "\n" + block;
        const stripped = new ClojureLangHelper().stripComments(src);
        assert(stripped === block);
    });

});
