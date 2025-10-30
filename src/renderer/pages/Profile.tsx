import {
  Building2Icon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  IdCardIcon,
  ShieldCheckIcon,
  FileTextIcon,
  CalendarIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import EditProfileDialog from "../components/dialogs/EditProfileDailog";
import { Profile } from "../types/profile";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await window.api.getProfile();
        if (data) setProfile(data);
        else {
          // If no data exists, insert default one into DB for first use
          const defaultProfile: Profile = {
            id: 1,
            companyName: "",
            address: "",
            email: "",
            phone: "",
            gstin: "",
            cin: "",
            fssai: "",
            pan: "",
            dlno: "",
            dlexp: new Date(),
          };
          await window.api.saveProfile(defaultProfile);
          setProfile(defaultProfile);
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleUpdateProfile = async (updatedProfile: Profile) => {
    setProfile(updatedProfile);
    await window.api.saveProfile(updatedProfile);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500 text-lg">
        Loading profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex h-screen items-center justify-center text-red-600 text-lg">
        Failed to load profile.
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col items-center py-10 px-6">
      {/* Header */}
      <header className="w-full max-w-5xl flex items-center justify-between mb-8">
        <h1 className="text-4xl tracking-tight text-slate-800 font-bold">
          Company Profile
        </h1>
        <EditProfileDialog profile={profile} onEdit={handleUpdateProfile} />
      </header>

      {/* Divider */}
      <div className="w-full max-w-5xl border-t border-slate-300 mb-10"></div>

      {/* Card */}
      <Card className="w-full max-w-5xl border border-slate-200 shadow-sm bg-card text-card-foreground rounded-xl">
        <CardHeader className="pb-2 border-b border-slate-200">
          <CardTitle className="text-2xl font-semibold flex items-center gap-3 text-primary">
            <Building2Icon className="h-6 w-6 text-primary" />
            <span>{profile.companyName || "Your Company Name"}</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="grid md:grid-cols-2 gap-x-16 gap-y-8 p-8">
          {/* Contact Info */}
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <MapPinIcon className="h-5 w-5 text-muted-foreground mt-1" />
              <span className="leading-relaxed">{profile.address || "Company Address"}</span>
            </div>
            <div className="flex items-center gap-3">
              <MailIcon className="h-5 w-5 text-muted-foreground" />
              <span>{profile.email || "company@email.com"}</span>
            </div>
            <div className="flex items-center gap-3">
              <PhoneIcon className="h-5 w-5 text-muted-foreground" />
              <span>{profile.phone || "+91 XXXXXXXXXX"}</span>
            </div>
          </div>

          {/* Legal Info */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <IdCardIcon className="h-5 w-5 text-muted-foreground" />
              <span><strong>GSTIN:</strong> {profile.gstin || "N/A"}</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheckIcon className="h-5 w-5 text-muted-foreground" />
              <span><strong>CIN:</strong> {profile.cin || "N/A"}</span>
            </div>
            <div className="flex items-center gap-3">
              <FileTextIcon className="h-5 w-5 text-muted-foreground" />
              <span><strong>FSSAI:</strong> {profile.fssai || "N/A"}</span>
            </div>
            <div className="flex items-center gap-3">
              <IdCardIcon className="h-5 w-5 text-muted-foreground" />
              <span><strong>PAN:</strong> {profile.pan || "N/A"}</span>
            </div>
          </div>
        </CardContent>

        <div className="border-t border-slate-200 my-2"></div>

        {/* License Info */}
        <CardContent className="grid md:grid-cols-2 gap-x-16 gap-y-5 p-8">
          <div className="flex items-center gap-3">
            <FileTextIcon className="h-5 w-5 text-muted-foreground" />
            <span><strong>DL No:</strong> {profile.dlno || "N/A"}</span>
          </div>
          <div className="flex items-center gap-3">
            <CalendarIcon className="h-5 w-5 text-muted-foreground" />
            <span>
              <strong>DL Expiry:</strong>{" "}
              {profile.dlexp ? new Date(profile.dlexp).toLocaleDateString() : "N/A"}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );

}
