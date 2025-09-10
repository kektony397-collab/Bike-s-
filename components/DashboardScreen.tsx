
import React, { useState, useMemo } from 'react';
import { BIKE_DATA } from '../constants';
import Card from './ui/Card';
import Speedometer from './Speedometer';
import { useGeolocation } from '../hooks/useGeolocation';
import type { BikeData } from '../types';

const DashboardScreen: React.FC = () => {
    const [selectedBike, setSelectedBike] = useState<BikeData>(BIKE_DATA[0]);
    const [searchQuery, setSearchQuery] = useState('');
    const { location } = useGeolocation();

    const filteredBikes = useMemo(() => {
        return BIKE_DATA.filter(bike => 
            bike.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    const handleSelectBike = (bikeName: string) => {
        const bike = BIKE_DATA.find(b => b.name === bikeName);
        if (bike) {
            setSelectedBike(bike);
            setSearchQuery('');
        }
    };

    return (
        <div className="space-y-6">
            <header className="text-center">
                <h1 className="text-3xl font-bold text-primary">Bike Dashboard</h1>
                <p className="text-on-surface-variant">Look up stats for popular bikes.</p>
            </header>

            <Card>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search for a bike..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-3 bg-surface-variant/60 rounded-lg border border-outline focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
                    />
                    {searchQuery && filteredBikes.length > 0 && (
                        <ul className="absolute z-10 w-full mt-1 bg-surface border border-outline rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {filteredBikes.map(bike => (
                                <li 
                                    key={bike.name} 
                                    className="px-4 py-2 hover:bg-primary-container cursor-pointer text-on-surface"
                                    onClick={() => handleSelectBike(bike.name)}
                                >
                                    {bike.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </Card>

            {selectedBike && (
                <Card>
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-on-surface">{selectedBike.name}</h2>
                        <p className="text-on-surface-variant">{selectedBike.model}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        <div className="bg-primary-container p-6 rounded-2xl text-center">
                            <p className="text-on-primary-container text-lg">Claimed Average</p>
                            <p className="text-5xl font-bold text-primary">{selectedBike.averageMileage}</p>
                            <p className="text-on-primary-container">km / litre</p>
                        </div>
                        <div>
                            <p className="text-center text-on-surface-variant mb-2">Your Current Speed</p>
                            <Speedometer speed={location.speed ?? 0} />
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default React.memo(DashboardScreen);
