import React, { Suspense, lazy } from 'react';
import { Tabs, Spin } from 'antd';
import type { TabsProps } from 'antd';

// Lazy load the components
const FeedbackStatistics = lazy(() => import('../statistics'));
const ConferenceFeedbackList = lazy(() => import('../feedback'));

const LoadingSpinner = () => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
    <Spin size="large" tip="Loading..." />
  </div>
);

const items: TabsProps['items'] = [
  {
    key: 'statistics',
    label: 'Statistics',
    children: (
      <Suspense fallback={<LoadingSpinner />}>
        <FeedbackStatistics />
      </Suspense>
    ),
  },
  {
    key: 'conference-feedback',
    label: 'Conference Feedback',
    children: (
      <Suspense fallback={<LoadingSpinner />}>
        <ConferenceFeedbackList />
      </Suspense>
    ),
  },
];

const Home: React.FC = () => (
  <div>
    <Tabs
      defaultActiveKey="statistics"
      items={items}
      tabBarStyle={{ marginBottom: 32, fontWeight: 'bold', fontSize: 18 }}
      centered
    />
  </div>
);

export default Home;