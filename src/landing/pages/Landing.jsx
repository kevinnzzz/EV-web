import Navbar from '../components/Navbar';
import Hero from '../sections/Hero';
import About from '../sections/About';
import Why from '../sections/Why';
import Cars from '../sections/Cars';
import Highlight from '../sections/Highlight';
import Steps from '../sections/Steps';
import Insights from '../sections/Insights';
import Footer from '../sections/Footer';

export default function Landing() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Why />
        <Cars />
        <Highlight />
        <Steps />
        <Insights />
      </main>
      <Footer />
    </>
  );
}
