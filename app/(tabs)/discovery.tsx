import React from 'react';
import { View, Text } from 'react-native';
import { useColorScheme } from 'react-native';
import { getCommonStyles } from '../../constants/CommonStyles';
import { Theme } from '../../constants/Theme';

export default function DiscoveryScreen() {
  const colorScheme = useColorScheme();
  const styles = getCommonStyles(colorScheme);

  return (
    <View style={styles.container}>
      <View style={[styles.centered, { padding: Theme.spacing.xl }]}>
        <Text style={styles.title}>Discovery</Text>
        <Text style={styles.subtitle}>Find classes here</Text>
      </View>
    </View>
  );
}
