import assert = require("power-assert");

import { leinProject, Dependencies, Dependency } from "../../../../../src/matchers/lang/clojure/LeinProjectGrammar";

describe("Lein project reading", () => {

    it("should read project group, name and version", () => {
        const src = `(defproject org.example/sample "1.0.0")`;
        const proj = leinProject(src);
        assert(proj.group === "org.example");
        assert(proj.name === "sample");
        assert(proj.version === "1.0.0");
    });

    it("should read project group, name, version and dependencies", () => {
        const src = `(defproject org.example/sample "1.0.0"
                       :dependencies [[org.clojure/clojure "1.3.0"]]
                     )`;
        const proj = leinProject(src);
        assert(proj.group === "org.example");
        assert(proj.name === "sample");
        assert(proj.version === "1.0.0");
        //assert(proj.keywordValues === "");
        assert(proj.dependencies === { dependencies: new Array<Dependency>({ group: "org.clojure", name: "clojure", version: "1.3.0" }) });
    });

});
