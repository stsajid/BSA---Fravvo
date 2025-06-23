import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthLayout } from "@/components/auth/auth-layout"

export default function PrivacyPage() {
  return (
    <AuthLayout>
      <Card className="shadow-lg border-0 max-w-4xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="p-8 pt-0">
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-4">Last updated: December 2024</p>

            <h3 className="text-lg font-semibold mt-6 mb-3">Information We Collect</h3>
            <p className="text-gray-600 mb-4">
              We collect information you provide directly to us, such as when you create an account, use our services,
              or contact us.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">How We Use Your Information</h3>
            <p className="text-gray-600 mb-4">
              We use the information we collect to provide, maintain, and improve our services.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">Information Sharing</h3>
            <p className="text-gray-600 mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your
              consent.
            </p>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
