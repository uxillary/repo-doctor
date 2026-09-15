import type { Rule } from "../core/types.js";
import { licensePresenceRule } from "./documentation/license-presence.js";
import { readmePresenceRule } from "./documentation/readme-presence.js";

export const defaultRules: Rule[] = [readmePresenceRule, licensePresenceRule];
