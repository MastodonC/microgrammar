/**
 * States for Clojure language
 */

import { LangState } from "../LangStateMachine";

export const Normal = new LangState("normal", false, false);
export const DoubleString = new LangState("string", false, true);
export const SemiColonComment = new LangState(";comment", true, false);
