import { View } from "react-native";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./dialog";
import { Text } from "./text";
import { Button } from "./button";
import { Label } from "./label";
import { Input } from "./input";
import { useEffect, useState } from "react";
import { Alert, AlertTitle } from "./alert";
import { AlertCircleIcon, Loader2 } from "lucide-react-native";
import { API_URL } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Icon } from "./icon";

export default function ChangePasswordDialog() {
    const [viewDialog, setViewDialog] = useState(false);
    const [currPwd, setCurrPwd] = useState<string>("");
    const [newPwd, setNewPwd] = useState<string>("");

    const [repeatNewPwd, setRepeatNewPwd] = useState<string>("");
    const [saveDisabled, setSaveDisabled] = useState(true);
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState<string>("");
    const [pwdMismatchError, setPwdMismatchError] = useState(false);

    const { token, signOut } = useAuth();

    useEffect(() => {
        if (currPwd && newPwd && repeatNewPwd) setSaveDisabled(false);
        else setSaveDisabled(true);

        if (newPwd && repeatNewPwd && newPwd !== repeatNewPwd)
            setPwdMismatchError(true);
        else setPwdMismatchError(false);
    }, [currPwd, newPwd, repeatNewPwd]);

    useEffect(() => {}, []);

    const onSubmit = async () => {
        setError("");
        try {
            setLoading(true);

            const resp = await fetch(`${API_URL}/api/change-password`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    oldPassword: currPwd,
                    newPassword: repeatNewPwd,
                }),
            });

            const data = await resp.json().catch(() => null);
            console.log("data = ", data);

            if (resp.status === 401) return signOut();
            if (!resp.ok) {
                setError(data?.message || "Some error occured");
                return;
            }

            setCurrPwd("");
            setNewPwd("");
            setRepeatNewPwd("");
            setViewDialog(false);
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Unknown error";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={viewDialog}
            onOpenChange={(value) => !loading && setViewDialog(value)}
        >
            <DialogTrigger asChild>
                <Text className="mb-4 font-medium">Change Password</Text>
            </DialogTrigger>

            <DialogContent className="w-[90vw]">
                <DialogHeader>
                    <DialogTitle className="pb-2">Change Password</DialogTitle>
                </DialogHeader>

                <View className="grid gap-4">
                    {error && (
                        <Alert variant="destructive" icon={AlertCircleIcon}>
                            <AlertTitle>{error}</AlertTitle>
                        </Alert>
                    )}
                    <View className="grid gap-3">
                        <Label htmlFor="current-pwd">Current Password</Label>
                        <Input
                            id="current-pwd"
                            aria-labelledby="current-pwd"
                            secureTextEntry={true}
                            autoCapitalize="none"
                            autoComplete="password"
                            value={currPwd}
                            onChangeText={setCurrPwd}
                        />
                    </View>

                    <View className="grid gap-3">
                        <Label htmlFor="new-pwd">New Password</Label>
                        <Input
                            id="new-pwd"
                            aria-labelledby="current-pwd"
                            secureTextEntry={true}
                            autoCapitalize="none"
                            autoComplete="password"
                            value={newPwd}
                            onChangeText={setNewPwd}
                        />
                    </View>

                    <View className="grid gap-3">
                        <Label htmlFor="repeat-new-pwd">
                            Repeat New Password
                        </Label>
                        <Input
                            id="repeat-new-pwd"
                            aria-labelledby="current-pwd"
                            secureTextEntry={true}
                            autoCapitalize="none"
                            autoComplete="password"
                            value={repeatNewPwd}
                            onChangeText={setRepeatNewPwd}
                        />
                        {pwdMismatchError && (
                            <Text className="text-red-500">
                                The passwords do not match
                            </Text>
                        )}
                    </View>
                </View>

                <DialogFooter className="mt-2">
                    <DialogClose asChild>
                        <Button variant="outline" disabled={loading}>
                            <Text>Cancel</Text>
                        </Button>
                    </DialogClose>

                    <Button
                        disabled={saveDisabled || pwdMismatchError || loading}
                        onPress={onSubmit}
                    >
                        {loading && (
                            <View className="pointer-events-none animate-spin">
                                <Icon
                                    as={Loader2}
                                    className="text-primary-foreground"
                                />
                            </View>
                        )}
                        <Text>Save</Text>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
