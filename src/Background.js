// App.js or Background.js
import React, { useEffect, useRef, useState } from "react";
import BIRDS from "vanta/src/vanta.birds";
import * as THREE from "three";

const VantaBackground = () => {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);

  useEffect(() => {
    if (!vantaEffect && vantaRef.current) {
      const effect = BIRDS({
        el: vantaRef.current,
        THREE, // 🔥 this is critical!
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        backgroundColor: 0x0a0a0a,
        color1: 0xff9900,
        color2: 0xffee00,
        birdSize: 1.5,
        speedLimit: 3.0,
      });

      setVantaEffect(effect);
    }

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <div
      ref={vantaRef}
      style={{
        width: "100%",
        height: "100vh",
        zIndex: -1,
        position: "fixed",
        top: 0,
        left: 0,
      }}
    />
  );
};

export default VantaBackground;
