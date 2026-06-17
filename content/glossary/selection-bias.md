---
term: "Selection Bias"
slug: "selection-bias"
shortDef: "Selection bias is a systematic error that arises when the people included in (or retained by) a study differ from the target population in ways related to both exposure and outcome."
tags: ["epidemiology", "bias", "study-design"]
related: ["collider-bias", "confounding", "dag", "causal-inference", "incidence-vs-prevalence"]
---

**Selection bias** occurs when the procedure that determines who enters or stays in a study distorts the exposure–outcome relationship. It can enter at recruitment (who volunteers, who is reachable) or during follow-up (who drops out). The bias is consequential when selection depends jointly on the exposure and the outcome — formally, when the analysis conditions on a **collider**.

It matters acutely in population science because many data sources — clinic populations, registries, online surveys, surviving patients — are non-random samples of the public. Findings from a biased sample may not transport to the population the research aims to serve, undermining both internal and external validity.

A frequent pitfall is treating a convenience sample as if it were representative, or ignoring **differential loss to follow-up** in a cohort. Healthy-volunteer effects, self-selection, and survivor bias are all named species of selection bias. Remedies include population-based sampling, tracking and reporting dropout, and weighting methods such as inverse-probability-of-selection weights.

For example, recruiting cancer-screening study participants only from a wellness fair could oversample health-conscious people, biasing estimates of how screening relates to outcomes in the broader community.
