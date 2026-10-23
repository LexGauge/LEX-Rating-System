import React from 'react';

export default function GuideCard({ guide, onClick }) {
  return (
    <div
      className="guide-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') onClick();
      }}
      aria-label={`Read guide: ${guide.title}`}
    >
      <div className="guide-card-tag" style={{ color: guide.color || '#008cc9' }}>
        {guide.cat}
      </div>
      <h3 className="guide-card-title">{guide.title}</h3>
      <p className="guide-card-summary">{guide.summary}</p>
      <div className="guide-card-footer">
        <span>Read time: {guide.read}</span>
        <span className="guide-card-link">Read Full Guide &rarr;</span>
      </div>
    </div>
  );
}
// step 1
// step 2
// step 3
// step 4
// step 5
// step 6
// step 7
// step 8
// step 9
// step 10
// step 11
