'use client';

import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
  ReferenceArea
} from 'recharts';
import { DataPoint, RegressionResult } from '../utils/regression';
import { Network } from 'lucide-react';

interface RegressionChartProps {
  data: DataPoint[];
  regression: RegressionResult;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="sci-panel" style={{ padding: '12px', minWidth: '150px' }}>
        <p className="mono-text" style={{ color: 'var(--text-main)', margin: '0 0 8px 0', fontSize: '12px', borderBottom: '1px solid var(--panel-border)', paddingBottom: '4px' }}>
          COORD: [ {payload[0].payload.x.toFixed(2)} ]
        </p>
        <p className="mono-text" style={{ color: 'var(--accent-primary)', margin: 0, fontSize: '13px' }}>
          Y_ACT: {payload[0].payload.yActual !== undefined ? payload[0].payload.yActual.toFixed(2) : '-'}
        </p>
        <p className="mono-text" style={{ color: 'var(--accent-tertiary)', margin: '4px 0 0 0', fontSize: '13px' }}>
          Y_PRD: {payload[0].payload.yPred !== undefined ? payload[0].payload.yPred.toFixed(2) : '-'}
        </p>
      </div>
    );
  }
  return null;
};

export default function RegressionChart({ data, regression }: RegressionChartProps) {
  // Combine data for ComposedChart
  const combinedData = data.map((d, i) => {
    // Find corresponding prediction
    const pred = regression.predictions.find(p => p.x === d.x);
    return {
      x: d.x,
      yActual: d.y,
      yPred: pred ? pred.y : (regression.slope * d.x + regression.intercept)
    };
  });

  // Sort by X so the line draws correctly
  combinedData.sort((a, b) => a.x - b.x);

  return (
    <div className="sci-panel" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
      <div className="chart-header">
        <h2 className="text-gradient" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', margin: 0 }}>
          <Network size={20} color="var(--accent-secondary)" />
          PLOT_VISUALIZATION
        </h2>
        <div className="mono-text" style={{ 
          background: 'rgba(168, 85, 247, 0.1)', 
          border: '1px solid var(--accent-tertiary)', 
          padding: '6px 16px', 
          color: 'var(--accent-tertiary)',
          fontSize: '15px',
          fontWeight: '600',
          boxShadow: '0 0 15px rgba(168, 85, 247, 0.2)',
          letterSpacing: '1px'
        }}>
          y = {regression.intercept.toFixed(4)} + {regression.slope.toFixed(4)}x
        </div>
      </div>
      
      {data.length < 2 ? (
        <div className="mono-text" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
          [ AWAITING DATA &gt;= 2 ]
        </div>
      ) : (
        <div style={{ flex: 1, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={combinedData} margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="rgba(0, 255, 204, 0.15)" vertical={true} horizontal={true} />
              <XAxis 
                dataKey="x" 
                type="number" 
                name="Feature" 
                stroke="var(--accent-secondary)" 
                tick={{fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 11}}
                domain={['auto', 'auto']}
              />
              <YAxis 
                yAxisId="left"
                stroke="var(--accent-secondary)" 
                tick={{fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 11}}
                domain={['auto', 'auto']}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(0, 255, 204, 0.4)', strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Scatter yAxisId="left" name="Actual Data" dataKey="yActual" fill="var(--accent-primary)" shape="diamond" />
              <Line 
                yAxisId="left" 
                type="monotone" 
                dataKey="yPred" 
                stroke="var(--accent-tertiary)" 
                strokeWidth={2}
                dot={false} 
                activeDot={false} 
                name="Regression Line" 
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
