import {
    analyticsApiRef,
    configApiRef,
    createApiFactory,
    identityApiRef,
} from '@backstage/core-plugin-api';
import { SampleAnalytics } from './SampleAnalytics';

export const SampleAnalyticsApiFactory = createApiFactory({
    api: analyticsApiRef,
    deps: { configApi: configApiRef, identityApi: identityApiRef },
    factory: ({ configApi, identityApi }) => 
        SampleAnalytics.fromConfig(configApi, { identityApi }),
});