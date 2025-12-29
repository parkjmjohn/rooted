import React, { useEffect, useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { Button, Chip, Input } from '@rneui/themed';

import { Colors } from '../constants/Colors';
import { Theme } from '../constants/Theme';
import {
  ACTIVITY_SPORTS,
  Activity,
  ActivitySport,
  CreateActivityPayload,
} from '../lib/types/activity';
import { createActivity } from '../lib/activities';

interface ActivityModalProps {
  visible: boolean;
  hostId: string;
  onClose: () => void;
  onCreated: (activity: Activity) => void;
}

const ActivityModal: React.FC<ActivityModalProps> = ({
  visible,
  hostId,
  onClose,
  onCreated,
}) => {
  const [name, setName] = useState('');
  const [sport, setSport] = useState<ActivitySport>('running');
  const [timeInput, setTimeInput] = useState('');
  const [details, setDetails] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setName('');
    setSport('running');
    setTimeInput('');
    setDetails('');
    setError(null);
  };

  useEffect(() => {
    if (!visible) {
      resetForm();
    }
  }, [visible]);

  const handleCreate = async () => {
    setError(null);
    try {
      if (!name.trim()) {
        throw new Error('Please add a name for the activity.');
      }

      const parsedTime = new Date(timeInput);
      if (Number.isNaN(parsedTime.getTime())) {
        throw new Error(
          'Add a valid date/time (e.g. 2025-02-08 17:30 or 2025-02-08T17:30:00Z).'
        );
      }

      const payload: CreateActivityPayload = {
        name: name.trim(),
        sport,
        time: parsedTime.toISOString(),
        details: details.trim() || null,
      };

      setSubmitting(true);
      const activity = await createActivity(payload, hostId);
      onCreated(activity);
      resetForm();
      onClose();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to create activity.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const renderOptions = <T extends string>(
    label: string,
    options: readonly T[],
    selected: T,
    onSelect: (value: T) => void
  ) => (
    <View style={styles.optionBlock}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.chips}>
        {options.map(option => (
          <Chip
            key={option}
            title={option}
            type={selected === option ? 'solid' : 'outline'}
            onPress={() => onSelect(option)}
            containerStyle={styles.chipContainer}
          />
        ))}
      </View>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <View style={styles.modalContent}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.header}>
              <Text style={styles.title}>Create Activity</Text>
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.helperText}>
              Fill out the details for your meetup. Only upcoming activities are
              shown in the Activities tab.
            </Text>

            <Input
              label="Name"
              value={name}
              onChangeText={setName}
              placeholder="Sunrise trail run"
            />

            <Input
              label="Date & time (local or ISO)"
              value={timeInput}
              onChangeText={setTimeInput}
              placeholder="2025-02-08 07:30"
            />

            {renderOptions('Sport', ACTIVITY_SPORTS, sport, setSport)}

            <Input
              label="Details (100 word max)"
              value={details}
              onChangeText={setDetails}
              multiline
              numberOfLines={3}
              placeholder="Pace, parking tips, gear to bring..."
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Button
              title={submitting ? 'Creating...' : 'Create activity'}
              onPress={handleCreate}
              disabled={submitting}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    alignItems: 'center',
    backgroundColor: Colors.overlay,
    flex: 1,
    justifyContent: 'center',
    padding: Theme.spacing.md,
  },
  chipContainer: {
    marginBottom: Theme.spacing.sm,
    marginRight: Theme.spacing.sm,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  closeText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  errorText: {
    color: Colors.error,
    marginBottom: Theme.spacing.md,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.md,
  },
  helperText: {
    color: Colors.textSecondary,
    marginBottom: Theme.spacing.md,
  },
  label: {
    color: Colors.text,
    fontWeight: '600',
    marginBottom: Theme.spacing.sm,
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderRadius: Theme.borderRadius.lg,
    maxHeight: '90%',
    width: '100%',
    ...Theme.shadows.medium,
  },
  optionBlock: {
    marginBottom: Theme.spacing.md,
  },
  scroll: {
    borderRadius: Theme.borderRadius.lg,
  },
  scrollContent: {
    padding: Theme.spacing.md,
  },
  title: {
    fontSize: Theme.typography.h2.fontSize,
    fontWeight: Theme.typography.h2.fontWeight,
  },
});

export default ActivityModal;
