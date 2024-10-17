import { Modes } from './constant';

export type TimePresets = {
  [key in Modes]: number;
};

export interface HmTime {
  hours: number;
  minutes: number;
}

export type ProjectId = string | null;
