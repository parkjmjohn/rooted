import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Theme } from '../../constants/Theme';

export default function MessagingScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Messages</Text>
        <Text style={styles.subtitle}>Send and receive messages</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    flex: 1,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: Theme.spacing.xl,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
  title: {
    fontSize: Theme.typography.h2.fontSize,
    fontWeight: Theme.typography.h2.fontWeight,
    marginBottom: Theme.spacing.sm,
  },
});
