export interface ScoreEntry {
  score: number;
  accuracy: number;
  date: string;
}

export class ScoreManager {
  private readonly storageKey = 'quiz-quest-scores';

  public addScore(score: number, accuracy: number): void {
    const existing = this.getScores();
    existing.push({ score, accuracy, date: new Date().toISOString() });
    existing.sort((a, b) => b.score - a.score);
    const top = existing.slice(0, 10);
    localStorage.setItem(this.storageKey, JSON.stringify(top));
  }

  public getScores(): ScoreEntry[] {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      return [];
    }
    try {
      return JSON.parse(raw) as ScoreEntry[];
    } catch {
      return [];
    }
  }
}
