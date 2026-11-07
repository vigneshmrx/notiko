import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { API_URL } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Note, noteCache } from '@/lib/note-cache';
import { useFocusEffect, useRouter } from 'expo-router';
import { PlusIcon } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, View } from 'react-native';

export default function Screen() {
    const router = useRouter();
    const { token, signOut } = useAuth();
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const getNotes = useCallback(async () => {
        setLoading(true);
        try {
            const resp = await fetch(
                `${API_URL}/api/notes`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (resp.status === 401) return signOut();
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            // console.log('got notes as ', await resp.json());
            const data: Note[] = await resp.json();
            noteCache.clear();
            data.forEach((itm) => noteCache.set(itm.id, itm));
            setNotes(data);
        } catch (err) {
            console.log('error getting notes ', err);
            setNotes([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [token]);

    // Runs on first show AND every time you come back to this screen
    useFocusEffect(
        useCallback(() => {
            if (noteCache.size > 0) {
                setNotes(sortByUpdated([...noteCache.values()]));
                setLoading(false);
            } else {
                getNotes();
            }
        }, [getNotes])
    );

    const sortByUpdated = (list: Note[]) =>
        list.sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));

    if (loading) {
        return (
            <View className='flex-1 items-center justify-center'>
                <ActivityIndicator />
            </View>
        )
    }

    return (
        <View className='flex-1'>
            <FlatList
                data={notes}
                keyExtractor={(n) => n.id}
                contentContainerClassName="gap-3 p-4 pb-24 flex-grow"
                refreshing={refreshing}
                onRefresh={() => {
                    setRefreshing(true);
                    getNotes();
                }}
                ListEmptyComponent={
                    <View className='flex-1 items-center justify-center gap-3'>
                        <Text className="text-muted-foreground">No notes added</Text>
                        <Button onPress={() => router.push('/new-note')}>
                            <Icon as={PlusIcon} size={20} className="text-primary-foreground" />
                            <Text>Create Note</Text>
                        </Button>
                    </View>
                }
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() => {
                            // noteCache.set(item.id, item);
                            router.push({ pathname: '/new-note', params: { id: item.id } });
                        }}
                        className='rounded-xl border border-border bg-card p-4 active:opacity-70'
                    >
                        <Text numberOfLines={3} className="text-card-foreground">
                            {item.text?.trim() || 'Empty note'}
                        </Text>
                        <Text className="mt-2 text-xs text-muted-foreground">
                            {new Date(item.updatedAt).toLocaleDateString()}
                        </Text>
                    </Pressable>
                )}
            />

            {notes.length > 0 && (
                <Button
                    size="icon"
                    className="absolute bottom-6 right-6 size-14 rounded-full"
                    onPress={() => router.push('/new-note')}
                >
                    <Icon as={PlusIcon} size={24} className="text-primary-foreground" />
                </Button>
            )}
        </View>
    );
}
