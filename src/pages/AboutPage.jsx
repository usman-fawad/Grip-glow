import { useEffect } from 'react';
import Footer from '../components/Footer';

export default function AboutPage() {
  useEffect(() => { document.title = 'About Us | GRIP GLOW'; }, []);

  return (
    <>
      <main className="about-page" aria-labelledby="about-heading">
        <div className="container">

          {/* Intro */}
          <div className="about-intro">
            <h1 id="about-heading">Welcome To Grip Glow</h1>
            <p>
              Whether you're working late in the garage, or handling a roadside repair,{' '}
              <span>reliable lighting can make all the difference.</span>
            </p>
          </div>

          {/* Our Story */}
          <div className="about-grid">
            <div className="about-story">
              <h2>Our Story</h2>
              <p>
                It started with a simple problem: most work lights were either too limited, too
                inconvenient, or difficult to position when you needed them most.
              </p>
              <p>
                That's how Grip Glow was born. By combining <span>powerful COB illumination</span>,
                flexible positioning, and a <span>rechargeable design</span>, we built a work light
                that adapts to the way people actually work. From garages to outdoor projects or
                emergencies, our mission is simple: make every task easier with lighting you can
                rely on.
              </p>
            </div>
            <div>
              <img
                src="/product_image.jpg"
                alt="The Grip Glow magnetic LED work light mounted in a car engine bay"
                className="about-img"
                loading="lazy"
              />
            </div>
          </div>

          {/* Values */}
          <div className="about-values">
            <h2>What We Stand For</h2>
            <div className="values-grid">
              {[
                { icon: '💡', title: 'Practical Innovation', desc: 'Every feature exists to solve a real problem mechanics and DIY users face every day.' },
                { icon: '🔧', title: 'Built to Last',        desc: 'We build products that hold up to real workshop conditions, not toys designed to sit on a shelf.' },
                { icon: '✓',  title: 'Customer First',       desc: '30-day no-questions-asked guarantee. If you\'re not satisfied, we make it right — full stop.' },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="value-card">
                  <div className="value-card__icon" aria-hidden="true">{icon}</div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
