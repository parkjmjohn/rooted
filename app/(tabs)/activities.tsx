import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Button } from '@rneui/themed';

import { Colors } from '../../constants/Colors';
import { Theme } from '../../constants/Theme';
import {
  fetchUpcomingActivities,
  joinActivity,
  leaveActivity,
} from '../../lib/activities';
import { Activity } from '../../lib/types/activity';
import { useAppSelector } from '../../lib/store';
import ActivitySection from '../../components/ActivitySection';
import ActivityCard from '../../components/ActivityCard';
import ActivityModal from '../../components/ActivityModal';
import ActivityDetailsModal from '../../components/activities/ActivityDetailsModal';

const ActivitiesScreen = () => {
  const userId = useAppSelector(s => s.auth.user?.id);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activityId, setActivityId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailsActivity, setDetailsActivity] = useState<Activity | null>(null);
  const [detailsVisible, setDetailsVisible] = useState(false);

  const loadActivities = async () => {
    setLoading(true);
    try {
      const data = await fetchUpcomingActivities();
      setActivities(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to load activities.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      loadActivities();
    }
  }, [userId]);

  const hostingOrJoinedActivities = useMemo(
    () =>
      activities.filter(
        activity =>
          activity.host_id === userId ||
          activity.activity_participants?.some(p => p.user_id === userId)
      ),
    [activities, userId]
  );

  const availableActivities = useMemo(
    () =>
      activities.filter(
        activity =>
          activity.host_id !== userId &&
          !activity.activity_participants?.some(p => p.user_id === userId)
      ),
    [activities, userId]
  );

  const handleJoin = async (activity: Activity) => {
    setActivityId(activity.id);
    try {
      if (!userId) {
        throw new Error('You must be logged in to join an activity.');
      }
      await joinActivity(activity.id, userId);
      await loadActivities();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to join activity.';
      Alert.alert('Join failed', message);
    } finally {
      setActivityId(null);
    }
  };

  const handleLeave = async (activity: Activity) => {
    setActivityId(activity.id);
    try {
      if (!userId) {
        throw new Error('You must be logged in to leave an activity.');
      }
      await leaveActivity(activity.id, userId);
      await loadActivities();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to leave activity.';
      Alert.alert('Leave failed', message);
    } finally {
      setActivityId(null);
    }
  };

  const handleCreated = (activity: Activity) => {
    setActivities(prev => [activity, ...prev]);
  };

  const openDetails = (activity: Activity) => {
    setDetailsActivity(activity);
    setDetailsVisible(true);
  };

  const closeDetails = () => {
    setDetailsVisible(false);
    setDetailsActivity(null);
  };

  if (!userId) {
    return (
      <View style={styles.container}>
        <Text style={[styles.title, { marginTop: Theme.spacing.xl }]}>
          Activities
        </Text>
        <Text style={styles.subtitle}>
          Sign in to browse or host an activity.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityModal
        visible={modalVisible}
        hostId={userId}
        onClose={() => setModalVisible(false)}
        onCreated={handleCreated}
      />
      <ActivityDetailsModal
        visible={detailsVisible}
        activity={detailsActivity}
        onClose={closeDetails}
      />
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Activities</Text>
          <Text style={styles.subtitle}>Upcoming and joinable activities</Text>
        </View>
        <Button
          title="New"
          onPress={() => setModalVisible(true)}
          type="outline"
          buttonStyle={styles.headerButton}
        />
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <ActivitySection
            title="Hosting or Joined"
            items={hostingOrJoinedActivities}
            renderItem={activity => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                showJoin={false}
                joining={false}
                onJoin={handleJoin}
                onLeave={handleLeave}
                onPress={() => openDetails(activity)}
              />
            )}
          />
          <ActivitySection
            title="Available to Join"
            items={availableActivities}
            renderItem={activity => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                showJoin={true}
                joining={activityId === activity.id}
                onJoin={handleJoin}
                onLeave={handleLeave}
                onPress={() => openDetails(activity)}
              />
            )}
          />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Theme.spacing.md,
    paddingTop: Theme.spacing.xl,
  },
  errorText: {
    color: Colors.error,
    marginBottom: Theme.spacing.sm,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.md,
  },
  headerButton: {
    paddingHorizontal: Theme.spacing.md,
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: Theme.spacing.xxl + Theme.tabBar.height,
  },
  subtitle: {
    fontSize: Theme.typography.body.fontSize,
  },
  title: {
    fontSize: Theme.typography.h2.fontSize,
    fontWeight: Theme.typography.h2.fontWeight,
  },
});

export default ActivitiesScreen;
