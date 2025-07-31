import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: 'How do I change my weight unit?',
    answer: 'Go to Settings, then select your preferred weight unit (kg or lbs). Regardless of the unit, you can always log your weights in either kg or lbs.'
  },
  {
    question: 'How do I create a new workout?',
    answer: 'Go to the Workouts tab, tap the "New Workout" button, and follow the prompts to add exercises to your new workout.'
  },
  {
    question: 'How do I track my progress?',
    answer: 'Start a workout, log your sets and reps for each exercise, and your progress will be saved automatically. Go to the Progression tab to see your progress over time via various charts.'
  },
  {
    question: 'How do I edit or delete a workout?',
    answer: 'On the Workouts tab, tap the workout you want to edit or delete, then use the edit or delete options.'
  },
  {
    question: 'How is my data saved?',
    answer: 'All your data is saved locally on your device. No need for an internet connection.'
  }
];

function Accordion({ question, answer }: FAQItem) {
  const [open, setOpen] = useState(false);

  const animatedStyle = useAnimatedStyle(() => ({
    maxHeight: withTiming(open ? 500 : 0, { duration: 500 }),
    overflow: 'hidden',
  }));

  function toggle() {
    setOpen((prev) => !prev);
  }

  return (
    <View className="mb-4 bg-card rounded-lg overflow-hidden">
      <TouchableOpacity className="flex-row items-center justify-between px-4 py-3" onPress={toggle} activeOpacity={0.8}>
        <Text className="text-txt-primary text-lg font-semibold flex-1">{question}</Text>
        <Feather name={open ? 'chevron-up' : 'chevron-down'} size={20} color="#068bec" />
      </TouchableOpacity>
      <Animated.View style={animatedStyle} className="px-4 pb-4">
        {open && <Text className="text-txt-secondary text-base">{answer}</Text>}
      </Animated.View>
    </View>
  );
}

export default function HelpPage() {
  return (
    <ScrollView className="flex-1 bg-primary px-4 py-6">
      <Text className="text-txt-primary text-4xl font-bold mb-6">Help</Text>
      {FAQS.map((faq, idx) => (
        <Accordion key={idx} question={faq.question} answer={faq.answer} />
      ))}
    </ScrollView>
  );
}
