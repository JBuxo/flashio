interface BrandedTextProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: string;
  children: React.ReactNode;
}

export default function BrandedText({
  children,
  color,
  className = "",
  ...props
}: BrandedTextProps) {
  return (
    <div className={`relative ${className}`} {...props}>
      <span
        className={`absolute inset-0 ${color ?? ""} font-londrina-solid`}
        style={{ WebkitTextStroke: "0 transparent" }}
      >
        {children}
      </span>
      <span className={`relative ${color ?? ""} font-londrina-shadow`}>
        {children}
      </span>
    </div>
  );
}
