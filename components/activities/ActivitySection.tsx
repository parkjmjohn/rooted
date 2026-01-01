import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '../../constants/Colors';
import { Theme } from '../../constants/Theme';
import { Activity } from '../../lib/types/activity';

interface ActivitySectionProps {
  title: string;
  items: Activity[];
  emptyMessage?: string;
  renderItem: (activity: Activity) => React.ReactNode;
}

const ActivitySection: React.FC<ActivitySectionProps> = ({
  title,
  items,
  emptyMessage = 'Nothing to show yet.',
  renderItem,
}) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionSubtitle}>
        {items.length} {items.length === 1 ? 'activity' : 'activities'}
      </Text>
    </View>
    {items.length === 0 ? (
      <Text style={styles.emptyText}>{emptyMessage}</Text>
    ) : (
      items.map(renderItem)
    )}
  </View>
);

const styles = StyleSheet.create({
  emptyText: {
    color: Colors.textSecondary,
    fontSize: Theme.typography.caption.fontSize,
    paddingVertical: Theme.spacing.sm,
  },
  section: {
    marginBottom: Theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.sm,
  },
  sectionSubtitle: {
    fontSize: Theme.typography.caption.fontSize,
  },
  sectionTitle: {
    fontSize: Theme.typography.h3.fontSize,
    fontWeight: Theme.typography.h3.fontWeight,
  },
});

export default ActivitySection;
