# Submission Audit — v0.12.41

## Rule verification

- Current HP is the submission threshold: **PASS**
- 0 HP threshold is 0: **PASS**
- Body-part damage persists after release: **PASS**
- Reapplying a hold can tap immediately once accumulated damage reaches current HP: **PASS**
- Fresh late-match hold can tap on its first successful application when pressure reaches current HP: **PASS**
- CPU Auto Counter recognises critically threatening submissions: **PASS**
- CPU banks setup pressure on early signature holds without blindly emptying its hand: **PASS**
- CPU prefers an immediate submission finish over a low-probability pin: **PASS**

## Automated certification

- Tests: **190 / 190 passed**
- Validation: **50 Superstars / 50 decks / 432 gameplay cards / 0 orphans / 0 issues**
- Counter-chain audit: **2,450 matches / 0 stalls / 730 depth-2+ / 0 non-Punch-Elbow depth-2+**
- Standard balance: **2,450 matches / 0 stalls / 24.80 average turns / 2,180 pins / 270 submissions**
- Deep balance: **24,500 matches / 0 stalls / 24.86 average turns / 24 median turns**
- Deep finishes: **21884 pins (89.3%) / 2616 submissions (10.7%)**
- P1 win rate: **48.44%**
- Winner HP: **32.7% average / 30.2% median**

## CM Punk spot check

Across 980 deep-sim matches, CM Punk recorded **167 submission wins** and **223 pin wins**. Persistent Anaconda Vise damage therefore remains a meaningful finish path while behaving as early-match setup when the opponent still has substantial HP.

No Superstar/card/deck numbers were changed in this submission-system pass. Any roster balance response should be handled separately after iPhone playtesting.
