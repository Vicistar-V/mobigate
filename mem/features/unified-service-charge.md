---
name: Unified Service Charge / Processing Fee
description: Service Charge and Processing Fee are a single charge, debited from both Community and Candidate wallets
type: feature
---
"Service Charge" and "Processing Fee" are the SAME unified charge across the
nomination/election flows. There is only ONE configurable rate
(`mobigateNominationConfig.serviceChargePercent`, range 15–30%).

Debit model:
- Candidate's Wallet is debited: `nominationFee + serviceCharge`
- Community Wallet is debited: `serviceCharge` (separately)
- Mobigate receives: `serviceCharge × 2` (collected from both wallets)
- Community net receives: `nominationFee − serviceCharge`

Code surface:
- `calculateTotalNominationCost()` in `src/data/nominationFeesData.ts` returns
  `candidateDebited`, `communityDebited`, `serviceCharge` (alias `processingFee`),
  `communityReceives`, `mobigateReceives`.
- UI must never show "Processing Fee" as a separate row from "Service Charge".
  Always display the single line: "Service Charge / Processing Fee ({rate}%)".
- Insufficient-balance checks on the candidate use `candidateDebited`, NOT
  `totalDebited`.
