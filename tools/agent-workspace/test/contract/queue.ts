// T032: Contract test for IntegrationQueue (US3): dependency order,
// one-at-a-time incorporation, verification rerun per FR-011, and semantic
// conflicts requiring a decision per FR-012.

import { runQueueBehaviorSuite } from './queue-suite.ts';
import { FakeIntegrationQueue } from '../../src/adapters/fakes/index.ts';

runQueueBehaviorSuite('fake-integration-queue', () => new FakeIntegrationQueue());