"use client"

import React, { useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

import { useMediaQuery } from "@/hooks/use-media-query";

interface ModalProps {
    trigger: React.ReactNode;
    title: string;
    description: string;
    content: React.ReactNode;
    onSuccess?: () => void;
}

const Modal: React.FC<ModalProps> = ({
    trigger,
    title,
    description,
    content,
    onSuccess
}) => {

    const [open, setOpen] = useState(false);

    const isLargeScreen = useMediaQuery("(min-width: 768px)");

    const clonedContent = React.isValidElement(content)
        ? React.cloneElement(content as React.ReactElement<{ onSuccess?: () => void }>, { onSuccess: () => { onSuccess?.(); setOpen(false); } })
        : content;

    if (isLargeScreen) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>{trigger}</DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>{description}</DialogDescription>
                    </DialogHeader>
                    {clonedContent}
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>{trigger}</DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>{title}</DrawerTitle>
                    <DrawerDescription>{description}</DrawerDescription>
                </DrawerHeader>
                <div className="px-4">{clonedContent}</div>
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );

};

export type { ModalProps };
export { Modal };

