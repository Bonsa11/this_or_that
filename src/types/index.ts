export interface Answer {
    name: string;
    count: number;
    chosen: number; 
  }
  
export interface Question {
id: number;
premise: string;
answers: [Answer, Answer]
answered: boolean;
timedOut: boolean;
}