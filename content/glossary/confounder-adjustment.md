---
term: "Confounder Adjustment"
slug: "confounder-adjustment"
shortDef: "Confounder adjustment is the use of statistical or design methods — such as stratification, regression, matching, or weighting — to remove the distortion a confounder introduces into an exposure–outcome estimate."
tags: ["causal-inference", "epidemiology", "methods"]
related: ["confounding", "dag", "logistic-regression", "causal-inference", "collider-bias"]
---

**Confounder adjustment** is how observational studies attempt to isolate the effect of an exposure from the influence of common causes. Design-stage approaches include restriction and matching; analysis-stage approaches include stratification, multivariable **regression**, propensity-score methods, and inverse-probability weighting. The goal is to compare exposed and unexposed groups that are alike with respect to the confounders, approximating the exchangeability a randomized trial achieves by design.

It is fundamental to **causal inference** in population science, where randomization is often impossible and confounding is the chief obstacle to credible effect estimates. Done well, adjustment lets a study report an effect that is "controlled for" known confounders.

The pitfalls are serious. Adjustment only handles *measured* confounders, so residual and unmeasured confounding can remain. Crucially, adjusting for the wrong variable backfires: conditioning on a **mediator** blocks part of the real effect, and conditioning on a **collider** opens new bias. This is why variable selection should follow a causal model (a **DAG**) rather than automated or significance-based procedures.

For example, to estimate whether a fitness program lowers cancer risk, a study might adjust for age, smoking, and income — but adjusting for "body weight after the program" would be a mistake, since weight may be on the causal pathway.
