import React from 'react';

export default function LoadingIndicator() {
  return (
    <div className="progress">
      <div className="progress-bar progress-bar-striped active"
        aria-valuenow="1" aria-valuemin="0" aria-valuemax="1"
        role="progressbar" style={{ width: '100%' }}>
        <span className="sr-only">Loading</span>
      </div>
    </div>
  );
}
