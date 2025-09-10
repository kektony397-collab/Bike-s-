import React, { useState, useMemo } from 'react';
import Card from './ui/Card';
import TextInput from './ui/TextInput';
import Button from './ui/Button';
import Speedometer from './Speedometer';
import Modal from './ui/Modal';
import { useGeolocation } from '../hooks/useGeolocation';

const FindAverageScreen: React.FC = () => {
    const { location, isTracking, distance, startTracking, stopTracking, resetDistance, permissionStatus } = useGeolocation();
    const [petrolRefilled, setPetrolRefilled] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [calculatedMileage, setCalculatedMileage] = useState(0);

    const handleReserveReached = () => {
        if (distance > 0 && petrolRefilled > 0) {
            const mileage = distance / petrolRefilled;
            setCalculatedMileage(mileage);
            setIsModalOpen(true);
            stopTracking();
        } else {
            alert("Please enter a valid petrol amount and start tracking distance first.");
        }
    };
    
    const handleStart = () => {
        resetDistance();
        startTracking();
    }

    const modalContent = useMemo(() => (
        <div>
            <p className="text-on-surface-variant mb-4">Based on your trip, here is your calculated bike mileage:</p>
            <div className="text-center bg-primary-container p-4 rounded-xl">
                <p className="text-4xl font-bold text-primary">{calculatedMileage.toFixed(2)}</p>
                <p className="text-on-primary-container">km / litre</p>
            </div>
        </div>
    ), [calculatedMileage]);

    const renderTrackingControls = () => {
        if (permissionStatus === 'denied') {
            return <p className="text-error text-sm text-center col-span-full">Location access denied. Please enable it in browser settings to track mileage.</p>;
        }
        
        return (
            <>
                {isTracking ? (
                    <Button variant="secondary" onClick={stopTracking} className="flex-1">Pause Tracking</Button>
                ) : (
                    <Button onClick={handleStart} className="flex-1" disabled={!petrolRefilled}>Start Tracking</Button>
                )}
                <Button variant="tertiary" onClick={handleReserveReached} className="flex-1" disabled={!isTracking && distance === 0}>Bike Reached Reserve</Button>
            </>
        );
    };

    return (
        <div className="space-y-6">
            <header className="text-center">
                <h1 className="text-3xl font-bold text-primary">Find Your Real Mileage</h1>
                <p className="text-on-surface-variant">Track your ride to calculate accurate fuel efficiency.</p>
            </header>

            <Card>
                <Speedometer speed={location.speed ?? 0} />
                <div className="mt-4 text-center font-mono text-2xl text-on-surface">
                    Distance: {distance.toFixed(2)} km
                </div>
            </Card>

            <Card className="space-y-4">
                 <TextInput 
                    id="petrol-refilled" 
                    label="Petrol Refilled (Litres)" 
                    type="number"
                    step="0.01"
                    value={petrolRefilled}
                    onChange={(e) => setPetrolRefilled(parseFloat(e.target.value) || 0)}
                    disabled={isTracking}
                />
                <div className="flex flex-col sm:flex-row gap-4">
                    {renderTrackingControls()}
                </div>
                {permissionStatus === 'prompt' && !isTracking && (
                    <p className="text-on-surface-variant text-xs mt-2 text-center">Click "Start Tracking" to allow location access.</p>
                )}
                {location.error && <p className="text-error text-xs mt-2 text-center">{location.error}</p>}
            </Card>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Mileage Calculated!">
                {modalContent}
            </Modal>
        </div>
    );
};

export default React.memo(FindAverageScreen);