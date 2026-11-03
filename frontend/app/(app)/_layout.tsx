import ThemeToggle from "@/components/ui/theme-toggle";
import { Tabs } from "expo-router";
import { NotebookTextIcon, UserIcon } from "lucide-react-native";


export default function AppLayout() {
    return (
        <Tabs screenOptions={{ headerRight: () => <ThemeToggle /> }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: "Notes",
                    tabBarIcon: ({ color, size }) => <NotebookTextIcon color={color} size={size} />
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color, size }) => <UserIcon color={color} size={size} />
                }}
            />
        </Tabs>
    )
}