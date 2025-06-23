"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload } from "lucide-react" // Import Check icon
import Link from "next/link"

// Complete world countries list
const WORLD_COUNTRIES = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahrain",
  "Bangladesh",
  "Belarus",
  "Belgium",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Brazil",
  "Bulgaria",
  "Cambodia",
  "Canada",
  "Chile",
  "China",
  "Colombia",
  "Croatia",
  "Czech Republic",
  "Denmark",
  "Ecuador",
  "Egypt",
  "Estonia",
  "Ethiopia",
  "Finland",
  "France",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kuwait",
  "Latvia",
  "Lebanon",
  "Lithuania",
  "Luxembourg",
  "Malaysia",
  "Mexico",
  "Morocco",
  "Netherlands",
  "New Zealand",
  "Nigeria",
  "Norway",
  "Pakistan",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Saudi Arabia",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "South Africa",
  "South Korea",
  "Spain",
  "Sri Lanka",
  "Sweden",
  "Switzerland",
  "Thailand",
  "Turkey",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Venezuela",
  "Vietnam",
]

// Available timezones
const AVAILABLE_TIMEZONES = [
  "Eastern Time - ET",
  "Central Time - CT",
  "Mountain Time - MT",
  "Pacific Time - PT",
  "Greenwich Mean Time - GMT",
  "Central European Time - CET",
  "Eastern European Time - EET",
  "India Standard Time - IST",
  "Pakistan Standard Time - PKT",
  "Bangladesh Standard Time - BST",
  "Sri Lanka Standard Time - SLST",
  "China Standard Time - CST",
  "Japan Standard Time - JST",
  "Korea Standard Time - KST",
  "Indochina Time - ICT",
  "Malaysia Time - MYT",
  "Singapore Standard Time - SGT",
  "Philippine Standard Time - PST",
  "Western Indonesia Time - WIB",
  "Australian Eastern Standard Time - AEST",
  "New Zealand Standard Time - NZST",
  "Brasília Time - BRT",
  "Argentina Time - ART",
  "Chile Standard Time - CLT",
  "Peru Time - PET",
  "Colombia Time - COT",
  "Venezuela Time - VET",
  "Ecuador Time - ECT",
  "Bolivia Time - BOT",
  "Uruguay Standard Time - UYT",
  "Iran Standard Time - IRST",
  "Arabia Standard Time - AST",
  "Gulf Standard Time - GST",
  "Armenia Time - AMT",
  "Azerbaijan Time - AZT",
  "Georgia Standard Time - GET",
  "Almaty Time - ALMT",
  "Western European Time - WET",
  "Turkey Time - TRT",
  "Israel Standard Time - IST",
  "South Africa Standard Time - SAST",
  "West Africa Time - WAT",
  "East Africa Time - EAT",
  "Moscow Standard Time - MSK",
  "Afghanistan Time - AFT",
  "Coordinated Universal Time - UTC",
]

// Timezone mapping function
const getTimezoneByCountry = (country: string): string => {
  const timezoneMap: { [key: string]: string } = {
    "United States": "Eastern Time - ET",
    Canada: "Eastern Time - ET",
    "United Kingdom": "Greenwich Mean Time - GMT",
    Germany: "Central European Time - CET",
    France: "Central European Time - CET",
    Spain: "Central European Time - CET",
    Italy: "Central European Time - CET",
    Netherlands: "Central European Time - CET",
    Switzerland: "Central European Time - CET",
    Austria: "Central European Time - CET",
    Belgium: "Central European Time - CET",
    Poland: "Central European Time - CET",
    "Czech Republic": "Central European Time - CET",
    Slovakia: "Central European Time - CET",
    Hungary: "Central European Time - CET",
    Croatia: "Central European Time - CET",
    Slovenia: "Central European Time - CET",
    Estonia: "Eastern European Time - EET",
    Latvia: "Eastern European Time - EET",
    Lithuania: "Eastern European Time - EET",
    Finland: "Eastern European Time - EET",
    Romania: "Eastern European Time - EET",
    Bulgaria: "Eastern European Time - EET",
    Greece: "Eastern European Time - EET",
    Russia: "Moscow Standard Time - MSK",
    Ukraine: "Eastern European Time - EET",
    Belarus: "Moscow Standard Time - MSK",
    Turkey: "Turkey Time - TRT",
    Israel: "Israel Standard Time - IST",
    Egypt: "Eastern European Time - EET",
    "South Africa": "South Africa Standard Time - SAST",
    Nigeria: "West Africa Time - WAT",
    Kenya: "East Africa Time - EAT",
    Ethiopia: "East Africa Time - EAT",
    Ghana: "Greenwich Mean Time - GMT",
    Morocco: "Western European Time - WET",
    Algeria: "Central European Time - CET",
    India: "India Standard Time - IST",
    Pakistan: "Pakistan Standard Time - PKT",
    Bangladesh: "Bangladesh Standard Time - BST",
    "Sri Lanka": "Sri Lanka Standard Time - SLST",
    China: "China Standard Time - CST",
    Japan: "Japan Standard Time - JST",
    "South Korea": "Korea Standard Time - KST",
    Thailand: "Indochina Time - ICT",
    Vietnam: "Indochina Time - ICT",
    Cambodia: "Indochina Time - ICT",
    Malaysia: "Malaysia Time - MYT",
    Singapore: "Singapore Standard Time - SGT",
    Philippines: "Philippine Standard Time - PST",
    Indonesia: "Western Indonesia Time - WIB",
    Australia: "Australian Eastern Standard Time - AEST",
    "New Zealand": "New Zealand Standard Time - NZST",
    Brazil: "Brasília Time - BRT",
    Argentina: "Argentina Time - ART",
    Chile: "Chile Standard Time - CLT",
    Peru: "Peru Time - PET",
    Colombia: "Colombia Time - COT",
    Venezuela: "Venezuela Time - VET",
    Ecuador: "Ecuador Time - ECT",
    Bolivia: "Bolivia Time - BOT",
    Uruguay: "Uruguay Standard Time - UYT",
    Mexico: "Central Time - CT",
    Iran: "Iran Standard Time - IRST",
    Iraq: "Arabia Standard Time - AST",
    "Saudi Arabia": "Arabia Standard Time - AST",
    "United Arab Emirates": "Gulf Standard Time - GST",
    Qatar: "Arabia Standard Time - AST",
    Kuwait: "Arabia Standard Time - AST",
    Bahrain: "Arabia Standard Time - AST",
    Jordan: "Eastern European Time - EET",
    Lebanon: "Eastern European Time - EET",
    Armenia: "Armenia Time - AMT",
    Azerbaijan: "Azerbaijan Time - AZT",
    Georgia: "Georgia Standard Time - GET",
    Kazakhstan: "Almaty Time - ALMT",
    Norway: "Central European Time - CET",
    Sweden: "Central European Time - CET",
    Denmark: "Central European Time - CET",
    Iceland: "Greenwich Mean Time - GMT",
    Ireland: "Greenwich Mean Time - GMT",
    Portugal: "Western European Time - WET",
    Luxembourg: "Central European Time - CET",
    "Bosnia and Herzegovina": "Central European Time - CET",
    Albania: "Central European Time - CET",
    Afghanistan: "Afghanistan Time - AFT",
  }

  return timezoneMap[country] || "Coordinated Universal Time - UTC"
}

export default function OnboardingPage() {
  const [formData, setFormData] = useState({
    organizationName: "",
    organizationLogo: null as File | null,
    location: "",
    timeZone: "",
    language: "",
    agreedToTerms: false,
  })
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if email is verified
    const isVerified = localStorage.getItem("email_verified") === "true"
    const verifiedEmail = localStorage.getItem("verified_email")

    if (!isVerified || !verifiedEmail) {
      router.push("/signup")
    }
  }, [router])

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.size <= 5 * 1024 * 1024) {
      // 5MB limit
      setFormData((prev) => ({ ...prev, organizationLogo: file }))
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Handle location change and auto-set timezone
  const handleLocationChange = (country: string) => {
    const timezone = getTimezoneByCountry(country)
    setFormData((prev) => ({
      ...prev,
      location: country,
      timeZone: timezone,
    }))
  }

  const isFormValid = () => {
    return (
      formData.organizationName.trim() !== "" &&
      formData.location !== "" &&
      formData.timeZone !== "" &&
      formData.language !== "" &&
      formData.agreedToTerms
    )
  }

  const handleContinue = () => {
    if (isFormValid()) {
      // Save onboarding data and proceed to next step
      localStorage.setItem("onboarding_step_1", JSON.stringify(formData))
      router.push("/onboarding/step-2")
    }
  }

  return (
    <div className="grid grid-cols-12 h-screen overflow-hidden">
      {/* Left Form Section */}
      <div className="col-span-12 lg:col-span-7 h-screen overflow-hidden">
        {/* Fixed Header */}
        <div className="bg-white px-8 pt-6 pb-4 border-b border-gray-100">
          {/* Fravvo Logo */}
          <div className="flex items-center gap-3 mb-6">
            <Image src="/fravvo_logo.svg" alt="Fravvo Logo" width={100} height={45} className="max-h-[45px] w-auto" />
            {/* Removed Fravvo text */}
          </div>

          {/* Step Indicators */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              {/* Step 1: Active */}
              <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
              {/* Step 2-5: Inactive */}
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Organization Setup</h1>
            <p className="text-muted-foreground text-sm">Step 1 of 5: Setup your Organization</p>
          </div>
        </div>

        {/* Scrollable Form Section */}
        <div className="h-[calc(100vh-200px)] overflow-y-scroll no-scrollbar px-4 py-6">
          <div className="max-w-lg mx-auto px-4">
            {/* Form Fields */}
            <div className="space-y-5">
              {/* Organization Name */}
              <div>
                <Label htmlFor="orgName" className="text-sm font-medium text-gray-900 mb-2 block">
                  Organization
                </Label>
                <Input
                  id="orgName"
                  value={formData.organizationName}
                  onChange={(e) => updateFormData("organizationName", e.target.value)}
                  placeholder="Enter organization name"
                  className="w-full h-10 text-sm border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              {/* Organization Logo */}
              <div>
                <Label className="text-sm font-medium text-gray-900 mb-2 block">Organization Logo (optional)</Label>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {logoPreview ? (
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
                        <img
                          src={logoPreview || "/placeholder.svg"}
                          alt="Logo preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white font-bold text-base">F</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      id="logo-upload"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
                    >
                      <Upload className="w-3 h-3" />
                      Choose image
                    </label>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG upto 5 MB</p>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div>
                <Label className="text-sm font-medium text-gray-900 mb-2 block">Location</Label>
                <Select value={formData.location} onValueChange={handleLocationChange}>
                  <SelectTrigger className="w-full h-10 border-gray-300 focus:border-purple-500 text-sm">
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {WORLD_COUNTRIES.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Time Zone - Auto-populated */}
              <div>
                <Label className="text-sm font-medium text-gray-900 mb-2 block">Time Zone</Label>
                <Select value={formData.timeZone} onValueChange={(value) => updateFormData("timeZone", value)}>
                  <SelectTrigger className="w-full h-10 border-gray-300 focus:border-purple-500 text-sm">
                    <SelectValue placeholder="Auto-filled based on location" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {AVAILABLE_TIMEZONES.map((timezone) => (
                      <SelectItem key={timezone} value={timezone}>
                        {timezone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Language */}
              <div>
                <Label className="text-sm font-medium text-gray-900 mb-2 block">Language</Label>
                <Select value={formData.language} onValueChange={(value) => updateFormData("language", value)}>
                  <SelectTrigger className="w-full h-10 border-gray-300 focus:border-purple-500 text-sm">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                    <SelectItem value="japanese">Japanese</SelectItem>
                    <SelectItem value="chinese">Chinese</SelectItem>
                    <SelectItem value="portuguese">Portuguese</SelectItem>
                    <SelectItem value="arabic">Arabic</SelectItem>
                    <SelectItem value="russian">Russian</SelectItem>
                    <SelectItem value="italian">Italian</SelectItem>
                    <SelectItem value="dutch">Dutch</SelectItem>
                    <SelectItem value="korean">Korean</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start gap-3 pt-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreedToTerms}
                  onCheckedChange={(checked) => updateFormData("agreedToTerms", checked as boolean)}
                  className="mt-0.5 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                />
                <label htmlFor="terms" className="text-xs text-gray-600 leading-relaxed">
                  I agree to Fravvo's{" "}
                  <Link href="/terms" className="text-purple-600 hover:text-purple-700 underline">
                    Terms of Use
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-purple-600 hover:text-purple-700 underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Continue Button */}
              <div className="pt-4">
                <Button
                  onClick={handleContinue}
                  disabled={!isFormValid()}
                  className="w-full h-10 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium text-sm rounded-lg"
                >
                  Continue
                </Button>
              </div>

              {/* Footer */}
              <div className="text-center pt-6 pb-4">
                <p className="text-xs text-gray-500">
                  © 2025, Fravvo.{" "}
                  <Link href="/terms" className="text-purple-600 hover:text-purple-700 underline">
                    Terms of Use
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-purple-600 hover:text-purple-700 underline">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Image Section */}
      <div className="hidden lg:block col-span-5">
        <div className="h-screen bg-[url('/onboarding-hero.jpg')] bg-no-repeat bg-cover bg-center bg-right"></div>
      </div>
    </div>
  )
}
