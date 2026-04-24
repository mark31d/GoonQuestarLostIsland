import React, {useEffect, useRef} from 'react';
import {
  View,
  Image,
  Animated,
  StyleSheet,
  Easing,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, {Polygon} from 'react-native-svg';
import AssetRegistry from './AssetRegistry';
import Colors from './Colors';

const {width, height} = Dimensions.get('window');
const ONBOARDING_KEY = '@goon_island_onboarding';
const CRACK_POINTS =
  '50,0 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35';

export default function LoaderScreen({navigation}) {
  const crackSpin1 = useRef(new Animated.Value(0)).current;
  const crackSpin2 = useRef(new Animated.Value(0)).current;
  const crackSpin3 = useRef(new Animated.Value(0)).current;
  const crackSpin4 = useRef(new Animated.Value(0)).current;
  const crackSpin5 = useRef(new Animated.Value(0)).current;
  const iconOpacity = useRef(new Animated.Value(0)).current;
  const iconScale = useRef(new Animated.Value(0.8)).current;
  const preloaderOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const startCrackSpin = (anim, delay = 0) => {
      if (delay > 0) {
        setTimeout(() => {
          Animated.loop(
            Animated.timing(anim, {
              toValue: 1,
              duration: 6000,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
          ).start();
        }, delay);
        return;
      }

      Animated.loop(
        Animated.timing(anim, {
          toValue: 1,
          duration: 6000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ).start();
    };

    startCrackSpin(crackSpin1);
    startCrackSpin(crackSpin2, 1000);
    startCrackSpin(crackSpin3, 1500);
    startCrackSpin(crackSpin4, 2000);
    startCrackSpin(crackSpin5, 2500);

    const showIcon = setTimeout(() => {
      Animated.parallel([
        Animated.timing(preloaderOpacity, {
          toValue: 0,
          duration: 450,
          useNativeDriver: true,
        }),
        Animated.timing(iconOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(iconScale, {
          toValue: 1,
          friction: 6,
          useNativeDriver: true,
        }),
      ]).start();
    }, 2400);

    const navigate = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 4600);

    return () => {
      clearTimeout(showIcon);
      clearTimeout(navigate);
    };
  }, []);

  const spin1 = crackSpin1.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const spin2 = crackSpin2.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const spin3 = crackSpin3.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const spin4 = crackSpin4.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const spin5 = crackSpin5.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Image source={AssetRegistry.bg_main} style={styles.bg} />
      <View style={styles.overlay} />

      <Animated.View style={[styles.preloader, {opacity: preloaderOpacity}]}>
        <Animated.View
          style={[
            styles.crack,
            styles.crack1,
            {transform: [{rotate: spin1}]},
          ]}>
          <Svg width="100%" height="100%" viewBox="0 0 100 100">
            <Polygon points={CRACK_POINTS} fill="#E52020" />
          </Svg>
        </Animated.View>
        <Animated.View
          style={[
            styles.crack,
            styles.crack2,
            {transform: [{rotate: spin2}]},
          ]}>
          <Svg width="100%" height="100%" viewBox="0 0 100 100">
            <Polygon points={CRACK_POINTS} fill="#E52020" />
          </Svg>
        </Animated.View>
        <Animated.View
          style={[
            styles.crack,
            styles.crack3,
            {transform: [{rotate: spin3}]},
          ]}>
          <Svg width="100%" height="100%" viewBox="0 0 100 100">
            <Polygon points={CRACK_POINTS} fill="#E52020" />
          </Svg>
        </Animated.View>
        <Animated.View
          style={[
            styles.crack,
            styles.crack4,
            {transform: [{rotate: spin4}]},
          ]}>
          <Svg width="100%" height="100%" viewBox="0 0 100 100">
            <Polygon points={CRACK_POINTS} fill="#E52020" />
          </Svg>
        </Animated.View>
        <Animated.View
          style={[
            styles.crack,
            styles.crack5,
            {transform: [{rotate: spin5}]},
          ]}>
          <Svg width="100%" height="100%" viewBox="0 0 100 100">
            <Polygon points={CRACK_POINTS} fill="#E52020" />
          </Svg>
        </Animated.View>
      </Animated.View>

      <Animated.View
        style={[
          styles.iconWrap,
          {opacity: iconOpacity, transform: [{scale: iconScale}]},
        ]}>
        <Image source={AssetRegistry.logo} style={styles.icon} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg_dark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bg: {
    position: 'absolute',
    width,
    height,
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    width,
    height,
    backgroundColor: 'rgba(14, 14, 14, 0.45)',
  },
  preloader: {
    position: 'absolute',
    width: width * 0.6,
    height: width * 0.6,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 1,
  },
  crack: {
    position: 'absolute',
    shadowColor: '#E52020',
    shadowOpacity: 0.9,
    shadowRadius: 3,
    shadowOffset: {width: 0, height: 0},
    elevation: 3,
  },
  crack1: {
    width: width * 0.1,
    height: width * 0.1,
    transform: [{rotate: '20deg'}],
  },
  crack2: {
    width: width * 0.12,
    height: width * 0.12,
    transform: [{rotate: '-15deg'}],
  },
  crack3: {
    width: width * 0.14,
    height: width * 0.14,
    transform: [{rotate: '35deg'}],
  },
  crack4: {
    width: width * 0.16,
    height: width * 0.16,
    transform: [{rotate: '-30deg'}],
  },
  crack5: {
    width: width * 0.18,
    height: width * 0.18,
    transform: [{rotate: '55deg'}],
  },
  iconWrap: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 200,
    height: 200,
    borderRadius: 40,
    resizeMode: 'contain',
  },
});
