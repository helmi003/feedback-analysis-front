import React from 'react';
import { Modal, Rate, Tag, Tooltip, type TooltipProps } from 'antd';
import type { FeedbackItemType } from '../../models/feedback/response';
import { type FeedbackStatusType } from '../../constants/consts';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts';
import type { FeedbackAnalysisModel } from '../../services/FeedbackAnalysisService';
import { formatDateTimeString } from '../../constants/dateformatter';

const statusColors: Record<FeedbackStatusType, string> = {
  excellent: 'green',
  good: 'blue',
  neutral: 'gold',
  bad: 'orange',
  terrible: 'red',
};

type FeedbackModalProps = {
  visible: boolean;
  feedback: FeedbackItemType | null;
  onClose: () => void;
  feedbackAnalysis: FeedbackAnalysisModel | null;
};

const colors = ['green', 'orange', 'red'];

const FeedbackModal: React.FC<FeedbackModalProps> = ({ visible, feedback, onClose, feedbackAnalysis }) => {
  if (!feedback) return null;
  
  const chartData = feedbackAnalysis ? [
    { name: 'Positive', value: feedbackAnalysis.Positive },
    { name: 'Neutral', value: feedbackAnalysis.Neutral },
    { name: 'Negative', value: feedbackAnalysis.Negative }
  ] : [];

  return (
    <Modal 
      title={<div style={{ textAlign: 'center' }}>Feedback Details</div>} 
      open={visible} 
      onCancel={onClose} 
      footer={null} 
      width={600}
      destroyOnClose
    >
      <div style={{ marginBottom: 16 }}><b>Comment:</b> {feedback.comment}</div>
      <div style={{ marginBottom: 16 }}>
        <b>Rating:</b>{' '}
        <Rate disabled defaultValue={feedback.rating} style={{ color: '#faad14', marginLeft: 8 }} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <b>Status:</b>{' '}
        {feedback.status && (
          <Tag 
            color={statusColors[feedback.status as FeedbackStatusType] || 'default'}
            style={{ marginLeft: 8 }}
          >
            {feedback.status}
          </Tag>
        )}
      </div>
      <div style={{ marginBottom: 16 }}><b>Conference:</b> {feedback.conference?.title}</div>
      <div style={{ marginBottom: 16 }}><b>Company:</b> {feedback.company?.name}</div>
      <div style={{ marginBottom: 16 }}><b>Created By:</b> {feedback.createdBy?.fullName}</div>
      <div style={{ marginBottom: 24 }}><b>Created At:</b> {formatDateTimeString(feedback.createdAt)}</div>
      
      {feedbackAnalysis && (
        <div style={{ marginTop: 40 }}>
          <h3 style={{ textAlign: 'center', marginBottom: 24 }}>Sentiment Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={colors[index % colors.length]} 
                    stroke={colors[index % colors.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </Modal>
  );
};

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0];
  const color = data.color;

  return (
    <div style={{
      backgroundColor: color,
      padding: '8px 12px',
      borderRadius: '8px',
      color: 'white',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
    }}>
      <p style={{ margin: 0, fontWeight: 'bold' }}>{data.name}</p>
      <p style={{ margin: 0 }}>{data.value}%</p>
    </div>
  );
};

export default FeedbackModal;