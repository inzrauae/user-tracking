import React from 'react';
import { Play, Square, Timer, AlertCircle, ShieldCheck, MousePointer2, Activity } from 'lucide-react';

interface TimeTrackerProps {
  isTracking: boolean;
  isIdle: boolean;
  elapsedSeconds: number;
  activityScore: number;
  onStart: () => void;
  onStop: () => void;
  onResume: () => void;
}

const TimeTracker: React.FC<TimeTrackerProps> = ({ 
  isTracking, 
  isIdle, 
  elapsedSeconds, 
  activityScore, 
  onStart, 
  onStop,
  onResume
}) => {
  
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getActivityColor = (score: number) => {
    if (score > 75) return 'bg-green-500';
    if (score > 40) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="relative bg-white rounded-xl shadow-sm border border-slate-200 p-4 overflow-hidden">
      
      {/* Idle Warning Overlay */}
      {isTracking && isIdle && (
        <div className="absolute inset-0 bg-red-50/95 z-20 flex flex-col items-center justify-center text-center p-4 rounded-xl animate-in fade-in duration-200">
          <AlertCircle className="w-8 h-8 text-red-600 mb-2 animate-bounce" />
          <h3 className="text-lg font-bold text-red-700">Idle Detected</h3>
          <p className="text-sm text-red-600 mb-4">No activity detected for a while. Timer is paused.</p>
          <div className="flex items-center gap-3">
            <button 
              onClick={onResume} 
              className="bg-white text-red-600 border border-red-200 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-50 transition-colors shadow-sm"
            >
              I'm Back
            </button>
            <button 
              onClick={onStop} 
              className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-700 transition-colors shadow-sm"
            >
              Stop Timer
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Time Display */}
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl transition-colors ${isTracking ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
            <Timer className={`w-6 h-6 ${isTracking && !isIdle ? 'animate-pulse' : ''}`} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Session Duration</p>
            <p className={`text-3xl font-mono font-bold ${isTracking ? 'text-slate-900' : 'text-slate-400'}`}>
              {formatTime(elapsedSeconds)}
            </p>
          </div>
        </div>

        {/* Activity Meter (Only visible when tracking) */}
        {isTracking && (
          <div className="flex-1 max-w-xs mx-auto w-full hidden sm:block">
            <div className="flex justify-between items-end mb-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                <MousePointer2 className="w-3 h-3" />
                Activity Level
              </span>
              <span className={`text-xs font-bold ${activityScore > 50 ? 'text-green-600' : 'text-amber-600'}`}>
                {activityScore}%
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${getActivityColor(activityScore)}`} 
                style={{ width: `${activityScore}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center gap-3">
          {isTracking && (
             <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Secured</span>
             </div>
          )}
          
          <button
            onClick={isTracking ? onStop : onStart}
            disabled={isIdle} // Disable main button if idle overlay is up
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold transition-all shadow-sm active:scale-95 ${
              isTracking
                ? 'bg-white border-2 border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-500/25'
            }`}
          >
            {isTracking ? (
              <>
                <Square className="w-4 h-4 fill-current" />
                Stop Work
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                Start Work
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeTracker;
