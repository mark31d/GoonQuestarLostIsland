import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AssetRegistry from './AssetRegistry';
import Colors from './Colors';
import {JOURNAL_KEY} from './JournalScreen';

function formatFullDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function JournalEntryScreen({route, navigation}) {
  const {entry} = route.params;
  const insets = useSafeAreaInsets();
  const isNew = !entry;

  const [title, setTitle] = useState(entry?.title || '');
  const [body, setBody] = useState(entry?.body || '');
  const [saved, setSaved] = useState(false);

  const bodyRef = useRef(null);

  useEffect(() => {
    if (isNew) {
      const timer = setTimeout(() => bodyRef.current?.focus(), 350);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSave = async () => {
    if (!body.trim() && !title.trim()) {
      navigation.goBack();
      return;
    }
    const raw = await AsyncStorage.getItem(JOURNAL_KEY);
    const entries = raw ? JSON.parse(raw) : [];
    const now = new Date().toISOString();

    if (isNew) {
      entries.unshift({
        id: String(Date.now()),
        title: title.trim(),
        body: body.trim(),
        createdAt: now,
        updatedAt: now,
      });
    } else {
      const idx = entries.findIndex(e => e.id === entry.id);
      if (idx !== -1) {
        entries[idx] = {
          ...entries[idx],
          title: title.trim(),
          body: body.trim(),
          updatedAt: now,
        };
      }
    }
    await AsyncStorage.setItem(JOURNAL_KEY, JSON.stringify(entries));
    setSaved(true);
    setTimeout(() => navigation.goBack(), 120);
  };

  const handleDelete = async () => {
    const raw = await AsyncStorage.getItem(JOURNAL_KEY);
    const entries = raw ? JSON.parse(raw) : [];
    const next = entries.filter(e => e.id !== entry.id);
    await AsyncStorage.setItem(JOURNAL_KEY, JSON.stringify(next));
    navigation.goBack();
  };

  const dateLabel = isNew
    ? formatFullDate(new Date().toISOString())
    : formatFullDate(entry.updatedAt);

  return (
    <ImageBackground
      source={AssetRegistry.bg_main}
      style={[styles.container, {paddingTop: insets.top}]}
      imageStyle={styles.bgImage}>
      <View style={styles.bgOverlay} />

      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}>

        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}>
            <Image source={AssetRegistry.icon_back} style={styles.backIcon} />
          </TouchableOpacity>

          <Text style={styles.topBarTitle} numberOfLines={1}>
            {isNew ? 'New Entry' : 'Edit Entry'}
          </Text>

          <View style={styles.topBarActions}>
            {!isNew && (
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={handleDelete}
                activeOpacity={0.8}>
                <Text style={styles.deleteBtnText}>Delete</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.saveBtn, saved && styles.saveBtnDone]}
              onPress={handleSave}
              activeOpacity={0.85}>
              <Text style={styles.saveBtnText}>{saved ? 'Saved' : 'Save'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            {paddingBottom: insets.bottom + 40},
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          <Text style={styles.dateLabel}>{dateLabel}</Text>

          <View style={styles.inputBlock}>
            <TextInput
              style={styles.titleInput}
              value={title}
              onChangeText={setTitle}
              placeholder="Title (optional)"
              placeholderTextColor={Colors.text_muted}
              returnKeyType="next"
              onSubmitEditing={() => bodyRef.current?.focus()}
              selectionColor="#C41014"
            />
          </View>

          <View style={styles.bodyBlock}>
            <TextInput
              ref={bodyRef}
              style={styles.bodyInput}
              value={body}
              onChangeText={setBody}
              placeholder="Write something here..."
              placeholderTextColor={Colors.text_muted}
              multiline
              textAlignVertical="top"
              selectionColor="#C41014"
            />
            <View style={styles.wordCountRow}>
              <Text style={styles.wordCount}>
                {body.trim() ? body.trim().split(/\s+/).length : 0} words
              </Text>
              <Text style={styles.wordCount}>{body.length} chars</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bgImage: {resizeMode: 'cover'},
  bgOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(14,14,14,0.88)',
  },
  container: {flex: 1, backgroundColor: Colors.bg_dark},
  kav: {flex: 1},
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    gap: 10,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#C41014',
    borderWidth: 1,
    borderColor: '#E52020',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {width: 20, height: 20, resizeMode: 'contain', tintColor: '#fff'},
  topBarTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text_white,
  },
  topBarActions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  deleteBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(196,16,20,0.4)',
  },
  deleteBtnText: {
    fontSize: 13,
    color: '#C41014',
    fontWeight: '600',
  },
  saveBtn: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: '#C41014',
  },
  saveBtnDone: {
    backgroundColor: '#3A6428',
  },
  saveBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  scroll: {flex: 1},
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    gap: 12,
  },
  dateLabel: {
    fontSize: 12,
    color: Colors.text_muted,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    paddingHorizontal: 4,
  },
  inputBlock: {
    backgroundColor: 'rgba(8,6,6,0.75)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.gold_border,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text_white,
    paddingVertical: 12,
  },
  bodyBlock: {
    backgroundColor: 'rgba(8,6,6,0.75)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.gold_border,
    padding: 16,
    gap: 12,
  },
  bodyInput: {
    fontSize: 16,
    color: Colors.text_secondary,
    lineHeight: 26,
    minHeight: 280,
    paddingVertical: 0,
  },
  wordCountRow: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.gold_border,
  },
  wordCount: {
    fontSize: 11,
    color: Colors.text_muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
