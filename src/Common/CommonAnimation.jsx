import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { useLocation } from "react-router-dom";

const Common = ({ children }) => {
  const containerRef = useRef(null);
  const stairParentRef = useRef(null);
  const pageRef = useRef(null);
  const location = useLocation();

  useLayoutEffect(() => {
    if (!containerRef.current || !stairParentRef.current || !pageRef.current) {
      return;
    }

    const waitForPaint = () =>
      new Promise((res) =>
        requestAnimationFrame(() => requestAnimationFrame(res))
      );

    let ctx;
    let tl;

    (async () => {
      try {
        await waitForPaint();

        ctx = gsap.context(() => {
          // Ensure initial CSS states
          gsap.set(stairParentRef.current, {
            display: "block",
            pointerEvents: "auto",
            zIndex: 9999,
          });

          gsap.set(".stairs", {
            height: "100%",
            y: "0%",
            overflow: "hidden",
          });

         // timeline
tl = gsap.timeline({
  defaults: { ease: "power2.inOut", duration: 0.6 },
});

// Ensure page starts hidden
gsap.set(pageRef.current, { opacity: 0, scale: 1.05 });

// reveal the bars from height 0 -> full
tl.from(".stairs", {
  height: 0,
  stagger: { amount: -0.2 },
});

// slide bars down (cover)
tl.to(
  ".stairs",
  {
    y: "100%",
    stagger: { amount: -0.2 },
  },
  "+=0.05"
);

// hide overlay
tl.set(stairParentRef.current, {
  display: "none",
  pointerEvents: "none",
});

// animate page content IN
tl.to(
  pageRef.current,
  {
    opacity: 1,
    scale: 1,
    duration: 0.6,
    ease: "power2.out",
  },
  "-=0.2"
);
        }, containerRef);
      } catch (error) {
        console.error("Animation error:", error);
      }
    })();

    return () => {
      if (ctx) ctx.revert();
      if (tl) tl.kill();
    };
  }, [location.pathname]);

  return (
    <div ref={containerRef}>
      {/* Transition Overlay */}
      <div
        ref={stairParentRef}
        className="h-screen w-full fixed top-0 left-0 pointer-events-none"
        style={{ display: "none", zIndex: 9999 }}
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

      {/* Page Content */}
      <div ref={pageRef}>
        {children}
      </div>
    </div>
  );
};

export default Common;