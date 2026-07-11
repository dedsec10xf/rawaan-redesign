import { createContext, useContext } from 'react';

// Notifies when a lazy-loaded, Suspense-wrapped section has actually
// COMMITTED (not just started loading) — see App.jsx's MountSignal. A
// component placed inside the same Suspense boundary as the lazy import only
// mounts once React has resolved and committed the whole subtree, so this is
// a reliable "this section is really in the DOM now" signal without needing
// to touch each section's own internals.
export const LazyMountContext = createContext(() => {});
export const useLazyMountSignal = () => useContext(LazyMountContext);
