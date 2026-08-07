import React from "react";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

const Container = ({ children, className = "" }: ContainerProps): React.JSX.Element => (
  <div className={`mx-auto w-full max-w-6xl px-5 sm:px-6 lg:px-8 ${className}`}>
    {children}
  </div>
);

export default Container;
