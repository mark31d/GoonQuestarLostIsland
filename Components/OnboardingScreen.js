import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AssetRegistry from './AssetRegistry';
import Colors from './Colors';

const {width, height} = Dimensions.get('window');
const ONBOARDING_KEY = '@goon_island_onboarding';
const TOTAL = 5;

const SLIDES = [
  {
    id: 0,
    image: AssetRegistry.onboarding_1,
    imageHeight: height * 0.72,
    title: 'Explore the Lost Island',
    body: 'Step into the role of an explorer and uncover a forgotten island once shaped by pirates.',
    button: 'Start Journey',
  },
  {
    id: 1,
    image: AssetRegistry.onboarding_2,
    imageHeight: height * 0.52,
    imageTop: height * 0.15,
    title: 'Discover Pirate Stories',
    body: 'Explore stories and facts about pirate life, divided into clear categories for easy discovery.',
    button: 'Continue',
  },
  {
    id: 2,
    image: AssetRegistry.onboarding_3,
    imageHeight: height * 0.55,
    imageTop: height * 0.12,
    title: 'Discover Lost Artifacts',
    body: 'Find objects left behind on the island and learn how pirates used them in their daily life.',
    button: 'Continue',
  },
  {
    id: 3,
    image: AssetRegistry.onboarding_4,
    imageHeight: height * 0.55,
    imageTop: height * 0.14,
    title: 'Make Your Own Discoveries',
    body: 'Reveal random facts and stories with a single tap and uncover hidden parts of the island.',
    button: 'Continue',
  },
  {
    id: 4,
    image: AssetRegistry.onboarding_5,
    imageHeight: height * 0.55,
    imageTop: height * 0.12,
    title: "Test What You've Learned",
    body: 'Take a simple quiz, check your knowledge, and save what matters to you along the way.',
    button: 'Start Exploring',
  },
];

export default function OnboardingScreen({navigation}) {
  const [index, setIndex] = useState(0);
  const listRef = useRef(null);
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 20);

  const goNext = async () => {
    if (index < SLIDES.length - 1) {
      const next = index + 1;
      listRef.current?.scrollToIndex({index: next, animated: true});
      setIndex(next);
    } else {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'done');
      navigation.replace('Main');
    }
  };

  const onScroll = e => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
    setIndex(newIndex);
  };

  const current = SLIDES[index];

  const renderSlide = ({item}) => (
    <View style={styles.slide}>
      <Image
        source={item.image}
        style={[styles.heroImage, {height: item.imageHeight, top: item.imageTop ?? 0, left: item.imageLeft ?? 0}]}
      />
      <LinearGradient
        colors={['transparent', 'rgba(14,14,14,0.55)', Colors.bg_dark]}
        locations={[0, 0.55, 1]}
        style={[styles.gradientFade, {top: (item.imageTop ?? 0) + item.imageHeight * 0.5, height: item.imageHeight * 0.58}]}
      />
    </View>
  );

  return (
    <ImageBackground source={AssetRegistry.bg_main} style={styles.root} imageStyle={styles.bgImage}>
      <View style={styles.bgOverlay} />
      <FlatList
        ref={listRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={item => String(item.id)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
        bounces={false}
        scrollEnabled
      />

      {/* card fixed outside FlatList — never moves */}
      <View style={[styles.card, {paddingBottom: bottomPad + 10}]}>
        <Text style={styles.title}>{current.title}</Text>
        <Text style={styles.body}>{current.body}</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={goNext}
          activeOpacity={0.85}>
          <LinearGradient
            colors={['#B01010', '#E52020']}
            start={{x: 0, y: 0.5}}
            end={{x: 1, y: 0.5}}
            style={styles.btnGradient}>
            <Text style={styles.buttonText}>{current.button}</Text>
          </LinearGradient>
        </TouchableOpacity>
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
  root: {
    flex: 1,
    backgroundColor: Colors.bg_dark,
  },
  slide: {
    width,
    height,
    backgroundColor: 'transparent',
  },
  heroImage: {
    position: 'absolute',
    top: 0,
    width,
    height: height * 0.72,
    resizeMode: 'cover',
  },
  gradientFade: {
    position: 'absolute',
    width,
    height: height * 0.42,
    top: height * 0.36,
  },
  spacer: {
    flex: 1,
  },
  card: {
    position: 'absolute',
    bottom: 0,
    left: -5,
    right: -5,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1.5,
    borderBottomWidth: 0,
    borderColor: Colors.gold_border,
    backgroundColor: 'rgba(20,16,16,0.97)',
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#C41014',
    marginBottom: 12,
    lineHeight: 30,
    textAlign: 'center',
  },
  body: {
    fontSize: 17,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 25,
    marginBottom: 28,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  button: {
    borderRadius: 16,
    overflow: 'hidden',
    width:280,
    alignSelf: 'center',
    
  },
  btnGradient: {
    height: 66,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
