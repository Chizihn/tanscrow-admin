"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GET_SYSTEMN_CONFIGS, UPDATE_SYSTEM_CONFIG } from "@/graphql/admin";

interface SystemConfig {
  id: string;
  key: string;
  value: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export default function SettingsPage() {
  const [configs, setConfigs] = useState<SystemConfig[]>([]);
  const [editingConfig, setEditingConfig] = useState<SystemConfig | null>(null);

  const { data, loading, error } = useQuery<{
    getSystemConfigs: SystemConfig[];
  }>(GET_SYSTEMN_CONFIGS);

  const [updateSystemConfig, { loading: updating }] = useMutation(
    UPDATE_SYSTEM_CONFIG,
    {
      onCompleted: () => {
        toast.success("System configuration updated successfully");
        setEditingConfig(null);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  useEffect(() => {
    if (data?.getSystemConfigs) {
      setConfigs(data.getSystemConfigs);
    }
  }, [data]);

  const handleUpdateConfig = () => {
    if (!editingConfig) return;

    updateSystemConfig({
      variables: {
        input: {
          key: editingConfig.key,
          value: editingConfig.value,
          description: editingConfig.description,
        },
      },
    });
  };

  const handleEditConfig = (config: SystemConfig) => {
    setEditingConfig(config);
  };

  const handleCancelEdit = () => {
    setEditingConfig(null);
  };

  const handleInputChange = (field: keyof SystemConfig, value: string) => {
    if (!editingConfig) return;
    setEditingConfig({
      ...editingConfig,
      [field]: value,
    });
  };

  // Group configs by category (assuming key format is CATEGORY_NAME)
  const groupedConfigs = configs.reduce((acc, config) => {
    const category = config.key.split("_")[0] || "General";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(config);
    return acc;
  }, {} as Record<string, SystemConfig[]>);

  const categories = Object.keys(groupedConfigs);

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-500">
          Error loading system settings: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">System Settings</h1>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : (
        <>
          {editingConfig ? (
            <Card>
              <CardHeader>
                <CardTitle>Edit Configuration: {editingConfig.key}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Key</label>
                    <Input
                      value={editingConfig.key}
                      onChange={(e) => handleInputChange("key", e.target.value)}
                      disabled
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Value</label>
                    <Input
                      value={editingConfig.value}
                      onChange={(e) =>
                        handleInputChange("value", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={editingConfig.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      rows={3}
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button onClick={handleUpdateConfig} disabled={updating}>
                      {updating ? "Updating..." : "Update"}
                    </Button>
                    <Button variant="outline" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue={categories[0] || "General"}>
              <TabsList className="mb-4">
                {categories.map((category) => (
                  <TabsTrigger key={category} value={category}>
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>

              {categories.map((category) => (
                <TabsContent key={category} value={category}>
                  <Card>
                    <CardHeader>
                      <CardTitle>{category} Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {groupedConfigs[category].map((config) => (
                          <div
                            key={config.id}
                            className="flex items-center justify-between p-4 border rounded-lg"
                          >
                            <div>
                              <h3 className="font-medium">{config.key}</h3>
                              <p className="text-sm text-muted-foreground">
                                {config.description}
                              </p>
                              <p className="text-sm mt-1">
                                Value:{" "}
                                <span className="font-mono">
                                  {config.value}
                                </span>
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              onClick={() => handleEditConfig(config)}
                            >
                              Edit
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </>
      )}
    </div>
  );
}
