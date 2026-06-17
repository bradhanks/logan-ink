---
title: "When an Odds Ratio Lies: Reading Effect Estimates Honestly"
slug: odds-ratios-honestly
kind: essay
publishedAt: 2026-05-20
excerpt: "The odds ratio is the workhorse of logistic regression, but it routinely overstates how much an exposure matters when the outcome is common. Here is how to read it honestly."
tldr: "An odds ratio approximates the relative risk only when the outcome is rare; for common outcomes it exaggerates the apparent effect. It is also non-collapsible, meaning it can shift when you add a covariate even with no confounding. Report odds ratios faithfully, but translate to risks—or fit a model that targets risk ratios or risk differences—when readers need to reason about probability."
tags: [epidemiology, biostatistics, odds-ratio, logistic-regression, causal-inference, methods]
collaborateCta: true
---

Almost every clinical and population-science paper I read reports an odds ratio, and almost none of them stop to ask whether the reader will interpret it correctly. The odds ratio (OR) is not wrong—it is a perfectly well-defined quantity—but it is widely *misread*, usually as if it were a relative risk. When the outcome is common, that mistake is not a rounding error. It can double the apparent strength of an association. This essay is about reading effect estimates honestly: what an OR actually measures, when it earns its reputation as a stand-in for relative risk, and when it quietly lies.

## Odds are not probabilities

Start with the two quantities that get conflated. A **probability** is the number of events divided by the total number of people at risk: if 20 of 100 people develop an outcome, the probability (risk) is 0.20. **Odds** are the number of events divided by the number of non-events: 20 events against 80 non-events gives odds of 20/80 = 0.25. The relationship is fixed: odds = p / (1 − p). When p is small, odds and probability are nearly equal (at p = 0.01, odds ≈ 0.0101). As p climbs, they diverge sharply—at p = 0.5 the odds are 1.0, and at p = 0.9 the odds are 9.

An **odds ratio** divides the odds in the exposed group by the odds in the unexposed group. A **relative risk** (or risk ratio, RR) divides the probability in the exposed group by the probability in the unexposed. Because odds inflate faster than probabilities as risk rises, the OR is always farther from the null value of 1 than the corresponding RR (when both are above 1; below 1, the OR sits farther toward zero). The OR and RR agree only in the limit where the outcome is rare in both groups—the classic "rare disease assumption" (Rothman, Greenland & Lash, *Modern Epidemiology*, 3rd ed., 2008; 4th ed., 2021).

## A worked intuition (hypothetical, illustrative only)

Let me make this concrete with a deliberately made-up example—no real study, just arithmetic to build intuition.

Imagine a hypothetical cohort of 200 people, 100 exposed and 100 unexposed to some factor. Among the exposed, 60 develop the outcome; among the unexposed, 40 do.

- Risk in exposed = 60/100 = 0.60. Risk in unexposed = 40/100 = 0.40.
- **Relative risk** = 0.60 / 0.40 = **1.5**. The exposure raises risk by half.
- Odds in exposed = 60/40 = 1.5. Odds in unexposed = 40/60 = 0.667.
- **Odds ratio** = 1.5 / 0.667 = **2.25**.

Same data, same association, but the OR (2.25) is far more dramatic than the RR (1.5). A reader who hears "the odds were more than doubled" walks away believing the effect is much larger than a 50% increase in risk. With a common outcome like this, reporting only the OR—and letting it be read as relative risk—materially misleads.

Now rerun the intuition with a rare outcome: 6 events among the exposed and 4 among the unexposed (out of 100 each). Risks are 0.06 and 0.04, so RR = 1.5. Odds are 6/94 and 4/96, giving OR ≈ 1.53. Here the OR and RR nearly coincide, because dividing by 94 and 96 is almost like dividing by 100. That is the whole content of the rare-disease assumption: when non-events dominate, odds and probabilities converge.

## Why the gap is not a curiosity

This is not a niche concern. The canonical treatment is Davies, Crombie & Tavakoli, "When can odds ratios mislead?" (*BMJ* 1998;316:989–991), which shows that for common outcomes the OR can dramatically overstate the relative risk, and that the discrepancy grows with baseline risk. In fields where outcomes are frequent—obesity, hypertension, vaccination uptake, depression screening—an uncritically reported OR routinely exaggerates effects. In cancer-prevention work, where we often study behaviors and uptake outcomes that are anything but rare, this matters constantly. An OR of 2 for completing a vaccine series does not mean the exposed group is "twice as likely" to complete it.

## Non-collapsibility: the OR can move without confounding

Here is the property that surprises even careful analysts. The odds ratio is **non-collapsible**: the marginal (unadjusted) OR and the conditional (covariate-adjusted) OR can differ *even when the covariate is not a confounder*—even when it is unassociated with the exposure and introduces no bias.

This is fundamentally different from confounding. With a confounder, the unadjusted estimate is *biased*, and adjustment moves it toward the truth. With non-collapsibility, both the marginal and conditional ORs are valid answers to *different questions*: the conditional OR is the effect within strata of the covariate, and the marginal OR is the population-averaged effect. Because of the nonlinearity of the odds transformation, averaging conditional ORs over a strong risk factor does not return the conditional value—it pulls the marginal OR toward the null. The risk ratio and risk difference are collapsible under the same conditions; the OR (and the hazard ratio) are not (Hernán & Robins, *Causal Inference: What If*; Greenland, Pearl & Robins, "Causal Diagrams for Epidemiologic Research," *Epidemiology* 1999;10:37–48, on collapsibility).

The practical lesson: when you add a strong prognostic covariate to a logistic model and the OR shifts, do not reflexively call it confounding control. Check whether the covariate is actually associated with the exposure. If it is not, the movement is non-collapsibility, and the "change in estimate" rule for confounder selection—watching whether the coefficient moves by, say, 10%—is unreliable for ORs precisely because the estimate can move for reasons that have nothing to do with bias.

## Why logistic regression hands you ORs anyway

If the OR is so easy to misread, why is it everywhere? Because logistic regression is everywhere, and the exponentiated coefficients of a logistic model *are* odds ratios. Logistic regression earned its place for good reasons: it constrains predicted probabilities to (0, 1), it handles case-control data natively (the OR is the one effect measure estimable from case-control sampling), and it is numerically stable and well understood. The OR is the price of those conveniences, not a deliberate choice to report odds.

You are not stuck with it. When you want a risk ratio or risk difference from cohort or cross-sectional data, you have options:

- **Log-binomial regression** estimates the RR directly, though it can fail to converge.
- **Poisson regression with robust (sandwich) variance** is a reliable fallback for the RR (Zou's modified Poisson approach, *Am J Epidemiol* 2004;159:702–706).
- **Marginal standardization / g-computation**: fit your logistic model, predict each person's risk under "exposed" and "unexposed," average, and take the ratio or difference. This recovers a marginal RR or risk difference while keeping logistic regression's flexibility, and it sidesteps non-collapsibility because risks are collapsible.

## Communicating an OR honestly

You do not have to abandon the OR. You have to refuse to let it impersonate a relative risk. A few habits:

1. **State the baseline risk.** An OR is uninterpretable as an effect on risk without it. "OR 2.25" means something very different at 4% baseline than at 40%.
2. **Translate to absolute terms when the audience reasons about people.** Clinicians and policymakers think in risks and numbers-needed-to-treat, not odds. Convert, or report a standardized risk difference alongside the OR.
3. **Do not say "times more likely" for an OR** unless the outcome is genuinely rare. Say "the odds were 2.25 times as high," which is literally true, or better, report the RR you actually estimated.
4. **Be explicit about marginal versus conditional.** If you adjusted, say what the OR is conditional on, and remember it is not directly comparable to an unadjusted or differently-adjusted OR from another paper.
5. **Prefer RR or risk difference when the outcome is common and the question is causal/public-health.** Reserve the OR for case-control designs and rare outcomes, where it is the right and honest tool.

The odds ratio is not a liar by nature. It lies when we let it borrow the relative risk's intuition without earning it. Read it for what it is—a ratio of odds, farther from the null than the risk ratio, non-collapsible, and exact only for case-control and rare-outcome settings—and it tells the truth.

## Let's strengthen your effect estimates together

If you are working on a manuscript and want a second set of eyes on how you specify and report effects—whether an OR is the right measure, whether to move to log-binomial or modified-Poisson or marginal standardization, or how to communicate estimates so reviewers and readers trust them—I would genuinely enjoy helping. I work in cancer-prevention and population-science research, and a lot of what I do is making the analytic story clear and defensible. Reach out; I am happy to dig into your model and help you present effects in a way that is both rigorous and honest.
