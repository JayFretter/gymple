import useStorage from "@/hooks/useStorage";
import { SessionDefinition } from "@/interfaces/SessionDefinition";
import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import WorkoutSessionTile from "./WorkoutSessionTile";

interface GroupedSessions {
  date: string;
  sessions: SessionDefinition[];
}

export default function WorkoutProgressionList() {
  const [sessions, setSessions] = useState<SessionDefinition[]>([]);
  const [groupedSessions, setGroupedSessions] = useState<GroupedSessions[]>([]);
  const { fetchFromStorage } = useStorage();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      const allSessions = fetchFromStorage<SessionDefinition[]>('data_sessions') ?? [];
      setSessions(allSessions.reverse());
    }
  }, [isFocused]);

  useEffect(() => {
    // Group sessions by date using local date string
    const groups: { [date: string]: SessionDefinition[] } = {};
    sessions.forEach((session) => {
      const dateObj = new Date(session.timestamp);
      const dateStr = dateObj.toLocaleDateString();
      if (!groups[dateStr]) {
        groups[dateStr] = [];
      }
      groups[dateStr].push(session);
    });
    const grouped: GroupedSessions[] = Object.keys(groups).map(date => ({
      date,
      sessions: groups[date],
    }));
    setGroupedSessions(grouped);
  }, [sessions]);

  return (
    <View className="bg-primary h-full px-4">
      <FlatList
        ListHeaderComponent={
          <Text className="text-txt-primary text-4xl font-bold mt-4 mb-8">
            Your workout sessions
          </Text>
        }
        showsVerticalScrollIndicator={false}
        data={groupedSessions}
        keyExtractor={(item) => item.date}
        renderItem={({ item }) => (
          <View>
            <Text className="text-txt-secondary text-lg font-semibold mt-4">{item.date}</Text>
            {item.sessions.map(session => 
              <WorkoutSessionTile key={session.id} session={session} />
            )}
          </View>
        )}
        ItemSeparatorComponent={() => <View className="h-4" />}
      />
    </View>
  );
}