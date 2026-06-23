import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getStudents } from '../utils/dataStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFees: 0,
    feesCollected: 0,
    balancePending: 0,
  });
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    const data = getStudents();
    
    let tFees = 0;
    let fCollected = 0;
    let bPending = 0;
    const catMap = {};

    data.forEach(s => {
      tFees += s.totalFee;
      fCollected += s.feePaid;
      bPending += s.balance;

      if(s.category) {
        catMap[s.category] = (catMap[s.category] || 0) + 1;
      }
    });

    setStats({
      totalStudents: data.length,
      totalFees: tFees,
      feesCollected: fCollected,
      balancePending: bPending
    });

    const cData = Object.keys(catMap).map(k => ({
      name: k, value: catMap[k]
    })).sort((a,b) => b.value - a.value).slice(0, 5); // top 5 categories
    setCategoryData(cData);
  }, []);

  const COLORS = ['#F37021', '#D95D1A', '#FF8F4D', '#f59e0b', '#fbbf24'];

  const StatCard = ({ title, value, icon, delay }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 100 }}
      className="glass-panel p-6 flex items-center gap-4"
    >
      <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-muted">{title}</p>
        <h3 className="text-2xl font-bold text-slate-text">{value}</h3>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-text">Dashboard</h1>
        <p className="text-slate-muted">Overview of admission and fee statistics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          delay={0.1}
          title="Total Students" 
          value={stats.totalStudents} 
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
        />
        <StatCard 
          delay={0.2}
          title="Total Fees Expected" 
          value={`₹${stats.totalFees.toLocaleString()}`} 
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" /></svg>}
        />
        <StatCard 
          delay={0.3}
          title="Fees Collected" 
          value={`₹${stats.feesCollected.toLocaleString()}`} 
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard 
          delay={0.4}
          title="Balance Pending" 
          value={`₹${stats.balancePending.toLocaleString()}`} 
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="glass-panel p-6"
        >
          <h3 className="text-lg font-semibold text-slate-text mb-4">Top Categories</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" fill="#F37021" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="glass-panel p-6"
        >
          <h3 className="text-lg font-semibold text-slate-text mb-4">Fee Collection Overview</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Collected', value: stats.feesCollected },
                    { name: 'Pending', value: stats.balancePending }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="#F37021" />
                  <Cell fill="#cbd5e1" />
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center pointer-events-none">
              <span className="text-sm text-slate-muted">Collected</span>
              <span className="text-xl font-bold text-brand-dark">
                {Math.round((stats.feesCollected / (stats.totalFees || 1)) * 100)}%
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
