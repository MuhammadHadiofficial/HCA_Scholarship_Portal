"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { getActiveGuidelines, getActivePolicies } from "@/lib/content-actions";

export default function GuidelinesPage() {
  const [guidelines, setGuidelines] = useState<any[]>([]);
  const [policies, setPolicies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [guidelinesResult, policiesResult] = await Promise.all([
          getActiveGuidelines(),
          getActivePolicies(),
        ]);

        if (guidelinesResult.guidelines) {
          setGuidelines(guidelinesResult.guidelines);
        }
        if (policiesResult.policies) {
          setPolicies(policiesResult.policies);
        }
      } catch (error) {
        console.error("Error loading guidelines:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading guidelines...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Guidelines & Policies
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Current scholarship guidelines and policies for HCA Scholarship Portal
          </p>
        </div>

        <div className="grid gap-6">
          {/* Guidelines */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Scholarship Guidelines
            </h2>
            {guidelines.map((guideline) => (
              <Card key={guideline.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{guideline.title}</CardTitle>
                      <CardDescription>
                        Version {guideline.version} • Published by {guideline.publisher.name}
                      </CardDescription>
                    </div>
                    <Badge variant="outline">
                      {new Date(guideline.publishedAt).toLocaleDateString()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: guideline.content.replace(/\n/g, "<br />"),
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Policies */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Policies
            </h2>
            {policies.map((policy) => (
              <Card key={policy.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{policy.title}</CardTitle>
                      <CardDescription>
                        Version {policy.version} • Published by {policy.publisher.name}
                      </CardDescription>
                    </div>
                    <Badge variant="outline">
                      {new Date(policy.publishedAt).toLocaleDateString()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: policy.content.replace(/\n/g, "<br />"),
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
              <CardDescription>
                Contact the scholarship office for questions about guidelines and policies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Email:</strong> scholarships@hca.edu
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Phone:</strong> +1 (555) 123-4567
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Office Hours:</strong> Monday - Friday, 9:00 AM - 5:00 PM
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

