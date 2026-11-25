import minesBackground from '../assets/images/MINES.png';

export default function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden bg-[#040814]" aria-hidden="true">
      {/* Cave background image with seamless object-cover fitting on all devices */}
      <img
        src={minesBackground}
        alt=""
        className="pointer-events-none absolute inset-0 size-full object-cover object-center opacity-85 select-none"
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
