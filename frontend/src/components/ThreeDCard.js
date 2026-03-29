import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const ThreeDCard = ({ children, title, className = '', height = 'auto' }) => {
    const ref = useRef(null);
    const [hover, setHover] = useState(false);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

    const handleMouseMove = (e) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        setHover(false);
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateY,
                rotateX,
                transformStyle: "preserve-3d",
                perspective: 1000
            }}
            className={`three-d-card-container ${className}`}
        >
            <motion.div
                style={{
                    transform: "translateZ(50px)",
                    transformStyle: "preserve-3d",
                }}
                className="three-d-card-content"
            >
                {/* Glass Layer */}
                <div style={{
                    position: 'relative',
                    background: 'var(--card-bg)', // Dynamic CSS variable
                    backdropFilter: 'blur(20px)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '24px',
                    padding: '32px',
                    height: height,
                    boxShadow: hover
                        ? 'var(--shadow-neon), 0 0 1px 1px var(--glass-highlight)' // Dynamic neon shadow
                        : 'var(--shadow-depth)',
                    transition: 'box-shadow 0.3s ease',
                    overflow: 'hidden',
                    color: 'var(--text-main)'
                }}>
                    {/* Inner Glow Gradient */}
                    <div style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: 'radial-gradient(circle at top left, var(--glass-highlight), transparent 50%)',
                        pointerEvents: 'none',
                        zIndex: 0
                    }} />

                    {/* Content */}
                    <div style={{ position: 'relative', zIndex: 1, transform: "translateZ(30px)" }}>
                        {title && (
                            <h3 style={{
                                fontSize: '1.25rem', marginBottom: '20px',
                                fontFamily: "'Space Grotesk', sans-serif",
                                color: 'var(--text-main)',
                                display: 'flex', alignItems: 'center', gap: '10px'
                            }}>
                                {title}
                            </h3>
                        )}
                        {children}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ThreeDCard;
