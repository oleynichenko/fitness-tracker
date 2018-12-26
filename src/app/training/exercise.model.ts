export interface Exercise {
  id: string;
  name: string;
  duration: number;
  calories: number;
  state?: 'completed' | 'cancelled' | null;
  date?: Date;
}
