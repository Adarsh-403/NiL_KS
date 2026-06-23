import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getStudents } from '../utils/dataStore';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

export default function Analytics() {
  const [timelineData, setTimelineData] = useState([]);
  const [feeData, setFeeData] = useState([]);

  useEffect(() => {
    const data = getStudents();
    
    // Process timeline data (admissions per month)
    const monthMap = {};
    const cMap = {};
    
    data.forEach(s => {
      if (s.enrolmentDate) {
        // Extract YYYY-MM
        const month = s.enrolmentDate.substring(0, 7);
        monthMap[month] = (monthMap[month] || 0) + 1;
      }
      if (s.category) {
        if (!cMap[s.category]) {
          cMap[s.category] = { category: s.category, totalFee: 0, feePaid: 0, balance: 0 };
        }
        cMap[s.category].totalFee += s.totalFee;
        cMap[s.category].feePaid += s.feePaid;
        cMap[s.category].balance += s.balance;
      }
    });

    const tData = Object.keys(monthMap).sort().map(k => ({
      month: k,
      admissions: monthMap[k]
    }));
    setTimelineData(tData);

    const fData = Object.values(cMap).sort((a,b) => b.totalFee - a.totalFee).slice(0, 8); // Top 8 categories
    setFeeData(fData);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-text">Analytics & Reports</h1>
        <p className="text-slate-muted">Detailed insights into admissions and fee collections.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6"
        >
          <h3 className="text-lg font-semibold text-slate-text mb-6">Admission Timeline</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAdmissions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F37021" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#F37021" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="admissions" stroke="#F37021" strokeWidth={3} fillOpacity={1} fill="url(#colorAdmissions)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-6"
        >
          <h3 className="text-lg font-semibold text-slate-text mb-6">Fee Analysis by Category</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={feeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip formatter={(value) => `₹${value}`} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" />
                <Bar dataKey="feePaid" name="Fee Paid" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
                <Bar dataKey="balance" name="Balance Pending" stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-panel p-6 overflow-hidden"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-slate-text">Category Summary</h3>
          <button className="text-brand-primary text-sm font-medium hover:underline">Download Report</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-500 text-sm border-b border-slate-200">
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium text-right">Total Fees</th>
                <th className="pb-3 font-medium text-right">Collected</th>
                <th className="pb-3 font-medium text-right">Balance</th>
                <th className="pb-3 font-medium text-right">Recovery Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {feeData.map((row) => (
                <tr key={row.category}>
                  <td className="py-3 font-medium text-slate-800">{row.category}</td>
                  <td className="py-3 text-right">₹{row.totalFee.toLocaleString()}</td>
                  <td className="py-3 text-right text-emerald-600 font-medium">₹{row.feePaid.toLocaleString()}</td>
                  <td className="py-3 text-right text-rose-500 font-medium">₹{row.balance.toLocaleString()}</td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-brand-primary rounded-full" 
                          style={{ width: `${Math.round((row.feePaid / (row.totalFee || 1)) * 100)}%` }}
                        ></div>
                      </div>
                      <span className="w-8 text-xs font-semibold text-slate-600">
                        {Math.round((row.feePaid / (row.totalFee || 1)) * 100)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
