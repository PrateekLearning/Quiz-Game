import questionsData from '../data/questions.json';

export interface QuizQuestion {
  id: number;
  question: string;
  answers: string[];
  correctAnswer: number;
}

export class QuizManager {
  private questions: QuizQuestion[] = [];
  private usedQuestionIds = new Set<number>();
  private currentIndex = 0;
  private currentQuestion: QuizQuestion | null = null;
  private score = 0;
  private answeredCount = 0;
  private readonly totalQuestions = 10;

  constructor() {
    this.questions = questionsData as QuizQuestion[];
    this.shuffleQuestions();
  }

  private shuffleQuestions(): void {
    const shuffled = [...this.questions].sort(() => Math.random() - 0.5);
    this.questions = shuffled.slice(0, this.totalQuestions);
  }

  public getNextQuestion(): QuizQuestion | null {
    if (this.currentIndex >= this.questions.length) {
      return null;
    }

    this.currentQuestion = this.questions[this.currentIndex];
    this.currentIndex += 1;
    return this.currentQuestion;
  }

  public submitAnswer(selectedIndex: number): boolean {
    if (!this.currentQuestion) {
      return false;
    }

    this.answeredCount += 1;
    const isCorrect = selectedIndex === this.currentQuestion.correctAnswer;
    if (isCorrect) {
      this.score += 100;
    }
    return isCorrect;
  }

  public getScore(): number {
    return this.score;
  }

  public getAnsweredCount(): number {
    return this.answeredCount;
  }

  public getProgress(): number {
    return Math.min(1, this.answeredCount / this.totalQuestions);
  }

  public getAccuracy(): number {
    if (this.answeredCount === 0) {
      return 0;
    }
    return Math.round((this.score / (this.answeredCount * 100)) * 100);
  }

  public reset(): void {
    this.currentIndex = 0;
    this.currentQuestion = null;
    this.score = 0;
    this.answeredCount = 0;
    this.shuffleQuestions();
  }
}
