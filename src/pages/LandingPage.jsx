import { useNavigate } from 'react-router-dom';
import Landing from '../landing/pages/Landing';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleReferenceNavigation = (event) => {
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest('a[href^="#/"]');
    if (!link) return;

    const destination = link.getAttribute('href');
    event.preventDefault();

    if (destination === '#/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const route = destination.slice(1);
    if (route === '/dashboard' || route === '/prediksi') {
      navigate(route);
    }
  };

  return (
    <div
      className="min-h-screen bg-paper font-landing text-ink"
      onClickCapture={handleReferenceNavigation}
    >
      <Landing />
    </div>
  );
}
