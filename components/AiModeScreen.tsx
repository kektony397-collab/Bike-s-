import React, { useState, useCallback, useRef, useEffect } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { useGeolocation } from '../hooks/useGeolocation';
import { analyzeDrivingData, DrivingData } from '../services/geminiService';

interface Message {
  text: string;
  sender: 'user' | 'ai';
}

const AiModeScreen: React.FC = () => {
  const { location, isTracking, distance, startTracking, stopTracking, permissionStatus } = useGeolocation();
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! I'm your AI driving coach. Start tracking your ride, and I'll give you tips to improve your mileage.", sender: 'ai' }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // Refs for tracking driving patterns
  const accelerationEvents = useRef(0);
  const brakingEvents = useRef(0);
  const speeds = useRef<number[]>([]);
  const lastSpeed = useRef<number | null>(null);

  useEffect(() => {
    if (isTracking && location.speed !== null) {
      const currentSpeed = location.speed;
      speeds.current.push(currentSpeed);
      if (lastSpeed.current !== null) {
        const speedDelta = currentSpeed - lastSpeed.current;
        if (speedDelta > 10) { // Rapid acceleration threshold (10 km/h in a short interval)
          accelerationEvents.current += 1;
        }
        if (speedDelta < -15) { // Hard braking threshold
          brakingEvents.current += 1;
        }
      }
      lastSpeed.current = currentSpeed;
    }
  }, [location.speed, isTracking]);

  const handleStopAndAnalyze = useCallback(async () => {
    stopTracking();
    if (distance === 0 || speeds.current.length === 0) {
      setMessages(prev => [...prev, { text: "Not enough data to analyze. Please track a longer ride.", sender: 'ai' }]);
      return;
    }

    setIsLoading(true);
    const avgSpeed = speeds.current.reduce((a, b) => a + b, 0) / speeds.current.length;

    const drivingData: DrivingData = {
      averageSpeed: avgSpeed,
      accelerationEvents: accelerationEvents.current,
      brakingEvents: brakingEvents.current,
      distance: distance,
    };
    
    setMessages(prev => [...prev, { text: `Okay, analyzing your ${distance.toFixed(2)} km ride...`, sender: 'user' }]);

    const analysis = await analyzeDrivingData(drivingData);
    setMessages(prev => [...prev, { text: analysis, sender: 'ai' }]);
    
    // Reset stats for next ride
    accelerationEvents.current = 0;
    brakingEvents.current = 0;
    speeds.current = [];
    lastSpeed.current = null;
    setIsLoading(false);
  }, [stopTracking, distance]);
  
  const handleStart = () => {
    // Reset stats for new ride
    accelerationEvents.current = 0;
    brakingEvents.current = 0;
    speeds.current = [];
    lastSpeed.current = null;
    startTracking();
     setMessages(prev => [...prev, { text: "Tracking started! Enjoy your ride.", sender: 'user' }]);
  }

  const renderControls = () => {
    if (permissionStatus === 'denied') {
        return <p className="text-error text-sm text-center">Location access denied. Please enable it in browser settings for AI analysis.</p>;
    }

    if (isTracking) {
        return <Button variant="secondary" onClick={handleStopAndAnalyze} className="flex-1">Stop & Analyze</Button>;
    }

    return <Button onClick={handleStart} className="flex-1" disabled={isLoading}>Start Tracking Ride</Button>;
  };

  return (
    <div className="space-y-6">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-primary">Honda AI Coach</h1>
        <p className="text-on-surface-variant">Get smart tips to save fuel.</p>
      </header>

      <Card className="flex flex-col h-[50vh]">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'ai' ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${msg.sender === 'ai' ? 'bg-secondary-container text-on-secondary-container rounded-bl-none' : 'bg-primary-container text-on-primary-container rounded-br-none'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
             <div className="flex justify-start">
               <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-2xl bg-secondary-container text-on-secondary-container rounded-bl-none animate-pulse">
                Analyzing...
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          {renderControls()}
        </div>
        {permissionStatus === 'prompt' && !isTracking && (
            <p className="text-on-surface-variant text-xs mt-2 text-center">Click "Start Tracking" to allow location access.</p>
        )}
        {location.error && <p className="text-error text-xs mt-2 text-center">{location.error}</p>}
      </Card>
    </div>
  );
};

export default React.memo(AiModeScreen);