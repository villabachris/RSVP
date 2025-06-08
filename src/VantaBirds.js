import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import BIRDS from 'vanta/dist/vanta.fog.min'
// import * as THREE from "three";

const VantaBirds = () => {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);

  useEffect(() => {
    if (!vantaEffect && vantaRef.current) {
      setVantaEffect(
        BIRDS({
          el: vantaRef.current,
          THREE: THREE, // Ensure THREE is available globally
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          blurFactor: 0.29,
          backgroundColor: 0xfff1f1,
          color1: 0xff00bb,
          color2: 0xff99cc,
          vertexColors: true
        })
      );
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
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -10,
        backgroundImage: "url('/jas.jpg')", // <-- Update path
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />
  );
};

export default VantaBirds;
