
export const getLikelihoodColor = (likelihood: string) => {
  switch (likelihood) {
    case 'Very High': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
    case 'High': return 'bg-red-200 text-red-900 dark:bg-red-800/50 dark:text-red-200';
    case 'Medium': return 'bg-red-300 text-red-950 dark:bg-red-700/50 dark:text-red-100';
    default: return 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400';
  }
};

export const getSuccessRateColor = (rate: number) => {
  if (rate >= 80) return 'text-red-600 dark:text-red-400';
  if (rate >= 60) return 'text-red-700 dark:text-red-500';
  return 'text-red-800 dark:text-red-600';
};
