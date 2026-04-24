import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import {useApp} from '../App';
import AssetRegistry from './AssetRegistry';
import Colors from './Colors';

const {width} = Dimensions.get('window');
const CARD_WIDTH = width - 32;
const CARD_HEIGHT = 180;

function EmptyState({onGoStories}) {
  return (
    <View style={styles.emptyWrap}>
      <View style={styles.emptyBg}>
        <ImageBackground
          source={AssetRegistry.story_card_3}
          style={styles.emptyCard}
          imageStyle={styles.emptyCardImage}>
          <LinearGradient
            colors={['rgba(0,0,0,0.66)', 'rgba(0,0,0,0.58)']}
            style={StyleSheet.absoluteFill}
          />
          <Text style={styles.emptyCardText}>No saved stories yet</Text>
        </ImageBackground>
        <Image source={AssetRegistry.book} style={styles.emptyIcon} />
        <TouchableOpacity
          style={styles.emptyBtn}
          onPress={onGoStories}
          activeOpacity={0.85}>
          <LinearGradient
            colors={['#B01010', '#E52020']}
            start={{x: 0, y: 0.5}}
            end={{x: 1, y: 0.5}}
            style={styles.emptyBtnGradient}>
            <Text style={styles.emptyBtnText}>Save stories</Text>
            <Image source={AssetRegistry.icon_stories} style={styles.emptyBtnIcon} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function SavedScreen({navigation}) {
  const insets = useSafeAreaInsets();
  const {savedStories} = useApp();

  const goToStories = () => {
    navigation.getParent()?.navigate('StoriesTab');
  };

  const renderCard = ({item}) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.88}
      onPress={() =>
        navigation.navigate('StoryDetailFromSaved', {story: item})
      }>
      <ImageBackground
        source={AssetRegistry[item.cardImage]}
        blurRadius={5}
        style={styles.cardBg}
        imageStyle={styles.cardBgImage}>
        <View style={styles.cardDarkOverlay} />
        <LinearGradient
          colors={['rgba(0,0,0,0.42)', 'rgba(14,14,14,0.9)', 'rgba(14,14,14,0.99)']}
          style={styles.cardGradient}
        />
        <View style={styles.cardBadge}>
          <Text style={styles.cardBadgeText}>{item.category}</Text>
        </View>
        <Text style={styles.cardTitle}>{item.title}</Text>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <ImageBackground source={AssetRegistry.bg_main} style={[styles.container, {paddingTop: insets.top}]} imageStyle={styles.bgImage}>
      <View style={styles.bgOverlay} />
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Saved</Text>
            <Text style={styles.headerSub}>
              Your saved stories and notes.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.journalBtn}
            onPress={() => navigation.navigate('JournalList')}
            activeOpacity={0.85}>
            <Image source={AssetRegistry.journal} style={styles.journalBtnIcon} />
            <Text style={styles.journalBtnText}>Journal</Text>
          </TouchableOpacity>
        </View>
      </View>

      {savedStories.length === 0 ? (
        <EmptyState onGoStories={goToStories} />
      ) : (
        <FlatList
          data={savedStories}
          renderItem={renderCard}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bgImage: {resizeMode: 'cover'},
  bgOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(14,14,14,0.82)',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.bg_dark,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.gold,
    marginBottom: 4,
  },
  headerSub: {
    fontSize: 13,
    color: Colors.text_secondary,
    lineHeight: 18,
  },
  journalBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(20,16,16,0.9)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.gold_border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 5,
  },
  journalBtnIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    tintColor: Colors.gold,
  },
  journalBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.gold,
  },
  emptyWrap: {
    flex: 1,
  },
  emptyBg: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingTop: 12,
    paddingBottom: 48,
  },
  emptyCard: {
    borderRadius: 22,
    overflow: 'hidden',
    justifyContent: 'center',
    minHeight: 190,
    paddingHorizontal: 28,
    alignSelf: 'stretch',
    alignItems: 'center',
    marginBottom: 36,
  },
  emptyCardImage: {
    resizeMode: 'cover',
    borderRadius: 22,
  },
  emptyCardText: {
    fontSize: 15,
    color: Colors.text_secondary,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    opacity: 0.8,
  },
  emptyBtn: {
    borderRadius: 16,
    marginHorizontal: 30,
    alignSelf: 'stretch',
    overflow: 'hidden',
  },
  emptyBtnGradient: {
    minHeight: 58,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  emptyBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  emptyBtnIcon: {
    width: 44,
    height: 44,
    resizeMode: 'contain',
    tintColor: '#fff',
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 20,
    gap: 14,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardBg: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 14,
    backgroundColor: Colors.bg_card,
  },
  cardBgImage: {
    borderRadius: 16,
    resizeMode: 'cover',
    opacity: 0.46,
  },
  cardGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  cardDarkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  cardBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: Colors.gold,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  cardBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#C41014',
  },
});
