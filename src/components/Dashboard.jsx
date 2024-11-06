import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaGamepad, FaTrophy, FaWallet, FaChartLine, FaFire, FaCrown, FaMedal, FaHistory } from 'react-icons/fa';
import Card from './ui/Card';
import Button from './ui/Button';
import api from '../utils/api';

const Dashboard = () => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await api.get('/api/balance');
        setBalance(response.data.balance);
      } catch (error) {
        console.error('Error fetching balance:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, []);

  const stats = [
    { icon: <FaGamepad />, title: 'Matches Played', value: '157', trend: '+12 this week' },
    { icon: <FaTrophy />, title: 'Tournaments Won', value: '12', trend: '+2 this month' },
    { icon: <FaWallet />, title: 'Total Earnings', value: `$${balance.toFixed(2)}`, trend: '+$450 today' },
    { icon: <FaChartLine />, title: 'Win Rate', value: '68%', trend: '+5% improvement' }
  ];

  const recentMatches = [
    { game: 'FIFA FC 24', result: 'Victory', reward: '+$50', date: '2h ago', opponent: 'ProGamer123' },
    { game: 'Dragon Ball', result: 'Victory', reward: '+$75', date: '5h ago', opponent: 'DBZMaster' },
    { game: 'Warzone', result: 'Defeat', reward: '-$25', date: '1d ago', opponent: 'WarriorElite' }
  ];

  const achievements = [
    { icon: <FaCrown />, title: 'Champion', description: 'Win 100 matches', progress: 85 },
    { icon: <FaMedal />, title: 'Tournament Master', description: 'Win 10 tournaments', progress: 60 },
    { icon: <FaFire />, title: 'Win Streak', description: '10 consecutive wins', progress: 40 }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h1 className="text-gradient">Player Dashboard</h1>
        <Link to="/">
          <Button variant="secondary">Back to Home</Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card transform hover:scale-105 transition-all duration-300">
            <Card className="p-6 group">
              <div className="text-game-accent text-3xl mb-4 group-hover:animate-bounce">
                {stat.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-gradient">
                {stat.title}
              </h3>
              <p className="text-3xl font-bold text-game-accent group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-game-accent group-hover:to-purple-500">
                {stat.value}
              </p>
              <p className="text-sm text-gray-400 mt-2">{stat.trend}</p>
            </Card>
          </div>
        ))}
      </div>

      {/* Recent Matches */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gradient">Recent Matches</h2>
          <FaHistory className="text-game-accent text-xl animate-spin-slow" />
        </div>
        <div className="space-y-4">
          {recentMatches.map((match, index) => (
            <div
              key={index}
              className="glass-effect p-4 rounded-lg transition-all duration-300 hover:scale-102 group cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <div className="text-white font-semibold group-hover:text-gradient">
                    {match.game}
                  </div>
                  <div className="text-sm text-gray-400">
                    vs {match.opponent}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${
                    match.result === 'Victory' 
                      ? 'text-green-500' 
                      : 'text-red-500'
                  }`}>
                    {match.result}
                  </div>
                  <div className={`text-sm ${
                    match.reward.includes('+') 
                      ? 'text-green-400' 
                      : 'text-red-400'
                  }`}>
                    {match.reward}
                  </div>
                  <div className="text-xs text-gray-400">{match.date}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Achievements */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-gradient mb-6">Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className="glass-effect p-4 rounded-lg transition-all duration-300 hover:scale-105 group"
            >
              <div className="flex items-center space-x-4">
                <div className="text-game-accent text-2xl group-hover:animate-bounce">
                  {achievement.icon}
                </div>
                <div>
                  <h3 className="text-white font-semibold group-hover:text-gradient">
                    {achievement.title}
                  </h3>
                  <p className="text-sm text-gray-400">{achievement.description}</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-game-accent">
                        {achievement.progress}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-700">
                    <div
                      style={{ width: `${achievement.progress}%` }}
                      className="animate-pulse shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-game-accent to-purple-500"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/1vs1" className="group">
          <Card className="p-6 hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <FaGamepad className="text-3xl text-game-accent group-hover:animate-bounce" />
                <h3 className="text-lg font-semibold mt-2 group-hover:text-gradient">Quick Match</h3>
                <p className="text-sm text-gray-400">Find a 1v1 match now</p>
              </div>
              <div className="text-game-accent group-hover:translate-x-2 transition-transform">
                →
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/torneos" className="group">
          <Card className="p-6 hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <FaTrophy className="text-3xl text-game-accent group-hover:animate-bounce" />
                <h3 className="text-lg font-semibold mt-2 group-hover:text-gradient">Tournaments</h3>
                <p className="text-sm text-gray-400">Join upcoming tournaments</p>
              </div>
              <div className="text-game-accent group-hover:translate-x-2 transition-transform">
                →
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/depositos" className="group">
          <Card className="p-6 hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <FaWallet className="text-3xl text-game-accent group-hover:animate-bounce" />
                <h3 className="text-lg font-semibold mt-2 group-hover:text-gradient">Deposit</h3>
                <p className="text-sm text-gray-400">Add funds to your account</p>
              </div>
              <div className="text-game-accent group-hover:translate-x-2 transition-transform">
                →
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;