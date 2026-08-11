import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import TransportMap from '../../components/TransportMap';
import { Truck, Users, Phone, MapPin, CheckCircle, Clock, AlertTriangle, Sparkles } from 'lucide-react';

const TransportManager = () => {
  const { user } = useAuth();
  const { students, busRoutes, updateBusStatus, showToast } = useApp();

  const [assignStudentId, setAssignStudentId] = useState('');
  const [assignRouteId, setAssignRouteId] = useState('route-1');

  // Handle student route assignment
  const handleAssignSubmit = (e) => {
    e.preventDefault();
    if (!assignStudentId) return;
    
    // Simply display mock feedback (or logic can push studentId to route's assignedStudents list)
    const stud = students.find(s => s.id === assignStudentId);
    const route = busRoutes.find(r => r.id === assignRouteId);
    
    showToast(`${stud.name} has been assigned to ${route.routeName} successfully.`, 'success');
  };

  const getStudentName = (studId) => {
    return students.find(s => s.id === studId)?.name || 'Student';
  };

  // ----------------------------------------------------
  // ADMIN PANEL
  // ----------------------------------------------------
  const renderAdminView = () => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Vector Map Tracker Card */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-base font-bold text-slate-800 dark:text-white mb-3">Live Fleet GPS Visualizer</h3>
            <TransportMap routesList={busRoutes} showAll={true} />
          </div>

          {/* Student route assigner card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-bold text-slate-855 dark:text-white flex items-center gap-1.5">
              <Users className="h-4.5 w-4.5 text-sky-600" />
              Assign Students to Routes
            </h3>
            <form onSubmit={handleAssignSubmit} className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <select
                  value={assignStudentId}
                  onChange={(e) => setAssignStudentId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 outline-none dark:border-slate-800 dark:bg-slate-850 dark:text-slate-300"
                >
                  <option value="">Select Student...</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} (Roll: {s.rollNumber})</option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  value={assignRouteId}
                  onChange={(e) => setAssignRouteId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 outline-none dark:border-slate-800 dark:bg-slate-850 dark:text-slate-300"
                >
                  {busRoutes.map(r => (
                    <option key={r.id} value={r.id}>{r.routeName} ({r.busNumber})</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="rounded-xl bg-sky-600 text-white font-bold py-2.5 text-xs hover:bg-sky-700 shadow-sm"
              >
                Assign Transport
              </button>
            </form>
          </div>
        </div>

        {/* Fleet Routes Controls Card */}
        <div className="lg:col-span-5 space-y-6">
          {busRoutes.map(route => (
            <div key={route.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h4 className="font-extrabold text-slate-800 dark:text-white text-sm">{route.routeName}</h4>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Bus Fleet Ref: {route.busNumber}</span>
                </div>
                
                {/* Route status toggle */}
                <select
                  value={route.status}
                  onChange={(e) => updateBusStatus(route.id, e.target.value)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold uppercase tracking-wider border outline-none ${
                    route.status === 'En Route'
                      ? 'bg-green-50 border-green-200 text-green-600 dark:bg-emerald-950/20'
                      : route.status === 'Delayed'
                      ? 'bg-amber-50 border-amber-250 text-amber-600 dark:bg-amber-950/20'
                      : 'bg-slate-50 border-slate-200 text-slate-500 dark:bg-slate-850'
                  }`}
                >
                  <option value="Idle">Idle</option>
                  <option value="En Route">En Route</option>
                  <option value="Delayed">Delayed</option>
                </select>
              </div>

              {/* Driver & stops layout details */}
              <div className="space-y-2 text-xs text-slate-655 dark:text-slate-400">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold">Driver Name:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{route.driverName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold">Driver Contact:</span>
                  <a href={`tel:${route.driverPhone}`} className="font-bold text-sky-600 flex items-center gap-1 dark:text-sky-400">
                    <Phone className="h-3.5 w-3.5" />
                    {route.driverPhone}
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold">Passengers Count:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{route.assignedStudents.length} Students</span>
                </div>
              </div>

              {/* Passengers lists */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Assigned Student Manifest</span>
                <div className="flex flex-wrap gap-1.5">
                  {route.assignedStudents.map((sId, index) => (
                    <span key={index} className="rounded-md bg-slate-100 dark:bg-slate-850 px-2 py-0.5 text-[10px] text-slate-600 dark:text-slate-350">
                      {getStudentName(sId)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ----------------------------------------------------
  // PARENT/STUDENT PANEL
  // ----------------------------------------------------
  const renderClientView = () => {
    // Find route assigned to this student
    const studentRefId = user.role === 'parent' 
      ? students.find(s => s.parentId === user.refId)?.id 
      : user.refId;

    const childRoute = busRoutes.find(r => r.assignedStudents.includes(studentRefId));

    if (!childRoute) {
      return (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-405 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
          <Truck className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700 mb-4" />
          <p className="font-bold text-sm">No Transport Routes assigned yet</p>
          <p className="text-xs mt-1 text-slate-400">Please contact the AuraAcademy Administration office to configure transport schedules.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left side: Live tracker map */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-base font-bold text-slate-800 dark:text-white mb-3">Live Transit Tracking Map</h3>
            <TransportMap route={childRoute} showAll={false} />
          </div>
        </div>

        {/* Right side: driver contact and stops checklist */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Driver details */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h3 className="text-base font-bold text-slate-855 dark:text-white">Assigned Bus Details</h3>
            
            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="rounded-xl bg-sky-100 dark:bg-sky-950/40 p-2.5 text-sky-600">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <span className="block text-sm font-bold text-slate-800 dark:text-white">{childRoute.routeName}</span>
                <p className="text-[10px] text-slate-450 uppercase font-bold tracking-wider">Bus Number: {childRoute.busNumber}</p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs text-slate-655 dark:text-slate-450 pt-2">
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Driver Name</span>
                <span className="font-semibold text-slate-805 dark:text-slate-200">{childRoute.driverName}</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-3">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Emergency Hotline</span>
                <a href={`tel:${childRoute.driverPhone}`} className="inline-flex items-center gap-1 bg-sky-50 dark:bg-sky-950/30 px-3 py-1.5 rounded-lg font-bold text-sky-600 dark:text-sky-400">
                  <Phone className="h-3.5 w-3.5" />
                  {childRoute.driverPhone}
                </a>
              </div>
            </div>
          </div>

          {/* Stops Timeline */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h3 className="text-base font-bold text-slate-855 dark:text-white">Route Stops Timeline</h3>

            {childRoute.status === 'Idle' && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 text-slate-500 text-xs">
                <Clock className="h-4 w-4 shrink-0 text-slate-400" />
                <span>The bus is currently idle at terminal. Simulated runs start when the Admin changes route status to **En Route**.</span>
              </div>
            )}

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {childRoute.stops.map((stop, idx) => {
                const isPassed = idx < childRoute.currentStopIndex || childRoute.status === 'Idle';
                const isCurrent = idx === childRoute.currentStopIndex && childRoute.status === 'En Route';
                
                return (
                  <div key={idx} className="relative flex items-center justify-between text-xs">
                    
                    {/* timeline node icon */}
                    <div className={`absolute -left-6 rounded-full border bg-white dark:bg-slate-900 h-4.5 w-4.5 flex items-center justify-center ${
                      isPassed
                        ? 'border-green-500 text-green-500'
                        : isCurrent
                        ? 'border-sky-500 text-sky-600 animate-pulse ring-4 ring-sky-100 dark:ring-sky-950'
                        : 'border-slate-300 dark:border-slate-700 text-slate-400'
                    }`}>
                      {isPassed ? (
                        <CheckCircle className="h-3 w-3 fill-green-50 dark:fill-slate-900" />
                      ) : (
                        <MapPin className="h-2.5 w-2.5" />
                      )}
                    </div>

                    <div>
                      <span className={`block font-semibold ${
                        isCurrent
                          ? 'text-sky-655 dark:text-sky-400 font-bold'
                          : isPassed
                          ? 'text-slate-700 dark:text-slate-350'
                          : 'text-slate-400'
                      }`}>
                        {stop.name}
                      </span>
                      {isCurrent && (
                        <span className="inline-block text-[9px] font-bold uppercase tracking-widest text-sky-600 bg-sky-50 dark:bg-sky-950/20 px-1.5 py-0.5 mt-0.5 rounded">
                          BUS ARRIVING
                        </span>
                      )}
                    </div>

                    <span className="font-mono text-slate-400">{stop.time}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-sky-50 dark:bg-sky-950/20 p-2.5 text-sky-600 shrink-0">
          <Truck className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            {user.role === 'admin' ? 'School Fleet Manager' : 'Live Bus Tracker'}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {user.role === 'admin' 
              ? 'Oversee bus routes, drivers telemetry, and student transport plans' 
              : 'Real-time GPS coordinate mapping, timetables, and estimated arrivals'}
          </p>
        </div>
      </div>

      {/* Conditional rendering based on role */}
      {user.role === 'admin' ? renderAdminView() : renderClientView()}
    </div>
  );
};

export default TransportManager;
