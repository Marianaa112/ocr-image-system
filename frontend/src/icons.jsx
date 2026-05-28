export const Icon = ({ d, size = 14, fill = "none", stroke = "currentColor", strokeWidth = 1.5, viewBox = "0 0 24 24", children }) => (
  <svg width={size} height={size} viewBox={viewBox} fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    {d ? <path d={d} /> : children}
  </svg>
);

export const IconFile = (p) => <Icon {...p} d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z M14 3v5h5 M9 13h6 M9 17h4" />;
export const IconPlus = (p) => <Icon {...p} d="M12 5v14 M5 12h14" />;
export const IconSettings = (p) => <Icon {...p} d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />;
export const IconUpload = (p) => <Icon {...p} d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12" />;
export const IconCamera = (p) => <Icon {...p} d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />;
export const IconSearch = (p) => <Icon {...p} d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M21 21l-4.35-4.35" />;
export const IconCheck = (p) => <Icon {...p} d="M20 6 9 17l-5-5" />;
export const IconX = (p) => <Icon {...p} d="M18 6 6 18 M6 6l12 12" />;
export const IconEye = (p) => <Icon {...p} d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />;
export const IconDownload = (p) => <Icon {...p} d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3" />;
export const IconMail = (p) => <Icon {...p} d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6 12 13 2 6" />;
export const IconTrash = (p) => <Icon {...p} d="M3 6h18 M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />;
export const IconDots = (p) => <Icon {...p} d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z M19 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z M5 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />;
export const IconLock = (p) => <Icon {...p} d="M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z M7 11V7a5 5 0 0 1 10 0v4" />;
export const IconSparkle = (p) => <Icon {...p} d="M12 3l1.9 5.2L19 10l-5.1 1.8L12 17l-1.9-5.2L5 10l5.1-1.8z" />;
export const IconArrowRight = (p) => <Icon {...p} d="M5 12h14 M12 5l7 7-7 7" />;
export const IconArrowLeft = (p) => (<Icon {...p} d="M19 12H5 M12 19l-7-7 7-7" />);
export const IconRefresh = (p) => <Icon {...p} d="M3 12a9 9 0 0 1 15-6.7L21 8 M21 3v5h-5 M21 12a9 9 0 0 1-15 6.7L3 16 M3 21v-5h5" />;
export const IconShield = (p) => <Icon {...p} d="M12 2 4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5z" />;
export const IconBuilding = (p) => <Icon {...p} d="M3 21h18 M6 21V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v14 M10 9h.01 M14 9h.01 M10 13h.01 M14 13h.01 M10 17h.01 M14 17h.01" />;
export const IconReceipt = (p) => <Icon {...p} d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-3-2-2 2-2-2-2 2-2-2-3 2z M9 7h6 M9 11h6 M9 15h4" />;
export const IconUser = (p) => <Icon {...p} d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />;

const FakeQR = ({ size = 120 }) => {
  const cells = 21;
  const seed = "010110100110101011010";
  const grid = [];
  for (let y = 0; y < cells; y++) {
    for (let x = 0; x < cells; x++) {
      const v = ((x * 13 + y * 7 + seed.charCodeAt((x + y) % seed.length)) % 3) === 0;
      if (v) grid.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#1a1a1a" />);
    }
  }
  const finder = (cx, cy) => (
    <g key={`f-${cx}-${cy}`}>
      <rect x={cx} y={cy} width="7" height="7" fill="#1a1a1a" />
      <rect x={cx+1} y={cy+1} width="5" height="5" fill="#fff" />
      <rect x={cx+2} y={cy+2} width="3" height="3" fill="#1a1a1a" />
    </g>
  );
  return (
    <svg viewBox="0 0 21 21" width={size} height={size} shapeRendering="crispEdges">
      <rect width="21" height="21" fill="#fff" />
      {grid}
      {finder(0,0)}{finder(14,0)}{finder(0,14)}
    </svg>
  );
};