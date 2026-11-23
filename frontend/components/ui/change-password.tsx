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
import { useState } from "react";

export default function ChangePasswordDialog() {
    const [currPwd, setCurrPwd] = useState<string>("");
    const [newPwd, setNewPwd] = useState<string>("");
    const [repeatNewPwd, setRepeatNewPwd] = useState<string>("");

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Text className="mb-4 font-medium">Change Password</Text>
            </DialogTrigger>

            <DialogContent className="w-[90vw]">
                <DialogHeader>
                    <DialogTitle className="pb-2">Change Password</DialogTitle>
                </DialogHeader>

                <View className="grid gap-4">
                    <View className="grid gap-3">
                        <Label htmlFor="current-pwd">Current Password</Label>
                        <Input
                            id="current-pwd"
                            aria-labelledby="current-pwd"
                            autoCapitalize="none"
                            autoComplete="password" 
                            value={currPwd}
                            onChangeText={setCurrPwd}
                        />
                    </View>

                    <View className="grid gap-3">
                        <Label htmlFor="new-pwd">New Password</Label>
                        <Input id="new-pwd" />
                    </View>

                    <View className="grid gap-3">
                        <Label htmlFor="repeat-new-pwd">
                            Repeat New Password
                        </Label>
                        <Input id="repeat-new-pwd" />
                    </View>
                </View>

                <DialogFooter className="mt-2">
                    <DialogClose asChild>
                        <Button variant="outline">
                            <Text>Cancel</Text>
                        </Button>
                    </DialogClose>

                    <Button>
                        <Text>Save</Text>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
