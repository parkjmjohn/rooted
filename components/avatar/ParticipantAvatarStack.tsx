import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  StyleProp,
  ViewStyle,
} from 'react-native';

import { downloadAvatarDataUrl } from '../../lib/avatar';
import { Colors } from '../../constants/Colors';
import { Theme } from '../../constants/Theme';
import { ActivityParticipant } from '../../lib/types/activity';
import { getInitialsActivityParticipant } from '../../lib/utils/formatAvatar';

interface ParticipantAvatarStackProps {
  participants?: ActivityParticipant[];
  style?: StyleProp<ViewStyle>;
  maxVisible?: number;
}

const drawParticipants = (
  participants: ActivityParticipant[],
  maxVisible: number
) => {
  const sorted = [...participants].sort((a, b) => {
    if (a.role === 'host' && b.role !== 'host') return -1;
    if (b.role === 'host' && a.role !== 'host') return 1;
    return 0;
  });
  const visible = sorted.slice(0, maxVisible);
  const extraCount = Math.max(0, sorted.length - visible.length);
  return { visible, extraCount };
};

const ParticipantAvatarStack: React.FC<ParticipantAvatarStackProps> = ({
  participants = [],
  style,
  maxVisible = 5,
}) => {
  const [avatarSources, setAvatarSources] = useState<Record<string, string>>(
    {}
  );
  const lastPaths = useRef<Record<string, string>>({});

  useEffect(() => {
    if (!participants.length) {
      setAvatarSources({});
      lastPaths.current = {};
      return;
    }

    let cancelled = false;

    participants.forEach(participant => {
      const path = participant.profile?.avatar_url;
      if (!path) {
        return;
      }

      if (lastPaths.current[participant.user_id] === path) {
        return;
      }

      lastPaths.current[participant.user_id] = path;

      if (path.startsWith('http')) {
        setAvatarSources(prev => ({
          ...prev,
          [participant.user_id]: path,
        }));
        return;
      }

      (async () => {
        try {
          const dataUrl = await downloadAvatarDataUrl(path);
          if (cancelled) {
            return;
          }

          setAvatarSources(prev => ({
            ...prev,
            [participant.user_id]: dataUrl,
          }));
        } catch (downloadError) {
          console.warn('Failed to load avatar', downloadError);
        }
      })();
    });
    return () => {
      cancelled = true;
    };
  }, [participants]);

  if (!participants.length) return null;

  const { visible, extraCount } = drawParticipants(participants, maxVisible);

  return (
    <View style={[styles.avatarStack, style]}>
      {visible.map((participant, index) => {
        const avatarUrl = avatarSources[participant.user_id];
        return (
          <View
            key={`${participant.user_id}-${index}`}
            style={[styles.avatarWrap, index !== 0 && styles.avatarOverlap]}
          >
            {avatarUrl ? (
              <Image
                source={{ uri: avatarUrl }}
                style={styles.avatar}
                accessibilityLabel="participant avatar"
              />
            ) : (
              <View style={styles.placeholder}>
                <Text style={styles.placeholderText}>
                  {getInitialsActivityParticipant(participant)}
                </Text>
              </View>
            )}
          </View>
        );
      })}
      {extraCount > 0 && (
        <View
          style={[styles.avatarWrap, styles.moreAvatar, styles.avatarOverlap]}
        >
          <Text style={styles.moreText}>+{extraCount}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    height: '100%',
    width: '100%',
  },
  avatarOverlap: {
    marginLeft: -8,
  },
  avatarStack: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  avatarWrap: {
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderColor: Colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    height: 36,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 36,
  },
  moreAvatar: {
    backgroundColor: Colors.surface,
  },
  moreText: {
    color: Colors.text,
    fontSize: Theme.typography.body.fontSize,
    fontWeight: '600',
  },
  placeholder: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
  placeholderText: {
    color: Colors.text,
    fontWeight: '600',
  },
});

export default ParticipantAvatarStack;
