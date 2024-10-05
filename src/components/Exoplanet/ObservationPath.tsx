import React, { useMemo } from "react";
import { Line } from "@react-three/drei";

interface ObservationPathProps {
  start: [number, number, number];
  end: [number, number, number];
  visible: boolean;
}

const ObservationPath: React.FC<ObservationPathProps> = ({
  start,
  end,
  visible,
}) => {
  const points = useMemo(() => [start, end], [start, end]);

  return visible ? (
    <Line
      points={points}
      color="#FFD700"
      lineWidth={2}
      dashed={true}
      dashScale={50}
      dashSize={0.5}
      dashOffset={0}
      transparent={true}
      opacity={0.6}
    />
  ) : null;
};

export default ObservationPath;
