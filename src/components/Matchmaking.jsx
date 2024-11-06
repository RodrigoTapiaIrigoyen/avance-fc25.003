import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaUser, FaGamepad, FaDollarSign } from 'react-icons/fa';
import Card from './ui/Card';
import Button from './ui/Button';
import api from '../utils/api';

const Matchmaking = () => {
  const [onlinePlayers, setOnlinePlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { game, amount } = location.state || {};

  useEffect(() => {
    if (!game || !amount) {
      navigate('/1vs1');
      return;
    }

    const fetchOnlinePlayers = async () => {
      try {
        const response = await api.get('/api/users/connected');
        setOnlinePlayers(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load online players');
        setLoading(false);
      }
    };

    fetchOnlinePlayers();
    const interval = setInterval(fetchOnlinePlayers, 30000);
    return () => clearInterval(interval);
  }, [game, amount, navigate]);

  const sendInvite = async (userId) => {
    try {
      await api.post('/api/matches/invite', {
        userId,
        gameId: game.id,
        amount
      });
      // Show success message
    } catch (err) {
      // Handle error
    }
  };

  if (!game || !amount) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-gradient">Find Opponent</h1>
        <Button variant="secondary" onClick={() => navigate('/1vs1')}>
          Back to Game Selection
        </Button>
      </div>

      <Card className="mb-6">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <img
              src={game.image}
              alt={game.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h2 className="text-xl font-bold text-white">{game.name}</h2>
              <p className="text-game-accent flex items-center">
                <FaDollarSign className="mr-1" />
                {amount} Match
              </p>
            </div>
          </div>
          <div className="text-gray-400">
            <span className="flex items-center">
              <FaUser className="mr-2" />
              {onlinePlayers.length} Online Players
            </span>
          </div>
        </div>
      </Card>

      {loading ? (
        <Card>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-game-accent"></div>
          </div>
        </Card>
      ) : error ? (
        <Card>
          <div className="text-red-500 text-center p-4">{error}</div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {onlinePlayers.map((player) => (
            <Card key={player.id} className="group hover:scale-105 transition-all duration-300">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-game-secondary flex items-center justify-center">
                      <FaUser className="text-game-accent" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-game-secondary"></div>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold group-hover:text-gradient">
                      {player.username}
                    </h3>
                    <p className="text-sm text-gray-400">
                      Online for {formatTimeDifference(new Date(player.lastActive))}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => sendInvite(player.id)}
                  className="flex items-center space-x-2"
                >
                  <FaGamepad />
                  <span>Invite</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const formatTimeDifference = (date) => {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  return `${Math.floor(diff / 3600)}h`;
};

export default Matchmaking;