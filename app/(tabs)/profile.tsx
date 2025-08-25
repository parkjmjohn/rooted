import { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Alert, ScrollView } from 'react-native';
import { Button, Input } from '@rneui/themed';
import { Session } from '@supabase/supabase-js';
import { useRouter } from 'expo-router';

import { supabase } from '../../lib/supabase';
import Avatar from '../../components/Avatar';
import { Colors } from '../../constants/Colors';
import { NavigationRoutes } from '../../constants/Navigation';

export default function ProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error, status } = await supabase
        .from('profiles')
        .select(
          `full_name, username, avatar_url, bio, city, country, is_teacher`
        )
        .eq('id', session?.user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setName(data.full_name);
        setUsername(data.username);
        setBio(data.bio);
        setAvatarUrl(data.avatar_url);
        setCity(data.city);
        setCountry(data.country);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session) getProfile();
  }, [session, getProfile]);

  async function updateProfile({
    name,
    username,
    avatar_url,
    city,
    country,
  }: {
    name: string;
    username: string;
    avatar_url: string;
    city: string;
    country: string;
  }) {
    try {
      setLoading(true);

      const updates = {
        id: session?.user.id,
        name,
        username,
        avatar_url,
        city,
        country,
        updated_at: new Date(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);

      if (error) {
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
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
        <Input label="Email" value={session?.user?.email} disabled />
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
            await supabase.auth.signOut();
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
    padding: 12,
    paddingBottom: 100, // Extra padding for bottom tab bar
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
