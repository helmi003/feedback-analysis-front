import React, { useState, useMemo } from 'react';
import { Table } from 'antd';
import useFetchFeedback from '../../services/useFetchFeedback';
import type { FeedbackItemType } from '../../models/feedback/response';
import { type FeedbackStatusType } from '../../constants/consts';
import { getColumns, getFilterComponents } from './columns';
import FeedbackModal from './feedbackDetails';
import { feedbackAnalysisService, type FeedbackAnalysisModel } from '../../services/FeedbackAnalysisService';

const truncate = (text: string, length = 20) =>
  text.length > length ? text.slice(0, length) + '...' : text;

const ratingOptions = [1, 2, 3, 4, 5];

const statusColors: Record<FeedbackStatusType, string> = {
  excellent: 'green',
  good: 'blue',
  neutral: 'gold',
  bad: 'orange',
  terrible: 'red',
};

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
  const [loadingRows, setLoadingRows] = useState<Record<string, boolean>>({});

  const [modalVisible, setModalVisible] = useState(false);
  const [modalFeedback, setModalFeedback] = useState<FeedbackItemType | null>(null);
  const [feedbackAnalysis, setFeedbackAnalysis] = useState<FeedbackAnalysisModel | null>(null);

  const filteredData = useMemo(() => {
    if (!response.data?.docs) return [];
    return response.data.docs;
  }, [response.data?.docs]);

  const onViewMore = async (feedback: FeedbackItemType) => {
    setLoadingRows(prev => ({ ...prev, [feedback._id]: true }));
    try {
      const res = await feedbackAnalysisService.getAnalysis(feedback.comment);
      setModalFeedback(feedback);
      setModalVisible(true);
      setFeedbackAnalysis(res);
    } catch (error) {
      console.error('Error', error);
    } finally {
      setLoadingRows(prev => ({ ...prev, [feedback._id]: false }));
    }
  };

  const columns = getColumns({
    onViewMore,
    truncate,
    loadingRows,
  });

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', textAlign: 'center' }}>Conference Feedback</h1>
      <p style={{ fontSize: '1.2rem', color: '#555', marginBottom: '2rem', textAlign: 'center' }}>
        Review and analyze feedback left by attendees for various conferences.
      </p>

      {getFilterComponents({
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
      })}

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
        feedbackAnalysis={feedbackAnalysis}
      />
    </div>
  );
};

export default ConferenceFeedbackList;