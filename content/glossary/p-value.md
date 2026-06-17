---
term: "P-value"
slug: "p-value"
shortDef: "A p-value is the probability of observing data at least as extreme as what was seen, assuming the null hypothesis is true."
tags: ["biostatistics", "inference", "hypothesis-testing"]
related: ["confidence-interval", "effect-modification", "logistic-regression", "relative-risk"]
---

A **p-value** quantifies how compatible the observed data are with a specified null hypothesis (typically "no effect"). It is computed as the probability, *under the null*, of a test statistic at least as extreme as the one observed. Small p-values indicate the data would be surprising if the null were true, which is taken as evidence against the null. The conventional 0.05 threshold is an arbitrary convention, not a law of nature.

P-values matter because they remain the dominant currency for declaring "statistical significance" across the health-science literature. But the p-value answers a narrow question and is frequently overinterpreted, so understanding what it is *not* is as important as what it is.

The pitfalls are numerous and consequential. A p-value is **not** the probability that the null hypothesis is true, nor the probability the result occurred by chance. It says nothing about effect size — a tiny, unimportant effect can be highly significant in a large sample, and an important effect can be non-significant in a small one. Multiple testing inflates false positives, and "p-hacking" (trying many analyses until p < 0.05) invalidates the interpretation. Report effect estimates and **confidence intervals** alongside, never a p-value alone.

For example, p = 0.04 for a dietary exposure does not mean a 96% chance the diet matters; it means data this extreme would occur 4% of the time if the diet had no effect.
