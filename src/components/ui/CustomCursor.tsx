'use client';

import { useCustomCursor } from '@/hooks/useCustomCursor';

export default function CustomCursor() {
  const { dotRef, ringRef, hovering, isTouch } = useCustomCursor();

  if (isTouch) return null;

  return (
    <>
      <div ref={dotRef} className={`custom-cursor custom-cursor-dot ${hovering ? 'hovering' : ''}`} />
      <div ref={ringRef} className={`custom-cursor custom-cursor-ring ${hovering ? 'hovering' : ''}`} />
    </>
  );
}
