import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaGamepad,
  FaTrophy,
  FaUserFriends,
  FaInfoCircle,
} from 'react-icons/fa';

const HomePage = () => {
  const games = [
    {
      title: 'FIFA FC 24',
      image:
        'https://media.gq.com.mx/photos/66fd872173f54ba5830a877a/16:9/w_2560%2Cc_limit/EA_Sports_FC_25_cover.jpg',
      description:
        'Experience the beautiful game with next-gen graphics and gameplay',
    },
    {
      title: 'Dragon Ball Sparking Zero',
      image:
        'https://cloudfront-us-east-1.images.arcpublishing.com/metroworldnews/4KBDKEMQLRHCBBVHYEMFL5PPBU.jpg',
      description:
        'Ultimate fighting experience with your favorite Dragon Ball characters',
    },
    {
      title: 'Warzone',
      image:
        'https://www.callofduty.com/content/dam/atvi/callofduty/cod-touchui/blog/hero/mw-wz/WZ-Season-Three-Announce-TOUT.jpg',
      description: 'Battle Royale action in the Call of Duty universe',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-screen md:h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://files.oaiusercontent.com/file-fUwIVbqOH58twtwkAC35TX8h?se=2024-10-28T20%3A49%3A58Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3D23c813fe-07664cb4-99e9-5b119bce6592.webp&sig=DW6qum52OlOsOKBdhLXjJSXzO89uul2MJPrfyv7uQkI%3D"
            alt="SuperEvilMegacorp"
            className="w-full h-full object-cover transform scale-105 animate-float"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-game-primary/50 to-game-primary"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4 animate-float">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-gradient">
              SuperEvilMegacorp Gaming
            </h1>
            <p className="text-xl md:text-3xl text-gray-300 mb-8">
              Compete. Win. Dominate.
            </p>
            <Link
              to="/1vs1"
              className="btn-primary inline-flex items-center space-x-2 animate-pulse-slow"
            >
              <FaGamepad className="text-xl" />
              <span>Start Playing Now</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Games */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-4xl font-bold text-gradient mb-12 text-center">Featured Games</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game, index) => (
            <div
              key={index}
              className="game-card group"
            >
              <div className="relative pt-[56.25%]">
                <img
                  src={game.image}
                  alt={game.title}
                  className="absolute top-0 left-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-2xl font-bold text-white mb-2">{game.title}</h3>
                    <p className="text-gray-300 mb-4">{game.description}</p>
                    <Link
                      to="/1vs1"
                      className="btn-primary inline-block"
                    >
                      Play Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<FaGamepad className="h-8 w-8" />}
            title="1v1 Matches"
            description="Challenge players in intense 1v1 battles"
            link="/1vs1"
          />
          <FeatureCard
            icon={<FaTrophy className="h-8 w-8" />}
            title="Tournaments"
            description="Join tournaments and win big prizes"
            link="/torneos"
          />
          <FeatureCard
            icon={<FaUserFriends className="h-8 w-8" />}
            title="Community"
            description="Connect with fellow gamers"
            link="/dashboard"
          />
          <FeatureCard
            icon={<FaInfoCircle className="h-8 w-8" />}
            title="About Us"
            description="Learn more about SuperEvilMegacorp"
            link="/sobreNosotros"
          />
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, link }) => {
  return (
    <Link to={link} className="block">
      <div className="glass-effect rounded-lg p-6 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-xl group">
        <div className="text-game-accent mb-4 group-hover:animate-bounce">{icon}</div>
        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-gradient">{title}</h3>
        <p className="text-gray-400 group-hover:text-white transition-colors duration-300">{description}</p>
      </div>
    </Link>
  );
};

export default HomePage;