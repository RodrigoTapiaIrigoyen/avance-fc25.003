import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { FaUsers, FaMoneyBillWave, FaChartLine, FaExclamationTriangle } from 'react-icons/fa';
import Card from './ui/Card';
import Button from './ui/Button';
import api from '../utils/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    activeUsers: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    pendingWithdrawals: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await api.get('/api/auth/check-admin');
        setIsAdmin(response.data.isAdmin);
      } catch (err) {
        setIsAdmin(false);
      }
    };

    const fetchStats = async () => {
      try {
        const response = await api.get('/api/admin/stats');
        setStats(response.data);
      } catch (err) {
        setError('Failed to load admin statistics');
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-game-accent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-gradient">Admin Dashboard</h1>
        <Button variant="secondary" onClick={() => window.location.reload()}>
          Refresh Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<FaUsers />}
          title="Active Users"
          value={stats.activeUsers}
          trend="+5% from last week"
        />
        <StatCard
          icon={<FaMoneyBillWave />}
          title="Total Deposits"
          value={`$${stats.totalDeposits.toLocaleString()}`}
          trend="+12% from last month"
        />
        <StatCard
          icon={<FaChartLine />}
          title="Total Withdrawals"
          value={`$${stats.totalWithdrawals.toLocaleString()}`}
          trend="-3% from last month"
        />
        <StatCard
          icon={<FaExclamationTriangle />}
          title="Pending Withdrawals"
          value={stats.pendingWithdrawals}
          trend="4 require review"
          urgent
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivityCard />
        <UserManagementCard />
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, trend, urgent }) => (
  <Card className={`p-6 ${urgent ? 'ring-2 ring-yellow-500 animate-pulse' : ''}`}>
    <div className="flex items-center justify-between mb-4">
      <div className="text-game-accent text-2xl">{icon}</div>
      <div className={`text-sm ${urgent ? 'text-yellow-500' : 'text-gray-400'}`}>
        {trend}
      </div>
    </div>
    <div className="space-y-2">
      <h3 className="text-white font-medium">{title}</h3>
      <p className="text-2xl font-bold text-game-accent">{value}</p>
    </div>
  </Card>
);

const RecentActivityCard = () => (
  <Card className="p-6">
    <h2 className="text-xl font-bold text-gradient mb-4">Recent Activity</h2>
    <div className="space-y-4">
      <ActivityItem
        action="Withdrawal Request"
        user="john.doe@example.com"
        amount="$1,000"
        time="5 minutes ago"
        status="pending"
      />
      <ActivityItem
        action="New User Registration"
        user="alice.smith@example.com"
        time="15 minutes ago"
        status="completed"
      />
      <ActivityItem
        action="Deposit"
        user="bob.wilson@example.com"
        amount="$500"
        time="1 hour ago"
        status="completed"
      />
    </div>
  </Card>
);

const ActivityItem = ({ action, user, amount, time, status }) => (
  <div className="flex items-center justify-between p-3 bg-game-secondary/50 rounded-lg">
    <div className="space-y-1">
      <div className="text-white font-medium">{action}</div>
      <div className="text-sm text-gray-400">{user}</div>
    </div>
    <div className="text-right">
      {amount && <div className="text-game-accent font-medium">{amount}</div>}
      <div className="text-sm text-gray-400">{time}</div>
      <div className={`text-sm ${
        status === 'completed' ? 'text-green-500' : 'text-yellow-500'
      }`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </div>
    </div>
  </div>
);

const UserManagementCard = () => (
  <Card className="p-6">
    <h2 className="text-xl font-bold text-gradient mb-4">User Management</h2>
    <div className="space-y-4">
      <UserItem
        email="john.doe@example.com"
        status="active"
        lastLogin="2 hours ago"
      />
      <UserItem
        email="alice.smith@example.com"
        status="suspended"
        lastLogin="1 day ago"
      />
      <UserItem
        email="bob.wilson@example.com"
        status="active"
        lastLogin="5 minutes ago"
      />
    </div>
  </Card>
);

const UserItem = ({ email, status, lastLogin }) => (
  <div className="flex items-center justify-between p-3 bg-game-secondary/50 rounded-lg">
    <div className="space-y-1">
      <div className="text-white font-medium">{email}</div>
      <div className="text-sm text-gray-400">Last login: {lastLogin}</div>
    </div>
    <div className="flex items-center space-x-2">
      <span className={`px-2 py-1 rounded text-sm ${
        status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
      }`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
      <Button variant="secondary" size="sm">
        Manage
      </Button>
    </div>
  </div>
);

export default AdminDashboard;