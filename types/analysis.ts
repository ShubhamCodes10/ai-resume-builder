
export type JobAnalysis = {
    id: string;
    jobFitPercentage: number;
    overallAssessment: string;
    strengths: Array<{
      skill: string;
      description: string;
    }>;
    areasForImprovement: Array<{
      area: string;
      suggestion: string;
    }>;
    recommendations: string[];
    skillsMatch: {
      technical: Array<{
        skill: string;
        matchLevel: 'high' | 'medium' | 'low' | 'missing';
        comment: string;
      }>;
      soft: Array<{
        skill: string;
        matchLevel: 'high' | 'medium' | 'low' | 'missing';
        comment: string;
      }>;
    };
    experienceAnalysis: Array<{
      company: string;
      position: string;
      duration: string;
      keyPoints: string[];
      relevance: string;
    }>;
    projectAnalysis: Array<{
      name: string;
      description: string;
      keyPoints: string[];
      relevance: string;
    }>;
    experienceRelevance: {
      score: number;
      relevantExperiences: Array<{
        experience: string;
        relevance: string;
      }>;
      missingExperiences: string[];
    };
    educationFit: {
      score: number;
      comment: string;
    };
    cultureFit: {
      score: number;
      comment: string;
    };
    atsImprovements: Array<{
      section: string;
      suggestion: string;
    }>;
    metadata: {
      analysisTimestamp: string;
      modelVersion: string;
      confidenceScore: number;
    };
  };
  