import { useState, useEffect, useRef, useCallback } from 'react';
import type { GeolocationState } from '../types';

export type PermissionStatus = 'prompt' | 'granted' | 'denied' | 'checking';

export const useGeolocation = () => {
  const [location, setLocation] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    speed: null,
    error: null,
  });
  const [isTracking, setIsTracking] = useState(false);
  const [distance, setDistance] = useState(0);
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>('checking');

  const watchId = useRef<number | null>(null);
  const lastPosition = useRef<GeolocationPosition | null>(null);

  useEffect(() => {
    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setPermissionStatus(result.state as PermissionStatus);
        result.onchange = () => {
            setPermissionStatus(result.state as PermissionStatus);
        };
      });
    } else {
        // Fallback for older browsers without the Permissions API
        setPermissionStatus('prompt');
    }
  }, []);

  const haversineDistance = (coords1: GeolocationCoordinates, coords2: GeolocationCoordinates) => {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371; // Earth radius in km
    const dLat = toRad(coords2.latitude - coords1.latitude);
    const dLon = toRad(coords2.longitude - coords1.longitude);
    const lat1 = toRad(coords1.latitude);
    const lat2 = toRad(coords2.latitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const handleSuccess = (position: GeolocationPosition) => {
    const speedKmh = position.coords.speed ? position.coords.speed * 3.6 : 0;
    
    setLocation({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      speed: speedKmh,
      error: null,
    });

    if (lastPosition.current) {
      const newDistance = haversineDistance(lastPosition.current.coords, position.coords);
      setDistance((prevDistance) => prevDistance + newDistance);
    }
    lastPosition.current = position;
  };

  const handleError = (error: GeolocationPositionError) => {
    if (error.code === error.PERMISSION_DENIED) {
        setLocation((prev) => ({ ...prev, error: "Location access was denied. Please enable it in your browser settings." }));
    } else {
        setLocation((prev) => ({ ...prev, error: error.message }));
    }
    setIsTracking(false);
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
  };

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setLocation((prev) => ({ ...prev, error: 'Geolocation is not supported by your browser.' }));
      return;
    }
    if (permissionStatus === 'denied') {
        setLocation((prev) => ({ ...prev, error: 'Location access is denied. Enable it in your settings.' }));
        return;
    }

    lastPosition.current = null;
    setDistance(0);
    setLocation(prev => ({...prev, error: null}));

    watchId.current = navigator.geolocation.watchPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });
    setIsTracking(true);
  }, [permissionStatus]);

  const stopTracking = useCallback(() => {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
    setIsTracking(false);
    lastPosition.current = null;
    setLocation(prev => ({...prev, speed: 0}));
  }, []);

  useEffect(() => {
    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, []);

  return { location, isTracking, distance, startTracking, stopTracking, resetDistance: () => setDistance(0), permissionStatus };
};
