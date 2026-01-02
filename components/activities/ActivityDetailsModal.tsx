import React from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button } from '@rneui/themed';

import { Colors } from '../../constants/Colors';
import { Theme } from '../../constants/Theme';
import { Activity } from '../../lib/types/activity';
import { formatDateTime } from '../../lib/utils/formatDateTime';
import ParticipantAvatarStack from '../avatar/ParticipantAvatarStack';

interface ActivityDetailsModalProps {
  visible: boolean;
  activity: Activity | null;
  onClose: () => void;
  onJoin: (activity: Activity) => void;
  onLeave: (activity: Activity) => void;
  onEdit?: (activity: Activity) => void;
  userId: string | null;
  actionActivityId: string | null;
  onViewParticipants?: (activity: Activity) => void;
}

const ActivityDetailsModal: React.FC<ActivityDetailsModalProps> = ({
  visible,
  activity,
  onClose,
  onJoin,
  onLeave,
  onEdit,
  userId,
  actionActivityId,
  onViewParticipants,
}) => {
  if (!activity) {
    return null;
  }

  const isHost = !!userId && activity.host_id === userId;
  const isParticipant =
    !!userId && activity.activity_participants?.some(p => p.user_id === userId);
  const actionInProgress = actionActivityId === activity.id;
  const participantCount = activity.activity_participants?.length ?? 0;

  let actionLabel = 'Join activity';
  let actionHandler = () => onJoin(activity);
  const actionType: 'solid' | 'outline' =
    isHost || isParticipant ? 'outline' : 'solid';

  if (isHost) {
    actionLabel = 'Cancel event';
    actionHandler = () => onLeave(activity);
  } else if (isParticipant) {
    actionLabel = 'Leave activity';
    actionHandler = () => onLeave(activity);
  }

  const showActionButton = !!userId;

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>{activity.name}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.close}>Close</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.avatarRow}>
            <TouchableOpacity
              style={styles.participantsButton}
              activeOpacity={0.75}
              onPress={() => onViewParticipants?.(activity)}
            >
              <ParticipantAvatarStack
                participants={activity.activity_participants}
              />
              <Text style={styles.participantsLink}>
                View {participantCount === 1 ? 'participant' : 'participants'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.body}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.label}>Sport</Text>
            <Text style={styles.value}>{activity.sport}</Text>

            <Text style={styles.label}>When</Text>
            <Text style={styles.value}>{formatDateTime(activity.time)}</Text>
            <Text style={styles.label}>Details</Text>
            <Text style={styles.value}>
              {activity.details ?? 'No additional details provided.'}
            </Text>

            <Text style={styles.label}>Created</Text>
            <Text style={styles.value}>
              {formatDateTime(activity.created_at)}
            </Text>
          </ScrollView>

          {showActionButton && (
            <View style={styles.actions}>
              {isHost && onEdit && (
                <Button
                  title="Edit event"
                  type="outline"
                  onPress={() => onEdit(activity)}
                  disabled={actionInProgress}
                  buttonStyle={styles.secondaryButton}
                />
              )}
              <Button
                title={actionLabel}
                type={actionType}
                onPress={actionHandler}
                loading={actionInProgress}
                disabled={actionInProgress}
              />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  actions: {
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    padding: Theme.spacing.md,
  },
  avatarRow: {
    paddingHorizontal: Theme.spacing.md,
    paddingTop: Theme.spacing.sm,
  },
  backdrop: {
    alignItems: 'center',
    backgroundColor: Colors.overlay,
    flex: 1,
    justifyContent: 'center',
    padding: Theme.spacing.md,
  },
  body: {
    padding: Theme.spacing.md,
    paddingBottom: Theme.spacing.xl,
  },
  close: {
    color: Colors.primary,
    fontWeight: '600',
  },
  container: {
    backgroundColor: Colors.surface,
    borderRadius: Theme.borderRadius.lg,
    maxHeight: '90%',
    width: '100%',
  },
  header: {
    alignItems: 'center',
    borderBottomColor: Colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Theme.spacing.md,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: Theme.typography.caption.fontSize,
    marginTop: Theme.spacing.md,
  },
  participantsButton: {
    alignItems: 'flex-start',
  },
  participantsLink: {
    color: Colors.primary,
    fontWeight: '600',
    marginTop: Theme.spacing.xs,
  },
  secondaryButton: {
    marginBottom: Theme.spacing.sm,
  },
  title: {
    fontSize: Theme.typography.h3.fontSize,
    fontWeight: Theme.typography.h3.fontWeight,
  },
  value: {
    color: Colors.text,
    fontSize: Theme.typography.body.fontSize,
  },
});

export default ActivityDetailsModal;
