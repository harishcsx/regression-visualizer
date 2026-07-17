'use client';

import React from 'react';
import { RegressionResult } from '../utils/regression';
import { Terminal } from 'lucide-react';

interface MetricsPanelProps {
  regression: RegressionResult;
}

export default function MetricsPanel({ regression }: MetricsPanelProps) {
  const metrics = [
    {
      label: 'SYS.EQUATION',
      value: `y = ${regression.intercept.toFixed(4)} + ${regression.slope.toFixed(4)}x`,
      desc: 'LINE OF BEST FIT [ MATHEMATICAL MODEL ]'
    },
    {
      label: 'PRM.B0 [INTERCEPT]',
      value: regression.intercept.toFixed(4),
      desc: 'EXPECTED VALUE OF Y_TARGET WHEN X_FEATURE = 0.'
    },
    {
      label: 'PRM.B1 [SLOPE]',
      value: regression.slope.toFixed(4),
      desc: 'STEEPNESS. ΔY FOR EVERY 1 UNIT INCREASE IN X.'
    },
    {
      label: 'ERR.MSE [MEAN_SQUARED]',
      value: regression.mse.toFixed(4),
      desc: 'AVG SQUARED DIFFERENCE: PREDICTED VS ACTUAL. PENALIZES OUTLIERS.'
    },
    {
      label: 'ERR.RMSE [ROOT_MSE]',
      value: regression.rmse.toFixed(4),
      desc: 'SQRT(MSE). TYPICAL DISTANCE FROM REGRESSION LINE (IN Y-UNITS).'
    },
    {
      label: 'ERR.MAE [MEAN_ABS]',
      value: regression.mae.toFixed(4),
      desc: 'AVG ABSOLUTE DIFFERENCE. LINEAR ERROR PENALTY.'
    },
    {
      label: 'ACC.R_SQR [VARIANCE_EXPLAINED]',
      value: regression.rSquared.toFixed(4),
      desc: 'PROPORTION OF TARGET VARIANCE PREDICTABLE BY FEATURE. [1.0 = PERFECT]'
    }
  ];

  return (
    <div className="sci-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h2 className="text-gradient" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', marginBottom: '24px', borderBottom: '1px solid var(--panel-border)', paddingBottom: '16px' }}>
        <Terminal size={20} color="var(--accent-tertiary)" />
        DIAGNOSTIC_METRICS
      </h2>
      <div style={{ overflowY: 'auto', flex: 1, paddingRight: '12px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {metrics.map((metric, i) => (
          <div key={i} style={{ 
            padding: '12px 16px', 
            background: 'rgba(0, 0, 0, 0.4)', 
            border: '1px solid var(--panel-border)',
            borderLeft: '3px solid var(--accent-tertiary)',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <strong className="mono-text" style={{ color: 'var(--text-main)', fontSize: '13px' }}>
                {metric.label}
              </strong>
              <span className="mono-text" style={{ 
                color: 'var(--text-highlight)', 
                fontSize: '14px',
                fontWeight: '600'
              }}>
                {metric.value}
              </span>
            </div>
            <p className="mono-text" style={{ margin: 0, fontSize: '10px', color: 'var(--text-muted)' }}>
              &gt; {metric.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
