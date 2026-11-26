import { useState, useEffect } from 'react';
import { Sliders, RotateCcw, Copy, Check, X, ChevronDown, ChevronUp, Layers, Layout, ArrowUpDown, Maximize2 } from 'lucide-react';

export const DEFAULT_CALIBRATION = {
  // Left Panel (Outer Position)
  leftTop: 6.7,
  leftBottom: 5.1,
  leftLeft: 7.3,
  leftWidth: 28.5,
  leftRadius: 9,
  leftScale: 0.98,
  leftGap: 9.5,

  // Left Inner Boxes Sizing & Gapping
  innerWidth: 100,
  gameModeH: 49,
  betInputH: 52,
  quickChipsH: 39,
  minesBarH: 48,
  cashoutH: 65,
  detailsP: 13,
  detailsRowH: 46,
  detailsRowGap: 0,

  // Right Panel (Game Board)
  rightTop: 7.7,
  rightBottom: 5.7,
  rightLeft: 42.0,
  rightWidth: 51.8,
  rightRadius: 16,

  // Navbar & Logo
  navHeight: 87,
  logoHeight: 66,

  // Stage Fit
  stageScale: 0.95,
};

const STORAGE_KEY = 'mines_ui_calibration_v4';

export function loadSavedCalibration() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CALIBRATION;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_CALIBRATION, ...parsed };
  } catch {
    return DEFAULT_CALIBRATION;
  }
}

export default function UiCalibrator({ values, onChange, onReset }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('inner'); // 'inner' | 'left' | 'right' | 'nav'
  const [minimized, setMinimized] = useState(false);

  const update = (key, val) => {
    const next = { ...values, [key]: Number(val) };
    onChange(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  };

  const resetAll = () => {
    onReset(DEFAULT_CALIBRATION);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CALIBRATION));
    } catch {}
  };

  const copyConfig = () => {
    const code = `// Calibration Settings:
left: top-[${values.leftTop}%] bottom-[${values.leftBottom}%] left-[${values.leftLeft}%] w-[${values.leftWidth}%] radius-[${values.leftRadius}px] scale-[${values.leftScale}] gap-[${values.leftGap}px]
innerBoxes: width-[${values.innerWidth}%] gameModeH-[${values.gameModeH}px] betH-[${values.betInputH}px] chipsH-[${values.quickChipsH}px] minesH-[${values.minesBarH}px] cashoutH-[${values.cashoutH}px] detailsP-[${values.detailsP}px] rowH-[${values.detailsRowH}px] rowGap-[${values.detailsRowGap}px]
right: top-[${values.rightTop}%] bottom-[${values.rightBottom}%] left-[${values.rightLeft}%] w-[${values.rightWidth}%] radius-[${values.rightRadius}px]
nav: height-[${values.navHeight}px] logo-[${values.logoHeight}px] stageScale-[${values.stageScale}]

JSON:
${JSON.stringify(values, null, 2)}`;

    navigator.clipboard?.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      {/* Floating Toggle Pill (Always accessible at bottom-right) */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-3 right-3 z-50 flex items-center gap-1.5 rounded-full border-2 border-[#ffe066] bg-[#241307]/95 px-3 py-1.5 text-xs font-black text-[#ffdb58] shadow-[0_4px_16px_rgba(0,0,0,0.85)] backdrop-blur-md transition hover:scale-105 active:scale-95"
      >
        <Sliders className="size-3.5" />
        <span>{open ? 'Close Tuner' : '🎛️ UI Tuner'}</span>
      </button>

      {/* Calibration Controller Window */}
      {open && (
        <aside
          aria-label="UI Position Calibration"
          className="fixed bottom-14 right-3 z-50 flex w-84 sm:w-[410px] flex-col rounded-2xl border-2 border-[#593214] bg-[#1a0f07]/95 text-white shadow-[0_20px_50px_rgba(0,0,0,0.95)] backdrop-blur-xl"
          style={{ maxHeight: 'calc(100vh - 80px)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#593214] px-3 py-2 bg-[#2a170a]/90 rounded-t-2xl">
            <div className="flex items-center gap-2">
              <Sliders className="size-4 text-[#ffc107]" />
              <span className="text-xs font-black tracking-wide text-[#ffea79]">
                Live Position & Size Tuner
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setMinimized((m) => !m)}
                className="grid size-6 place-items-center rounded text-[#d8c2aa] hover:bg-[#40220d] hover:text-white"
                title={minimized ? 'Expand' : 'Collapse'}
              >
                {minimized ? <ChevronDown className="size-3.5" /> : <ChevronUp className="size-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid size-6 place-items-center rounded text-[#d8c2aa] hover:bg-[#591414] hover:text-white"
                title="Close"
              >
                <X className="size-3.5" />
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              {/* Tab selector */}
              <div className="grid grid-cols-4 gap-1 border-b border-[#593214]/60 p-1.5 bg-[#201108]">
                <button
                  type="button"
                  onClick={() => setActiveTab('inner')}
                  className={`rounded-lg py-1 text-center text-[10.5px] font-black transition ${
                    activeTab === 'inner'
                      ? 'border border-[#ffe066] bg-[#3d2008] text-[#ffdb58]'
                      : 'text-[#c0a890] hover:text-white'
                  }`}
                >
                  Inner Boxes
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('left')}
                  className={`rounded-lg py-1 text-center text-[10.5px] font-black transition ${
                    activeTab === 'left'
                      ? 'border border-[#ffe066] bg-[#3d2008] text-[#ffdb58]'
                      : 'text-[#c0a890] hover:text-white'
                  }`}
                >
                  Left Panel
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('right')}
                  className={`rounded-lg py-1 text-center text-[10.5px] font-black transition ${
                    activeTab === 'right'
                      ? 'border border-[#ffe066] bg-[#3d2008] text-[#ffdb58]'
                      : 'text-[#c0a890] hover:text-white'
                  }`}
                >
                  Right Board
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('nav')}
                  className={`rounded-lg py-1 text-center text-[10.5px] font-black transition ${
                    activeTab === 'nav'
                      ? 'border border-[#ffe066] bg-[#3d2008] text-[#ffdb58]'
                      : 'text-[#c0a890] hover:text-white'
                  }`}
                >
                  Nav & Scale
                </button>
              </div>

              {/* Sliders Container (Scrollable) */}
              <div className="space-y-2 overflow-y-auto p-2.5 text-xs" style={{ maxHeight: '380px' }}>
                {activeTab === 'inner' && (
                  <>
                    <div className="mb-1 rounded bg-[#331a0a] px-2 py-1 text-[10px] font-bold text-[#ffe396]">
                      Left Box: Heights, Widths & Inner Gappings
                    </div>
                    <SliderRow
                      label="Left Boxes Width (%)"
                      val={values.innerWidth}
                      min={70}
                      max={100}
                      step={1}
                      unit="%"
                      onChange={(v) => update('innerWidth', v)}
                    />
                    <SliderRow
                      label="Items Gap (Aapas me gapping)"
                      val={values.leftGap}
                      min={0}
                      max={18}
                      step={0.5}
                      unit="px"
                      onChange={(v) => update('leftGap', v)}
                    />
                    <SliderRow
                      label="GameMode Height"
                      val={values.gameModeH}
                      min={22}
                      max={60}
                      step={1}
                      unit="px"
                      onChange={(v) => update('gameModeH', v)}
                    />
                    <SliderRow
                      label="Bet Amount Input Height"
                      val={values.betInputH}
                      min={24}
                      max={65}
                      step={1}
                      unit="px"
                      onChange={(v) => update('betInputH', v)}
                    />
                    <SliderRow
                      label="Quick Chips Height (₹10,50..)"
                      val={values.quickChipsH}
                      min={16}
                      max={46}
                      step={1}
                      unit="px"
                      onChange={(v) => update('quickChipsH', v)}
                    />
                    <SliderRow
                      label="Mines Selector Bar Height"
                      val={values.minesBarH}
                      min={24}
                      max={65}
                      step={1}
                      unit="px"
                      onChange={(v) => update('minesBarH', v)}
                    />
                    <SliderRow
                      label="Cashout / Bet Button Height"
                      val={values.cashoutH}
                      min={30}
                      max={85}
                      step={1}
                      unit="px"
                      onChange={(v) => update('cashoutH', v)}
                    />
                    <SliderRow
                      label="Game Details Padding"
                      val={values.detailsP}
                      min={2}
                      max={18}
                      step={1}
                      unit="px"
                      onChange={(v) => update('detailsP', v)}
                    />
                    <SliderRow
                      label="Game Details Row Height"
                      val={values.detailsRowH}
                      min={18}
                      max={46}
                      step={1}
                      unit="px"
                      onChange={(v) => update('detailsRowH', v)}
                    />
                    <SliderRow
                      label="Game Details Rows Gap"
                      val={values.detailsRowGap}
                      min={0}
                      max={14}
                      step={0.5}
                      unit="px"
                      onChange={(v) => update('detailsRowGap', v)}
                    />
                  </>
                )}

                {activeTab === 'left' && (
                  <>
                    <SliderRow
                      label="Left Panel: Top (%)"
                      val={values.leftTop}
                      min={0}
                      max={15}
                      step={0.1}
                      unit="%"
                      onChange={(v) => update('leftTop', v)}
                    />
                    <SliderRow
                      label="Left Panel: Bottom (%)"
                      val={values.leftBottom}
                      min={0}
                      max={15}
                      step={0.1}
                      unit="%"
                      onChange={(v) => update('leftBottom', v)}
                    />
                    <SliderRow
                      label="Left Panel: Left (%)"
                      val={values.leftLeft}
                      min={0}
                      max={20}
                      step={0.1}
                      unit="%"
                      onChange={(v) => update('leftLeft', v)}
                    />
                    <SliderRow
                      label="Left Panel: Width (%)"
                      val={values.leftWidth}
                      min={20}
                      max={38}
                      step={0.1}
                      unit="%"
                      onChange={(v) => update('leftWidth', v)}
                    />
                    <SliderRow
                      label="Left Panel: Corner Radius"
                      val={values.leftRadius}
                      min={0}
                      max={45}
                      step={1}
                      unit="px"
                      onChange={(v) => update('leftRadius', v)}
                    />
                    <SliderRow
                      label="Left Content Zoom Scale"
                      val={values.leftScale}
                      min={0.7}
                      max={1.25}
                      step={0.01}
                      unit="x"
                      onChange={(v) => update('leftScale', v)}
                    />
                  </>
                )}

                {activeTab === 'right' && (
                  <>
                    <SliderRow
                      label="Right Box: Top (%)"
                      val={values.rightTop}
                      min={0}
                      max={15}
                      step={0.1}
                      unit="%"
                      onChange={(v) => update('rightTop', v)}
                    />
                    <SliderRow
                      label="Right Box: Bottom (%)"
                      val={values.rightBottom}
                      min={0}
                      max={15}
                      step={0.1}
                      unit="%"
                      onChange={(v) => update('rightBottom', v)}
                    />
                    <SliderRow
                      label="Right Box: Left (%)"
                      val={values.rightLeft}
                      min={35}
                      max={55}
                      step={0.1}
                      unit="%"
                      onChange={(v) => update('rightLeft', v)}
                    />
                    <SliderRow
                      label="Right Box: Width (%)"
                      val={values.rightWidth}
                      min={40}
                      max={60}
                      step={0.1}
                      unit="%"
                      onChange={(v) => update('rightWidth', v)}
                    />
                    <SliderRow
                      label="Right Box: Corner Radius"
                      val={values.rightRadius}
                      min={0}
                      max={45}
                      step={1}
                      unit="px"
                      onChange={(v) => update('rightRadius', v)}
                    />
                  </>
                )}

                {activeTab === 'nav' && (
                  <>
                    <SliderRow
                      label="Navbar Height (px)"
                      val={values.navHeight}
                      min={38}
                      max={95}
                      step={1}
                      unit="px"
                      onChange={(v) => update('navHeight', v)}
                    />
                    <SliderRow
                      label="Logo Height (px)"
                      val={values.logoHeight}
                      min={30}
                      max={90}
                      step={1}
                      unit="px"
                      onChange={(v) => update('logoHeight', v)}
                    />
                    <SliderRow
                      label="Stage Scale"
                      val={values.stageScale}
                      min={0.75}
                      max={1.15}
                      step={0.01}
                      unit="x"
                      onChange={(v) => update('stageScale', v)}
                    />
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between border-t border-[#593214] p-2 bg-[#201108] rounded-b-2xl">
                <button
                  type="button"
                  onClick={resetAll}
                  className="flex items-center gap-1 rounded-lg border border-[#593214] bg-[#2d170a] px-2.5 py-1 text-[11px] font-bold text-[#e6d0ba] hover:border-[#ff9800] hover:text-white"
                >
                  <RotateCcw className="size-3" />
                  Reset Defaults
                </button>

                <button
                  type="button"
                  onClick={copyConfig}
                  className="flex items-center gap-1 rounded-lg border border-[#ffe066] bg-[#ffc107]/20 px-3 py-1 text-[11px] font-black text-[#ffdb58] hover:bg-[#ffc107]/30"
                >
                  {copied ? <Check className="size-3 text-green-400" /> : <Copy className="size-3" />}
                  <span>{copied ? 'Copied!' : 'Copy Config'}</span>
                </button>
              </div>
            </>
          )}
        </aside>
      )}
    </>
  );
}

function SliderRow({ label, val, min, max, step, unit, onChange }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-[#593214]/60 bg-[#251307] p-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[10.5px] font-bold text-[#d8c2aa]">{label}</span>
        <span className="font-mono text-[11px] font-black text-[#ffdb58]">
          {val}
          {unit}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={val}
          onChange={(e) => onChange(e.target.value)}
          className="h-1.5 flex-1 cursor-pointer appearance-none rounded-lg bg-[#40220d] accent-[#ffc107]"
        />
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={val}
          onChange={(e) => onChange(e.target.value)}
          className="w-13 rounded border border-[#593214] bg-[#140b04] px-1 py-0.5 text-center font-mono text-[10px] font-bold text-white outline-none focus:border-[#ffc107]"
        />
      </div>
    </div>
  );
}
