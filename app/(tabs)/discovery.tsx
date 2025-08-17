import React from 'react';
import { View, Text } from 'react-native';
import { useColorScheme } from 'react-native';
import { getCommonStyles } from '../../constants/CommonStyles';

export default function DiscoveryScreen() {
  const colorScheme = useColorScheme();
  const styles = getCommonStyles(colorScheme);

  return (
    <View style={styles.container}>
      <View style={[styles.centered, styles.padding]}>
        <Text style={styles.title}>Discovery</Text>
        <Text style={styles.subtitle}>Find classes here</Text>
      </View>
    </View>
  );
}
