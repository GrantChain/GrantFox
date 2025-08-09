export type EvidenceFilePath = string;

export type Feedback = {
  author: string;
  timestamp: string;
  message: string;
  files?: EvidenceFilePath[];
};

export type Evidence = {
  url?: string;
  notes?: string;
  files?: EvidenceFilePath[];
  feedback?: Feedback[];
};

export type Milestone = {
  description: string;
  amount: number | string;
  status?: string;
  evidences?: Evidence[];
};
