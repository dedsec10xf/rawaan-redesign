// Register GSAP plugins ONCE and export a pre-configured gsap.
// Every module imports gsap/ScrollTrigger from here — never from 'gsap' directly.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
import { useGSAP } from '@gsap/react';
import { EXPO_OUT, EXPO_OUT_GSAP } from './easings';

gsap.registerPlugin(ScrollTrigger, CustomEase, useGSAP);

// Build the locked expo-out ease from the single source of control points.
// cubic-bezier(x1,y1,x2,y2) maps to the SVG path "M0,0 C x1,y1 x2,y2 1,1".
const [x1, y1, x2, y2] = EXPO_OUT;
CustomEase.create(EXPO_OUT_GSAP, `M0,0 C${x1},${y1} ${x2},${y2} 1,1`);

// Reveals default to ~1s expo-out; sections override duration per spec.
gsap.defaults({ ease: EXPO_OUT_GSAP, duration: 1 });

export { gsap, ScrollTrigger, useGSAP };
