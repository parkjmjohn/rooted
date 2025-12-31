import { useState, useEffect } from 'react';
import { StyleSheet, View, Alert, ScrollView } from 'react-native';
import { Button, Input } from '@rneui/themed';
import { useRouter } from 'expo-router';

import Avatar from '../../components/Avatar';
import { Colors } from '../../constants/Colors';
import { Theme } from '../../constants/Theme';
import { NavigationRoutes } from '../../constants/Navigation';
import { useAppDispatch, useAppSelector } from '../../lib/store';
import {
  fetchProfile,
  upsertProfile,
} from '../../lib/store/slices/profileSlice';
import { signOut as signOutThunk } from '../../lib/store/slices/authSlice';

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(s => s.auth.user);
  const { profile, loading } = useAppSelector(s => s.profile);
  const [name, setName] = useState(profile?.full_name ?? '');
  const [username, setUsername] = useState(profile?.username ?? '');
  const [bio, setBio] = useState(profile?.bio ?? '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? '');
  const [city, setCity] = useState(profile?.city ?? '');
  const [country, setCountry] = useState(profile?.country ?? '');
  const router = useRouter();

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchProfile(user.id));
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (profile) {
      setName(profile.full_name ?? '');
      setUsername(profile.username ?? '');
      setBio(profile.bio ?? '');
      setAvatarUrl(profile.avatar_url ?? '');
      setCity(profile.city ?? '');
      setCountry(profile.country ?? '');
    }
  }, [profile]);

  async function updateProfile(values: {
    name: string;
    username: string;
    avatar_url: string;
    city: string;
    country: string;
  }) {
    if (!user?.id) return;
    const result = await dispatch(
      upsertProfile({
        id: user.id,
        full_name: values.name,
        username: values.username,
        avatar_url: values.avatar_url,
        city: values.city,
        country: values.country,
      })
    );
    if (upsertProfile.rejected.match(result)) {
      const msg = (result.payload as string) ?? 'Failed to update profile';
      Alert.alert(msg);
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View>
        <Avatar
          size={200}
          url={avatarUrl}
          onUpload={(url: string) => {
            setAvatarUrl(url);
            updateProfile({ name, username, city, country, avatar_url: url });
          }}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input label="Email" value={user?.email ?? ''} disabled />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Name"
          value={name || ''}
          onChangeText={(text: string) => setName(text)}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Username"
          value={username || ''}
          onChangeText={(text: string) => setUsername(text)}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Bio"
          value={bio || ''}
          onChangeText={(text: string) => setBio(text)}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="City"
          value={city || ''}
          onChangeText={(text: string) => setCity(text)}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Country"
          value={country || ''}
          onChangeText={(text: string) => setCountry(text)}
        />
      </View>

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title={loading ? 'Loading ...' : 'Update'}
          onPress={() =>
            updateProfile({
              name,
              username,
              city,
              country,
              avatar_url: avatarUrl,
            })
          }
          disabled={loading}
        />
      </View>

      <View style={styles.verticallySpaced}>
        <Button
          title="Sign Out"
          onPress={async () => {
            await dispatch(signOutThunk());
            router.replace(NavigationRoutes.AUTH);
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    flex: 1,
  },
  contentContainer: {
    padding: Theme.spacing.md,
    paddingBottom: Theme.tabBar.height + Theme.spacing.xl, // Extra padding for bottom tab bar
  },
  mt20: {
    marginTop: 20,
  },
  verticallySpaced: {
    alignSelf: 'stretch',
    paddingBottom: 4,
    paddingTop: 4,
  },
});
