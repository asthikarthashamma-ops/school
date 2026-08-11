import React from 'react';
import BiometricScanner from '../../components/BiometricScanner';

const BiometricSimulator = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Attendance Verification Hub</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Simulate student check-ins and test parent notification hooks</p>
      </div>

      <BiometricScanner />
    </div>
  );
};

export default BiometricSimulator;
