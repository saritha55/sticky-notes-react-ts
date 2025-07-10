import React from 'react';

type TrashZoneProps = {};

const TrashZone = React.forwardRef<HTMLDivElement, TrashZoneProps>((_, ref) => (
  <div
    ref={ref as React.RefObject<HTMLDivElement>}
    style={{
      position: 'fixed',
      bottom: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      background: '#ddd',
      padding: '10px 20px',
      borderRadius: '8px',
      fontWeight: 'bold',
      zIndex: 999,
    }}
  >
    🗑️ Drag here to delete
  </div>
));

export default TrashZone;
