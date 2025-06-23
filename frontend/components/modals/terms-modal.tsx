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

interface TermsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function TermsModal({ isOpen, onClose }: TermsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Terms of Use</DialogTitle>
          <DialogDescription>Last updated: December 2024</DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          <div className="prose prose-gray max-w-none">
            <h3 className="text-lg font-semibold mt-6 mb-3">1. Acceptance of Terms</h3>
            <p className="text-gray-600 mb-4">
              By accessing and using Fravvo, you accept and agree to be bound by the terms and provision of this
              agreement. If you do not agree to abide by the above, please do not use this service.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">2. Use License</h3>
            <p className="text-gray-600 mb-4">
              Permission is granted to temporarily use Fravvo for personal, non-commercial transitory viewing only. This
              is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-5 mb-4 text-gray-600">
              <li>modify or copy the materials;</li>
              <li>use the materials for any commercial purpose;</li>
              <li>attempt to decompile or reverse engineer any software contained on Fravvo;</li>
              <li>remove any copyright or other proprietary notations from the materials; or</li>
              <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
            </ul>

            <h3 className="text-lg font-semibold mt-6 mb-3">3. Disclaimer</h3>
            <p className="text-gray-600 mb-4">
              The materials on Fravvo are provided on an 'as is' basis. Fravvo makes no warranties, expressed or
              implied, and hereby disclaims and negates all other warranties including, without limitation, implied
              warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of
              intellectual property or other violation of rights.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">4. Limitations</h3>
            <p className="text-gray-600 mb-4">
              In no event shall Fravvo or its suppliers be liable for any damages (including, without limitation,
              damages for loss of data or profit, or due to business interruption) arising out of the use or inability
              to use Fravvo, even if Fravvo or a Fravvo authorized representative has been notified orally or in writing
              of the possibility of such damage.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">5. Revisions and Errata</h3>
            <p className="text-gray-600 mb-4">
              The materials appearing on Fravvo could include technical, typographical, or photographic errors. Fravvo
              does not warrant that any of the materials on its website are accurate, complete or current. Fravvo may
              make changes to the materials contained on its website at any time without notice.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">6. Links</h3>
            <p className="text-gray-600 mb-4">
              Fravvo has not reviewed all of the sites linked to its website and is not responsible for the contents of
              any such linked site. The inclusion of any link does not imply endorsement by Fravvo of the site. Use of
              any such linked website is at the user's own risk.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">7. Site Terms of Use Modifications</h3>
            <p className="text-gray-600 mb-4">
              Fravvo may revise these terms of use for its website at any time without notice. By using this website you
              are agreeing to be bound by the then current version of these Terms and Conditions of Use.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">8. Governing Law</h3>
            <p className="text-gray-600 mb-4">
              Any claim relating to Fravvo shall be governed by the laws of the country of registration without regard
              to its conflict of law provisions.
            </p>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button onClick={onClose} className="bg-purple-600 hover:bg-purple-700">
            I Agree
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
