import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@rneui/themed';

import { Colors } from '../constants/Colors';
import { Theme } from '../constants/Theme';
import { Activity } from '../lib/types/activity';

interface ActivityCardProps {
  activity: Activity;
  showJoin: boolean;
  joining: boolean;
  onJoin: (activity: Activity) => void;
  onLeave: (activity: Activity) => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  showJoin,
  joining,
  onJoin,
  onLeave,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.activityName}>{activity.name}</Text>
      <Text style={styles.meta}>{activity.sport}</Text>
      {activity.details ? (
        <Text style={styles.details}>{activity.details}</Text>
      ) : null}
      {showJoin ? (
        <View style={styles.cardActions}>
          <Button
            title={'Join activity'}
            type="outline"
            onPress={() => onJoin(activity)}
            disabled={joining}
          />
        </View>
      ) : (
        <View style={styles.cardActions}>
          <Button
            title={'Leave activity'}
            type="outline"
            onPress={() => onLeave(activity)}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  activityName: {
    fontSize: Theme.typography.h3.fontSize,
    fontWeight: Theme.typography.h3.fontWeight,
    marginBottom: Theme.spacing.xs,
  },
  card: {
    borderColor: Colors.border,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    marginBottom: Theme.spacing.sm,
    padding: Theme.spacing.md,
    ...Theme.shadows.small,
  },
  cardActions: {
    marginTop: Theme.spacing.sm,
  },
  details: {
    marginTop: Theme.spacing.xs,
  },
  meta: {
    color: Colors.textSecondary,
    fontSize: Theme.typography.caption.fontSize,
  },
});

export default ActivityCard;
