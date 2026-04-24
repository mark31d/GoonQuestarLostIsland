import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  Animated,
  StyleSheet,
  Dimensions,
  Share,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import {FACTS} from './DiscoveryData';
import AssetRegistry from './AssetRegistry';
import Colors from './Colors';
import {useApp} from '../App';

const {width, height} = Dimensions.get('window');
const PARTICLE_COUNT = 10;
const PARTICLE_COLORS = [
  '#C41014', '#E52020', '#FF6B6B', '#ffffff',
  '#C41014', '#E52020', '#FF6B6B', '#ffffff',
  '#C41014', '#E52020',
];

function shufflePool() {
  const indices = Array.from({length: FACTS.length}, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices;
}

export default function DiscoveryScreen() {
  const insets = useSafeAreaInsets();
  const {discoveryCount, bumpDiscovery} = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [currentFact, setCurrentFact] = useState('');
  const [pool, setPool] = useState([]);

  const chestScale = useRef(new Animated.Value(1)).current;
  const factSlide = useRef(new Animated.Value(60)).current;
  const factOpacity = useRef(new Animated.Value(0)).current;

  const particles = useRef(
    Array.from({length: PARTICLE_COUNT}, () => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      opacity: new Animated.Value(0),
      scale: new Animated.Value(1),
    })),
  ).current;

  const CHEST_SIZE = Math.min(
    width * 0.88,
    (height - insets.top - insets.bottom) * 0.42,
  );

  const burstParticles = () => {
    const anims = particles.map((p, i) => {
      const angle = (i / PARTICLE_COUNT) * 2 * Math.PI;
      const dist = 80 + Math.random() * 60;
      p.x.setValue(0);
      p.y.setValue(0);
      p.opacity.setValue(1);
      p.scale.setValue(1);
      return Animated.parallel([
        Animated.timing(p.x, {
          toValue: Math.cos(angle) * dist,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(p.y, {
          toValue: Math.sin(angle) * dist - 20,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(200),
          Animated.timing(p.opacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(p.scale, {
          toValue: 0.3,
          duration: 700,
          useNativeDriver: true,
        }),
      ]);
    });
    Animated.parallel(anims).start();
  };

  const pickNextFact = currentPool => {
    let nextPool = currentPool.length > 0 ? [...currentPool] : shufflePool();
    const idx = nextPool.shift();
    setPool(nextPool);
    return FACTS[idx];
  };

  const showFact = () => {
    factSlide.setValue(60);
    factOpacity.setValue(0);
    Animated.parallel([
      Animated.spring(factSlide, {toValue: 0, friction: 7, useNativeDriver: true}),
      Animated.timing(factOpacity, {
        toValue: 1,
        duration: 350,
        delay: 120,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleOpen = () => {
    const fact = pickNextFact(pool);
    setCurrentFact(fact);
    bumpDiscovery();
    setIsOpen(true);

    Animated.sequence([
      Animated.spring(chestScale, {toValue: 1.12, friction: 4, useNativeDriver: true}),
      Animated.spring(chestScale, {toValue: 1, friction: 6, useNativeDriver: true}),
    ]).start();

    burstParticles();
    showFact();
  };

  const handleNext = () => {
    const fact = pickNextFact(pool);
    setCurrentFact(fact);
    bumpDiscovery();

    Animated.sequence([
      Animated.spring(chestScale, {toValue: 1.07, friction: 5, useNativeDriver: true}),
      Animated.spring(chestScale, {toValue: 1, friction: 6, useNativeDriver: true}),
    ]).start();
    burstParticles();

    Animated.timing(factOpacity, {
      toValue: 0,
      duration: 130,
      useNativeDriver: true,
    }).start(() => showFact());
  };

  const handleShare = async () => {
    try {
      await Share.share({message: currentFact});
    } catch {}
  };

  return (
    <ImageBackground
      source={AssetRegistry.bg_main}
      style={[
        styles.container,
        {paddingTop: insets.top, paddingBottom: insets.bottom},
      ]}
      imageStyle={styles.bgImage}>
      <View style={styles.bgOverlay} />

      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Discovery</Text>
          {discoveryCount > 0 && (
            <View style={styles.countChip}>
              <Text style={styles.countNum}>{discoveryCount}</Text>
              <Text style={styles.countSuffix}> opened</Text>
            </View>
          )}
        </View>
        <Text style={styles.headerSub}>
          Each chest holds a new find. Open it and see what the island reveals
          today.
        </Text>
      </View>

      <View style={styles.centerArea}>
        {particles.map((p, i) => (
          <Animated.View
            key={i}
            style={[
              styles.particle,
              {
                backgroundColor: PARTICLE_COLORS[i],
                transform: [
                  {translateX: p.x},
                  {translateY: p.y},
                  {scale: p.scale},
                ],
                opacity: p.opacity,
              },
            ]}
          />
        ))}

        <Animated.Image
          source={
            isOpen ? AssetRegistry.chest_open : AssetRegistry.chest_closed
          }
          style={[
            styles.chest,
            {
              width: CHEST_SIZE,
              height: CHEST_SIZE,
              transform: [{scale: chestScale}],
            },
          ]}
        />
      </View>

      {isOpen && (
        <Animated.View
          style={[
            styles.factCard,
            {transform: [{translateY: factSlide}], opacity: factOpacity},
          ]}>
          <Text style={styles.factText}>"{currentFact}"</Text>
        </Animated.View>
      )}

      <View style={styles.bottomArea}>
        {!isOpen ? (
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={handleOpen}
            activeOpacity={0.85}>
            <LinearGradient
              colors={['#B01010', '#E52020']}
              start={{x: 0, y: 0.5}}
              end={{x: 1, y: 0.5}}
              style={styles.btnGradient}>
              <Text style={styles.primaryBtnText}>Open discovery</Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <View style={styles.openedBtns}>
            <TouchableOpacity
              style={styles.nextBtn}
              onPress={handleNext}
              activeOpacity={0.85}>
              <LinearGradient
                colors={['#B01010', '#E52020']}
                start={{x: 0, y: 0.5}}
                end={{x: 1, y: 0.5}}
                style={styles.btnGradient}>
                <Text style={styles.primaryBtnText}>Next</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.shareBtn}
              onPress={handleShare}
              activeOpacity={0.8}>
              <LinearGradient
                colors={['#B01010', '#E52020']}
                start={{x: 0, y: 0.5}}
                end={{x: 1, y: 0.5}}
                style={styles.shareBtnGradient}>
                <Image
                  source={AssetRegistry.icon_share}
                  style={styles.shareIcon}
                />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bgImage: {resizeMode: 'cover'},
  bgOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(14,14,14,0.82)',
  },
  container: {flex: 1},
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 7,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.gold,
  },
  countChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(196,16,20,0.14)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.gold_border,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  countNum: {fontSize: 14, fontWeight: '800', color: '#C41014'},
  countSuffix: {fontSize: 12, color: Colors.text_muted},
  headerSub: {
    fontSize: 14,
    color: Colors.text_secondary,
    lineHeight: 20,
  },
  centerArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  particle: {
    position: 'absolute',
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  chest: {
    resizeMode: 'contain',
  },
  factCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: 'rgba(20,16,16,0.96)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.gold_border,
    padding: 18,
  },
  factText: {
    fontSize: 15,
    fontStyle: 'italic',
    color: Colors.text_secondary,
    lineHeight: 24,
    textAlign: 'center',
  },
  bottomArea: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  primaryBtn: {borderRadius: 16, overflow: 'hidden'},
  btnGradient: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {color: '#fff', fontSize: 17, fontWeight: '700'},
  openedBtns: {flexDirection: 'row', gap: 12},
  nextBtn: {flex: 1, borderRadius: 16, overflow: 'hidden'},
  shareBtn: {width: 56, height: 56, borderRadius: 16, overflow: 'hidden'},
  shareBtnGradient: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  shareIcon: {width: 22, height: 22, resizeMode: 'contain', tintColor: '#fff'},
});
