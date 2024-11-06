import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCreditCard, FaPaypal, FaBitcoin, FaDollarSign } from 'react-icons/fa';
import Card from './ui/Card';
import Button from './ui/Button';
import api from '../utils/api';

// Initialize Stripe outside of component
let stripePromise;
const initializeStripe = async () => {
  if (!stripePromise) {
    const { loadStripe } = await import('@stripe/stripe-js');
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
  }
  return stripePromise;
};

const Depositos = () => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [balance, setBalance] = useState(0);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [balanceError, setBalanceError] = useState(null);

  useEffect(() => {
    const fetchBalance = async () => {
      setBalanceLoading(true);
      setBalanceError(null);
      try {
        const response = await api.get('/balance');
        if (response.data && typeof response.data.balance === 'number') {
          setBalance(response.data.balance);
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to fetch balance';
        setBalanceError(errorMessage);
        console.error('Error fetching balance:', err);
      } finally {
        setBalanceLoading(false);
      }
    };

    fetchBalance();
  }, []);

  const handleDeposit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const stripe = await initializeStripe();
      if (!stripe) {
        throw new Error('Failed to initialize Stripe');
      }

      const response = await api.post('/payments/create-payment-intent', {
        amount: parseFloat(amount)
      });

      if (!response.data || !response.data.clientSecret) {
        throw new Error('Invalid payment intent response');
      }

      const result = await stripe.confirmCardPayment(response.data.clientSecret, {
        payment_method: {
          card: elements.getElement('card'),
          billing_details: {
            name: 'Test User',
          },
        },
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      // Refresh balance after successful payment
      const balanceResponse = await api.get('/balance');
      if (balanceResponse.data && typeof balanceResponse.data.balance === 'number') {
        setBalance(balanceResponse.data.balance);
      }
      
      setAmount('');
      
    } catch (err) {
      setError(err.message || 'Error processing payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-gradient">Deposit Funds</h1>
        <Link to="/">
          <Button variant="secondary">Back to Home</Button>
        </Link>
      </div>

      <Card className="p-6">
        <h2 className="text-2xl font-bold text-gradient mb-6">Current Balance</h2>
        <div className="text-4xl font-bold text-white flex items-center justify-center p-4">
          {balanceLoading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-game-accent"></div>
          ) : balanceError ? (
            <div className="text-red-500 text-base">{balanceError}</div>
          ) : (
            <>
              <FaDollarSign className="text-game-accent" />
              <span>{balance.toFixed(2)}</span>
            </>
          )}
        </div>
      </Card>

      <Card className="p-8">
        <form onSubmit={handleDeposit} className="space-y-8">
          <div>
            <label className="block text-white mb-2 text-lg font-semibold">
              Deposit Amount
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaDollarSign className="text-game-accent" />
              </div>
              <input
                type="number"
                min="5"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input-primary pl-10"
                placeholder="Enter amount (min. $5)"
                required
              />
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
            disabled={!amount || loading}
          >
            <div className="flex items-center justify-center space-x-2">
              <FaDollarSign className="text-xl" />
              <span>{loading ? 'Processing...' : 'Complete Deposit'}</span>
            </div>
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Depositos;