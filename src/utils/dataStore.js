import { useState, useEffect } from 'react';
import initialStudents from '../data/initialStudents.json';

// Utility to manage local storage
export const getStudents = () => {
  const data = localStorage.getItem('students_data');
  if (data) {
    return JSON.parse(data);
  }
  // Initialize from JSON if empty
  localStorage.setItem('students_data', JSON.stringify(initialStudents));
  return initialStudents;
};

export const saveStudents = (students) => {
  localStorage.setItem('students_data', JSON.stringify(students));
};
