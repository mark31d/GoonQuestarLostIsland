import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet,
  Dimensions,
  Share,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AssetRegistry from './AssetRegistry';
import Colors from './Colors';

const {width} = Dimensions.get('window');

export default function ArtifactDetailScreen({route, navigation}) {
  const {artifact} = route.params;
  const insets = useSafeAreaInsets();

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${artifact.title}\n\n${artifact.full}`,
        title: artifact.title,
      });
    } catch {}
  };

  return (
    <ImageBackground source={AssetRegistry.bg_details} style={[styles.container, {paddingBottom: insets.bottom}]} imageStyle={styles.bgImage}>
      <View style={styles.bgOverlay} />
      <View style={[styles.topBar, {top: insets.top + 10}]}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}>
          <Image source={AssetRegistry.icon_back} style={styles.iconImg} />
        </TouchableOpacity>
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={handleShare}
            activeOpacity={0.8}>
            <Image source={AssetRegistry.icon_share} style={styles.iconImg} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          {paddingTop: insets.top + 64},
        ]}>
        <View style={styles.imageWrap}>
          <Image
            source={AssetRegistry[artifact.key]}
            style={styles.artifactImage}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{artifact.title}</Text>
          <Text style={styles.cardBody}>{artifact.full}</Text>
        </View>

        <View style={styles.usedCard}>
          <Text style={styles.usedLabel}>Used for</Text>
          <Text style={styles.usedBody}>{artifact.usedFor}</Text>
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
  topBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  iconBtn: {
    width: 74,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#C41014',
    borderWidth: 1,
    borderColor: '#E52020',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    backgroundColor: '#C41014',
    borderRadius: 21,
    borderWidth: 1,
    borderColor: '#E52020',
    overflow: 'hidden',
  },
  actionBtn: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImg: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: 'rgba(255,255,255,0.9)',
  },
  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 16,
  },
  imageWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 220,
    marginBottom: 4,
  },
  artifactImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  card: {
    backgroundColor: 'rgba(20,16,16,0.82)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.gold_border,
    padding: 20,
    gap: 12,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.gold,
  },
  cardBody: {
    fontSize: 15,
    color: Colors.text_secondary,
    lineHeight: 24,
  },
  usedCard: {
    backgroundColor: 'rgba(20,16,16,0.82)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.gold_border,
    padding: 20,
    gap: 10,
  },
  usedLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.gold,
  },
  usedBody: {
    fontSize: 15,
    color: Colors.text_secondary,
    lineHeight: 22,
  },
});
