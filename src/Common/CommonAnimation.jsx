import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { useLocation } from "react-router-dom";

const Common = ({ children }) => {
  const containerRef = useRef(null);
  const stairParentRef = useRef(null);
  const pageRef = useRef(null);
  const location = useLocation();
  const tlRef = useRef(null);

  useLayoutEffect(() => {
    if (!stairParentRef.current || !pageRef.current) return;

    // Kill any existing timeline
    if (tlRef.current) {
      tlRef.current.kill();
    }

    const animate = async () => {
      // Wait for paint
      await new Promise((res) =>
        requestAnimationFrame(() => requestAnimationFrame(res))
      );

      // Reset everything
      gsap.set(stairParentRef.current, {
        display: "block",
        pointerEvents: "auto",
        zIndex: 9999,
      });

      gsap.set(".stairs", {
        height: "100%",
        y: "0%",
      });

      gsap.set(pageRef.current, {
        opacity: 0,
        scale: 1.05,
      });

      // Create timeline
      const tl = gsap.timeline();

      tl.from(".stairs", {
        height: 0,
        duration: 0.6,
        ease: "power2.inOut",
        stagger: { amount: -0.2 },
      })
        .to(
          ".stairs",
          {
            y: "100%",
            duration: 0.6,
            ease: "power2.inOut",
            stagger: { amount: -0.2 },
          },
          "+=0.05"
        )
        .set(stairParentRef.current, {
          display: "none",
          pointerEvents: "none",
        })
        .to(
          pageRef.current,
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.2"
        );

      tlRef.current = tl;
    };

    animate().catch(console.error);

    // Cleanup
    return () => {
      if (tlRef.current) {
        tlRef.current.kill();
      }
    };
  }, [location.pathname]);

  return (
    <div ref={containerRef}>
      <div
        ref={stairParentRef}
        className="h-screen w-full fixed top-0 left-0"
        style={{ display: "block", zIndex: 9999, pointerEvents: "none" }}
      >
        <div className="h-full w-full flex">
          <div className="stairs h-full w-1/5 bg-black"></div>
          <div className="stairs h-full w-1/5 bg-black"></div>
          <div className="stairs h-full w-1/5 bg-black"></div>
          <div className="stairs h-full w-1/5 bg-black"></div>
          <div className="stairs h-full w-1/5 bg-black"></div>
          <div className="stairs h-full w-1/5 bg-black"></div>
        </div>
      </div>

      <div ref={pageRef}>{children}</div>
    </div>
  );
};

export default Common;