import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCreditCard, FaPaypal, FaBitcoin, FaDollarSign, FaHistory } from 'react-icons/fa';
import Card from './ui/Card';
import Button from './ui/Button';
import api from '../utils/api';

const Retiros = () => {
  const [amount, setAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const withdrawMethods = [
    { id: 'bank', name: 'Bank Transfer', icon: <FaCreditCard className="h-6 w-6" /> },
    { id: 'paypal', name: 'PayPal', icon: <FaPaypal className="h-6 w-6" /> },
    { id: 'crypto', name: 'Cryptocurrency', icon: <FaBitcoin className="h-6 w-6" /> }
  ];

  const recentWithdrawals = [
    { id: 1, method: 'PayPal', amount: 100, status: 'completed', date: '2024-01-15' },
    { id: 2, method: 'Bank Transfer', amount: 250, status: 'pending', date: '2024-01-10' },
    { id: 3, method: 'Bitcoin', amount: 500, status: 'completed', date: '2024-01-05' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.post('/api/withdrawals', {
        amount: parseFloat(amount),
        method: withdrawMethod
      });
      setAmount('');
      setWithdrawMethod('');
      // Show success message or redirect
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process withdrawal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-gradient">Withdraw Funds</h1>
        <Link to="/">
          <Button variant="secondary">Back to Home</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-gradient mb-6">Available Balance</h2>
          <div className="text-4xl font-bold text-white flex items-center justify-center p-4">
            <FaDollarSign className="text-game-accent" />
            <span>1,250.00</span>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-bold text-gradient mb-6">Pending Withdrawals</h2>
          <div className="text-4xl font-bold text-white flex items-center justify-center p-4">
            <FaDollarSign className="text-game-accent" />
            <span>250.00</span>
          </div>
        </Card>
      </div>

      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-white mb-2 text-lg font-semibold">Withdrawal Amount</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaDollarSign className="text-game-accent" />
              </div>
              <input
                type="number"
                min="10"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input-primary pl-10"
                placeholder="Enter amount (min. $10)"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-white mb-4 text-lg font-semibold">Withdrawal Method</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {withdrawMethods.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setWithdrawMethod(method.id)}
                  className={`glass-effect p-6 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                    withdrawMethod === method.id
                      ? 'ring-2 ring-game-accent bg-game-accent/20 animate-glow'
                      : 'hover:bg-white/10'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-3">
                    <div className={`${
                      withdrawMethod === method.id ? 'text-white' : 'text-game-accent'
                    } transition-colors duration-300`}>
                      {method.icon}
                    </div>
                    <span className="text-white font-medium">{method.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full py-4 text-lg"
            disabled={!amount || !withdrawMethod || loading}
          >
            <div className="flex items-center justify-center space-x-2">
              <FaDollarSign className="text-xl" />
              <span>{loading ? 'Processing...' : 'Request Withdrawal'}</span>
            </div>
          </Button>
        </form>
      </Card>

      <Card className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gradient">Recent Withdrawals</h2>
          <FaHistory className="text-game-accent text-xl" />
        </div>
        <div className="space-y-4">
          {recentWithdrawals.map((withdrawal) => (
            <div
              key={withdrawal.id}
              className="glass-effect p-4 rounded-lg transition-all duration-300 hover:scale-102 group"
            >
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <div className="text-white font-semibold group-hover:text-gradient">
                    {withdrawal.method}
                  </div>
                  <div className="text-sm text-gray-400">
                    {new Date(withdrawal.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-game-accent font-bold group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-game-accent group-hover:to-purple-500">
                    ${withdrawal.amount.toFixed(2)}
                  </div>
                  <div className={`text-sm ${
                    withdrawal.status === 'completed' ? 'text-green-500' : 'text-yellow-500'
                  }`}>
                    {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Retiros;