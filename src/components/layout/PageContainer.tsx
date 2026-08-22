import React from "react";

type PageContainerProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  withBottomNav?: boolean;
  flex?: boolean;
  center?: boolean;
};

const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className = "",
  style,
  withBottomNav = false,
  flex = false,
  center = false,
}) => {
  const layoutClass = [
    "min-h-screen",
    flex ? "flex flex-col" : "",
    center ? "items-center justify-center" : "",
    withBottomNav ? "pb-20" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={layoutClass} style={{ background: "var(--app-bg)", color: "var(--app-ink)", ...style }}>
      {children}
    </div>
  );
};

export default PageContainer;
