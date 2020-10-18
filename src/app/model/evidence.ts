export interface EvidenceSource {
  name: string;
  valueType:string; //enum
  link: string;
  note: string;
  tooltip: string;
}

export interface Evidence {
  dimension: string;
  element: string;
  evidenceSources: EvidenceSource[];
}
