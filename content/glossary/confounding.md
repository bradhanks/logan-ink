---
term: "Confounding"
slug: "confounding"
shortDef: "Confounding is a distortion of an exposure–outcome association caused by a third variable that influences both the exposure and the outcome."
tags: ["causal-inference", "epidemiology", "bias"]
related: ["confounder-adjustment", "collider-bias", "selection-bias", "dag", "causal-inference", "effect-modification"]
---

**Confounding** occurs when a variable is a common cause of both the exposure and the outcome, creating a non-causal (spurious) component in their observed association. Because the confounder is unevenly distributed across exposure groups and independently affects the outcome, the crude association mixes the true effect with the confounder's effect. Classically, a confounder must be associated with the exposure, be a cause of the outcome, and not lie on the causal pathway between them.

Confounding is the central threat to **causal inference** from observational data, which dominates population science. It is why an association between coffee drinking and lung cancer can appear even if coffee is harmless — smokers drink more coffee and smoking causes cancer, so smoking confounds the relationship.

The main pitfall is "adjusting for everything." Controlling for a variable on the causal pathway (a mediator) or for a **collider** introduces bias rather than removing it. Deciding what to adjust for should be guided by causal reasoning — ideally a **directed acyclic graph** — not by which variables happen to be statistically significant.

For example, in a hypothetical study linking neighborhood walkability to lower cancer rates, household income could confound the result if wealthier people both live in walkable areas and have better screening access.
