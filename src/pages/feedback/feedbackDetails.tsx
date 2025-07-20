import React, { Suspense, lazy } from 'react';
import { Modal, Rate, Tag, Spin } from 'antd';
import type { FeedbackItemType } from '../../models/feedback/response';
import { type FeedbackStatusType } from '../../constants/consts';
import type { FeedbackAnalysisModel } from '../../services/FeedbackAnalysisService';
import { formatDateTimeString } from '../../constants/dateformatter';

// Lazy load the chart component
const SentimentChart = lazy(() => import('../../components/SentimentChart'));

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

const FeedbackModal: React.FC<FeedbackModalProps> = ({ visible, feedback, onClose, feedbackAnalysis }) => {
  if (!feedback) return null;

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
      <div style={{ marginBottom: 16 }}><b>Company:</b> {feedback.companyId?.name}</div>
      <div style={{ marginBottom: 16 }}><b>Created By:</b> {feedback.createdBy?.fullName}</div>
      <div style={{ marginBottom: 24 }}><b>Created At:</b> {formatDateTimeString(feedback.createdAt)}</div>
      
      {feedbackAnalysis && (
        <Suspense fallback={<div style={{ textAlign: 'center', padding: '2rem' }}><Spin size="large" tip="Loading chart..." /></div>}>
          <SentimentChart feedbackAnalysis={feedbackAnalysis} />
        </Suspense>
      )}
    </Modal>
  );
};

export default FeedbackModal;