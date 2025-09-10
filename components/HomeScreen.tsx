import React, { useState, useMemo, useCallback } from 'react';
import { HONDA_DREAM_YUGA, DEFAULT_PETROL_PRICE, DEFAULT_REAL_MILEAGE, DEFAULT_DAILY_DISTANCE, TANK_CAPACITY } from '../constants';
import Card from './ui/Card';
import TextInput from './ui/TextInput';
import Slider from './ui/Slider';
import Speedometer from './Speedometer';
import { useGeolocation } from '../hooks/useGeolocation';
import Button from './ui/Button';

const HomeScreen: React.FC = () => {
    const { location, isTracking, startTracking, stopTracking, permissionStatus } = useGeolocation();
    const [petrolPrice, setPetrolPrice] = useState(DEFAULT_PETROL_PRICE);
    const [realMileage, setRealMileage] = useState(DEFAULT_REAL_MILEAGE);
    const [dailyDistance, setDailyDistance] = useState(DEFAULT_DAILY_DISTANCE);
    const [refillAmount, setRefillAmount] = useState(300);

    const calculations = useMemo(() => {
        const price = petrolPrice > 0 ? petrolPrice : 0.01;
        const mileage = realMileage > 0 ? realMileage : 0.01;
        const distance = dailyDistance > 0 ? dailyDistance : 0;
        
        const fuelCostPerKm = price / mileage;
        const fuelCostPerDay = fuelCostPerKm * distance;
        const fullTankRange = mileage * TANK_CAPACITY;
        const fullTankCost = price * TANK_CAPACITY;

        const quickRefillLitres = refillAmount / price;
        const quickRefillRange = quickRefillLitres * mileage;

        return { fuelCostPerKm, fuelCostPerDay, fullTankRange, fullTankCost, quickRefillLitres, quickRefillRange };
    }, [petrolPrice, realMileage, dailyDistance, refillAmount]);
    
    const scenarioData = useMemo(() => {
        const mileages = [45, 50, 55, 60, 65];
        const distances = [80, 100, 120, 150, 200];
        const price = petrolPrice > 0 ? petrolPrice : 1;
        return distances.map(dist => ({
            distance: dist,
            costs: mileages.map(mil => (price / mil) * dist)
        }));
    }, [petrolPrice]);

    const formatCurrency = useCallback((amount: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
    }, []);
    
    const renderTrackingButton = () => {
        if (permissionStatus === 'denied') {
            return <p className="text-error text-sm text-center">Location access denied. Please enable it in your browser settings to track your ride.</p>;
        }
        if (isTracking) {
            return <Button variant="secondary" onClick={stopTracking}>Stop Tracking</Button>;
        }
        return <Button onClick={startTracking}>Start Tracking</Button>;
    };

    return (
        <div className="space-y-6">
            <header className="text-center">
                <h1 className="text-3xl font-bold text-primary">{HONDA_DREAM_YUGA.name}</h1>
                <p className="text-on-surface-variant">{HONDA_DREAM_YUGA.model}</p>
                <p className="text-sm text-secondary">Default Average: {HONDA_DREAM_YUGA.averageMileage} km/l</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <Speedometer speed={location.speed ?? 0} />
                    <div className="mt-4 text-center">
                        {renderTrackingButton()}
                        {permissionStatus === 'prompt' && !isTracking && (
                            <p className="text-on-surface-variant text-xs mt-2">Click "Start Tracking" to allow location access.</p>
                        )}
                        {location.error && <p className="text-error text-xs mt-2">{location.error}</p>}
                    </div>
                </Card>

                <Card className="space-y-4">
                    <h2 className="text-xl font-semibold text-on-surface">Fuel Calculator</h2>
                     <TextInput id="petrol-price" label="Petrol Price (₹/L)" type="number" step="0.01" value={petrolPrice} onChange={(e) => setPetrolPrice(parseFloat(e.target.value) || 0)} />
                    <Slider label="Real Mileage" min="30" max="80" value={realMileage} unit="km/l" onChange={(e) => setRealMileage(parseInt(e.target.value))} />
                    <Slider label="Daily Distance" min="50" max="300" value={dailyDistance} unit="km" onChange={(e) => setDailyDistance(parseInt(e.target.value))} />
                </Card>
            </div>
            
            <Card>
                <h2 className="text-xl font-semibold text-on-surface mb-4">Calculations</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-primary-container p-3 rounded-xl"><p className="text-on-primary-container">Cost/km: <span className="font-bold">{formatCurrency(calculations.fuelCostPerKm)}</span></p></div>
                    <div className="bg-primary-container p-3 rounded-xl"><p className="text-on-primary-container">Cost/day: <span className="font-bold">{formatCurrency(calculations.fuelCostPerDay)}</span></p></div>
                    <div className="bg-secondary-container p-3 rounded-xl"><p className="text-on-secondary-container">Full Tank Range: <span className="font-bold">{calculations.fullTankRange.toFixed(1)} km</span></p></div>
                    <div className="bg-secondary-container p-3 rounded-xl"><p className="text-on-secondary-container">Full Tank Cost: <span className="font-bold">{formatCurrency(calculations.fullTankCost)}</span></p></div>
                </div>
            </Card>

            <Card className="space-y-4">
                <h2 className="text-xl font-semibold text-on-surface">Quick Refill Check</h2>
                <TextInput id="refill-amount" label="Refill Amount (₹)" type="number" value={refillAmount} onChange={e => setRefillAmount(parseFloat(e.target.value) || 0)} />
                <div className="flex justify-around bg-tertiary-container p-4 rounded-xl text-on-tertiary-container font-semibold">
                    <p>Litres: {calculations.quickRefillLitres.toFixed(2)} L</p>
                    <p>Range: {calculations.quickRefillRange.toFixed(1)} km</p>
                </div>
            </Card>

            <Card>
                <h2 className="text-xl font-semibold text-on-surface mb-4">Cost Scenarios (Daily Distance vs Mileage)</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-on-surface-variant">
                        <thead className="text-xs text-on-surface uppercase bg-surface-variant/50">
                            <tr>
                                <th scope="col" className="px-4 py-3 rounded-tl-lg">Distance</th>
                                {[45,50,55,60,65].map(m => <th key={m} scope="col" className="px-4 py-3 text-center">{m} km/l</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {scenarioData.map(({distance, costs}) => (
                                <tr key={distance} className="border-b border-outline/50">
                                    <th scope="row" className="px-4 py-3 font-medium text-on-surface whitespace-nowrap">{distance} km</th>
                                    {costs.map((cost, idx) => (
                                        <td key={idx} className="px-4 py-3 text-center">{formatCurrency(cost)}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default React.memo(HomeScreen);