"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@supabase/supabase-js";
import { Loader2, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

interface PayoutProviderData {
  user_id: string;
  organization_name?: string | null;
  network_type?: string | null;
  email?: string | null;
  created_at?: Date;
  updated_at?: Date;
}

export function PayoutProviderProfile() {
  const [formData, setFormData] = useState<PayoutProviderData>({
    user_id: "",
    organization_name: "",
    network_type: "",
    email: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState<PayoutProviderData | null>(
    null,
  );

  const NETWORK_TYPES = [
    { value: "bank", label: "Bank Transfer" },
    { value: "paypal", label: "PayPal" },
    { value: "stripe", label: "Stripe" },
    { value: "crypto", label: "Crypto" },
    { value: "other", label: "Other" },
  ] as const;

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: userData, error: userError } =
        await supabaseClient.auth.getUser();

      if (userError) {
        console.error("❌ User error:", userError);
        throw userError;
      }

      const userId = userData.user?.id;

      if (!userId) {
        toast.error("Please log in to view your profile");
        setIsLoading(false);
        return;
      }

      const { data: profileData, error: profileError } = await supabaseClient
        .from("payout_provider")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        console.error("❌ Profile fetch error:", profileError);
        throw profileError;
      }

      if (profileData) {
        setFormData(profileData);
        setOriginalData(profileData);
      } else {
        setFormData((prev) => ({ ...prev, user_id: userId }));
      }
    } catch (error) {
      console.error("💥 Error in fetchProfile:", error);
      toast.error(
        `Failed to load profile: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof PayoutProviderData,
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.organization_name?.trim()) {
      toast.error("Organization name is required.");
      return false;
    }

    if (!formData.email?.trim()) {
      toast.error("Email is required.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }

    if (!formData.network_type?.trim()) {
      toast.error("Network type is required.");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const updateData = {
        user_id: formData.user_id,
        organization_name: formData.organization_name,
        network_type: formData.network_type,
        email: formData.email,
        updated_at: new Date().toISOString(),
      };

      let result: { error: any } | { data: any; error: null };
      if (originalData) {
        result = await supabaseClient
          .from("payout_provider")
          .update(updateData)
          .eq("user_id", formData.user_id);
      } else {
        result = await supabaseClient
          .from("payout_provider")
          .insert([{ ...updateData, created_at: new Date().toISOString() }]);
      }

      if (result.error) {
        console.error("❌ Save error:", result.error);
        throw result.error;
      }

      setIsEditing(false);
      setOriginalData(formData);

      toast.success(
        "Your payout provider profile has been saved successfully.",
      );

      // Refresh data
      await fetchProfile();
    } catch (error) {
      console.error("💥 Error saving profile:", error);
      toast.error(
        `Save failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (originalData) {
      setFormData(originalData);
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="ml-2">Loading profile...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Payout Provider Profile
            {!isEditing && (
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="ml-auto"
              >
                Edit Profile
              </Button>
            )}
          </CardTitle>
          <CardDescription>
            Manage your payout provider information and settings.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="organization_name">Organization Name *</Label>
              <Input
                id="organization_name"
                value={formData.organization_name || ""}
                onChange={(e) =>
                  handleInputChange("organization_name", e.target.value)
                }
                placeholder="Enter organization name"
                disabled={!isEditing}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter email address"
                disabled={!isEditing}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="network_type">Network Type *</Label>
              <Select
                value={formData.network_type || ""}
                onValueChange={(value) =>
                  handleInputChange("network_type", value)
                }
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select network type" />
                </SelectTrigger>
                <SelectContent>
                  {NETWORK_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>

        {isEditing && (
          <CardFooter className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
