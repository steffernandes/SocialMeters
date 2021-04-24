import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity } from 'react-native';


const shadow = {
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.23,
  shadowRadius: 2.62,

  elevation: 4,
}

// So that it stretches in landscape mode.
const width = Dimensions.get('screen').width -32;

export const PageTab = (props) => {
  const translateValue = ((width - 4) / props?.tabs?.length);
  const [tabTranslate, setTabTranslate] = React.useState(new Animated.Value(0));

  // useCallBack with an empty array as input, which will call inner lambda only once and memoize the reference for future calls
  const memorizedTabPressCallback = React.useCallback(
    (index) => {
      props?.onChange(index);
    },
    []
  );

  useEffect(() => {
    // Animating the active index based on current index
    Animated.spring(tabTranslate, {
      toValue: props?.currentIndex * translateValue,
      stiffness: 180,
      damping: 20,
      mass: 1,
      useNativeDriver: true
    }).start()
  }, [props?.currentIndex])

  return (
    <Animated.View style={[
      styles.rankingSegmentedControlWrapper,
      {
        backgroundColor: "#F1F1F1"
      },
      {
        paddingVertical: 8,
      }
    ]}>
      <Animated.View
        style={[{
          ...StyleSheet.absoluteFill,
          position: "absolute",
          width: (width - 4) / props?.tabs?.length,
          top: 0,
          marginVertical: 2,
          marginHorizontal: 2,
          backgroundColor: '#F9825F',
          borderRadius: 24,
          ...shadow,
        },
        {
          transform: [
            {
              translateX: tabTranslate
            }
          ]
        }]}
      >
      </Animated.View>
      {
        props?.tabs.map((tab, index) => {
          const isCurrentIndex = props?.currentIndex === index;
          return (
            <TouchableOpacity
              key={index}
              style={[styles.rankingTextWrapper]}
              onPress={() => memorizedTabPressCallback(index)}
              activeOpacity={0.7} >
              <Text numberOfLines={1} style={[styles.rankingTextStyles, { color: "#0D1B1E" }, isCurrentIndex && { color: "#FFFFFF" }]}>{tab}</Text>
            </TouchableOpacity>
          )
        })
      }
    </Animated.View >
  )
}

export const RewardsTab = (props) => {
  const translateValue = ((width - 4) / props?.tabs?.length);
  const [tabTranslate, setTabTranslate] = React.useState(new Animated.Value(0));

  // useCallBack with an empty array as input, which will call inner lambda only once and memoize the reference for future calls
  const memorizedTabPressCallback = React.useCallback(
    (index) => {
      props?.onChange(index);
    },
    []
  );

  useEffect(() => {
    // Animating the active index based on current index
    Animated.spring(tabTranslate, {
      toValue: props?.currentIndex * translateValue,
      useNativeDriver: true
    }).start()
  }, [props?.currentIndex])

  return (
    <Animated.View style={[
      styles.segmentedControlWrapper
    ]}>
      <Animated.View
        style={[{
          position: "absolute",
          width: width,
          top: 0,
        }]}
      >
      </Animated.View>
      {
        props?.tabs.map((tab, index) => {
          const isCurrentIndex = props?.currentIndex === index;
          return (
            <TouchableOpacity
              key={index}
              style={[styles.textWrapper]}
              onPress={() => memorizedTabPressCallback(index)}
              activeOpacity={0.7} >
              <Text numberOfLines={1} style={[styles.textStyles, { color: "#50555C", fontSize: 14 }, isCurrentIndex && { color: "#0D1B1E", fontSize: 16 }]}>{tab}</Text>
            </TouchableOpacity>
          )
        })
      }
    </Animated.View >
  )
}

const styles = StyleSheet.create({
  segmentedControlWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: width,
    paddingHorizontal: 32,
    marginVertical: 32
  },
  textWrapper: {
    flex: 1, 
  },
  textStyles: {
    fontFamily: "Roboto-Medium",
    textAlign: 'center',
    alignSelf: 'flex-start'
  },

  rankingSegmentedControlWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    width: width,
    marginVertical: 24
  },
  rankingTextWrapper: {
    flex: 1,
    elevation: 9,
    paddingHorizontal: 5
  },
  rankingTextStyles: {
    fontSize: 16,
    textAlign: 'center',
  },



})
