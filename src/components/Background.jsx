import minesBackground from '../assets/images/MINES.png';

export default function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden bg-[#040814]" aria-hidden="true">
      {/* Cave background image with slight softening */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-85 transition-opacity duration-300"
        style={{ backgroundImage: `url(${minesBackground})` }}
      />
      {/* Gentle dark shading overlay to make the carved wood panels pop */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(5, 9, 20, 0.45) 0%, rgba(4, 7, 16, 0.35) 60%, rgba(3, 5, 12, 0.58) 100%)',
        }}
      />
    </div>
  );
}
