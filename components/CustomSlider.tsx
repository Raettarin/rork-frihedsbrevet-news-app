import React, { useState, useRef } from 'react';
import { View, PanResponder, Animated, StyleSheet, Platform } from 'react-native';

interface CustomSliderProps {
  minimumValue: number;
  maximumValue: number;
  value: number;
  onSlidingComplete?: (value: number) => void;
  onValueChange?: (value: number) => void;
  minimumTrackTintColor?: string;
  maximumTrackTintColor?: string;
  thumbTintColor?: string;
  style?: any;
  disabled?: boolean;
}

export default function CustomSlider({
  minimumValue = 0,
  maximumValue = 100,
  value = 0,
  onSlidingComplete,
  onValueChange,
  minimumTrackTintColor = '#007AFF',
  maximumTrackTintColor = '#E5E5EA',
  thumbTintColor = '#007AFF',
  style,
  disabled = false,
}: CustomSliderProps) {
  const [sliderWidth, setSliderWidth] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const lastValue = useRef<number>(value);

  React.useEffect(() => {
    if (!isDragging && value !== lastValue.current) {
      lastValue.current = value;
      const percentage = (value - minimumValue) / (maximumValue - minimumValue);
      animatedValue.setValue(percentage * sliderWidth);
    }
  }, [value, minimumValue, maximumValue, sliderWidth, isDragging, animatedValue]);

  const calculateValue = (gestureX: number): number => {
    const percentage = Math.max(0, Math.min(1, gestureX / sliderWidth));
    return minimumValue + percentage * (maximumValue - minimumValue);
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => !disabled,
    onMoveShouldSetPanResponder: () => !disabled,
    onPanResponderGrant: (evt) => {
      if (disabled) return;
      setIsDragging(true);
      const newValue = calculateValue(evt.nativeEvent.locationX);
      lastValue.current = newValue;
      animatedValue.setValue(evt.nativeEvent.locationX);
      onValueChange?.(newValue);
    },
    onPanResponderMove: (evt, gestureState) => {
      if (disabled) return;
      const clampedX = Math.max(0, Math.min(sliderWidth, gestureState.moveX - gestureState.x0 + evt.nativeEvent.locationX));
      const newValue = calculateValue(clampedX);
      lastValue.current = newValue;
      animatedValue.setValue(clampedX);
      onValueChange?.(newValue);
    },
    onPanResponderRelease: () => {
      if (disabled) return;
      setIsDragging(false);
      onSlidingComplete?.(lastValue.current);
    },
  });

  const handleLayout = (event: any) => {
    const { width } = event.nativeEvent.layout;
    setSliderWidth(width - 20); // Account for thumb size
    const percentage = (value - minimumValue) / (maximumValue - minimumValue);
    animatedValue.setValue(percentage * (width - 20));
  };

  const thumbPosition = animatedValue.interpolate({
    inputRange: [0, sliderWidth || 1],
    outputRange: [0, sliderWidth || 1],
    extrapolate: 'clamp',
  });

  const trackFillWidth = animatedValue.interpolate({
    inputRange: [0, sliderWidth || 1],
    outputRange: [0, sliderWidth || 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.container, style]} onLayout={handleLayout}>
      <View style={[styles.track, { backgroundColor: maximumTrackTintColor }]}>
        <Animated.View
          style={[
            styles.trackFill,
            {
              backgroundColor: minimumTrackTintColor,
              width: trackFillWidth,
            },
          ]}
        />
      </View>
      <Animated.View
        style={[
          styles.thumb,
          {
            backgroundColor: thumbTintColor,
            transform: [{ translateX: thumbPosition }],
          },
        ]}
        {...panResponder.panHandlers}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  track: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E5EA',
  },
  trackFill: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#007AFF',
  },
  thumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#007AFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
      },
    }),
  },
});