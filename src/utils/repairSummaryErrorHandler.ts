
export const getErrorMessage = (error: { code?: string; message: string }): string => {
  if (error.message.includes('JWTError') || error.message.includes('JWT')) {
    return 'Authentication error. Please sign out and sign back in.';
  } else if (error.message.includes('permission denied') || error.code === 'PGRST301') {
    return 'Access denied. Please check your permissions.';
  } else {
    return `Database error: ${error.message}`;
  }
};

export const validateUser = (user: any): { isValid: boolean; errorMessage: string } => {
  if (!user?.id) {
    console.log('No user ID available for fetching repair summaries');
    return {
      isValid: false,
      errorMessage: 'Authentication required. Please log in to view your repair data.'
    };
  }
  
  return { isValid: true, errorMessage: '' };
};
