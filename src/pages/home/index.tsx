import React from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import FeedbackStatistics from '../statistics';
import ConferenceFeedbackList from '../feedback';

const items: TabsProps['items'] = [
  {
    key: 'statistics',
    label: 'Statistics',
    children: <FeedbackStatistics />,
  },
  {
    key: 'conference-feedback',
    label: 'Conference Feedback',
    children: <ConferenceFeedbackList />,
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