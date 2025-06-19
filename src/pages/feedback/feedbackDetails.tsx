// FeedbackModal.tsx
import React from 'react';
import { Modal, Rate, Tag } from 'antd';
import type { FeedbackItemType } from '../../models/feedback/response';
import { type FeedbackStatusType } from '../../constants/consts';
import { formatDateTimeString } from './columns';

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
};

const FeedbackModal: React.FC<FeedbackModalProps> = ({ visible, feedback, onClose }) => {
  if (!feedback) return null;

  return (
    <Modal title="Feedback Details" open={visible} onCancel={onClose} footer={null} width={600}>
      <p><b>Comment:</b> {feedback.comment}</p>
      <p>
        <b>Rating:</b>{' '}
        <Rate disabled defaultValue={feedback.rating} style={{ color: '#faad14' }} />
      </p>
      <p>
        <b>Status:</b>{' '}
        {feedback.status && (
          <Tag color={statusColors[feedback.status as FeedbackStatusType] || 'default'}>
            {feedback.status}
          </Tag>
        )}
      </p>
      <p><b>Conference:</b> {feedback.conference?.title}</p>
      <p><b>Company:</b> {feedback.company?.name}</p>
      <p><b>Created By:</b> {feedback.createdBy?.fullName}</p>
      <p><b>Created At:</b> {formatDateTimeString(feedback.createdAt)}</p>
    </Modal>
  );
};

export default FeedbackModal;
