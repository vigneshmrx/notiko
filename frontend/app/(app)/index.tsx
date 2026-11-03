import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import ThemeToggle from '@/components/ui/theme-toggle';
import { Link, Stack } from 'expo-router';
import { MoonStarIcon, PlusIcon, StarIcon, SunIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Image, type ImageStyle, View } from 'react-native';

const LOGO = {
  light: require('@/assets/images/react-native-reusables-light.png'),
  dark: require('@/assets/images/react-native-reusables-dark.png'),
};

const SCREEN_OPTIONS = {
  // title: 'React Native Reusables',
  headerTransparent: true,
  headerRight: () => <ThemeToggle />,
};

const IMAGE_STYLE: ImageStyle = {
  height: 76,
  width: 76,
};

type Notes = {

}

export default function Screen() {
  const [notes, setNotes] = useState<Notes[]>([]);

  useEffect(() => {

  }, []);

  return (
    <View className="flex-1 p-6 justify-center gap-2">
      <View>
        <Text>No notes added</Text>
      </View>

      <Button>
        <PlusIcon />
        <Text>Create Note</Text>
      </Button>
    </View>
  );
}
