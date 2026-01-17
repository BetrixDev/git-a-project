import { useState } from "react";
import { useMutation } from "convex/react";
import { useUser } from "@clerk/tanstack-react-start";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

interface GenerateOptions {
  guidance?: string;
  parentGenerationId?: Id<"generations">;
  parentProjectId?: string;
  parentProjectName?: string;
  parentProjectDescription?: string;
}

export function useGenerateProjects() {
  const { user } = useUser();
  const navigate = useNavigate();
  const createGeneration = useMutation(api.projects.createGeneration);
  const retryGenerationMutation = useMutation(api.projects.retryGeneration);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const githubUsername = user?.externalAccounts?.find(
    (acc) => acc.provider === "github",
  )?.username;

  const generateProjects = async (options: GenerateOptions = {}) => {
    if (!githubUsername) {
      toast.error("GitHub account not connected");
      return null;
    }

    if (isGenerating) {
      return null;
    }

    setIsGenerating(true);

    try {
      const generationId = await createGeneration({
        githubUsername,
        guidance: options.guidance?.trim() || undefined,
        parentGenerationId: options.parentGenerationId,
        parentProjectId: options.parentProjectId,
        parentProjectName: options.parentProjectName,
        parentProjectDescription: options.parentProjectDescription,
      });

      navigate({
        to: "/projectIdeas",
        search: { generationId },
      });

      toast.success("Generation started", {
        description: "Your project ideas are being generated",
      });

      return generationId;
    } catch (error) {
      console.error("Failed to create generation:", error);
      toast.error("Failed to start generation", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const retryGeneration = async (generationId: Id<"generations">) => {
    if (!githubUsername) {
      toast.error("GitHub account not connected");
      return;
    }

    if (isRetrying) {
      return;
    }

    setIsRetrying(true);

    try {
      await retryGenerationMutation({
        generationId,
        githubUsername,
      });

      toast.success("Retrying generation", {
        description: "Your project ideas are being regenerated",
      });
    } catch (error) {
      console.error("Failed to retry generation:", error);
      toast.error("Failed to retry generation", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    } finally {
      setIsRetrying(false);
    }
  };

  return {
    generateProjects,
    retryGeneration,
    isGenerating,
    isRetrying,
    canGenerate: !!githubUsername,
    githubUsername,
  };
}
