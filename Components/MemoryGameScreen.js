import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AssetRegistry from './AssetRegistry';
import Colors from './Colors';

const {width} = Dimensions.get('window');
const COLS = 4;
const CARD_GAP = 10;
const CARD_W = Math.floor((width - 32 - (COLS - 1) * CARD_GAP) / COLS);
const CARD_H = Math.floor(CARD_W * 1.18);
const CARD_COUNT = 12;

const PAIRS = [
  {key: 'artifact_journal'},
  {key: 'artifact_compass'},
  {key: 'artifact_key'},
  {key: 'artifact_coin'},
  {key: 'artifact_lantern'},
  {key: 'artifact_map_fragment'},
];

function makeCards() {
  const deck = [];
  PAIRS.forEach((p, i) => {
    deck.push({uid: i * 2, key: p.key});
    deck.push({uid: i * 2 + 1, key: p.key});
  });
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export default function MemoryGameScreen({navigation}) {
  const insets = useSafeAreaInsets();
  const [cards, setCards] = useState(makeCards);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState(new Set());
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [won, setWon] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const timerRef = useRef(null);
  const wonAnim = useRef(new Animated.Value(0)).current;
  const flipAnims = useRef(
    Array.from({length: CARD_COUNT}, () => new Animated.Value(0)),
  ).current;

  useEffect(() => {
    timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (won) {
      clearInterval(timerRef.current);
      Animated.spring(wonAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }).start();
    }
  }, [won]);

  const animFlip = useCallback(
    (index, toValue, duration = 200) => {
      Animated.timing(flipAnims[index], {
        toValue,
        duration,
        useNativeDriver: true,
      }).start();
    },
    [flipAnims],
  );

  const handleCardPress = useCallback(
    index => {
      if (locked) return;
      const card = cards[index];
      if (matched.has(card.uid)) return;
      if (flipped.includes(index)) return;

      animFlip(index, 1);
      const newFlipped = [...flipped, index];
      setFlipped(newFlipped);

      if (newFlipped.length === 2) {
        setMoves(m => m + 1);
        setLocked(true);
        const [a, b] = newFlipped;
        if (cards[a].key === cards[b].key) {
          setTimeout(() => {
            setMatched(prev => {
              const next = new Set(prev);
              next.add(cards[a].uid);
              next.add(cards[b].uid);
              if (next.size === CARD_COUNT) setWon(true);
              return next;
            });
            setFlipped([]);
            setLocked(false);
          }, 400);
        } else {
          setTimeout(() => {
            animFlip(a, 0, 250);
            animFlip(b, 0, 250);
            setFlipped([]);
            setLocked(false);
          }, 900);
        }
      }
    },
    [locked, cards, matched, flipped, animFlip],
  );

  const restart = () => {
    clearInterval(timerRef.current);
    const newCards = makeCards();
    setCards(newCards);
    flipAnims.forEach(a => a.setValue(0));
    setFlipped([]);
    setMatched(new Set());
    setMoves(0);
    setSeconds(0);
    setLocked(false);
    setWon(false);
    wonAnim.setValue(0);
    timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
  };

  const formatTime = s =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <ImageBackground
      source={AssetRegistry.bg_main}
      style={[
        styles.container,
        {paddingTop: insets.top, paddingBottom: insets.bottom},
      ]}
      imageStyle={styles.bgImage}>
      <View style={styles.overlay} />

      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}>
          <Image source={AssetRegistry.icon_back} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.titleText}>Memory</Text>
        <View style={styles.statsRow}>
          <View style={styles.statChip}>
            <Text style={styles.statLabel}>Moves</Text>
            <Text style={styles.statValue}>{moves}</Text>
          </View>
          <View style={styles.statChip}>
            <Text style={styles.statLabel}>Time</Text>
            <Text style={styles.statValue}>{formatTime(seconds)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.progressRow}>
        <Text style={styles.progressLabel}>
          {matched.size / 2} / {PAIRS.length} pairs found
        </Text>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {width: `${(matched.size / CARD_COUNT) * 100}%`},
            ]}
          />
        </View>
      </View>

      <View style={styles.grid}>
        {cards.map((card, index) => {
          const isMatched = matched.has(card.uid);
          const anim = flipAnims[index];
          const backOpacity = anim.interpolate({
            inputRange: [0, 0.49, 0.5, 1],
            outputRange: [1, 1, 0, 0],
            extrapolate: 'clamp',
          });
          const frontOpacity = anim.interpolate({
            inputRange: [0, 0.49, 0.5, 1],
            outputRange: [0, 0, 1, 1],
            extrapolate: 'clamp',
          });
          const scaleX = anim.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [1, 0, 1],
          });

          return (
            <TouchableOpacity
              key={card.uid}
              style={[styles.cardWrap, isMatched && styles.cardMatched]}
              onPress={() => handleCardPress(index)}
              activeOpacity={0.85}>
              <Animated.View
                style={[styles.cardInner, {transform: [{scaleX}]}]}>
                <Animated.View
                  style={[StyleSheet.absoluteFill, styles.cardBack, {opacity: backOpacity}]}>
                  <Text style={styles.cardBackQ}>?</Text>
                </Animated.View>
                <Animated.View
                  style={[StyleSheet.absoluteFill, styles.cardFront, {opacity: frontOpacity}]}>
                  <Image
                    source={AssetRegistry[card.key]}
                    style={styles.cardImg}
                  />
                </Animated.View>
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>

      {won && (
        <Animated.View
          style={[
            styles.wonOverlay,
            {opacity: wonAnim, transform: [{scale: wonAnim}]},
          ]}>
          <View style={styles.wonCard}>
            <Text style={styles.wonTitle}>All pairs found!</Text>
            <View style={styles.wonStats}>
              <View style={styles.wonStatChip}>
                <Text style={styles.wonStatVal}>{moves}</Text>
                <Text style={styles.wonStatLbl}>moves</Text>
              </View>
              <View style={styles.wonStatDivider} />
              <View style={styles.wonStatChip}>
                <Text style={styles.wonStatVal}>{formatTime(seconds)}</Text>
                <Text style={styles.wonStatLbl}>time</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.wonBtn}
              onPress={restart}
              activeOpacity={0.85}>
              <Text style={styles.wonBtnText}>Play Again</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.wonBtnSecondary}
              onPress={() => navigation.goBack()}
              activeOpacity={0.85}>
              <Text style={styles.wonBtnTextSecondary}>Back to Quiz</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bgImage: {resizeMode: 'cover'},
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(14,14,14,0.88)',
  },
  container: {flex: 1},
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    gap: 12,
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
  titleText: {
    flex: 1,
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text_white,
  },
  statsRow: {flexDirection: 'row', gap: 8},
  statChip: {
    backgroundColor: 'rgba(20,16,16,0.9)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.gold_border,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
    minWidth: 56,
  },
  statLabel: {
    fontSize: 9,
    color: Colors.text_muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {fontSize: 14, fontWeight: '700', color: Colors.gold},
  progressRow: {
    paddingHorizontal: 16,
    marginBottom: 14,
    gap: 6,
  },
  progressLabel: {fontSize: 12, color: Colors.text_secondary},
  progressTrack: {
    height: 5,
    backgroundColor: 'rgba(40,40,40,0.86)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {height: 5, backgroundColor: '#C41014', borderRadius: 3},
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: CARD_GAP,
    justifyContent: 'center',
  },
  cardWrap: {
    width: CARD_W,
    height: CARD_H,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.gold_border,
  },
  cardMatched: {
    borderColor: '#3A6428',
    opacity: 0.65,
  },
  cardInner: {
    flex: 1,
  },
  cardBack: {
    backgroundColor: 'rgba(196,16,20,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
  },
  cardBackQ: {fontSize: 26, fontWeight: '900', color: '#C41014'},
  cardFront: {
    backgroundColor: 'rgba(24,20,20,0.98)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
    padding: 8,
  },
  cardImg: {width: '85%', height: '85%', resizeMode: 'contain'},
  wonOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.72)',
  },
  wonCard: {
    backgroundColor: 'rgba(20,16,16,0.98)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.gold_border,
    paddingVertical: 32,
    paddingHorizontal: 28,
    alignItems: 'center',
    gap: 20,
    marginHorizontal: 28,
    alignSelf: 'stretch',
  },
  wonTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#C41014',
    textAlign: 'center',
  },
  wonStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    backgroundColor: 'rgba(196,16,20,0.1)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.gold_border,
    paddingVertical: 14,
    paddingHorizontal: 28,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  wonStatChip: {alignItems: 'center', gap: 2},
  wonStatVal: {fontSize: 24, fontWeight: '800', color: Colors.text_white},
  wonStatLbl: {fontSize: 11, color: Colors.text_muted, textTransform: 'uppercase', letterSpacing: 0.5},
  wonStatDivider: {width: 1, height: 36, backgroundColor: Colors.gold_border},
  wonBtn: {
    backgroundColor: '#C41014',
    borderRadius: 14,
    paddingVertical: 15,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  wonBtnText: {fontSize: 16, fontWeight: '700', color: '#fff'},
  wonBtnSecondary: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.gold_border,
    paddingVertical: 14,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  wonBtnTextSecondary: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text_secondary,
  },
});
