
export const getLikelihoodColor = (likelihood: string) => {
  switch (likelihood) {
    case 'Very High': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
    case 'High': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300';
    case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
    default: return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
  }
};

export const getSuccessRateColor = (rate: number) => {
  if (rate >= 80) return 'text-green-600 dark:text-green-400';
  if (rate >= 60) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
};
