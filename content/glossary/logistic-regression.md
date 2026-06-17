---
term: "Logistic Regression"
slug: "logistic-regression"
shortDef: "Logistic regression is a regression model for a binary outcome that estimates the log-odds of the outcome as a linear function of predictors, yielding adjusted odds ratios."
tags: ["biostatistics", "modeling", "epidemiology"]
related: ["odds-ratio", "confounder-adjustment", "confounding", "effect-modification", "p-value"]
---

**Logistic regression** models a yes/no outcome (disease/no disease, screened/not screened) by relating the log-odds of the outcome — the *logit* — to a linear combination of predictors. Because the logit can range over all real numbers while a probability is bounded between 0 and 1, the logistic link keeps predicted probabilities valid. Exponentiating a coefficient gives an **odds ratio** for a one-unit change in that predictor, holding the others fixed.

It is a workhorse of population science because most epidemiological outcomes are binary and because it provides a natural way to perform **confounder adjustment**: including covariates yields the odds ratio for the exposure adjusted for those covariates. Interaction terms let it model **effect modification**, and it underpins risk-prediction tools.

A central pitfall is interpreting adjusted odds ratios as risk ratios when the outcome is common — the OR overstates the relative risk in that case. Other cautions: associations are not automatically causal just because a model is "adjusted"; including a collider or mediator as a covariate introduces bias; and sparse data or perfect separation can make estimates unstable.

For example, regressing late-stage diagnosis on screening status plus age and income would return an odds ratio for screening adjusted for those confounders.
