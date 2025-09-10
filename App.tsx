
import React, { useState } from 'react';
import { NavigationTab } from './types';
import HomeScreen from './components/HomeScreen';
import FindAverageScreen from './components/FindAverageScreen';
import DashboardScreen from './components/DashboardScreen';
import AiModeScreen from './components/AiModeScreen';
import BottomNav from './components/BottomNav';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavigationTab>(NavigationTab.Home);

  const renderContent = () => {
    switch (activeTab) {
      case NavigationTab.Home:
        return <HomeScreen />;
      case NavigationTab.FindAverage:
        return <FindAverageScreen />;
      case NavigationTab.Dashboard:
        return <DashboardScreen />;
      case NavigationTab.AiMode:
        return <AiModeScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-background font-sans">
      <div className="container mx-auto max-w-lg p-4 pb-24">
        <main>{renderContent()}</main>
      </div>
      <footer className="fixed bottom-16 left-0 right-0 h-8 bg-inverse-surface text-inverse-on-surface flex items-center justify-center text-xs">
        Created By Yash K Pathak
      </footer>
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default App;
