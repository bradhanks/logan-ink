---
title: "Why Reviewers Reward Design, Not Just Data"
slug: design-gets-papers-accepted
kind: essay
publishedAt: 2026-06-03
excerpt: "Reviewers accept manuscripts they can trust, and trust comes from a clearly specified causal question, a defensible design, and honest sensitivity analyses—not from a bigger dataset or a flashier model."
tldr: "Papers get accepted when reviewers can trust the inference: a pre-specified causal question, a DAG that justifies confounder choices, a stated analysis plan, and sensitivity analyses that test the conclusion's fragility. A sophisticated-but-honest design beats a flashy-but-fragile one because it lets reviewers see where the result could break and confirm that it doesn't."
tags: [study-design, causal-inference, DAGs, confounding, peer-review, sensitivity-analysis, population-science]
collaborateCta: true
---

The most useful thing I have learned helping with population-science research is that reviewers are not primarily evaluating your result. They are evaluating whether they can *believe* it. A striking association with a small p-value, presented without a clear design, invites suspicion: what was adjusted for, and why those variables? Was the analysis chosen before or after seeing which version gave the cleanest answer? Could one unmeasured factor explain the whole thing? A manuscript that answers those questions before they are asked reads as trustworthy, and trustworthy manuscripts get accepted. This essay is about why design—not data volume, not model novelty—is what earns that trust.

I want to be careful about my own footing here. I am an undergraduate doing population-science and cancer-prevention research, and my role is mostly on the analytic and technical side—building DAGs, helping specify regressions, running and documenting sensitivity analyses. So I am not writing as a senior author who has shepherded dozens of papers through review. I am writing about what I have repeatedly seen reviewers and experienced researchers value, and why those preferences make methodological sense.

## Trust comes from a pre-specified causal question

The first move in a defensible paper is stating, in plain language, the causal question—or stating plainly that the aim is descriptive or predictive, not causal. Vagueness here is where credibility leaks. "We examined factors associated with HPV-vaccination completion" can mean a dozen different studies with a dozen different correct adjustment sets. Naming the estimand—the specific effect of a specific exposure on a specific outcome in a specific population—tells the reviewer what to check, and it disciplines every later choice. Hernán and Robins make this point forcefully in *Causal Inference: What If*: you cannot adjust correctly for confounding until you have said what causal contrast you are after. A clear question is not pedantry; it is the thing that makes the rest of the analysis checkable.

## A DAG turns confounder selection from taste into argument

The single most persuasive page in a methods-forward manuscript is often a directed acyclic graph (DAG). A DAG encodes your assumptions about how variables cause one another, and from those assumptions it tells you, by explicit rules, which variables to adjust for and which to leave alone (Pearl; Greenland, Pearl & Robins, "Causal Diagrams for Epidemiologic Research," *Epidemiology* 1999;10:37–48). This matters because the instinct to "adjust for everything available" is actively harmful:

- **Confounders** (common causes of exposure and outcome) must be controlled—failing to do so biases the estimate.
- **Mediators** (on the causal path from exposure to outcome) must *not* be controlled if you want the total effect—adjusting for them blocks part of the very effect you are estimating.
- **Colliders** (common effects of two variables) must *not* be controlled—conditioning on them can *create* an association that does not exist (collider/selection bias).

"We adjusted for age, income, and insurance because the DAG identifies them as a sufficient adjustment set, and we deliberately did not adjust for [a downstream variable] because it is a mediator" is an argument a reviewer can interrogate and accept. A bare list of covariates is just a list. The DAG converts confounder selection from personal taste into a stated, falsifiable claim—and reviewers reward claims they can evaluate over assertions they have to take on faith.

This is also why the "change-in-estimate" approach to picking confounders—keep a variable if it moves the coefficient by some threshold—should be used cautiously. As I have written elsewhere, effect measures like the odds ratio are non-collapsible, so a coefficient can move for reasons that have nothing to do with confounding. A DAG selects adjustment variables by their causal role, not by how much they happen to shift the estimate.

## State the analysis before the data talk back

Reviewers have learned to be wary of analytic flexibility—the quiet, often unconscious process of trying several models and reporting the one that "worked." The defense is pre-specification: say, before the analysis or at least before the reader, what the primary model is, what the outcome and exposure definitions are, how continuous variables are handled, and what counts as the primary result versus exploration. Pre-registration is the strongest version of this; even without a formal registry, a clearly stated analysis plan in the manuscript signals that the headline result was not cherry-picked. When I help label analyses honestly as confirmatory versus exploratory, the paper does not get weaker—it gets more believable, because the reader can calibrate how much to trust each number.

## Effect modification: report it where it is real, do not manufacture it

Subgroups are where flashy-but-fragile papers go to die. Splitting the data many ways until one subgroup reaches significance produces findings that do not replicate, and reviewers know it. The disciplined alternative is to decide in advance which effect modifiers are scientifically motivated—say, whether a vaccination intervention works differently by age or by rurality—and to test them with interaction terms rather than a parade of subgroup analyses, reporting the interaction estimate and its uncertainty. Genuine effect modification is important scientific information and worth presenting carefully; modification mined post hoc is noise wearing a lab coat. Distinguishing the two, openly, is exactly the kind of honesty that builds reviewer trust.

## Missing data: handle it, don't hide it

How a manuscript treats missing data is a fast tell of its seriousness. The default in too many analyses is complete-case analysis by silent omission—drop anyone with a missing value and never mention it. That can bias results badly unless data are missing completely at random, which is rarely defensible. A credible paper states the extent and pattern of missingness, reasons about the missingness mechanism (missing completely at random, at random, or not at random), and uses an appropriate method—often multiple imputation—while being candid that no method can fully rescue data that are missing not at random (Rubin; Little & Rubin, *Statistical Analysis with Missing Data*, 3rd ed., Wiley, 2019). Reviewers do not expect perfection here. They expect that you saw the problem, addressed it reasonably, and told them what you did.

## Sensitivity analysis: show where it could break

The move that most separates a robust manuscript from a fragile one is the sensitivity analysis. A single point estimate says "here is my answer." A sensitivity analysis says "here is my answer, and here is how hard I tried to break it, and it held." That is a fundamentally more trustworthy claim. Useful forms include: varying the adjustment set, trying alternative outcome or exposure definitions, testing different missing-data assumptions, and—powerfully—quantifying robustness to unmeasured confounding, for example with an E-value, which states how strong an unmeasured confounder would have to be to explain away the result (VanderWeele & Ding, "Sensitivity Analysis in Observational Research: Introducing the E-Value," *Ann Intern Med* 2017). When a paper shows that its conclusion survives reasonable perturbations, the reviewer's residual doubt shrinks. When it doesn't, you have learned something important before a reviewer—or a reader—learns it for you.

## Sophisticated-but-honest beats flashy-but-fragile

Put these together and the pattern is clear. A flashy paper leads with a dramatic estimate and a novel model and leaves the design implicit. A sophisticated-but-honest paper leads with a clear question, shows its causal assumptions in a DAG, justifies its adjustments, states its plan, reports modification and missingness candidly, and stress-tests the result. The second paper often reports a *more modest* estimate—because honest handling of confounding and uncertainty usually shrinks effects—and it is far more likely to be accepted, because the reviewer can trace the inference from assumption to conclusion and find no place where it quietly cheats. Reviewers reward design because design is what makes a result *checkable*, and checkable is the closest thing to true that a single study can offer.

## Let's strengthen the analytic side of your manuscript

If you are preparing a population-science or cancer-prevention paper and want help on the technical spine of it—drawing and defending a DAG, choosing and justifying your adjustment set, specifying the regression, planning the missing-data approach, or designing sensitivity analyses that show your result holds—I would be glad to help. This is the work I most enjoy, and I think it is where a paper's odds of acceptance are quietly won. I am working toward a top graduate program in cancer prevention and population science, and collaborating on real analyses is how I learn and contribute. Reach out, and let's make the inference in your manuscript something a reviewer can trust.
