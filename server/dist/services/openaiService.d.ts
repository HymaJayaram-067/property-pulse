import { AISearchRequest, AIDescriptionRequest, AIRecommendationRequest } from '../types';
export declare const naturalLanguageSearch: (searchRequest: AISearchRequest) => Promise<any>;
export declare const generatePropertyDescription: (request: AIDescriptionRequest) => Promise<string>;
export declare const getAIRecommendations: (request: AIRecommendationRequest) => Promise<any[]>;
//# sourceMappingURL=openaiService.d.ts.map