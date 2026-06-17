---
term: "Causal Inference"
slug: "causal-inference"
shortDef: "Causal inference is the set of methods and assumptions used to estimate the effect that changing an exposure would have on an outcome, as distinct from mere statistical association."
tags: ["causal-inference", "epidemiology", "methods"]
related: ["confounding", "dag", "confounder-adjustment", "collider-bias", "selection-bias", "effect-modification"]
---

**Causal inference** asks a counterfactual question: what *would* the outcome be if we intervened to change the exposure, compared to if we did not? Because we can never observe both the treated and untreated version of the same individual (the "fundamental problem of causal inference"), causal effects are estimated by comparing groups under explicit assumptions — chiefly exchangeability (no unmeasured confounding), positivity, and consistency.

It is the core ambition of population science: the point of studying social and behavioral exposures is usually to guide interventions, which requires knowing causes, not just correlations. Randomized trials achieve exchangeability by design; observational studies must approximate it through tools like **confounder adjustment**, matching, inverse-probability weighting, instrumental variables, and **DAG**-guided analysis.

The defining pitfall is the slogan "correlation is not causation," yet stated assumptions can make causal claims from observational data defensible — or expose them as untenable. The failure mode is leaving assumptions implicit, so readers cannot judge whether **confounding**, **selection bias**, or reverse causation explains the result.

For example, claiming that a community nutrition program *reduces* cancer incidence requires arguing that participants and non-participants were exchangeable after adjustment — not merely that participants had lower incidence.
