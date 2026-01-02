import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { Colors } from '../../../../constants/Colors';
import { Theme } from '../../../../constants/Theme';
import { Profile } from '../../../../lib/types/profile';
import { downloadAvatarDataUrl } from '../../../../lib/avatar';
import { fetchProfileById } from '../../../../lib/profiles';
import { getInitialsProfile } from '../../../../lib/utils/formatAvatar';

const ParticipantProfileScreen = () => {
  const router = useRouter();
  const { participantId } = useLocalSearchParams<{
    participantId?: string;
  }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!participantId) {
      setProfile(null);
      setError('Missing participant identifier.');
      return;
    }

    let isCurrent = true;
    setLoading(true);
    setError(null);

    fetchProfileById(participantId)
      .then(data => {
        if (isCurrent) {
          setProfile(data);
        }
      })
      .catch(err => {
        if (isCurrent) {
          setError(
            err instanceof Error ? err.message : 'Failed to load profile.'
          );
        }
      })
      .finally(() => {
        if (isCurrent) {
          setLoading(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [participantId]);

  useEffect(() => {
    let cancelled = false;

    if (!profile?.avatar_url) {
      setAvatarUri(null);
      return;
    }

    (async () => {
      try {
        if (profile?.avatar_url) {
          const uri = await downloadAvatarDataUrl(profile.avatar_url);
          if (!cancelled) {
            setAvatarUri(uri);
          }
        }
      } catch (avatarError) {
        console.warn('Failed to load avatar', avatarError);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [profile?.avatar_url]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    // router.replace(NavigationRoutes.ACTIVITIES);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack}>
            <Text style={styles.back}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{profile?.full_name}</Text>
          <View style={styles.spacer} />
        </View>

        {loading ? (
          <ActivityIndicator style={styles.loader} size="large" />
        ) : error ? (
          <Text style={styles.message}>{error}</Text>
        ) : profile ? (
          <View style={styles.card}>
            <View style={styles.avatarWrapper}>
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatar} />
              ) : (
                <View style={styles.placeholder}>
                  <Text style={styles.initials}>
                    {getInitialsProfile(profile)}
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.username}>
              {profile.username ? `@${profile.username}` : profile.id}
            </Text>
            {profile.bio ? (
              <>
                <Text style={styles.sectionLabel}>Bio</Text>
                <Text style={styles.sectionValue}>{profile.bio}</Text>
              </>
            ) : null}
            {(profile.city || profile.country) && (
              <>
                <Text style={styles.sectionLabel}>Location</Text>
                <Text style={styles.sectionValue}>
                  {profile.city && profile.country
                    ? `${profile.city}, ${profile.country}`
                    : (profile.city ?? profile.country)}
                </Text>
              </>
            )}
          </View>
        ) : (
          <Text style={styles.message}>No profile found.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 60,
    height: 120,
    width: 120,
  },
  avatarWrapper: {
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  back: {
    color: Colors.primary,
    fontWeight: '600',
  },
  card: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderRadius: Theme.borderRadius.lg,
    borderWidth: 1,
    margin: Theme.spacing.md,
    padding: Theme.spacing.md,
  },
  container: {
    backgroundColor: Colors.background,
    flexGrow: 1,
    paddingBottom: Theme.spacing.xl,
    paddingTop: Theme.spacing.md,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
  },
  initials: {
    color: Colors.background,
    fontSize: Theme.typography.h3.fontSize,
    fontWeight: '600',
  },
  loader: {
    marginTop: Theme.spacing.lg,
  },
  message: {
    color: Colors.textSecondary,
    marginTop: Theme.spacing.lg,
    textAlign: 'center',
  },
  placeholder: {
    alignItems: 'center',
    backgroundColor: Colors.border,
    borderRadius: 60,
    height: 120,
    justifyContent: 'center',
    width: 120,
  },
  safeArea: {
    backgroundColor: Colors.background,
    flex: 1,
  },
  sectionLabel: {
    color: Colors.textSecondary,
    fontSize: Theme.typography.caption.fontSize,
    marginTop: Theme.spacing.md,
  },
  sectionValue: {
    color: Colors.text,
    fontSize: Theme.typography.body.fontSize,
    marginTop: Theme.spacing.xs,
    textAlign: 'center',
  },
  spacer: {
    width: 48,
  },
  title: {
    fontSize: Theme.typography.h3.fontSize,
    fontWeight: Theme.typography.h3.fontWeight,
  },
  username: {
    color: Colors.textSecondary,
    fontSize: Theme.typography.caption.fontSize,
    marginBottom: Theme.spacing.sm,
  },
});

export default ParticipantProfileScreen;
