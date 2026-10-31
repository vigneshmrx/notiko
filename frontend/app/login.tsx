import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import ThemeToggle from "@/components/ui/theme-toggle";
import { Link, Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";

const SCREEN_OPTIONS = {
    title: 'Login',
    headerTransparent: true,
    headerRight: () => <ThemeToggle />,
};

export default function LoginScreen() {
    const router = useRouter();

    const [loginDisabled, setLoginDisabled] = useState(true);
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    useEffect(() => {
        if (username && password) setLoginDisabled(false);
        else setLoginDisabled(true);
    }, [username, password]);

    const onSubmit = () => {
        console.log('submit clicked = ', username, password)
    }

    return (
        <>
            <Stack.Screen options={SCREEN_OPTIONS}>
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
                                <Button className="w-full" disabled={loginDisabled} onPress={onSubmit}>
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
            </Stack.Screen>
        </>
    )
}