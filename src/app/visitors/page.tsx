import React from 'react';
import fs from 'fs/promises';
import path from 'path';
import { Users, Server, HardDrive, Clock, Activity } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic'; // Ensures this page doesn't statically cache

export default async function VisitorsPage() {
  const dataPath = path.join(process.cwd(), 'src', 'data', 'visitors.json');
  
  let visitorData = { globalUniqueCount: 0, visitors: [] };
  
  try {
    const fileContent = await fs.readFile(dataPath, 'utf-8');
    visitorData = JSON.parse(fileContent);
  } catch (err) {
    console.error("Could not read visitors.json, it might not exist yet.");
  }

  // Sort visitors by most recent
  visitorData.visitors.sort((a: any, b: any) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime());

  return (
    <div className="container" style={{ animation: 'fadeIn 0.6s ease-out forwards' }}>
      <header className="dashboard-header" style={{ marginBottom: '30px' }}>
        <div style={{ 
          background: 'rgba(255, 51, 102, 0.1)', 
          padding: '16px', 
          border: '1px solid var(--accent-danger)',
          position: 'relative'
        }}>
          <div style={{position: 'absolute', top: -1, left: -1, width: 6, height: 6, background: 'var(--accent-danger)'}} />
          <div style={{position: 'absolute', bottom: -1, right: -1, width: 6, height: 6, background: 'var(--accent-danger)'}} />
          <Server color="var(--accent-danger)" size={32} />
        </div>
        <div>
          <h1 className="text-gradient dashboard-title" style={{ background: 'linear-gradient(135deg, var(--accent-danger), var(--accent-tertiary))', WebkitBackgroundClip: 'text', textShadow: '0 0 20px rgba(255, 51, 102, 0.3)' }}>NETWORK_ANALYTICS</h1>
          <div className="dashboard-subtitle">
            <span style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontFamily: 'var(--font-mono)' }}><Activity size={12} /> TRAFFIC_LOGS</span>
            <Link href="/" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontFamily: 'var(--font-mono)', textDecoration: 'none' }}>
              &lt; RETURN_TO_DASHBOARD
            </Link>
          </div>
        </div>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        
        {/* Global Stats */}
        <div className="sci-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 className="text-gradient" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', margin: 0 }}>
              <Users size={20} color="var(--accent-secondary)" />
              GLOBAL_UNIQUE_COUNT
            </h2>
            <p className="mono-text" style={{ margin: '8px 0 0 0', color: 'var(--text-muted)', fontSize: '12px' }}>
              TOTAL NON-DUPLICATED NODES CONNECTED
            </p>
          </div>
          <div className="mono-text" style={{ fontSize: '42px', color: 'var(--accent-primary)', fontWeight: 'bold', textShadow: '0 0 15px rgba(0,255,204,0.4)' }}>
            {visitorData.globalUniqueCount}
          </div>
        </div>

        {/* Visitor Log */}
        <div className="sci-panel">
          <h2 className="text-gradient" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', marginBottom: '24px', borderBottom: '1px solid var(--panel-border)', paddingBottom: '16px' }}>
            <HardDrive size={20} color="var(--accent-tertiary)" />
            NODE_REGISTRY
          </h2>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'rgba(0, 0, 0, 0.4)', borderBottom: '1px solid var(--panel-border)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'normal' }}>NODE_ID</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'normal' }}>DEVICE_SIGNATURE</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: 'normal' }}>PING_COUNT</th>
                  <th style={{ padding: '12px', textAlign: 'right', fontWeight: 'normal' }}>LAST_SEEN <Clock size={12} style={{ display: 'inline', verticalAlign: 'text-bottom' }} /></th>
                </tr>
              </thead>
              <tbody>
                {visitorData.visitors.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>[ NO DATA LOGGED ]</td>
                  </tr>
                ) : (
                  visitorData.visitors.map((visitor: any) => (
                    <tr key={visitor.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}>
                      <td style={{ padding: '12px', color: 'var(--text-main)' }}>{visitor.id.split('-')[0]}***</td>
                      <td style={{ padding: '12px', color: 'var(--accent-primary)' }}>{visitor.deviceName}</td>
                      <td style={{ padding: '12px', color: 'var(--accent-secondary)', textAlign: 'center', fontWeight: 'bold' }}>{visitor.visitCount}</td>
                      <td style={{ padding: '12px', color: 'var(--text-muted)', textAlign: 'right' }}>{new Date(visitor.lastVisit).toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
