import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FaCheckCircle, FaTrophy, FaCalendar, FaUsers } from 'react-icons/fa';
import Card from './ui/Card';
import Button from './ui/Button';

const TournamentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const tournament = location.state?.tournament;

  useEffect(() => {
    if (!tournament) {
      navigate('/torneos');
    }
  }, [tournament, navigate]);

  if (!tournament) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 animate-fadeIn">
      <Card className="max-w-2xl w-full p-8">
        <div className="text-center space-y-6">
          <FaCheckCircle className="text-green-500 text-6xl mx-auto animate-bounce-slow" />
          
          <h1 className="text-3xl font-bold text-gradient">
            Tournament Registration Successful!
          </h1>
          
          <p className="text-gray-300 text-lg">
            You have successfully registered for the {tournament.name}
          </p>

          <div className="bg-game-secondary/50 p-6 rounded-lg mt-8">
            <h2 className="text-xl font-semibold text-white mb-4">Tournament Details</h2>
            <div className="space-y-3">
              <DetailRow icon={<FaTrophy />} label="Prize Pool" value={`$${tournament.prizePool.toLocaleString()}`} />
              <DetailRow icon={<FaCalendar />} label="Start Date" value={new Date(tournament.startDate).toLocaleDateString()} />
              <DetailRow icon={<FaUsers />} label="Participants" value={`${tournament.participants}/${tournament.maxParticipants}`} />
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <p className="text-gray-400">
              Check your email for additional tournament information and instructions.
            </p>
            
            <div className="flex justify-center space-x-4">
              <Link to="/dashboard">
                <Button variant="secondary">Go to Dashboard</Button>
              </Link>
              <Link to="/torneos">
                <Button>View More Tournaments</Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

const DetailRow = ({ icon, label, value }) => (
  <div className="flex items-center justify-between text-gray-300">
    <div className="flex items-center space-x-2">
      <span className="text-game-accent">{icon}</span>
      <span>{label}</span>
    </div>
    <span className="font-semibold text-white">{value}</span>
  </div>
);

export default TournamentSuccess;