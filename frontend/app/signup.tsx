import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import ThemeToggle from "@/components/ui/theme-toggle";
import { Link, Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { Loader2 } from 'lucide-react-native';
import { Icon } from "@/components/ui/icon";
import { useAuth } from "@/lib/auth";

const SCREEN_OPTIONS = {
    title: 'Signup',
    headerTransparent: true,
    headerRight: () => <ThemeToggle />,
};

export default function SignupScreen() {
    const { signIn } = useAuth();

    const [signupDisabled, setSignupDisabled] = useState(false);
    const [email, setEmail] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [repeatPassword, setRepeatPassword] = useState<string>('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (email && username && password && repeatPassword) setSignupDisabled(false);
        else setSignupDisabled(true);
    }, [email, username, password, repeatPassword]);

    const onSubmit = () => {
        console.log('submit clicked = ', email, username, password)
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
                            <CardTitle>Hi there!</CardTitle>
                            <CardDescription>Create an account</CardDescription>
                        </CardHeader>

                        <CardContent>
                            <View className="gap-4">
                                <View className="gap-2" >
                                    <Label nativeID="email" htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        aria-labelledby="email"
                                        placeholder="john@example.com"
                                        autoComplete="email"
                                        autoCapitalize="none"
                                        value={email}
                                        onChangeText={setEmail}
                                    />
                                </View>

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
                                        autoComplete="new-password"
                                        value={password}
                                        onChangeText={setPassword}
                                    />
                                </View>

                                <View className="gap-2">
                                    <Label nativeID="repeatPassword" htmlFor="repeatPassword">Password</Label>
                                    <Input
                                        id="repeatPassword"
                                        aria-labelledby="repeatPassword"
                                        placeholder="••••••••"
                                        secureTextEntry
                                        autoComplete="new-password"
                                        value={repeatPassword}
                                        onChangeText={setRepeatPassword}
                                    />
                                </View>
                            </View>
                        </CardContent>

                        <CardFooter className="flex-col">
                            <Button
                                className="w-full"
                                disabled={signupDisabled || loading}
                                onPress={onSubmit}>
                                {loading && <View className="pointer-events-none animate-spin">
                                    <Icon as={Loader2} className="text-primary-foreground" />
                                </View>}
                                <Text>Sign up</Text>
                            </Button>

                            <View className="mt-6 flex-row gap-1">
                                <Text className="text-muted-foreground">Already have an account?</Text>
                                <Link href="/login">
                                    <Text className="font-medium">Log in</Text>
                                </Link>
                            </View>
                        </CardFooter>
                    </Card>
                </ScrollView>
            </KeyboardAvoidingView>
        </>
    )
}