import React from 'react';
import { Link } from 'react-router-dom';
import { FaGamepad, FaTrophy, FaShieldAlt, FaUsers, FaEnvelope, FaDiscord } from 'react-icons/fa';
import Card from './ui/Card';
import Button from './ui/Button';

const SobreNosotros = () => {
  const features = [
    {
      icon: <FaGamepad />,
      title: 'Competitive Gaming',
      description: 'Join intense 1v1 matches in our most popular games'
    },
    {
      icon: <FaTrophy />,
      title: 'Regular Tournaments',
      description: 'Participate in daily and weekly tournaments with big prizes'
    },
    {
      icon: <FaShieldAlt />,
      title: 'Secure Platform',
      description: 'Advanced security measures to protect your account and funds'
    },
    {
      icon: <FaUsers />,
      title: 'Growing Community',
      description: 'Join thousands of active gamers in our thriving community'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-gradient">About Us</h1>
        <Link to="/">
          <Button variant="secondary">Back to Home</Button>
        </Link>
      </div>

      <Card className="p-8">
        <h2 className="text-2xl font-bold text-gradient mb-4">Our Mission</h2>
        <p className="text-gray-300 text-lg leading-relaxed">
          At SuperEvilMegacorpGaming, we're dedicated to creating the ultimate competitive gaming
          platform where players can showcase their skills, compete for prizes, and become
          part of a thriving gaming community. Our platform is built on the principles of
          fair play, transparency, and continuous innovation.
        </p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <div key={index} className="group">
            <Card className="p-6 transition-all duration-300 transform hover:scale-105">
              <div className="text-game-accent text-3xl mb-4 group-hover:animate-bounce">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-gradient">{feature.title}</h3>
              <p className="text-gray-400 group-hover:text-white transition-colors duration-300">{feature.description}</p>
            </Card>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-8 group">
          <h2 className="text-2xl font-bold text-gradient mb-4">Why Choose Us</h2>
          <ul className="space-y-4">
            <FeatureItem text="Fair and competitive matchmaking" />
            <FeatureItem text="Secure payment processing" />
            <FeatureItem text="24/7 customer support" />
            <FeatureItem text="Regular tournaments and events" />
          </ul>
        </Card>

        <Card className="p-8">
          <h2 className="text-2xl font-bold text-gradient mb-4">Contact Us</h2>
          <div className="space-y-6">
            <p className="text-gray-300">Have questions or feedback? We'd love to hear from you!</p>
            
            <ContactItem
              icon={<FaEnvelope />}
              label="Email"
              value="support@superevilmegacorp.com"
              href="mailto:support@superevilmegacorp.com"
            />
            
            <ContactItem
              icon={<FaDiscord />}
              label="Discord"
              value="Join our Discord community"
              href="#"
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

const FeatureItem = ({ text }) => (
  <li className="flex items-center group">
    <span className="h-2 w-2 bg-game-accent rounded-full mr-3 group-hover:animate-pulse"></span>
    <span className="text-gray-300 group-hover:text-white transition-colors duration-300">{text}</span>
  </li>
);

const ContactItem = ({ icon, label, value, href }) => (
  <div className="group">
    <div className="flex items-center space-x-2 text-game-accent mb-1">
      {icon}
      <strong className="text-white group-hover:text-gradient">{label}:</strong>
    </div>
    <a
      href={href}
      className="text-game-accent hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-game-accent hover:to-purple-500 transition-all duration-300"
    >
      {value}
    </a>
  </div>
);

export default SobreNosotros;