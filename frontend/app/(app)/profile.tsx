import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { API_URL } from '@/lib/api';

type Me = { id: string, email: string, username: string };

export default function ProfileScreen() {
    const { token, signOut } = useAuth();
    const [me, setMe] = useState<Me | null>(null);

    useEffect(() => {
        fetch(`${API_URL}/api/me`, { headers: { Authorization: `Bearer ${token}` } })
            .then(async (resp) => {
                if (resp.status === 401) return signOut();
                if (resp.ok) setMe(await resp.json());
            })
            .catch(() => { })
    }, [token]);

    return (
        <View className="flex-1 gap-4 p-6">
            <View className="gap-1">
                <Text className="text-2xl font-bold">{me?.username ?? '...'}</Text>
                <Text className="text-muted-foreground">{me?.email}</Text>
            </View>

            <Button variant="outline" onPress={signOut}>
                <Text>Log out</Text>
            </Button>
        </View>
    )

}