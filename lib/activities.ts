import { supabase } from './supabase';
import {
  Activity,
  ActivityParticipant,
  CreateActivityPayload,
} from './types/activity';

const ACTIVITY_SELECT = `
  id,
  host_id,
  name,
  sport,
  time,
  completed,
  details,
  created_at,
  updated_at,
  activity_participants(user_id, role, joined_at)
`;

type ActivityRow = Omit<Activity, 'activity_participants'> & {
  activity_participants?: ActivityParticipant[];
};

const mapActivity = (row: ActivityRow): Activity => ({
  ...row,
  details: row.details ?? null,
  activity_participants: row.activity_participants ?? [],
});

export const fetchUpcomingActivities = async (): Promise<Activity[]> => {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('activities')
    .select(ACTIVITY_SELECT)
    .gte('time', now)
    .order('time', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data as ActivityRow[]).map(mapActivity);
};

export const fetchActivityById = async (
  id: string
): Promise<Activity | null> => {
  const { data, error } = await supabase
    .from('activities')
    .select(ACTIVITY_SELECT)
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapActivity(data as ActivityRow) : null;
};

export const createActivity = async (
  payload: CreateActivityPayload,
  hostId: string
): Promise<Activity> => {
  const { data, error } = await supabase
    .from('activities')
    .insert({
      ...payload,
      host_id: hostId,
      completed: false,
    })
    .select('id')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const activityId = (data as { id: string }).id;

  const { error: participantError } = await supabase
    .from('activity_participants')
    .upsert({
      activity_id: activityId,
      user_id: hostId,
      role: 'host',
    });

  if (participantError) {
    console.warn('Failed to record host as participant', participantError);
  }

  const activity = await fetchActivityById(activityId);
  if (!activity) {
    throw new Error('Failed to load the newly created activity');
  }

  return activity;
};

export const joinActivity = async (
  activityId: string,
  userId: string
): Promise<void> => {
  const { error } = await supabase.from('activity_participants').upsert({
    activity_id: activityId,
    user_id: userId,
    role: 'participant',
  });

  if (error) {
    throw new Error(error.message);
  }
};

export const leaveActivity = async (
  activityId: string,
  userId: string
): Promise<void> => {
  const { error } = await supabase
    .from('activity_participants')
    .delete()
    .match({ activity_id: activityId, user_id: userId });

  if (error) {
    console.log('cant delete');
    throw new Error(error.message);
  }
};
