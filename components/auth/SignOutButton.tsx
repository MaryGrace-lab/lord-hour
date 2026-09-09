"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const [open, setOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut({ callbackUrl: "/bible-college/portal/login" });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors">
          Sign Out
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Confirm Sign Out</DialogTitle>
          <DialogDescription>
            Are you sure you want to sign out? You will need to log in again to access your account.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isSigningOut ? "Signing out..." : "Sign Out"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}