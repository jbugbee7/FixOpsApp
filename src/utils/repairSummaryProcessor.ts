
import { RepairSummary } from "@/types/repairSummary";
import { Case } from "@/types/case";

export const processCasesIntoSummaries = (cases: Case[]): RepairSummary[] => {
  console.log('=== PROCESSING CASES ===');
  console.log('Cases to process:', cases.length);

  // Group and analyze cases by appliance type
  const summariesByType: { [key: string]: RepairSummary } = {};
  
  cases.forEach((case_, index) => {
    console.log(`Processing case ${index + 1}:`, {
      id: case_.id,
      appliance_type: case_.appliance_type,
      problem_description: case_.problem_description,
      status: case_.status
    });
    
    const applianceType = case_.appliance_type || 'Unknown';
    
    if (!summariesByType[applianceType]) {
      summariesByType[applianceType] = {
        appliance_type: applianceType,
        case_count: 0,
        common_issues: [],
        recent_solutions: [],
        success_rate: 0,
        last_updated: new Date().toISOString()
      };
    }

    const summary = summariesByType[applianceType];
    summary.case_count++;

    // Add unique issues and solutions
    if (case_.problem_description) {
      const issue = case_.problem_description.trim();
      if (issue && !summary.common_issues.includes(issue)) {
        summary.common_issues.push(issue);
      }
    }

    if (case_.initial_diagnosis) {
      const solution = case_.initial_diagnosis.trim();
      if (solution && !summary.recent_solutions.includes(solution)) {
        summary.recent_solutions.push(solution);
      }
    }
  });

  // Calculate success rates and limit arrays
  Object.keys(summariesByType).forEach(type => {
    const typeCases = cases.filter(c => (c.appliance_type || 'Unknown') === type);
    const completedCases = typeCases.filter(c => c.status === 'Completed');
    summariesByType[type].success_rate = typeCases.length > 0 
      ? Math.round((completedCases.length / typeCases.length) * 100)
      : 0;
    
    // Limit arrays to most recent/common items and ensure they're not empty
    summariesByType[type].common_issues = summariesByType[type].common_issues.slice(0, 5);
    summariesByType[type].recent_solutions = summariesByType[type].recent_solutions.slice(0, 3);
    
    // If no solutions found, add a default message
    if (summariesByType[type].recent_solutions.length === 0) {
      summariesByType[type].recent_solutions.push('No diagnostic solutions recorded yet');
    }
    
    // If no issues found, add a default message
    if (summariesByType[type].common_issues.length === 0) {
      summariesByType[type].common_issues.push('No problem descriptions recorded yet');
    }
  });

  const summaries = Object.values(summariesByType);
  console.log('=== FINAL SUMMARIES ===');
  console.log('Generated summaries:', summaries);
  console.log('Appliance types found:', Object.keys(summariesByType));
  
  return summaries;
};
