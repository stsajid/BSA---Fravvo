import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthLayout } from "@/components/auth/auth-layout"

export default function TermsPage() {
  return (
    <AuthLayout>
      <Card className="shadow-lg border-0 max-w-4xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">Terms of Use</CardTitle>
        </CardHeader>
        <CardContent className="p-8 pt-0">
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-4">Last updated: December 2024</p>

            <h3 className="text-lg font-semibold mt-6 mb-3">1. Acceptance of Terms</h3>
            <p className="text-gray-600 mb-4">
              By accessing and using Fravvo, you accept and agree to be bound by the terms and provision of this
              agreement.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">2. Use License</h3>
            <p className="text-gray-600 mb-4">
              Permission is granted to temporarily use Fravvo for personal, non-commercial transitory viewing only.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">3. Disclaimer</h3>
            <p className="text-gray-600 mb-4">
              The materials on Fravvo are provided on an 'as is' basis. Fravvo makes no warranties, expressed or
              implied.
            </p>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
