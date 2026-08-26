// T014: Contract test for ClaimStore acquire/renew/conflict behavior.
// Runs the shared behavior suite (T012) against every available adapter.

import { runAdapterContractSuites } from './claims-suite.ts';
import { FakeClaimStore } from '../../src/adapters/fakes/index.ts';

runAdapterContractSuites(() => new FakeClaimStore());
