import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  GestureResponderEvent,
} from 'react-native';

import { Colors } from '../constants/Colors';
import { Theme } from '../constants/Theme';
import { Activity } from '../lib/types/activity';

interface ActivityCardProps {
  activity: Activity;
  onPress?: (event: GestureResponderEvent) => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onPress }) => {
  return (
    <TouchableOpacity
      disabled={!onPress}
      activeOpacity={onPress ? 0.75 : 1}
      onPress={onPress}
    >
      <View style={styles.card}>
        <Text style={styles.activityName}>{activity.name}</Text>
        <Text style={styles.meta}>{activity.sport}</Text>
        {activity.details ? (
          <Text style={styles.details}>{activity.details}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
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
  details: {
    marginTop: Theme.spacing.xs,
  },
  meta: {
    color: Colors.textSecondary,
    fontSize: Theme.typography.caption.fontSize,
  },
});

export default ActivityCard;
