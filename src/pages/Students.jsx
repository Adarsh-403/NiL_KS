import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getStudents, saveStudents } from '../utils/dataStore';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: '', enrolmentDate: '', category: '', totalFee: 0, feePaid: 0
  });

  useEffect(() => {
    setStudents(getStudents());
  }, []);

  const categories = [...new Set(students.map(s => s.category).filter(Boolean))];

  // Filter & Search
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          student.slNo.toString().includes(searchQuery);
    const matchesCategory = filterCategory ? student.category === filterCategory : true;
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleExportCSV = () => {
    const headers = ['SL No', 'Name', 'Enrolment Date', 'Category', 'Total Fee', 'Fee Paid', 'Balance'];
    const csvContent = [
      headers.join(','),
      ...filteredStudents.map(s => 
        [s.slNo, s.name, s.enrolmentDate, s.category, s.totalFee, s.feePaid, s.balance].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'students_export.csv';
    link.click();
  };

  const handleAdd = () => {
    setEditingStudent(null);
    setIsAdding(true);
    setFormData({
      name: '', 
      enrolmentDate: new Date().toISOString().split('T')[0], 
      category: '', 
      totalFee: 0, 
      feePaid: 0
    });
    setIsModalOpen(true);
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setIsAdding(false);
    setFormData({
      name: student.name,
      enrolmentDate: student.enrolmentDate.split(' ')[0], // just keep the date part
      category: student.category,
      totalFee: student.totalFee,
      feePaid: student.feePaid
    });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const tFee = parseFloat(formData.totalFee) || 0;
    const fPaid = parseFloat(formData.feePaid) || 0;
    let updatedStudents;

    if (isAdding) {
      // Find max SL No to auto-increment
      const maxSlNo = students.reduce((max, s) => {
        const num = parseInt(s.slNo);
        return !isNaN(num) ? Math.max(max, num) : max;
      }, 0);
      
      const newStudent = {
        id: crypto.randomUUID(),
        slNo: (maxSlNo + 1).toString(),
        name: formData.name,
        enrolmentDate: formData.enrolmentDate,
        category: formData.category,
        totalFee: tFee,
        feePaid: fPaid,
        balance: tFee - fPaid
      };
      // Add to beginning of list
      updatedStudents = [newStudent, ...students];
    } else {
      updatedStudents = students.map(s => {
        if (s.id === editingStudent.id) {
          return {
            ...s,
            ...formData,
            totalFee: tFee,
            feePaid: fPaid,
            balance: tFee - fPaid
          };
        }
        return s;
      });
    }

    setStudents(updatedStudents);
    saveStudents(updatedStudents);
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      const updatedStudents = students.filter(s => s.id !== id);
      setStudents(updatedStudents);
      saveStudents(updatedStudents);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-text">Student Management</h1>
          <p className="text-slate-muted">Manage admissions, view details, and track fee balances.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleExportCSV} className="btn-secondary flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Export CSV
          </button>
          <button onClick={handleAdd} className="btn-primary flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            Add Student
          </button>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel overflow-hidden"
      >
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 bg-white/40">
          <div className="flex-1 relative">
            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              type="text"
              placeholder="Search by name or Sl No..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
              value={searchQuery}
              onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}}
            />
          </div>
          <select 
            className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-slate-600"
            value={filterCategory}
            onChange={(e) => {setFilterCategory(e.target.value); setCurrentPage(1);}}
          >
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-sm border-b border-slate-200">
                <th className="px-6 py-4 font-medium">SL No</th>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium text-right">Total Fee</th>
                <th className="px-6 py-4 font-medium text-right">Fee Paid</th>
                <th className="px-6 py-4 font-medium text-right">Balance</th>
                <th className="px-6 py-4 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {paginatedStudents.length > 0 ? paginatedStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-3 font-medium text-slate-700">{student.slNo}</td>
                  <td className="px-6 py-3 text-slate-800 font-semibold">{student.name}</td>
                  <td className="px-6 py-3 text-slate-500 whitespace-nowrap">{student.enrolmentDate.split(' ')[0]}</td>
                  <td className="px-6 py-3">
                    <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-brand-primary/10 text-brand-dark border border-brand-primary/20">
                      {student.category}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">₹{student.totalFee}</td>
                  <td className="px-6 py-3 text-right text-emerald-600 font-medium">₹{student.feePaid}</td>
                  <td className="px-6 py-3 text-right">
                    <span className={`font-medium ${student.balance > 0 ? 'text-rose-500' : 'text-slate-500'}`}>
                      ₹{student.balance}
                    </span>
                  </td>
                  <td className="px-6 py-3 flex justify-center gap-2">
                    <button onClick={() => handleEdit(student)} className="p-1.5 text-slate-400 hover:text-brand-primary transition-colors bg-white rounded-md shadow-sm border border-slate-200" title="Edit">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button onClick={() => handleDelete(student.id)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors bg-white rounded-md shadow-sm border border-slate-200" title="Delete">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-slate-500">No records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-white/40">
          <span className="text-sm text-slate-500">
            Showing <span className="font-medium">{paginatedStudents.length}</span> of <span className="font-medium">{filteredStudents.length}</span> results
          </span>
          <div className="flex gap-1">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="px-3 py-1 border border-slate-200 rounded-md text-sm disabled:opacity-50 hover:bg-slate-50 transition-colors"
            >
              Prev
            </button>
            <span className="px-3 py-1 text-sm font-medium bg-brand-primary/10 text-brand-dark rounded-md">
              {currentPage} / {totalPages || 1}
            </span>
            <button 
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="px-3 py-1 border border-slate-200 rounded-md text-sm disabled:opacity-50 hover:bg-slate-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </motion.div>

      {/* Edit/Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-semibold text-lg text-slate-800">
                {isAdding ? 'Add New Student' : 'Edit Student'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Name</label>
                <input 
                  type="text" 
                  required 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  className="input-field py-2" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Category</label>
                  <input 
                    type="text" 
                    required
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})} 
                    className="input-field py-2" 
                    placeholder="e.g. HMV"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Date</label>
                  <input 
                    type="date" 
                    required
                    value={formData.enrolmentDate} 
                    onChange={e => setFormData({...formData, enrolmentDate: e.target.value})} 
                    className="input-field py-2" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Total Fee (₹)</label>
                  <input 
                    type="number" 
                    required 
                    min="0"
                    value={formData.totalFee} 
                    onChange={e => setFormData({...formData, totalFee: e.target.value})} 
                    className="input-field py-2" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Fee Paid (₹)</label>
                  <input 
                    type="number" 
                    required 
                    min="0"
                    value={formData.feePaid} 
                    onChange={e => setFormData({...formData, feePaid: e.target.value})} 
                    className="input-field py-2" 
                  />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">
                  {isAdding ? 'Add Student' : 'Save Changes'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
