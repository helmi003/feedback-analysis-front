import React from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { TooltipProps } from 'recharts';
import type { FeedbackAnalysisModel } from '../services/FeedbackAnalysisService';

interface SentimentChartProps {
    feedbackAnalysis: FeedbackAnalysisModel;
}

const colors = ['green', 'orange', 'red'];

const CustomTooltip = ({ active, payload }: TooltipProps<any, any>) => {
    if (!active || !payload?.length) return null;

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

const SentimentChart: React.FC<SentimentChartProps> = ({ feedbackAnalysis }) => {
    const chartData = [
        { name: 'Positive', value: feedbackAnalysis.Positive },
        { name: 'Neutral', value: feedbackAnalysis.Neutral },
        { name: 'Negative', value: feedbackAnalysis.Negative }
    ];

    return (
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
                        {chartData.map((entry) => (
                            <Cell
                                key={`cell-${entry.name}`}
                                fill={colors[chartData.findIndex(e => e.name === entry.name) % colors.length]}
                                stroke={colors[chartData.findIndex(e => e.name === entry.name) % colors.length]}
                            />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SentimentChart;
