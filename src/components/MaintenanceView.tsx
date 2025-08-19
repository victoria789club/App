import React from 'react';

interface MaintenanceViewProps {
    imageUrl: string;
}

export const MaintenanceView: React.FC<MaintenanceViewProps> = ({ imageUrl }) => {
    return (
        <div className="fixed inset-0 bg-slate-900 flex items-center justify-center p-4">
            <img 
              src={imageUrl} 
              alt="Maintenance Information" 
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" 
            />
        </div>
    );
};
