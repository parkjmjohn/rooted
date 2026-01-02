import React, { useEffect, useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Button, Chip, Input } from '@rneui/themed';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

import { Colors } from '../../constants/Colors';
import { Theme } from '../../constants/Theme';
import {
  ACTIVITY_SPORTS,
  Activity,
  ActivitySport,
  CreateActivityPayload,
} from '../../lib/types/activity';
import { createActivity, updateActivity } from '../../lib/activities';
import { formatDateTime } from '../../lib/utils/formatDateTime';

interface ActivityModalProps {
  visible: boolean;
  hostId: string;
  onClose: () => void;
  onCreated?: (activity: Activity) => void;
  activity?: Activity | null;
  onSaved?: (activity: Activity) => void;
}

const ActivityModal: React.FC<ActivityModalProps> = ({
  visible,
  hostId,
  onClose,
  onCreated,
  activity = null,
  onSaved,
}) => {
  const [name, setName] = useState('');
  const [sport, setSport] = useState<ActivitySport>('running');
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [pickerMode, setPickerMode] = useState<'date' | 'time' | null>(null);
  const [details, setDetails] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setName('');
    setSport('running');
    setSelectedDate(new Date());
    setPickerMode(null);
    setDetails('');
    setError(null);
  };

  useEffect(() => {
    if (!visible) {
      resetForm();
    }
  }, [visible]);

  useEffect(() => {
    if (activity) {
      setName(activity.name);
      setSport(activity.sport);
      setSelectedDate(new Date(activity.time));
      setDetails(activity.details ?? '');
      setPickerMode(null);
    }
  }, [activity]);

  const handlePickerChange = (
    event: DateTimePickerEvent,
    value?: Date | undefined
  ) => {
    if (event.type === 'dismissed') {
      setPickerMode(null);
      return;
    }

    const nextDate = value ?? selectedDate;
    setSelectedDate(nextDate);
    if (Platform.OS !== 'ios') {
      setPickerMode(null);
    }
  };

  const openPicker = (mode: 'date' | 'time') => {
    setPickerMode(mode);
  };

  const isEditing = Boolean(activity);

  const handleCreate = async () => {
    setError(null);
    try {
      if (!name.trim()) {
        throw new Error('Please add a name for the activity.');
      }

      const payload: CreateActivityPayload = {
        name: name.trim(),
        sport,
        time: selectedDate.toISOString(),
        details: details.trim() || null,
      };

      setSubmitting(true);
      if (isEditing && activity) {
        const updatedActivity = await updateActivity(activity.id, payload);
        onSaved?.(updatedActivity);
      } else {
        const createdActivity = await createActivity(payload, hostId);
        onCreated?.(createdActivity);
      }
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

  const modalTitle = isEditing ? 'Edit Activity' : 'Create Activity';
  const submitTitle = isEditing ? 'Save changes' : 'Create activity';
  const submittingTitle = isEditing ? 'Saving...' : 'Creating...';

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
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.backdrop}>
        <View style={styles.modalContent}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.header}>
              <Text style={styles.title}>{modalTitle}</Text>
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

            <View style={styles.whenBlock}>
              <Text style={styles.label}>When</Text>
              <Text style={styles.whenDescription}>
                {formatDateTime(selectedDate.toISOString())}
              </Text>
              <View style={styles.whenRow}>
                <TouchableOpacity
                  style={styles.whenButton}
                  onPress={() => openPicker('date')}
                >
                  <Text style={styles.whenButtonLabel}>Date</Text>
                  <Text style={styles.whenButtonValue}>
                    {selectedDate.toLocaleDateString(undefined, {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.whenButton, styles.whenButtonSecond]}
                  onPress={() => openPicker('time')}
                >
                  <Text style={styles.whenButtonLabel}>Time</Text>
                  <Text style={styles.whenButtonValue}>
                    {selectedDate.toLocaleTimeString(undefined, {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {pickerMode && (
              <View style={styles.pickerWrapper}>
                <DateTimePicker
                  value={selectedDate}
                  mode={pickerMode}
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handlePickerChange}
                />
                {Platform.OS === 'ios' && (
                  <Button
                    title="Done"
                    type="outline"
                    onPress={() => setPickerMode(null)}
                    containerStyle={styles.pickerButton}
                  />
                )}
              </View>
            )}

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
              title={submitting ? submittingTitle : submitTitle}
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
  pickerButton: {
    marginTop: Theme.spacing.sm,
  },
  pickerWrapper: {
    marginBottom: Theme.spacing.md,
    marginTop: Theme.spacing.sm,
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
  whenBlock: {
    marginBottom: Theme.spacing.md,
  },
  whenButton: {
    backgroundColor: Colors.background,
    borderColor: Colors.border,
    borderRadius: Theme.borderRadius.sm,
    borderWidth: 1,
    flex: 1,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
  },
  whenButtonLabel: {
    color: Colors.textSecondary,
    fontSize: Theme.typography.caption.fontSize,
    textTransform: 'uppercase',
  },
  whenButtonSecond: {
    marginLeft: Theme.spacing.sm,
  },
  whenButtonValue: {
    color: Colors.text,
    fontSize: Theme.typography.body.fontSize,
    marginTop: 4,
  },
  whenDescription: {
    color: Colors.textSecondary,
    marginBottom: Theme.spacing.xs,
  },
  whenRow: {
    flexDirection: 'row',
  },
});

export default ActivityModal;
