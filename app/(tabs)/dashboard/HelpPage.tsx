import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import Accordion from '@/components/shared/Accordion';

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
    question: 'What is "volume"?',
    answer: 'Volume refers to the total amount of weight you lifted in an exercise or workout, calculated by multiplying the weight lifted by the number of repetitions and sets. ' + 
    'It\'s a key factor in building strength and muscle. If your volume is increasing, it means you are lifting more weight or doing more reps/sets over time.'
  },
  {
    question: 'How do I edit or delete a workout?',
    answer: 'On the Workouts tab, tap the workout you want to edit or delete, then use the edit or delete options.'
  },
  {
    question: 'How do I use the "Goals" feature?',
    answer: 'You can set goals for any exercise in the form of a target weight for a specific number of reps. ' +
    'When you achieve a goal, it will be marked as completed. You can view your goals on the "Goals" tab and track your progress towards them.'
  }
];

export default function HelpPage() {
  return (
    <ScrollView className="flex-1 bg-primary px-4 py-6">
      <Text className="text-txt-primary text-4xl font-bold mb-6">Help</Text>
      {FAQS.map((faq, idx) => (
        <Accordion key={idx} className='bg-card rounded-xl mb-4 px-4 py-2' title={faq.question} animated>
          <Text className="text-txt-secondary text-base">{faq.answer}</Text>
        </Accordion>
      ))}
    </ScrollView>
  );
}
