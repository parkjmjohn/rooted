import React, { useEffect, useMemo, useRef, useState } from 'react';
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
  deleteActivity,
} from '../../lib/activities';
import { Activity } from '../../lib/types/activity';
import { useAppSelector } from '../../lib/store';
import ActivitySection from '../../components/activities/ActivitySection';
import ActivityCard from '../../components/activities/ActivityCard';
import ActivityModal from '../../components/activities/ActivityModal';
import ActivityDetailsModal from '../../components/activities/ActivityDetailsModal';
import { useRouter, useSegments } from 'expo-router';

const ActivitiesScreen = () => {
  const userId = useAppSelector(s => s.auth.user?.id);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activityId, setActivityId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailsActivity, setDetailsActivity] = useState<Activity | null>(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [shouldReopenDetails, setShouldReopenDetails] = useState(false);
  const router = useRouter();
  const segments = useSegments();
  const prevIsActivityRoute = useRef(false);

  useEffect(() => {
    const isActivityRoute = segments.some(segment => segment === 'activity');
    const wasActivityRoute = prevIsActivityRoute.current;
    if (shouldReopenDetails && !isActivityRoute && wasActivityRoute) {
      setDetailsVisible(true);
      setShouldReopenDetails(false);
    }
    prevIsActivityRoute.current = isActivityRoute;
  }, [segments, shouldReopenDetails]);

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
      closeDetails();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to join activity.';
      Alert.alert('Join failed', message);
    } finally {
      setActivityId(null);
    }
  };

  const handleLeave = async (activity: Activity) => {
    const isHost = !!userId && activity.host_id === userId;
    setActivityId(activity.id);
    try {
      if (!userId) {
        throw new Error('You must be logged in to leave an activity.');
      }
      if (isHost) {
        await deleteActivity(activity.id);
      } else {
        await leaveActivity(activity.id, userId);
      }
      await loadActivities();
      closeDetails();
    } catch (err) {
      const defaultMessage = isHost
        ? 'Failed to cancel event.'
        : 'Failed to leave activity.';
      const message = err instanceof Error ? err.message : defaultMessage;
      const alertTitle = isHost ? 'Cancel failed' : 'Leave failed';
      Alert.alert(alertTitle, message);
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

  const closeDetails = (options?: {
    keepReopen?: boolean;
    clearActivity?: boolean;
  }) => {
    setDetailsVisible(false);
    const keepActivity = options?.keepReopen && options.clearActivity === false;
    if (!keepActivity) {
      setDetailsActivity(null);
    }
    if (!options?.keepReopen) {
      setShouldReopenDetails(false);
    }
  };

  const openEdit = (activity: Activity) => {
    closeDetails();
    setEditingActivity(activity);
  };

  const closeEditModal = () => {
    setEditingActivity(null);
  };

  const handleActivityUpdated = (updatedActivity: Activity) => {
    setActivities(prev =>
      prev.map(activity =>
        activity.id === updatedActivity.id ? updatedActivity : activity
      )
    );
    closeEditModal();
  };

  const handleViewParticipants = (activity: Activity) => {
    globalThis.setTimeout(() => {
      router.push(`/activity/${activity.id}/participants`);
    }, 0);
    setShouldReopenDetails(true);
    closeDetails({ keepReopen: true, clearActivity: false });
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
      <ActivityModal
        visible={!!editingActivity}
        hostId={userId}
        onClose={closeEditModal}
        activity={editingActivity}
        onSaved={handleActivityUpdated}
      />
      <ActivityDetailsModal
        visible={detailsVisible}
        activity={detailsActivity}
        onClose={closeDetails}
        onJoin={handleJoin}
        onLeave={handleLeave}
        onEdit={openEdit}
        userId={userId ?? null}
        actionActivityId={activityId}
        onViewParticipants={handleViewParticipants}
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
