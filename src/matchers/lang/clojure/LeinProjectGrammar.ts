import { atLeastOne, zeroOrMore } from "../../../Rep"
import { Microgrammar } from "../../../Microgrammar"
import { Sexp } from "./Sexp"
import { ClojureLangHelper } from "./ClojureLangHelper"
import { ClojureVector } from "./ClojureBody"
import { optional } from "../../../../src/Ops";

export interface Exclude {
    group: string,
    name: string
}

export interface Dependency {
    group: string,
    name: string,
    version: string,
    //exclusions: Array<Exclude>
}

export interface Dependencies {
    dependencies: Array<Dependency>
}

export interface LeinProject {
    group: string,
    name: string,
    version: string,
    keywordValues: Map<string, any>,
    dependencies: Dependencies
}

export const alpha = /^[a-zA-Z.0-9\-]+/;

export const groupSlashName = {
    group: alpha,
    _s: "/",
    name: alpha
}

export const versionRexp = /^[0-9]+\.[0-9]+\.[0-9]+(?:-SNAPSHOT)?/;

export const keyword = /^:(?:[a-zA-Z.0-9\-]+\/)?[a-zA-Z.0-9\-]+/;

export const KeywordValue = {
    k: keyword,
    v: keyword
}

export const DependencyGrammar = Microgrammar.fromDefinitions<Dependency>({
    _start: `[`,
    _groupName: groupSlashName,
    group: ctx => ctx._groupName.group,
    name: ctx => ctx._groupName.name,
    _vstringstart: `"`,
    version: versionRexp,
    _vstringend: `"`,
    _end: `]`
}
)

export const DependenciesGrammar = Microgrammar.fromDefinitions<Dependencies>({
    _start: `[`,
    dependencies: atLeastOne(DependencyGrammar),
    _end: `]`
}
);

export const LeinProjectGrammar = Microgrammar.fromDefinitions<LeinProject>({
    _start: `(defproject `,
    _groupName: groupSlashName,
    group: ctx => ctx._groupName.group,
    name: ctx => ctx._groupName.name,
    _vstringstart: `"`,
    version: versionRexp,
    _vstringend: `"`,
    //keywordValues: zeroOrMore(KeywordValue),
    _deps: optional(`:dependencies`),
    dependencies: optional(DependenciesGrammar),
    _end: `)`
}
);


export function leinProject(src: string): LeinProject {
    return LeinProjectGrammar.firstMatch(new ClojureLangHelper().canonicalize(src));
}
