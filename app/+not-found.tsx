import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// Animated Workshop Tool Component
const AnimatedTool = ({
  tool,
  delay = 0,
  duration = 3000,
  style
}: {
  tool: string;
  delay?: number;
  duration?: number;
  style?: any;
}) => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createFloatingAnimation = () => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, {
            toValue: 1,
            duration: duration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim, {
            toValue: 0,
            duration: duration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      );
    };

    const createRotationAnimation = () => {
      return Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: duration * 2,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
    };

    const timer = setTimeout(() => {
      createFloatingAnimation().start();
      createRotationAnimation().start();
    }, delay);

    return () => clearTimeout(timer);
  }, [floatAnim, rotateAnim, delay, duration]);

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.toolContainer,
        style,
        {
          transform: [
            { translateY },
            { rotate },
          ],
        },
      ]}
    >
      <Text style={styles.toolEmoji}>{tool}</Text>
    </Animated.View>
  );
};

// Bouncing 404 Component
const Bouncing404 = () => {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const bounceAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.bounce,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.bounce,
          useNativeDriver: true,
        }),
      ])
    );

    const scaleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    bounceAnimation.start();
    scaleAnimation.start();

    return () => {
      bounceAnimation.stop();
      scaleAnimation.stop();
    };
  }, [bounceAnim, scaleAnim]);

  const translateY = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30],
  });

  return (
    <Animated.View
      style={[
        styles.fourZeroFourContainer,
        {
          transform: [
            { translateY },
            { scale: scaleAnim },
          ],
        },
      ]}
    >
      <LinearGradient
        colors={['#3B82F6', '#8B5CF6', '#EC4899']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientText}
      >
        <Text style={styles.fourZeroFourText}>404</Text>
      </LinearGradient>
    </Animated.View>
  );
};

// Pulsing Button Component
const PulsatingButton = ({ onPress, children }: { onPress: () => void; children: React.ReactNode }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    pulseAnimation.start();
    return () => pulseAnimation.stop();
  }, [pulseAnim]);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Animated.View
        style={[
          styles.button,
          {
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        <View style={styles.buttonGradient}>
          {children}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default function NotFoundPage() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleGoHome = () => {
    router.replace('/');
  };

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      <View style={styles.container}>
        {/* Background Pattern */}
        <View style={styles.backgroundPattern}>
          {Array.from({ length: 20 }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.patternDot,
                {
                  left: (i % 5) * (width / 4),
                  top: Math.floor(i / 5) * (height / 4),
                  opacity: 0.1,
                },
              ]}
            />
          ))}
        </View>

        {/* Floating Workshop Tools */}
        <AnimatedTool tool="🔧" delay={0} style={{ top: '15%', left: '10%' }} />
        <AnimatedTool tool="🔨" delay={500} style={{ top: '25%', right: '15%' }} duration={3500} />
        <AnimatedTool tool="⚙️" delay={1000} style={{ top: '70%', left: '5%' }} duration={4000} />
        <AnimatedTool tool="🔩" delay={1500} style={{ top: '80%', right: '10%' }} duration={2500} />
        <AnimatedTool tool="🛠️" delay={2000} style={{ top: '40%', left: '80%' }} duration={3200} />
        <AnimatedTool tool="⚡" delay={2500} style={{ top: '60%', right: '75%' }} duration={2800} />

        {/* Main Content */}
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* 404 Animation */}
          <Bouncing404 />

          {/* Title with Background */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Oops! Page Not Found</Text>
            <Text style={styles.subtitle}>
              Looks like this page took a detour to the parts department! 🚗
            </Text>
          </View>

          {/* Description */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>
              The page you&apos;re looking for might be getting a tune-up or has been moved to a different location in our workshop.
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <PulsatingButton onPress={handleGoHome}>
              <Text style={styles.buttonText}>🏠 Back to Workshop</Text>
            </PulsatingButton>

            <TouchableOpacity onPress={handleGoBack} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>← Go Back</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Bottom Decoration */}
        <View style={styles.bottomDecoration}>
          <View style={styles.decorationGradient} />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#0F172A',
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  patternDot: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#3B82F6',
  },
  toolContainer: {
    position: 'absolute',
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  toolEmoji: {
    fontSize: 32,
  },
  content: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  fourZeroFourContainer: {
    marginBottom: 20,
  },
  gradientText: {
    borderRadius: 20,
    padding: 10,
    backgroundColor: '#3B82F6',
  },
  fourZeroFourText: {
    fontSize: 120,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 6,
  },
  titleContainer: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(30, 41, 59, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F8FAFC',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#CBD5E1',
    textAlign: 'center',
    lineHeight: 24,
  },
  descriptionContainer: {
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  description: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  button: {
    borderRadius: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 200,
    backgroundColor: '#10B981',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    marginBottom: 40,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#3B82F6',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  secondaryButtonText: {
    color: '#60A5FA',
    fontSize: 16,
    fontWeight: '500',
  },
  quoteContainer: {
    marginTop: 40,
    paddingHorizontal: 20,
  },
  quoteText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  bottomDecoration: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  decorationGradient: {
    flex: 1,
    backgroundColor: '#3B82F6',
    opacity: 0.3,
  },
});