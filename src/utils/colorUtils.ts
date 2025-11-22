
export const getLikelihoodColor = (likelihood: string) => {
  switch (likelihood) {
    case 'Very High': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300';
    case 'High': return 'bg-purple-200 text-purple-900 dark:bg-purple-800/50 dark:text-purple-200';
    case 'Medium': return 'bg-purple-300 text-purple-950 dark:bg-purple-700/50 dark:text-purple-100';
    default: return 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400';
  }
};

export const getSuccessRateColor = (rate: number) => {
  if (rate >= 80) return 'text-purple-600 dark:text-purple-400';
  if (rate >= 60) return 'text-purple-700 dark:text-purple-500';
  return 'text-purple-800 dark:text-purple-600';
};
