import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { profileAPI } from "@/api/profile";
import { toast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";

const EmailVerificationDialog = ({ 
  isOpen, 
  setIsOpen, 
  isEmailSent, 
  setIsEmailSent, 
  userId 
}) => {
  const handleEmailValidate = async () => {
    try {
      await profileAPI.sendEmailValidation(userId);
      setIsOpen(false);
      setIsEmailSent(true);
      toast({
        title: "Success",
        description: "Verification email sent successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send verification email. Please try again.",
        variant: "destructive",
      });
    }
  };

  // First dialog - Email not verified
  if (isOpen) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Not Verified
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Please verify your email address to access all features of your account.
              We&apos;ll send you a verification link to complete the process.
            </p>
            <div className="flex justify-end">
              <Button onClick={handleEmailValidate}>
                Send Verification Email
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Second dialog - Email sent confirmation
  if (isEmailSent) {
    return (
      <Dialog open={isEmailSent} onOpenChange={setIsEmailSent}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Verification Email Sent
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              A verification link has been sent to your email address.
              Please check your inbox and click the link to verify your email.
            </p>
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setIsEmailSent(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return null;
};

export default EmailVerificationDialog;