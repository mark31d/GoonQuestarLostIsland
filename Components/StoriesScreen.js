import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Dimensions,
  Image,
  Animated,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import {STORIES, CATEGORIES} from './StoriesData';
import AssetRegistry from './AssetRegistry';
import Colors from './Colors';

const {width} = Dimensions.get('window');
const CARD_WIDTH = width - 32;
const CARD_HEIGHT = 180;

export default function StoriesScreen({navigation}) {
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState('All');
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const surpriseBtnScale = useRef(new Animated.Value(1)).current;

  const filtered =
    activeCategory === 'All'
      ? STORIES
      : STORIES.filter(s => s.category === activeCategory);

  const handleSurprise = () => {
    Animated.sequence([
      Animated.spring(surpriseBtnScale, {toValue: 0.88, friction: 5, useNativeDriver: true}),
      Animated.timing(shakeAnim, {toValue: -7, duration: 55, useNativeDriver: true}),
      Animated.timing(shakeAnim, {toValue: 7, duration: 55, useNativeDriver: true}),
      Animated.timing(shakeAnim, {toValue: -5, duration: 55, useNativeDriver: true}),
      Animated.timing(shakeAnim, {toValue: 5, duration: 55, useNativeDriver: true}),
      Animated.timing(shakeAnim, {toValue: 0, duration: 55, useNativeDriver: true}),
      Animated.spring(surpriseBtnScale, {toValue: 1, friction: 5, useNativeDriver: true}),
    ]).start(() => {
      const pool = activeCategory === 'All' ? STORIES : filtered;
      const pick = pool[Math.floor(Math.random() * pool.length)];
      if (pick) navigation.navigate('StoryDetail', {story: pick});
    });
  };

  const renderCard = ({item}) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.88}
      onPress={() => navigation.navigate('StoryDetail', {story: item})}>
      <ImageBackground
        source={AssetRegistry[item.cardImage]}
        style={styles.cardBg}
        imageStyle={styles.cardBgImage}>
        <LinearGradient
          colors={['transparent', 'rgba(14,14,14,0.78)', 'rgba(14,14,14,0.95)']}
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
    <ImageBackground
      source={AssetRegistry.bg_main}
      style={[styles.container, {paddingTop: insets.top}]}
      imageStyle={styles.bgImage}>
      <View style={styles.bgOverlay} />
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Pirate Stories</Text>
            <Text style={styles.headerCount}>
              {filtered.length} {filtered.length === 1 ? 'story' : 'stories'}
            </Text>
          </View>
          <Animated.View
            style={{
              width: 96,
              height: 40,
              transform: [{translateX: shakeAnim}, {scale: surpriseBtnScale}],
            }}>
            <TouchableOpacity
              style={styles.surpriseBtn}
              onPress={handleSurprise}
              activeOpacity={0.85}>
              <LinearGradient
                colors={['#B01010', '#E52020']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={styles.surpriseGradient}>
                <Text style={styles.surpriseIcon}>?</Text>
                <Text style={styles.surpriseText}>Surprise</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
        <Text style={styles.headerSub}>
          Explore real stories and insights about pirate life, their ships,
          legends, and the world they left behind.
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
        style={styles.chipsScroll}>
        {CATEGORIES.map(cat => {
          const isActive = activeCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[
                styles.chip,
                isActive ? styles.chipActive : styles.chipInactive,
              ]}
              onPress={() => setActiveCategory(cat)}
              activeOpacity={0.8}>
              <LinearGradient
                colors={['#B01010', '#E52020']}
                start={{x: 0, y: 0.5}}
                end={{x: 1, y: 0.5}}
                style={StyleSheet.absoluteFill}
              />
              {!isActive && (
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                  }}
                />
              )}
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <FlatList
        data={filtered}
        renderItem={renderCard}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bgImage: {resizeMode: 'cover'},
  bgOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(14,14,14,0.2)',
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
    marginBottom: 8,
  },
  headerLeft: {
    flex: 1,
    marginRight: 10,
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
  headerSub: {
    fontSize: 14,
    color: Colors.text_secondary,
    lineHeight: 22,
  },
  surpriseBtn: {
    width: 96,
    height: 40,
    borderRadius: 14,
    overflow: 'hidden',
  },
  surpriseGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  surpriseIcon: {
    fontSize: 15,
    fontWeight: '900',
    color: '#fff',
  },
  surpriseText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  chipsScroll: {
    flexShrink: 0,
    marginBottom: 6,
  },
  chips: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    gap: 8,
  },
  chip: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    paddingHorizontal: 52,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipActive: {
    borderColor: '#C41014',
  },
  chipInactive: {
    borderColor: 'rgba(196,16,20,0.6)',
  },
  chipText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#fff',
    fontWeight: '700',
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
  },
  cardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: CARD_HEIGHT * 0.65,
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
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
  },
});
