import minesBackground from '../assets/images/MINES.png';

export default function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      {/* High-visibility crisp cave background matching user reference */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-300"
        style={{ backgroundImage: `url(${minesBackground})` }}
      />
      {/* Minimal subtle center gradient for card contrast, keeping lantern, crystal cart, tunnel & crystals bright and vibrant */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(4, 8, 18, 0.3) 0%, rgba(4, 8, 18, 0.12) 60%, transparent 100%)',
        }}
      />
    </div>
  );
}
