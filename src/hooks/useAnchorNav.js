import { useLocation, useNavigate } from 'react-router-dom';
import { useLenis } from './useLenis';
import { scrollToAnchor } from '@/lib/resolveAnchor';

// Cross-route anchor navigation (Header nav audit, V8+): clicking a homepage
// section link while already on '/' just scrolls; clicking it from any other
// route (e.g. /build) navigates to '/' first and hands the target hash to
// App.jsx's RouteChangeEffects via location state, which scrolls once the
// section actually exists (waitForElement — see resolveAnchor.js), not on a
// timer guess.
export function useAnchorNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const lenis = useLenis();

  return (hash) => (e) => {
    e.preventDefault();
    if (pathname === '/') {
      scrollToAnchor(lenis, hash);
    } else {
      navigate('/', { state: { scrollTo: hash } });
    }
  };
}
