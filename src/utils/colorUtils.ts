
export const getLikelihoodColor = (likelihood: string) => {
  switch (likelihood) {
    case 'Very High': return 'bg-primary/20 text-primary dark:bg-primary/30 dark:text-primary';
    case 'High': return 'bg-primary/30 text-primary dark:bg-primary/40 dark:text-primary';
    case 'Medium': return 'bg-accent/30 text-accent dark:bg-accent/40 dark:text-accent';
    default: return 'bg-muted text-muted-foreground dark:bg-muted/50 dark:text-muted-foreground';
  }
};

export const getSuccessRateColor = (rate: number) => {
  if (rate >= 80) return 'text-primary dark:text-primary';
  if (rate >= 60) return 'text-accent dark:text-accent';
  return 'text-muted-foreground dark:text-muted-foreground';
};
