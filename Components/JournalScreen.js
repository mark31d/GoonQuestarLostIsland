import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  StyleSheet,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useFocusEffect} from '@react-navigation/native';
import AssetRegistry from './AssetRegistry';
import Colors from './Colors';

export const JOURNAL_KEY = '@goon_journal_entries';

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'});
}

export default function JournalScreen({navigation}) {
  const insets = useSafeAreaInsets();
  const [entries, setEntries] = useState([]);

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem(JOURNAL_KEY).then(raw => {
        if (raw) setEntries(JSON.parse(raw));
        else setEntries([]);
      });
    }, []),
  );

  const renderItem = ({item, index}) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => navigation.navigate('JournalEntry', {entry: item})}>
      <View style={styles.cardAccent} />
      <View style={styles.cardContent}>
        <View style={styles.cardTop}>
          <View style={styles.cardMeta}>
            <Text style={styles.cardDate}>{formatDate(item.updatedAt)}</Text>
            <Text style={styles.cardTime}>{formatTime(item.updatedAt)}</Text>
          </View>
          <View style={styles.cardIndexBadge}>
            <Text style={styles.cardIndexText}>#{entries.length - index}</Text>
          </View>
        </View>
        {item.title ? (
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.title}
          </Text>
        ) : null}
        <Text style={styles.cardPreview} numberOfLines={2}>
          {item.body || 'Empty entry...'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View style={styles.empty}>
      <Image source={AssetRegistry.book} style={styles.emptyIcon} />
      <Text style={styles.emptyTitle}>No entries yet</Text>
      <Text style={styles.emptyText}>
        Write down your thoughts, discoveries, and notes about the island.
      </Text>
    </View>
  );

  return (
    <ImageBackground
      source={AssetRegistry.bg_main}
      style={[styles.container, {paddingTop: insets.top}]}
      imageStyle={styles.bgImage}>
      <View style={styles.bgOverlay} />

      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}>
            <Image source={AssetRegistry.icon_back} style={styles.closeBtnIcon} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Journal</Text>
            <Text style={styles.headerCount}>
              {entries.length}{' '}
              {entries.length === 1 ? 'entry' : 'entries'}
            </Text>
          </View>
        </View>
        <Text style={styles.headerSub}>
          Your personal notes from the island.
        </Text>
      </View>

      <FlatList
        data={entries}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={[
          styles.list,
          entries.length === 0 && styles.listEmpty,
        ]}
        ListEmptyComponent={EmptyState}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={[styles.fab, {bottom: insets.bottom + 24}]}
        onPress={() => navigation.navigate('JournalEntry', {entry: null})}
        activeOpacity={0.85}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bgImage: {resizeMode: 'cover'},
  bgOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(14,14,14,0.84)',
  },
  container: {flex: 1, backgroundColor: Colors.bg_dark},
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.gold,
    marginBottom: 3,
  },
  headerCount: {
    fontSize: 12,
    color: Colors.text_muted,
  },
  closeBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#C41014',
    borderWidth: 1,
    borderColor: '#E52020',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: '#fff',
  },
  headerSub: {
    fontSize: 14,
    color: Colors.text_secondary,
    lineHeight: 20,
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 100,
    gap: 12,
  },
  listEmpty: {
    flex: 1,
  },
  card: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.gold_border,
    backgroundColor: 'rgba(20,16,16,0.9)',
    overflow: 'hidden',
  },
  cardAccent: {
    width: 4,
    backgroundColor: '#C41014',
  },
  cardContent: {
    flex: 1,
    padding: 14,
    gap: 6,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardDate: {
    fontSize: 12,
    color: Colors.gold,
    fontWeight: '600',
  },
  cardTime: {
    fontSize: 11,
    color: Colors.text_muted,
  },
  cardIndexBadge: {
    backgroundColor: 'rgba(196,16,20,0.15)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gold_border,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  cardIndexText: {
    fontSize: 10,
    color: Colors.text_muted,
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text_white,
  },
  cardPreview: {
    fontSize: 13,
    color: Colors.text_secondary,
    lineHeight: 19,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 14,
    paddingBottom: 60,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    tintColor: Colors.gold,
    opacity: 0.35,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text_white,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: Colors.text_secondary,
    textAlign: 'center',
    lineHeight: 21,
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#C41014',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E52020',
    shadowColor: '#C41014',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    fontSize: 30,
    fontWeight: '300',
    color: '#fff',
    lineHeight: 34,
  },
});
