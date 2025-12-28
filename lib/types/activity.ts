export type ActivitySport =
  | 'running'
  | 'trail running'
  | 'hiking'
  | 'road biking'
  | 'gravel biking'
  | 'mountain biking';

export type ActivityRole = 'host' | 'participant';

export interface ActivityParticipant {
  user_id: string;
  role: ActivityRole;
  joined_at: string;
}

export interface Activity {
  id: string;
  name: string;
  sport: ActivitySport;
  completed: boolean;
  details: string | null;
  host_id: string;
  created_at: string;
  updated_at: string;
  activity_participants?: ActivityParticipant[];
}

export interface CreateActivityPayload {
  name: string;
  sport: ActivitySport;
  details?: string | null;
}

export const ACTIVITY_SPORTS: ActivitySport[] = [
  'running',
  'trail running',
  'hiking',
  'road biking',
  'gravel biking',
  'mountain biking',
];
