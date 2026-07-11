// Single source of truth for the global expo-out ease.
// Control points for cubic-bezier(0.16, 1, 0.3, 1). Never hardcode these
// literals in animation code — import from here.
export const EXPO_OUT = [0.16, 1, 0.3, 1];

// CSS / Framer Motion consumable form.
export const EXPO_OUT_CSS = `cubic-bezier(${EXPO_OUT.join(', ')})`;

// Name of the GSAP CustomEase registered once in lib/gsap.js.
export const EXPO_OUT_GSAP = 'expoOut';
