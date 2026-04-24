import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import {ARTIFACTS} from './ArtifactsData';
import AssetRegistry from './AssetRegistry';
import Colors from './Colors';

const {width} = Dimensions.get('window');
const HERO_HEIGHT = 340;
const WIN_INSET = 8;
const WIN_CORNER = 10;
const IMG_COL_W = 124;
const SEEN_KEY = '@goon_artifacts_seen';

const HERO_QUOTE =
  '"While exploring the island, I found traces of those who lived here before — not stories, but objects.\n\nEach one once had a purpose, held in someone\'s hands.\n\nI gathered them as pieces of the past. Take a closer look."';

export default function ArtifactsScreen({navigation}) {
  const insets = useSafeAreaInsets();
  const [seenIds, setSeenIds] = useState(new Set());

  useEffect(() => {
    AsyncStorage.getItem(SEEN_KEY).then(raw => {
      if (raw) setSeenIds(new Set(JSON.parse(raw)));
    });
  }, []);

  const handleArtifactPress = item => {
    setSeenIds(prev => {
      const next = new Set(prev);
      next.add(item.id);
      AsyncStorage.setItem(SEEN_KEY, JSON.stringify([...next]));
      return next;
    });
    navigation.navigate('ArtifactDetail', {artifact: item});
  };

  const seenCount = seenIds.size;
  const total = ARTIFACTS.length;
  const progressPct = total > 0 ? (seenCount / total) * 100 : 0;

  return (
    <ImageBackground
      source={AssetRegistry.bg_main}
      style={[styles.container, {paddingTop: insets.top}]}
      imageStyle={styles.bgImage}>
      <View style={styles.bgOverlay} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Artifacts</Text>
          <Text style={styles.headerSub}>
            A collection of objects found across the island.
          </Text>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressTop}>
            <Text style={styles.progressLabel}>Explored</Text>
            <Text style={styles.progressCount}>
              {seenCount}/{total}
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[styles.progressFill, {width: `${progressPct}%`}]}
            />
          </View>
          {seenCount === total && (
            <Text style={styles.progressComplete}>
              All artifacts discovered!
            </Text>
          )}
        </View>

        <View style={styles.heroWrap}>
          <Image
            source={AssetRegistry.onboarding_3}
            style={styles.heroImage}
          />
        </View>

        <View style={styles.quoteCard}>
          <Text style={styles.quoteText}>{HERO_QUOTE}</Text>
        </View>

        <View style={styles.listWrap}>
          {ARTIFACTS.map(item => {
            const seen = seenIds.has(item.id);
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.artifactCard, seen && styles.artifactCardSeen]}
                activeOpacity={0.85}
                onPress={() => handleArtifactPress(item)}>
                <View style={styles.cardBgCornerTL} />
                <View style={styles.cardBgCornerBL} />
                <View style={styles.cardBgTop} />
                <View style={styles.cardBgBottom} />
                <View style={styles.cardBgLeft} />
                <View style={styles.cardBgRight} />

                {seen && (
                  <View style={styles.seenBadge}>
                    <Text style={styles.seenBadgeText}>Seen</Text>
                  </View>
                )}

                <View style={styles.artifactRow}>
                  <View style={styles.artifactImageWrap}>
                    <Image
                      source={AssetRegistry[item.key]}
                      style={styles.artifactImage}
                    />
                  </View>
                  <View style={styles.artifactInfo}>
                    <Text style={styles.artifactTitle}>{item.title}</Text>
                    <Text style={styles.artifactShort}>{item.short}</Text>
                    <View style={styles.arrowPill}>
                      <LinearGradient
                        colors={['rgba(196,16,20,0)', 'rgba(196,16,20,0.82)']}
                        start={{x: 0, y: 0.5}}
                        end={{x: 1, y: 0.5}}
                        style={styles.arrowGradient}>
                        <Image
                          source={AssetRegistry.arrow}
                          style={styles.arrowIcon}
                        />
                      </LinearGradient>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
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
  scroll: {
    paddingBottom: 28,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.gold,
    marginBottom: 7,
    textAlign: 'center',
  },
  headerSub: {
    fontSize: 14,
    color: Colors.text_secondary,
    lineHeight: 22,
    textAlign: 'center',
  },
  progressSection: {
    marginHorizontal: 20,
    marginBottom: 8,
    backgroundColor: 'rgba(20,16,16,0.82)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.gold_border,
    padding: 14,
    gap: 8,
  },
  progressTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 13,
    color: Colors.text_secondary,
    fontWeight: '600',
  },
  progressCount: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.gold,
  },
  progressTrack: {
    height: 7,
    backgroundColor: 'rgba(40,40,40,0.86)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: 7,
    backgroundColor: '#C41014',
    borderRadius: 4,
  },
  progressComplete: {
    fontSize: 12,
    color: '#3A6428',
    fontWeight: '600',
    textAlign: 'center',
  },
  heroWrap: {
    width,
    height: HERO_HEIGHT,
    marginBottom: 4,
  },
  heroImage: {
    width,
    height: HERO_HEIGHT,
    resizeMode: 'contain',
  },
  quoteCard: {
    marginHorizontal: 16,
    marginTop: -24,
    marginBottom: 4,
    backgroundColor: 'rgb(20,16,16)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.gold_border,
    padding: 16,
  },
  quoteText: {
    fontSize: 13,
    fontStyle: 'italic',
    color: Colors.gold,
    lineHeight: 20,
  },
  listWrap: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 12,
  },
  artifactCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.gold_border,
    backgroundColor: 'transparent',
  },
  artifactCardSeen: {
    borderColor: 'rgba(58,100,40,0.6)',
  },
  seenBadge: {
    position: 'absolute',
    top: 8,
    right: 10,
    zIndex: 10,
    backgroundColor: 'rgba(58,100,40,0.85)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  seenBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  cardBgCornerTL: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: WIN_INSET + WIN_CORNER,
    height: WIN_INSET + WIN_CORNER,
    borderBottomRightRadius: WIN_CORNER,
    backgroundColor: 'rgba(24,20,20,0.98)',
  },
  cardBgCornerBL: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: WIN_INSET + WIN_CORNER,
    height: WIN_INSET + WIN_CORNER,
    borderTopRightRadius: WIN_CORNER,
    backgroundColor: 'rgba(24,20,20,0.98)',
  },
  cardBgTop: {
    position: 'absolute',
    top: 0,
    left: WIN_INSET + WIN_CORNER,
    right: 0,
    height: WIN_INSET,
    backgroundColor: 'rgba(24,20,20,0.98)',
  },
  cardBgBottom: {
    position: 'absolute',
    bottom: 0,
    left: WIN_INSET + WIN_CORNER,
    right: 0,
    height: WIN_INSET,
    backgroundColor: 'rgba(24,20,20,0.98)',
  },
  cardBgLeft: {
    position: 'absolute',
    top: WIN_INSET + WIN_CORNER,
    bottom: WIN_INSET + WIN_CORNER,
    left: 0,
    width: WIN_INSET,
    backgroundColor: 'rgba(24,20,20,0.98)',
  },
  cardBgRight: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: IMG_COL_W,
    right: 0,
    backgroundColor: 'rgba(24,20,20,0.98)',
  },
  artifactRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  artifactImageWrap: {
    width: IMG_COL_W,
    paddingVertical: WIN_INSET,
    paddingLeft: WIN_INSET,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  artifactImage: {
    width: 82,
    height: 82,
    resizeMode: 'contain',
  },
  artifactInfo: {
    flex: 1,
    padding: 12,
    backgroundColor: 'transparent',
  },
  artifactTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#C41014',
    marginBottom: 5,
  },
  artifactShort: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 18,
    marginBottom: 10,
  },
  arrowPill: {
    overflow: 'hidden',
    alignSelf: 'flex-end',
    width: '100%',
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
  },
  arrowGradient: {
    paddingVertical: 10,
    paddingHorizontal: 4,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
  },
  arrowIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    tintColor: '#0E0E0E',
    left: -30,
    top: -10,
  },
});
