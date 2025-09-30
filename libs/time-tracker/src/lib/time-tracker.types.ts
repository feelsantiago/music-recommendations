export interface TimeTracker {
  value(): number;
  compare(other: TimeTracker): boolean;
}

export type TimePassed = 'same_time' | 'different_time';
export interface TimeTrackData {
  day: TimeTracker;
  hour: TimeTracker;
  minute: TimeTracker;
}

export type TimePassedData = {
  [key in keyof TimeTrackData]: TimePassed;
};
