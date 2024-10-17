import { Modes } from './constant';

export type TimePresets = {
  [key in Modes]: number;
};

export interface HmTime {
  hours: number;
  minutes: number;
}

export type NonExistingProjectId = null;
export type ProjectId = string;
export type StorageProjectId = ProjectId | NonExistingProjectId;
