import React from 'react';
import { getBezierPath } from '@xyflow/react';
import { motion } from 'framer-motion';

export const AnimatedDataEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      {/* The base glowing line */}
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          strokeWidth: 2,
          stroke: 'rgba(59, 130, 246, 0.4)', // Base ds-accent with opacity
        }}
      />
      
      {/* The moving "data packet" particle */}
      <motion.circle
        r="4"
        fill="#FFFFFF"
        className="filter drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
        animate={{
          offsetDistance: ['0%', '100%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          offsetPath: `path('${edgePath}')`,
        }}
      />
    </>
  );
};
