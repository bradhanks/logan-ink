---
term: "Odds Ratio"
slug: "odds-ratio"
shortDef: "The odds ratio (OR) is the ratio of the odds of an outcome in an exposed group to the odds in an unexposed group, measuring the strength of association between an exposure and an outcome."
tags: ["measures-of-association", "epidemiology", "biostatistics"]
related: ["relative-risk", "risk-difference", "logistic-regression", "confidence-interval", "confounding"]
---

The **odds ratio (OR)** compares the *odds* of an event between two groups. Odds are the probability of an event divided by the probability of its complement (p / (1 − p)). If the odds of disease are 0.25 among the exposed and 0.10 among the unexposed, the OR is 2.5 — exposed individuals have 2.5 times the odds of disease. An OR of 1 means no association; above 1 suggests a positive association, below 1 a protective one.

In population science the OR is the natural effect measure for **case-control studies**, where outcomes are sampled rather than followed forward, so risks cannot be estimated directly. It is also the coefficient that **logistic regression** estimates (after exponentiating), which is why it appears throughout the epidemiological literature.

A common pitfall is treating the OR as if it were a risk ratio. When the outcome is rare (roughly <10%), the OR approximates the relative risk, but for common outcomes the OR exaggerates the apparent effect — an OR of 2.5 can correspond to a much smaller relative risk. Always check outcome prevalence before interpreting an OR as a risk.

For example, in a hypothetical case-control study of a screening behavior and a cancer outcome, 40 of 100 cases versus 20 of 100 controls reported the exposure, giving odds of 40/60 and 20/80 and an OR of (40/60)/(20/80) ≈ 2.67.
