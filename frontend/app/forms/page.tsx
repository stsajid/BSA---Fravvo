import { MainLayout } from "@/components/layout/main-layout"
import { FormBuilder } from "@/components/drag-drop/form-builder"

export default function FormsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Form Builder</h1>
          <p className="text-muted-foreground">Create dynamic forms with drag & drop and AI assistance</p>
        </div>

        <FormBuilder />
      </div>
    </MainLayout>
  )
}
