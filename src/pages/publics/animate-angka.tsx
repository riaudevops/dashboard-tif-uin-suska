import { animate } from "framer-motion";
import { useEffect, useState } from "react";

const AnimatedPercentage = ({ target }: { target: number }) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, target, {
      duration: 1,
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [target]);

  return <span className="text-3xl font-bold">{value} %</span>;
};

export default AnimatedPercentage;
