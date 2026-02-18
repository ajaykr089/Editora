import React, { useEffect, useRef } from 'react';
import { Button } from '@editora/ui-react';

export default {
  title: 'UI/Layout',
};

export const FlexAndGrid = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const host = ref.current!;
    // create ui-flex
    const flex = document.createElement('ui-flex');
    flex.setAttribute('direction', 'row');
    flex.innerHTML = '<button part="slot">Flex item A</button><button part="slot">Flex item B</button>';
    // create ui-grid
    const grid = document.createElement('ui-grid');
    grid.setAttribute('columns', '1fr 1fr');
    grid.innerHTML = '<div>Grid A</div><div>Grid B</div>';
    host.appendChild(flex);
    host.appendChild(document.createElement('br'));
    host.appendChild(grid);
    return () => { host.innerHTML = ''; };
  }, []);

  return (
    <div ref={ref} style={{ padding: 12 }}>
      <div style={{ marginBottom: 8 }}>Flex and Grid primitives (native web components):</div>
    </div>
  );
};
