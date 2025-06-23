"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface PrivacyModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Privacy Policy</DialogTitle>
          <DialogDescription>Last updated: December 2024</DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-4">
              At Fravvo, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and
              safeguard your information when you use our service.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">Information We Collect</h3>
            <p className="text-gray-600 mb-4">
              We collect information you provide directly to us, such as when you create an account, use our services,
              or contact us. This may include:
            </p>
            <ul className="list-disc pl-5 mb-4 text-gray-600">
              <li>Personal identifiers (name, email address, phone number)</li>
              <li>Account credentials</li>
              <li>Profile information</li>
              <li>Content you create, upload, or receive while using our services</li>
              <li>Transaction information when you use our services</li>
            </ul>

            <p className="text-gray-600 mb-4">
              We also automatically collect certain information when you use our service, including:
            </p>
            <ul className="list-disc pl-5 mb-4 text-gray-600">
              <li>Log data (IP address, browser type, pages visited)</li>
              <li>Device information</li>
              <li>Usage information</li>
              <li>Cookies and similar technologies</li>
            </ul>

            <h3 className="text-lg font-semibold mt-6 mb-3">How We Use Your Information</h3>
            <p className="text-gray-600 mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-5 mb-4 text-gray-600">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Develop new products and services</li>
              <li>Monitor and analyze trends and usage</li>
              <li>Detect, investigate, and prevent fraud and other illegal activities</li>
              <li>Protect the rights and property of Fravvo and others</li>
            </ul>

            <h3 className="text-lg font-semibold mt-6 mb-3">Information Sharing</h3>
            <p className="text-gray-600 mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your
              consent, except in the following circumstances:
            </p>
            <ul className="list-disc pl-5 mb-4 text-gray-600">
              <li>
                With vendors and service providers who need access to such information to carry out work on our behalf
              </li>
              <li>
                In response to a request for information if we believe disclosure is in accordance with applicable law
              </li>
              <li>If we believe your actions are inconsistent with our user agreements or policies</li>
              <li>In connection with a merger, sale of company assets, financing, or acquisition</li>
            </ul>

            <h3 className="text-lg font-semibold mt-6 mb-3">Data Security</h3>
            <p className="text-gray-600 mb-4">
              We take reasonable measures to help protect information about you from loss, theft, misuse, unauthorized
              access, disclosure, alteration, and destruction. However, no security system is impenetrable, and we
              cannot guarantee the security of our systems.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">Your Rights</h3>
            <p className="text-gray-600 mb-4">
              Depending on your location, you may have certain rights regarding your personal information, such as:
            </p>
            <ul className="list-disc pl-5 mb-4 text-gray-600">
              <li>Access to your personal information</li>
              <li>Correction of inaccurate information</li>
              <li>Deletion of your information</li>
              <li>Restriction of processing</li>
              <li>Data portability</li>
              <li>Objection to processing</li>
            </ul>

            <h3 className="text-lg font-semibold mt-6 mb-3">Changes to this Privacy Policy</h3>
            <p className="text-gray-600 mb-4">
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new
              privacy policy on this page and updating the "Last Updated" date.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">Contact Us</h3>
            <p className="text-gray-600 mb-4">
              If you have any questions about this Privacy Policy, please contact us at privacy@fravvo.com.
            </p>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button onClick={onClose} className="bg-purple-600 hover:bg-purple-700">
            I Understand
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
