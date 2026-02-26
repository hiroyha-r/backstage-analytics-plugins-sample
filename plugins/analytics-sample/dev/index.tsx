import { createDevApp } from '@backstage/dev-utils';
import { Playground } from './Playground';
import { SampleAnalyticsApiFactory } from '../src/api';

createDevApp()
  .registerApi(SampleAnalyticsApiFactory)
  .addPage({
    element: <Playground />,
    title: 'Root Page',
    path: '/playground',
  })
  .render();
