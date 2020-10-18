

// export interface Result {
//   dimension: string;
//   evidence: string;
//   result: string;
//   note: string | null;
// }

// export interface ProjectElementResult {
//   projectelement: string;
//   dimensionResults: Result[];
// }

// export interface Results {
//   results: ProjectElementResult[];

// }

export interface ProjectElement {
  dimension: string;
  evidence: string;
  result: string;
  note?: string;
}

export interface Result {
  projectelement: string;
  projectelementResults: ProjectElement[];
}

// export interface ProjectElementWithResults
