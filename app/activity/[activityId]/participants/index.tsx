import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';

import ParticipantAvatarStack from '../../../../components/avatar/ParticipantAvatarStack';
import { Colors } from '../../../../constants/Colors';
import { Theme } from '../../../../constants/Theme';
import { Activity, ActivityParticipant } from '../../../../lib/types/activity';
import { fetchActivityById } from '../../../../lib/activities';

const ParticipantListScreen = () => {
  const router = useRouter();
  const { activityId } = useLocalSearchParams<{ activityId?: string }>();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!activityId) {
      setActivity(null);
      setError('Missing activity identifier.');
      return;
    }

    let isCurrent = true;
    setLoading(true);
    setError(null);

    fetchActivityById(activityId)
      .then(data => {
        if (!isCurrent) return;
        if (data) {
          setActivity(data);
        } else {
          setError('Activity not found.');
        }
      })
      .catch(err => {
        if (!isCurrent) return;
        const message =
          err instanceof Error ? err.message : 'Failed to load activity.';
        setError(message);
      })
      .finally(() => {
        if (isCurrent) {
          setLoading(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [activityId]);

  const participants = activity?.activity_participants ?? [];

  const handleParticipantPress = (participant: ActivityParticipant) => {
    if (!activityId) return;
    router.push(`/activity/${activityId}/participants/${participant.user_id}`);
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    // router.replace(NavigationRoutes.ACTIVITIES);
  };

  const title = activity?.name ?? 'Participants';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack}>
            <Text style={styles.back}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.spacer} />
        </View>

        {loading ? (
          <ActivityIndicator style={styles.loader} size="large" />
        ) : error ? (
          <Text style={styles.message}>{error}</Text>
        ) : participants.length === 0 ? (
          <Text style={styles.message}>No participants yet.</Text>
        ) : (
          <ScrollView
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          >
            {participants.map(participant => (
              <TouchableOpacity
                key={participant.user_id}
                style={styles.row}
                onPress={() => handleParticipantPress(participant)}
                activeOpacity={0.7}
              >
                <ParticipantAvatarStack
                  participants={[participant]}
                  maxVisible={1}
                  style={styles.avatar}
                />
                <View style={styles.details}>
                  <Text style={styles.name}>
                    {participant.profile?.full_name ??
                      participant.profile?.username ??
                      participant.user_id}
                  </Text>
                  <Text style={styles.role}>
                    {participant.role === 'host' ? 'Host' : 'Participant'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  avatar: {
    marginRight: Theme.spacing.md,
  },
  back: {
    color: Colors.primary,
    fontWeight: '600',
  },
  container: {
    backgroundColor: Colors.background,
    flex: 1,
    paddingTop: Theme.spacing.md,
  },
  details: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
  },
  list: {
    padding: Theme.spacing.md,
  },
  loader: {
    marginTop: Theme.spacing.lg,
  },
  message: {
    color: Colors.textSecondary,
    marginTop: Theme.spacing.lg,
    textAlign: 'center',
  },
  name: {
    fontSize: Theme.typography.body.fontSize,
    fontWeight: '600',
  },
  role: {
    color: Colors.textSecondary,
    fontSize: Theme.typography.caption.fontSize,
  },
  row: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: Theme.spacing.sm,
    padding: Theme.spacing.md,
  },
  safeArea: {
    backgroundColor: Colors.background,
    flex: 1,
  },
  spacer: {
    width: 48,
  },
  title: {
    fontSize: Theme.typography.h3.fontSize,
    fontWeight: Theme.typography.h3.fontWeight,
  },
});

export default ParticipantListScreen;
