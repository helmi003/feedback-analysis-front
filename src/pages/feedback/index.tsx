import React, { useState, useMemo } from 'react';
import { Table } from 'antd';
import useFetchFeedback from '../../services/useFetchFeedback';
import type { FeedbackItemType } from '../../models/feedback/response';
import { type FeedbackStatusType } from '../../constants/consts';
import { getColumns } from './columns';
import FeedbackModal from './feedbackDetails';
import { feedbackAnalysisService, type FeedbackAnalysisModel } from '../../services/feedbackAnalysisService';

const truncate = (text: string, length = 20) =>
  text.length > length ? text.slice(0, length) + '...' : text;

const ratingOptions = [1, 2, 3, 4, 5];

const ConferenceFeedbackList: React.FC = () => {
  const {
    response,
    handleTableChange,
    handleSearchChange,
    handleRatingChange,
    handleStatusChange,
    handleCompanyChange,
    handleConferenceChange,
    searchTerm,
    filterRating,
    filterStatus,
    filterCompany,
    filterConference
  } = useFetchFeedback();

  const loadingTable = response.isLoading || response.isError || response.isFetching;

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalFeedback, setModalFeedback] = useState<FeedbackItemType | null>(null);

  // Filter and search the data client-side (remove this if you want server-side filtering)
  const filteredData = useMemo(() => {
    if (!response.data?.docs) return [];
    return response.data.docs;
  }, [response.data?.docs]);

  const onAnalyzeSentiment = async (comment: string) => {
  alert(`Analyze sentiment for: "${comment}"`);
  try {
    const res = await feedbackAnalysisService.getAnalysis(comment);
    // const data = res.data;
    console.log('Sentiment Analysis Result:', res);
  } catch (error) {
    console.error('Error', error);
  }
};



  const onViewMore = (feedback: FeedbackItemType) => {
    setModalFeedback(feedback);
    setModalVisible(true);
  };

  const statusColors: Record<FeedbackStatusType, string> = {
    excellent: 'green',
    good: 'blue',
    neutral: 'gold',
    bad: 'orange',
    terrible: 'red',
  };

  const columns = getColumns({
    searchTerm,
    setSearchTerm: handleSearchChange,
    filterRating,
    setFilterRating: handleRatingChange,
    filterStatus,
    setFilterStatus: handleStatusChange,
    filterCompany,
    setFilterCompany: handleCompanyChange,
    filterConference,
    setFilterConference: handleConferenceChange,
    ratingOptions,
    statusColors,
    onAnalyzeSentiment,
    onViewMore,
    truncate,
  });

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Conference Feedback</h1>
      <p style={{ fontSize: '1.2rem', color: '#555', marginBottom: '2rem' }}>
        Review and analyze feedback left by attendees for various conferences.
      </p>

      <Table
        rowKey="_id"
        loading={loadingTable}
        columns={columns}
        dataSource={filteredData}
        pagination={{
          current: response.data?.page,
          pageSize: response.data?.limit,
          total: response.data?.totalDocs,
        }}
        onChange={handleTableChange}
      />

      <FeedbackModal
        visible={modalVisible}
        feedback={modalFeedback}
        onClose={() => setModalVisible(false)}
      />
    </div>
  );
};

export default ConferenceFeedbackList;