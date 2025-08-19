
import React from 'react';

export const UserLinkManagerView: React.FC = () => {
  return (
    <div className="bg-slate-800 p-8 rounded-lg text-center animate-fade-in">
      <h2 className="text-2xl font-bold text-white mb-4">User Link Manager</h2>
      <p className="text-slate-400">This area is for managing user-specific links and data.</p>
      <p className="text-slate-500 mt-2">(Feature under construction)</p>
    </div>
  );
};

const style = document.createElement('style');
style.innerHTML = `
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
}
`;
document.head.appendChild(style);
