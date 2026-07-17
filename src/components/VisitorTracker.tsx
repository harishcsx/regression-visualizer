'use client';

import { useEffect } from 'react';

export default function VisitorTracker() {
  useEffect(() => {
    // Only track once per page load
    fetch('/api/track').catch(err => console.error('Failed to track visitor:', err));
  }, []);

  return null; // This component doesn't render anything
}
