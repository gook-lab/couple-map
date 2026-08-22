import React from "react";
import { H3, Meta } from "@/components/ui/typography";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action, actionLabel, onAction }) => {
  const label = actionLabel || action?.label;
  const handler = onAction || action?.onClick;

  return (
    <div className="text-center py-10 px-6">
      <div className="mb-4 flex justify-center text-5xl opacity-50">{icon}</div>
      <H3 className="mb-1">{title}</H3>
      <Meta className="block mb-5">{description}</Meta>
      {label && handler && (
        <button
          onClick={handler}
          className="px-6 py-2.5 rounded-full text-[15px] font-semibold"
          style={{ background: "rgb(var(--accent-070))", color: "var(--app-ink-on-accent)" }}
        >
          {label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
