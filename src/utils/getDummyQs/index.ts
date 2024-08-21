import { Answer, Question } from "@/types";

const a1a: Answer = {
    name: 'City',
    count: 0,
    chosen: 0
  };
  
  const a1b: Answer = {
    name: 'Beach',
    count: 0,
    chosen: 0
  };
  
  const q1: Question = {
    id: 1,
    premise: 'Better holiday destination',
    answers: [a1a, a1b],
    answered: false,
    timedOut: false
  };

  const q3: Question = {
    id: 3,
    premise: 'Better to walk on barefoot',
    answers: [a1a, a1b],
    answered: false,
    timedOut: false
  };

  const q2: Question = {
    id: 2,
    premise: 'Best place to sleep homeless',
    answers: [a1a, a1b],
    answered: false,
    timedOut: false
  };
  
  export const dummyQuestions: Question[] = [q1, q2, q3];