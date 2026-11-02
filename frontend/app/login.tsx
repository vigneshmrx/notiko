import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import ThemeToggle from "@/components/ui/theme-toggle";
import { Link, Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { AlertCircleIcon } from 'lucide-react-native';
import { Alert, AlertTitle } from "@/components/ui/alert";
import { API_URL } from "@/lib/api";
import { Loader2 } from 'lucide-react-native';
import { Icon } from "@/components/ui/icon";
import { useAuth } from "@/lib/auth";

const SCREEN_OPTIONS = {
    title: 'Login',
    headerTransparent: true,
    headerRight: () => <ThemeToggle />,
};

export default function LoginScreen() {
    const { signIn } = useAuth();

    const [loginDisabled, setLoginDisabled] = useState(true);
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (username && password) setLoginDisabled(false);
        else setLoginDisabled(true);
    }, [username, password]);

    const onSubmit = async () => {
        setError(null);
        try {
            setLoading(true);
            console.log('simulating API call...');
            const resp = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await resp.json().catch(() => null);

            if (!resp.ok) {
                setError(data?.message || 'Some error occurred');
                return;
            }

            await signIn(data.token);
        } catch (error) {
            console.log('Login error:', error);
            setError("Some error occurred");
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Stack.Screen options={SCREEN_OPTIONS} />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                className="flex-1"
            >
                <ScrollView
                    contentContainerClassName="flex-grow justify-center gap-6 p-6"
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Welcome back</CardTitle>
                            <CardDescription>Login to your account</CardDescription>
                        </CardHeader>

                        <CardContent>
                            {error && (
                                <Alert variant="destructive" icon={AlertCircleIcon} className="mb-4">
                                    <AlertTitle>{error}</AlertTitle>
                                </Alert>
                            )}

                            <View className="gap-4">
                                <View className="gap-2" >
                                    <Label nativeID="username" htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        aria-labelledby="username"
                                        placeholder="john_doe"
                                        autoComplete="username"
                                        autoCapitalize="none"
                                        value={username}
                                        onChangeText={setUsername}
                                    />
                                </View>

                                <View className="gap-2">
                                    <Label nativeID="password" htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        aria-labelledby="password"
                                        placeholder="••••••••"
                                        secureTextEntry
                                        autoComplete="password"
                                        value={password}
                                        onChangeText={setPassword}
                                    />
                                </View>
                            </View>
                        </CardContent>

                        <CardFooter className="flex-col">
                            <Button
                                className="w-full"
                                disabled={loginDisabled || loading}
                                onPress={onSubmit}
                            >
                                {loading && <View className="pointer-events-none animate-spin">
                                    <Icon as={Loader2} className="text-primary-foreground" />
                                </View>}
                                <Text>Log in</Text>
                            </Button>

                            <View className="mt-6 flex-row gap-1">
                                <Text className="text-muted-foreground">Don't have an account?</Text>
                                <Link href="/signup">
                                    <Text className="font-medium">Sign up</Text>
                                </Link>
                            </View>
                        </CardFooter>
                    </Card>
                </ScrollView>
            </KeyboardAvoidingView>
        </>
    )
}