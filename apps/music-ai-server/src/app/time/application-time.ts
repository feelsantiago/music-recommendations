import { AppError, ok, Result, safeTry, safeTryBind } from '@music-ai/common';
import { Injectable } from '@nestjs/common';
import { TimeTrackerValue } from './domain/time-tracker';
import { TimePassed, TimePassedData, TimeTrackData } from './time.types';

@Injectable()
export class ApplicationTime {
  private _last: TimeTrackData;

  constructor() {
    this._last = this._track().expect('error');
  }

  public hasPassed(): Result<TimePassedData, AppError> {
    return safeTryBind(this, function* ({ $ }) {
      const now = yield* $(this._track());
      const track = {
        minute: this._minute(now),
        day: this._day(now),
        hour: this._hour(now),
      };

      this._last = now;
      return ok(track);
    });
  }

  private _minute({ hour, minute }: TimeTrackData): TimePassed {
    return minute.compare(this._last.minute) && hour.compare(this._last.hour)
      ? 'same_time'
      : 'different_time';
  }

  private _day({ day, hour }: TimeTrackData): TimePassed {
    return day.compare(this._last.day) && hour.compare(this._last.hour)
      ? 'same_time'
      : 'different_time';
  }

  private _hour({ day }: TimeTrackData): TimePassed {
    return day.compare(this._last.day) ? 'same_time' : 'different_time';
  }

  private _track(): Result<TimeTrackData, AppError> {
    return safeTry(function* ({ $ }) {
      const now = new Date();

      const minute = yield* $(TimeTrackerValue.minute(now.getMinutes()));
      const day = yield* $(TimeTrackerValue.day(now.getDate()));
      const hour = yield* $(TimeTrackerValue.hour(now.getHours()));

      return ok({ day, hour, minute });
    });
  }
}
