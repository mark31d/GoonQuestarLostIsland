import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Dimensions,
  Animated,
  ScrollView,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import {useApp} from '../App';
import {QUESTIONS, getResultMessage} from './QuizData';
import AssetRegistry from './AssetRegistry';
import Colors from './Colors';

const {width} = Dimensions.get('window');
const TOTAL = QUESTIONS.length;

function InfoBlock({icon, imageSource, label, value}) {
  return (
    <View style={styles.infoBlock}>
      <View style={styles.infoIconWrap}>
        {imageSource ? (
          <Image source={imageSource} style={styles.infoIconImg} />
        ) : (
          <Text style={styles.infoIcon}>{icon}</Text>
        )}
      </View>
      <View>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

export default function QuizScreen({navigation}) {
  const insets = useSafeAreaInsets();
  const {bestScore, saveBestScore} = useApp();

  const [phase, setPhase] = useState('intro');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);

  const fadeAnim = useRef(new Animated.Value(1)).current;

  const q = QUESTIONS[questionIndex];
  const isCorrect = selectedOption === q?.answer;

  const startQuiz = () => {
    setQuestionIndex(0);
    setSelectedOption(null);
    setChecked(false);
    setScore(0);
    setPhase('playing');
  };

  const handleCheck = () => {
    if (selectedOption === null) return;
    setChecked(true);
    if (isCorrect) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (questionIndex < TOTAL - 1) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }).start(() => {
        setQuestionIndex(i => i + 1);
        setSelectedOption(null);
        setChecked(false);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }).start();
      });
    } else {
      // score already updated in handleCheck
      saveBestScore(score);
      setPhase('result');
    }
  };

  const handleClose = () => {
    setPhase('intro');
    setQuestionIndex(0);
    setSelectedOption(null);
    setChecked(false);
    setScore(0);
  };

  const getOptionStyle = (idx) => {
    if (!checked) {
      return selectedOption === idx ? styles.optionSelected : styles.option;
    }
    if (idx === q.answer) return styles.optionCorrect;
    if (idx === selectedOption && idx !== q.answer) return styles.optionIncorrect;
    return styles.option;
  };

  const getOptionTextStyle = (idx) => {
    if (!checked) {
      return selectedOption === idx ? styles.optionTextSelected : styles.optionText;
    }
    if (idx === q.answer || idx === selectedOption) return styles.optionTextSelected;
    return styles.optionText;
  };

  if (phase === 'intro') {
    return (
      <ImageBackground source={AssetRegistry.bg_main} style={[styles.container, {paddingTop: insets.top, paddingBottom: insets.bottom}]} imageStyle={styles.bgImage}>
        <View style={styles.bgOverlay} />
        <ScrollView contentContainerStyle={styles.introScroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.introTitle}>Quiz</Text>
          <Text style={styles.introSub}>
            Test what you've learned about pirate life and the island.
          </Text>

          <View style={styles.infoList}>
            <InfoBlock icon={String(TOTAL)} label="Questions" value={`${TOTAL} Questions Total`} />
            <InfoBlock imageSource={AssetRegistry.infinity} label="Time Limit" value="No Time Limit" />
            <InfoBlock icon="?" label="Difficulty" value="Mixed Difficulty" />
          </View>

          <View style={styles.bestWrap}>
            <Text style={styles.bestLabel}>Your best score</Text>
            <Text style={styles.bestScore}>
              {bestScore}/{TOTAL}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.startBtn}
            onPress={startQuiz}
            activeOpacity={0.85}>
            <LinearGradient
              colors={['#B01010', '#E52020']}
              start={{x: 0, y: 0.5}}
              end={{x: 1, y: 0.5}}
              style={styles.btnGradient}>
              <Text style={styles.startBtnText}>Start quiz</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.memoryBtn}
            onPress={() => navigation.navigate('MemoryGame')}
            activeOpacity={0.85}>
            <View style={styles.memoryBtnInner}>
              <Image source={AssetRegistry.artifact_compass} style={styles.memoryBtnIcon} />
              <View style={styles.memoryBtnText}>
                <Text style={styles.memoryBtnTitle}>Memory Game</Text>
                <Text style={styles.memoryBtnSub}>Find matching artifact pairs</Text>
              </View>
              <Image source={AssetRegistry.arrow} style={styles.memoryBtnArrow} />
            </View>
          </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
    );
  }

  if (phase === 'result') {
    const msg = getResultMessage(score);
    return (
      <ImageBackground source={AssetRegistry.bg_main} style={[styles.container, {paddingTop: insets.top, paddingBottom: insets.bottom}]} imageStyle={styles.bgImage}>
        <View style={styles.bgOverlay} />
        <View style={styles.resultWrap}>
          <Text style={styles.resultTitle}>Quiz completed</Text>
          <View style={styles.resultScoreWrap}>
            <Text style={styles.resultScore}>{score}/{TOTAL}</Text>
            <Text style={styles.resultBest}>Your Best: {Math.max(score, bestScore)}/{TOTAL}</Text>
            <Text style={styles.resultMsg}>{msg}</Text>
          </View>
          <TouchableOpacity
            style={[styles.startBtn, styles.resultStartBtn]}
            onPress={startQuiz}
            activeOpacity={0.85}>
            <LinearGradient
              colors={['#B01010', '#E52020']}
              start={{x: 0, y: 0.5}}
              end={{x: 1, y: 0.5}}
              style={styles.btnGradient}>
              <View style={styles.startAgainContent}>
                <Image source={AssetRegistry.reload} style={styles.reloadIcon} />
                <Text style={styles.startBtnText}>Start again</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  const progress = (questionIndex / TOTAL) * (width - 40);

  return (
    <ImageBackground source={AssetRegistry.bg_main} style={[styles.container, {paddingBottom: insets.bottom}]} imageStyle={styles.bgImage}>
      <View style={styles.bgOverlay} />
      <View style={[styles.quizTopBar, {paddingTop: insets.top + 26}]}>
        <Text style={styles.questionCounter}>
          Question {questionIndex + 1} of {TOTAL}
        </Text>
        <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.progressWrap, {top: insets.top + 68}]}>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, {width: progress}]} />
        </View>
        <Image source={AssetRegistry.skull} style={styles.progressSkull} />
      </View>

      <Animated.View style={[styles.questionArea, {opacity: fadeAnim}]}>
        <Text style={styles.questionText}>{q.question}</Text>

        <View style={styles.optionsList}>
          {q.options.map((opt, idx) => (
            <TouchableOpacity
              key={idx}
              style={getOptionStyle(idx)}
              onPress={() => {
                if (!checked) setSelectedOption(idx);
              }}
              activeOpacity={0.8}>
              <View style={[styles.radio, selectedOption === idx && styles.radioSelected]}>
                {selectedOption === idx && <View style={styles.radioDot} />}
              </View>
              <Text style={getOptionTextStyle(idx)}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      <View style={styles.actionArea}>
        {!checked ? (
          <TouchableOpacity
            style={[styles.checkBtn, selectedOption === null && styles.checkBtnDisabled]}
            onPress={handleCheck}
            activeOpacity={0.85}>
            <LinearGradient
              colors={['#B01010', '#E52020']}
              start={{x: 0, y: 0.5}}
              end={{x: 1, y: 0.5}}
              style={styles.btnGradient}>
              <Text style={styles.checkBtnText}>Check</Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.checkBtn}
            onPress={handleNext}
            activeOpacity={0.85}>
            <LinearGradient
              colors={['#B01010', '#E52020']}
              start={{x: 0, y: 0.5}}
              end={{x: 1, y: 0.5}}
              style={styles.btnGradient}>
              <Text style={styles.checkBtnText}>
                {questionIndex < TOTAL - 1 ? 'Next' : 'Finish'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
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
  container: {
    flex: 1,
    backgroundColor: Colors.bg_dark,
  },

  // Intro
  introScroll: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
  },
  introTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.gold,
    marginBottom: 8,
  },
  introSub: {
    fontSize: 14,
    color: Colors.text_secondary,
    lineHeight: 20,
    marginBottom: 28,
  },
  infoList: {
    gap: 12,
    marginBottom: 32,
  },
  infoBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20,16,16,0.82)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.gold_border,
    padding: 16,
    gap: 16,
  },
  infoIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoIcon: {
    fontSize: 18,
    color: '#fff',
  },
  infoIconImg: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    tintColor: '#fff',
  },
  infoLabel: {
    fontSize: 11,
    color: Colors.text_muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text_white,
  },
  bestWrap: {
    alignItems: 'center',
    marginBottom: 32,
    backgroundColor: 'rgba(20,16,16,0.82)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.gold_border,
    padding: 16,
  },
  bestLabel: {
    fontSize: 13,
    color: Colors.text_muted,
    marginBottom: 4,
  },
  bestScore: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.gold,
  },
  startBtn: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  resultStartBtn: {
    alignSelf: 'stretch',
  },
  btnGradient: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startAgainContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  reloadIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: '#fff',
  },
  startBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },

  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.gold_border,
  },
  dividerText: {
    fontSize: 13,
    color: Colors.text_muted,
  },
  memoryBtn: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.gold_border,
    backgroundColor: 'rgba(20,16,16,0.82)',
    overflow: 'hidden',
  },
  memoryBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  memoryBtnIcon: {
    width: 44,
    height: 44,
    resizeMode: 'contain',
  },
  memoryBtnText: {
    flex: 1,
    gap: 3,
  },
  memoryBtnTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.gold,
  },
  memoryBtnSub: {
    fontSize: 13,
    color: Colors.text_secondary,
  },
  memoryBtnArrow: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: Colors.gold,
    transform: [{rotate: '0deg'}],
  },

  // Playing
  quizTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 54,
    backgroundColor: 'rgba(20,16,16,0.88)',
    borderBottomWidth: 1,
    borderBottomColor: Colors.gold_border,
  },
  questionCounter: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(14,14,14,0.95)',
    borderWidth: 1,
    borderColor: Colors.gold_border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
  },
  progressWrap: {
    position: 'absolute',
    left: 20,
    right: 20,
    justifyContent: 'center',
    zIndex: 20,
  },
  progressTrack: {
    height: 8,
    backgroundColor: 'rgba(40,40,40,0.86)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: 8,
    backgroundColor: '#C41014',
    borderRadius: 4,
  },
  progressSkull: {
    position: 'absolute',
    alignSelf: 'center',
    width: 52,
    height: 52,
    resizeMode: 'contain',
    top: -24,
  },
  questionArea: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 42,
  },
  questionText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.gold,
    lineHeight: 28,
    marginBottom: 24,
    textAlign: 'center',
  },
  optionsList: {
    gap: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20,16,16,0.82)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.gold_border,
    paddingVertical: 20,
    paddingHorizontal: 16,
    gap: 14,
  },
  optionSelected: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C41014',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E52020',
    paddingVertical: 20,
    paddingHorizontal: 16,
    gap: 14,
    overflow: 'hidden',
  },
  optionCorrect: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.correct,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.correct,
    paddingVertical: 20,
    paddingHorizontal: 16,
    gap: 14,
  },
  optionIncorrect: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.incorrect,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.incorrect,
    paddingVertical: 20,
    paddingHorizontal: 16,
    gap: 14,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: Colors.gold,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.gold,
  },
  optionText: {
    fontSize: 15,
    color: Colors.text_secondary,
    flex: 1,
  },
  optionTextSelected: {
    fontSize: 15,
    color: Colors.text_white,
    fontWeight: '600',
    flex: 1,
  },
  actionArea: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  checkBtn: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  checkBtnDisabled: {
    opacity: 0.45,
  },
  checkBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },

  // Result
  resultWrap: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  resultTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.gold,
    textAlign: 'center',
  },
  resultScoreWrap: {
    backgroundColor: 'rgba(20,16,16,0.82)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.gold_border,
    paddingVertical: 28,
    paddingHorizontal: 28,
    alignItems: 'center',
    gap: 10,
    alignSelf: 'stretch',
  },
  resultScore: {
    fontSize: 52,
    fontWeight: '700',
    color: Colors.text_white,
  },
  resultBest: {
    fontSize: 14,
    color: Colors.text_muted,
  },
  resultMsg: {
    fontSize: 15,
    color: Colors.text_secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 4,
  },
});
