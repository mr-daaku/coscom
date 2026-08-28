export default function AuroraBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
      {/* Dynamic Aurora Ambient Blobs */}
      <div className="absolute -top-[15%] left-[10%] size-[550px] sm:size-[700px] rounded-full bg-primary/18 blur-[140px] animate-pulse duration-1000" />
      <div className="absolute top-[25%] -right-[10%] size-[450px] sm:size-[600px] rounded-full bg-cyan-500/14 blur-[130px]" />
      <div className="absolute bottom-[10%] left-[20%] size-[500px] sm:size-[650px] rounded-full bg-emerald-500/12 blur-[140px]" />
      <div className="absolute top-[45%] left-[40%] size-[350px] rounded-full bg-amber-500/10 blur-[120px]" />

      {/* Cyber Subtle Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      {/* Radial Vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#060813]/60 to-[#060813]" />
    </div>
  );
}
