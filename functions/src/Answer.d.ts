export type Answer = {
  a?: String;
  E?: number;
  I?: number;
  S?: number;
  N?: number;
  J?: number;
  P?: number;
  "T(M)"?: number;
  "T(F)"?: number;
  "F(M)"?: number;
  "F(F)"?: number;
  checked?: boolean;
  [key: string]: any;
};

export interface NumberType {
  [key: string]: number;
}

export type Score = {
  E?: number;
  I?: number;
  S?: number;
  N?: number;
  J?: number;
  P?: number;
  "T(M)"?: number;
  "T(F)"?: number;
  "F(M)"?: number;
  "F(F)"?: number;
  // id?: String;
  // [key: string]: number;
};

export type Question = {
  index: number;
  question?: String;
  checked?: boolean;
  answers: Answer[];
  score?: Answer;
};
