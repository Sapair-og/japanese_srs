export default function Stats({ stats, vocabCount }) {
  const accuracy = stats.totalAttempts > 0 
    ? Math.round((stats.totalCorrect / stats.totalAttempts) * 100) 
    : 0;

  const statItems = [
    {
      label: 'Current Streak',
      value: `${stats.streak} Days`,
      icon: '🔥',
      colorClass: 'text-claude-coral border-claude-coral/20 bg-claude-coral/5',
    },
    {
      label: 'Session Accuracy',
      value: `${accuracy}%`,
      icon: '🎯',
      colorClass: 'text-emerald-700 dark:text-emerald-400 border-emerald-600/20 bg-emerald-500/5',
    },
    {
      label: 'Total Vocabulary',
      value: `${vocabCount} Words`,
      icon: '📚',
      colorClass: 'text-amber-700 dark:text-amber-400 border-amber-600/20 bg-amber-500/5',
    },
    {
      label: 'Cards Reviewed',
      value: stats.totalCorrect,
      icon: '✅',
      colorClass: 'text-rose-700 dark:text-rose-400 border-rose-600/20 bg-rose-500/5',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {statItems.map((item, idx) => (
        <div 
          key={idx} 
          className={`claude-panel border p-5 rounded-2xl flex flex-col justify-between items-start hover:scale-[1.01] transition-transform duration-200 ${item.colorClass}`}
        >
          <div className="flex justify-between items-center w-full mb-3">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-claude-text-muted">{item.label}</span>
            <span className="text-xl">{item.icon}</span>
          </div>
          <span className="text-2xl font-bold tracking-tight text-claude-text-heading claude-serif">{item.value}</span>
        </div>
      ))}
    </div>
  );
}
