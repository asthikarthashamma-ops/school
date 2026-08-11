import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Cpu, Fingerprint, Camera, User, RefreshCw, CheckCircle, ShieldAlert, Sparkles } from 'lucide-react';

const BiometricScanner = () => {
  const { students, teachers, markBiometricAttendance } = useApp();

  const [scanType, setScanType] = useState('face'); // face, fingerprint
  const [userType, setUserType] = useState('Student'); // Student, Teacher
  const [selectedUserId, setSelectedUserId] = useState('');
  
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(null); // { user, action, time, status }
  const [scanStatusMsg, setScanStatusMsg] = useState('READY TO SCAN');

  // Filter dropdown list based on Student or Teacher
  const userList = userType === 'Student' ? students : teachers;

  // Auto select first user when lists change
  useEffect(() => {
    if (userList.length > 0) {
      setSelectedUserId(userList[0].id);
    } else {
      setSelectedUserId('');
    }
    setScanSuccess(null);
    setScanStatusMsg('READY TO SCAN');
  }, [userType, scanType]);

  const handleScan = () => {
    if (!selectedUserId) return;
    
    setIsScanning(true);
    setScanSuccess(null);
    setScanStatusMsg(scanType === 'face' ? 'CAPTURING FACIAL DATA...' : 'SCANNING FINGERPRINT CORE...');

    // Multi-phase scanner telemetry messages
    setTimeout(() => {
      setScanStatusMsg(scanType === 'face' ? 'ANALYZING MATRIX POINTS...' : 'EXTRACTING MINUTIAE MAP...');
    }, 1000);

    setTimeout(() => {
      setScanStatusMsg('COMPARING WITH DATABASE...');
    }, 1800);

    setTimeout(() => {
      // Find matches
      const targetUser = userList.find(u => u.id === selectedUserId);
      const deviceId = userType === 'Student' ? targetUser.rollNumber : targetUser.employeeId;
      
      const res = markBiometricAttendance(deviceId, userType, scanType === 'face' ? 'Face' : 'Fingerprint');
      
      setIsScanning(false);
      if (res.success) {
        setScanSuccess(res);
        setScanStatusMsg('VERIFIED');
      } else {
        setScanSuccess(null);
        setScanStatusMsg('ACCESS DENIED');
      }
    }, 2500);
  };

  const getScannerPlaceholderPhoto = (userId) => {
    const matched = userList.find(u => u.id === userId);
    return matched ? matched.photo : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';
  };

  return (
    <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900 transition-all duration-300">
      <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="rounded-xl bg-sky-100 p-2 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400">
          <Cpu className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Simulated Biometric Terminal</h2>
          <p className="text-xs text-slate-550 dark:text-slate-400">Demonstrates check-in hardware logic and parent alert triggers</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Telemetry and Controls Panel */}
        <div className="md:col-span-5 space-y-6">
          
          {/* User Type Toggles */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400">Select User Role</label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                onClick={() => setUserType('Student')}
                disabled={isScanning}
                className={`rounded-xl border py-2.5 text-sm font-semibold transition-all ${
                  userType === 'Student'
                    ? 'border-sky-500 bg-sky-50 text-sky-600 dark:bg-sky-950/30 dark:text-sky-400'
                    : 'border-slate-100 text-slate-600 dark:border-slate-800 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
                }`}
              >
                Student
              </button>
              <button
                onClick={() => setUserType('Teacher')}
                disabled={isScanning}
                className={`rounded-xl border py-2.5 text-sm font-semibold transition-all ${
                  userType === 'Teacher'
                    ? 'border-sky-500 bg-sky-50 text-sky-600 dark:bg-sky-950/30 dark:text-sky-400'
                    : 'border-slate-100 text-slate-600 dark:border-slate-800 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
                }`}
              >
                Teacher
              </button>
            </div>
          </div>

          {/* User selection dropdown */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400">
              Choose profile to simulate
            </label>
            <div className="relative mt-2">
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                disabled={isScanning}
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-4 pr-10 text-sm text-slate-800 outline-none focus:border-sky-500 dark:border-slate-800 dark:bg-slate-850 dark:text-white"
              >
                {userList.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({userType === 'Student' ? `Roll: ${u.rollNumber}` : `ID: ${u.employeeId}`})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Method selector tab */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400">Scanner Engine</label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                onClick={() => setScanType('face')}
                disabled={isScanning}
                className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-semibold transition-all ${
                  scanType === 'face'
                    ? 'border-sky-500 bg-sky-50 text-sky-600 dark:bg-sky-950/30 dark:text-sky-400'
                    : 'border-slate-100 text-slate-600 dark:border-slate-800 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
                }`}
              >
                <Camera className="h-4 w-4" />
                Face Scan
              </button>
              <button
                onClick={() => setScanType('fingerprint')}
                disabled={isScanning}
                className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-semibold transition-all ${
                  scanType === 'fingerprint'
                    ? 'border-sky-500 bg-sky-50 text-sky-600 dark:bg-sky-950/30 dark:text-sky-400'
                    : 'border-slate-100 text-slate-600 dark:border-slate-800 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
                }`}
              >
                <Fingerprint className="h-4 w-4" />
                Fingerprint
              </button>
            </div>
          </div>

          {/* Scanner action trigger */}
          <button
            onClick={handleScan}
            disabled={isScanning || !selectedUserId}
            className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-sky-600 py-4 text-sm font-bold text-white shadow-md shadow-sky-600/10 hover:bg-sky-700 active:scale-98 disabled:opacity-50 dark:bg-sky-600 dark:hover:bg-sky-500"
          >
            {isScanning ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span>Scanning Biometrics...</span>
              </>
            ) : (
              <>
                {scanType === 'face' ? <Camera className="h-5 w-5" /> : <Fingerprint className="h-5 w-5" />}
                <span>Initiate Verification</span>
              </>
            )}
          </button>
        </div>

        {/* Hardware Terminal Render Column */}
        <div className="md:col-span-7 flex flex-col items-center justify-center bg-slate-900 border border-slate-950 dark:border-slate-800 rounded-3xl p-6 min-h-[350px] text-white relative overflow-hidden shadow-inner">
          
          {/* Laser Scanner Viewport */}
          <div className="relative h-48 w-48 rounded-2xl border-2 border-dashed border-sky-500 bg-slate-950 overflow-hidden flex items-center justify-center shadow-lg shadow-sky-500/10">
            {scanType === 'face' ? (
              <>
                {/* Face recognition telemetry boundaries */}
                <div className={`absolute inset-3 border border-dashed border-sky-400/40 rounded-xl transition-all ${isScanning ? 'scale-105 duration-1000 border-green-500/60' : ''}`} />
                
                {/* Telemetry Reticle corner points */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-sky-500" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-sky-500" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-sky-500" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-sky-500" />

                {/* Target Avatar image */}
                {selectedUserId ? (
                  <img
                    src={getScannerPlaceholderPhoto(selectedUserId)}
                    alt="Facial telemetry target"
                    className={`h-36 w-36 rounded-xl object-cover grayscale opacity-75 transition-all ${
                      isScanning ? 'blur-[0.5px] scale-102 opacity-90 grayscale-0 border-2 border-green-500/50' : ''
                    }`}
                  />
                ) : (
                  <User className="h-20 w-20 text-slate-700" />
                )}

                {/* Laser animation */}
                {isScanning && (
                  <div className="absolute w-full h-1 laser-line animate-laser-scan left-0" />
                )}
              </>
            ) : (
              <>
                {/* Fingerprint scanning viewport */}
                <div className={`rounded-full p-6 transition-all duration-300 relative ${
                  isScanning ? 'bg-emerald-950/20 pulse-glow text-green-400' : 'bg-slate-900 text-sky-400'
                }`}>
                  <Fingerprint className="h-24 w-24" />
                </div>
                {/* Laser animation */}
                {isScanning && (
                  <div className="absolute w-full h-1 laser-line animate-laser-scan left-0" />
                )}
              </>
            )}
          </div>

          {/* Telemetry output status details */}
          <div className="mt-5 w-full text-center space-y-1">
            <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-widest border transition-all ${
              isScanning
                ? 'bg-sky-950/50 border-sky-500/50 text-sky-400 animate-pulse'
                : scanSuccess
                ? 'bg-emerald-950/50 border-emerald-500/50 text-green-400'
                : scanStatusMsg === 'ACCESS DENIED'
                ? 'bg-red-950/50 border-red-500/50 text-red-400'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}>
              {scanStatusMsg}
            </span>

            {/* Scanning details / Logs */}
            <div className="text-[11px] font-mono text-slate-500 mt-2 min-h-[36px] flex flex-col justify-center">
              {isScanning && (
                <>
                  <p>MATCHING KEYPOINTS: {Math.floor(60 + Math.random() * 38)}%</p>
                  <p className="text-sky-500/70">SDK ENGINE: OK (V8.4.1)</p>
                </>
              )}
              {!isScanning && !scanSuccess && scanStatusMsg === 'READY TO SCAN' && (
                <p>ALIGN SCAN TARGET AND PRESS VERIFY</p>
              )}
              {!isScanning && scanSuccess && (
                <p className="text-green-500/90 font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5" />
                  AUTHENTICATION SUCCESSFUL
                </p>
              )}
              {!isScanning && scanStatusMsg === 'ACCESS DENIED' && (
                <p className="text-red-500/90 font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  USER IDENTIFICATION FAILURE
                </p>
              )}
            </div>
          </div>

          {/* Verification success panel overlay */}
          {scanSuccess && (
            <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center animate-radar-pulse">
              <div className="rounded-full bg-emerald-500/10 p-3.5 text-green-400 border border-green-500/20 shadow-lg shadow-emerald-500/10">
                <CheckCircle className="h-10 w-10" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-white">Biometric Log Success</h3>
              
              <div className="mt-4 space-y-1.5 text-sm max-w-xs text-slate-350">
                <p className="font-semibold text-white">{scanSuccess.user.name}</p>
                <p className="text-xs">
                  Role: <span className="text-slate-200">{userType}</span>
                </p>
                <p className="text-xs">
                  Event: <span className="font-bold text-slate-200 uppercase">{scanSuccess.action}</span>
                </p>
                <p className="text-xs">
                  Time Recorded: <span className="text-slate-200">{scanSuccess.time}</span>
                </p>
                <p className="text-xs">
                  Shift Entry Status: <span className={`font-bold ${scanSuccess.status === 'Late' ? 'text-amber-400' : 'text-green-400'}`}>{scanSuccess.status}</span>
                </p>
              </div>

              {/* Reset simulator */}
              <button
                onClick={() => setScanSuccess(null)}
                className="mt-6 text-xs font-bold text-sky-400 hover:text-sky-350 hover:underline flex items-center gap-1"
              >
                Clear Terminal Screen
              </button>
            </div>
          )}

        </div>

      </div>
      
      {/* Developer Guidance Callout */}
      <div className="mt-8 rounded-2xl bg-slate-50 dark:bg-slate-850 p-4 border border-slate-100 dark:border-slate-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-sky-600 dark:text-sky-400" />
          Production Hardware API Integration Guide
        </h4>
        <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          In a physical deployment, the biometric scanner device agent (e.g., ZKTeco standalone SDK or Neurotechnology Face Authentication Web Service) handles the verification and triggers an HTTP POST request to the API backend endpoint 
          <code className="mx-1 rounded bg-slate-200 dark:bg-slate-750 px-1 py-0.5 font-mono text-[10px] text-slate-800 dark:text-slate-200">/api/attendance/biometric-scan</code>. 
          The request payload maps the scanned user identifier token (RFID, Fingerprint minutiae ID, or face boundary template key) and records check-in times in MongoDB, which automatically broadcasts parent alerts.
        </p>
      </div>
    </div>
  );
};

export default BiometricScanner;
