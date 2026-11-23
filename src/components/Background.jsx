import minesBackground from '../assets/images/MINES.png';

export default function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      {/* High clarity cave background matching user reference image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${minesBackground})` }}
      />
      {/* Vignette keeping lantern on left and tunnel on right bright, with soft contrast in center */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(5, 10, 22, 0.42) 0%, rgba(4, 8, 18, 0.65) 75%, rgba(2, 4, 10, 0.88) 100%)',
        }}
      />
    </div>
  );
}
