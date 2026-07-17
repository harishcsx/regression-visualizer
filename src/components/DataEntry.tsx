'use client';

import React from 'react';
import { DataPoint } from '../utils/regression';
import { Plus, Trash2, Cpu } from 'lucide-react';

interface DataEntryProps {
  data: DataPoint[];
  setData: React.Dispatch<React.SetStateAction<DataPoint[]>>;
}

export default function DataEntry({ data, setData }: DataEntryProps) {
  const handleAddRow = () => {
    setData([...data, { x: 0, y: 0 }]);
  };

  const handleRemoveRow = (index: number) => {
    const newData = [...data];
    newData.splice(index, 1);
    setData(newData);
  };

  const handleChange = (index: number, field: 'x' | 'y', value: string) => {
    const newData = [...data];
    newData[index][field] = parseFloat(value) || 0;
    setData(newData);
  };

  return (
    <div className="sci-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--panel-border)', paddingBottom: '16px' }}>
        <h2 className="text-gradient" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px' }}>
          <Cpu size={20} color="var(--accent-primary)" />
          DATA_MATRIX
        </h2>
        <button className="btn-sci" onClick={handleAddRow} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={14} /> ADD_VECTOR
        </button>
      </div>
      
      <div style={{ overflowY: 'auto', flex: 1, paddingRight: '12px' }}>
        {data.length === 0 ? (
          <p className="mono-text" style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
            [ NO DATA_POINTS. INITIALIZE VECTOR. ]
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {data.map((point, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                gap: '12px', 
                alignItems: 'center', 
                background: 'rgba(0,0,0,0.3)',
                padding: '12px',
                borderLeft: '2px solid var(--accent-secondary)'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <label className="mono-text" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>VAR_X [FEATURE]</label>
                    <span className="mono-text" style={{ fontSize: '11px', color: 'var(--accent-primary)', fontWeight: '600' }}>{point.x}</span>
                  </div>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    step="0.5"
                    className="slider-sci"
                    value={point.x}
                    onChange={(e) => handleChange(index, 'x', e.target.value)}
                  />
                  <input
                    type="number"
                    className="input-sci"
                    value={point.x}
                    onChange={(e) => handleChange(index, 'x', e.target.value)}
                    style={{ marginTop: '4px', padding: '6px 10px' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <label className="mono-text" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>VAR_Y [TARGET]</label>
                    <span className="mono-text" style={{ fontSize: '11px', color: 'var(--accent-primary)', fontWeight: '600' }}>{point.y}</span>
                  </div>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    step="0.5"
                    className="slider-sci"
                    value={point.y}
                    onChange={(e) => handleChange(index, 'y', e.target.value)}
                  />
                  <input
                    type="number"
                    className="input-sci"
                    value={point.y}
                    onChange={(e) => handleChange(index, 'y', e.target.value)}
                    style={{ marginTop: '4px', padding: '6px 10px' }}
                  />
                </div>
                <div style={{ marginTop: '22px' }}>
                  <button className="btn-icon-sci" onClick={() => handleRemoveRow(index)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
