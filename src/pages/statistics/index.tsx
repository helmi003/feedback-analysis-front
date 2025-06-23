import React, { useEffect, useState } from 'react';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Card, Col, Row, Statistic, Spin, Alert, Rate, Progress, Carousel } from 'antd';
import type { FeedbackAVG, FeedbackStats, FeedbackItemType } from '../../models/feedback/response';
import { feedbackService } from '../../services/FeedbackService';
import { formatDateTimeString } from '../../constants/dateformatter';

const FeedbackStatistics: React.FC = () => {
    const [stats, setStats] = useState<FeedbackStats | null>(null);
    const [avgStats, setAvgStats] = useState<FeedbackAVG | null>(null);
    const [topFeedbacks, setTopFeedbacks] = useState<FeedbackItemType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const statsResponse = await feedbackService.getFeedbackStatistics();
                setStats(statsResponse);

                const avgResponse = await feedbackService.getFeedbackAVG();
                setAvgStats(avgResponse);

                const topResponse = await feedbackService.getTopFeedbacks();
                setTopFeedbacks(topResponse);
            } catch (err) {
                console.error(err);
                setError('Failed to load statistics.');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <Spin size="large" tip="Loading statistics..." />;
    }

    if (error) {
        return <Alert type="error" message={error} />;
    }

    if (!stats || !avgStats) {
        return null;
    }

    return (
        <div style={{ marginLeft: '2rem' }}>
            <h1 style={{ textAlign: 'center' }}>Feedback Statistics</h1>
            <Row gutter={16}>
                <Col span={10}>
                    <Card title="Ratings Breakdown">
                        {[5, 4, 3, 2, 1].map((star) => (
                            <div
                                key={star}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginBottom: '0.5rem',
                                    gap: '0.75rem',
                                }}
                            >
                                <div style={{ width: 60 }}>
                                    {star}{' '}
                                    <Rate
                                        disabled
                                        defaultValue={1}
                                        count={1}
                                        style={{ color: '#faad14' }}
                                    />
                                </div>
                                <Progress
                                    percent={avgStats.ratingDistribution[star - 1]}
                                    showInfo
                                    strokeColor="#1890ff"
                                    style={{ flex: 1 }}
                                />
                                <div style={{ width: 30, textAlign: 'right' }}>
                                    {avgStats.ratingCounts[star - 1]}
                                </div>
                            </div>
                        ))}
                        <hr style={{ margin: '1rem 0' }} />
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontWeight: 'bold',
                            }}
                        >
                            <span>Total: {avgStats.total}</span>
                            <span>
                                Average:{' '}
                                <Rate
                                    disabled
                                    allowHalf
                                    value={avgStats.averageRating}
                                    style={{ fontSize: '16px', color: '#faad14' }}
                                />
                                <span style={{ marginLeft: 8 }}>({avgStats.averageRating.toFixed(1)})</span>
                            </span>
                        </div>
                    </Card>
                </Col>

                <Col span={14}>
                    <Row gutter={16} justify="center" style={{ marginTop: '2rem' }}>
                        <Col span={4}>
                            <Card>
                                <Statistic
                                    title="Positive"
                                    value={stats.positive}
                                    valueStyle={{ color: '#52c41a' }}
                                    prefix={<ArrowUpOutlined />}
                                />
                            </Card>
                        </Col>

                        <Col span={4}>
                            <Card>
                                <Statistic
                                    title="Negative"
                                    value={stats.negative}
                                    valueStyle={{ color: '#cf1322' }}
                                    prefix={<ArrowDownOutlined />}
                                />
                            </Card>
                        </Col>
                    </Row>

                    <Row justify="center" style={{ marginTop: '1rem' }}>
                        <Col span={4}>
                            <Card>
                                <Statistic
                                    title="Neutral"
                                    value={stats.neutral}
                                    valueStyle={{ color: '#faad14' }}
                                />
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <h2 style={{ textAlign: 'center', marginTop: '2rem' }}>Top Feedbacks</h2>
            <Carousel autoplay autoplaySpeed={5000} dots>
                {topFeedbacks.map((feedback) => (
                    <div >
                        <Card
                            style={{ margin: '4rem auto', width: "600px", marginTop: '2rem' }}
                            key={feedback._id}
                            actions={[
                                <Rate
                                    disabled
                                    value={feedback.rating}
                                    style={{ color: '#faad14' }}
                                />,
                            ]}
                        >
                            <Card.Meta
                                title={`${feedback.createdBy?.fullName} - ${feedback.conference?.title}`}
                                description={
                                    <>
                                        <p>{feedback.comment}</p>
                                        <p style={{ color: 'rgba(0,0,0,0.45)' }}>
                                            {formatDateTimeString(feedback.createdAt)}
                                        </p>
                                    </>
                                }
                            />
                        </Card>
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default FeedbackStatistics;