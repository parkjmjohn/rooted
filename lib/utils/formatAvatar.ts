import { ActivityParticipant } from '../types/activity';
import { Profile } from '../types/profile';

export const getInitialsActivityParticipant = (
  participant: ActivityParticipant
) => {
  const label =
    participant.profile?.full_name ??
    participant.profile?.username ??
    participant.user_id;
  if (!label) return '';

  const parts = label.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  const first = parts[0]?.charAt(0) ?? '';
  const last = parts[parts.length - 1]?.charAt(0) ?? '';
  return `${first}${last}`.toUpperCase();
};

export const getInitialsProfile = (profile: Profile) => {
  const label = profile.full_name ?? profile.username;
  if (!label) return '';

  const parts = label.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  const first = parts[0]?.charAt(0) ?? '';
  const last = parts[parts.length - 1]?.charAt(0) ?? '';
  return `${first}${last}`.toUpperCase();
};
