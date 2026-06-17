---
term: "Effect Modification (Interaction)"
slug: "effect-modification"
shortDef: "Effect modification occurs when the magnitude of an exposure's effect on an outcome differs across levels of a third variable."
tags: ["epidemiology", "causal-inference", "modeling"]
related: ["confounding", "confounder-adjustment", "logistic-regression", "causal-inference", "relative-risk"]
---

**Effect modification** (closely related to statistical *interaction*) means the effect of an exposure genuinely varies depending on another variable — the modifier. For instance, a treatment might cut risk substantially in younger people but little in older people. Unlike confounding, effect modification is not a bias to be removed; it is a real feature of the data worth reporting, because it tells you *for whom* an exposure matters.

It matters in population science and **health equity** because average effects can mask important heterogeneity across age, sex, race/ethnicity, or socioeconomic groups. Identifying modifiers helps target interventions to those who benefit most and reveals where a one-size-fits-all program may fail.

A key subtlety is that effect modification is **scale-dependent**: an exposure can show interaction on the additive (risk-difference) scale but not the multiplicative (ratio) scale, or vice versa. Always state the scale. Another pitfall is confusing effect modification with confounding — modifiers are reported via stratified or interaction analyses, whereas confounders are adjusted away. Subgroup analyses also demand caution, since testing many subgroups inflates false positives.

For example, if a screening program reduces late-stage cancer risk by 5 percentage points in well-insured patients but by only 1 point in uninsured patients, insurance status modifies the program's effect.
