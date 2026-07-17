'use client';

import React, { useState, useMemo } from 'react';
import DataEntry from '../components/DataEntry';
import RegressionChart from '../components/RegressionChart';
import MetricsPanel from '../components/MetricsPanel';
import { DataPoint, calculateLinearRegression } from '../utils/regression';
import { Database, Activity, GitBranch } from 'lucide-react';

export default function Home() {
  const [data, setData] = useState<DataPoint[]>([
    { x: 1, y: 2.1 },
    { x: 2, y: 3.8 },
    { x: 3, y: 6.2 },
    { x: 4, y: 7.9 },
    { x: 5, y: 10.5 }
  ]);

  const regressionResult = useMemo(() => {
    return calculateLinearRegression(data);
  }, [data]);

  return (
    <div className="container" style={{ animation: 'fadeIn 0.6s ease-out forwards' }}>
      <header style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '20px', 
        marginBottom: '40px',
        borderBottom: '1px solid var(--panel-border)',
        paddingBottom: '20px'
      }}>
        <div style={{ 
          background: 'rgba(0, 255, 204, 0.1)', 
          padding: '16px', 
          border: '1px solid var(--accent-primary)',
          position: 'relative'
        }}>
          {/* Corner accents */}
          <div style={{position: 'absolute', top: -1, left: -1, width: 6, height: 6, background: 'var(--accent-primary)'}} />
          <div style={{position: 'absolute', bottom: -1, right: -1, width: 6, height: 6, background: 'var(--accent-primary)'}} />
          <Activity color="var(--accent-primary)" size={32} />
        </div>
        <div>
          <h1 className="text-gradient" style={{ margin: 0, fontSize: '36px', letterSpacing: '2px' }}>REGRESSION_TELEMETRY</h1>
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px', alignItems: 'center' }}>
            <span style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontFamily: 'var(--font-mono)' }}><Database size={12} /> SYS.DATA_ACTIVE</span>
            <span style={{ color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontFamily: 'var(--font-mono)' }}><GitBranch size={12} /> MODEL.LINEAR_V1</span>
          </div>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '30px', minHeight: '600px' }}>
        
        {/* Left Column: Data Entry */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <DataEntry data={data} setData={setData} />
        </div>

        {/* Right Column: Chart and Metrics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <RegressionChart data={data} regression={regressionResult} />
          <MetricsPanel regression={regressionResult} />
        </div>
        
      </div>
    </div>
  );
}
