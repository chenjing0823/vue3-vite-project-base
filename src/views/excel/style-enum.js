// 抛出多个枚举 距离枚举 字体枚举 对齐枚举
const HORIZONTAL = {
  1: 'left',
  2: 'center',
  3: 'right'
}
const VERTICAL = {
  1: 'top',
  2: 'middle',
  3: 'bottom'
}
// 0: NONE, 1: THIN, 2: HAIR, 3: DOTTED, 4: DASHED, 5: DASH_DOT, 6: DASH_DOT_DOT, 7: DOUBLE, 8: MEDIUM, 9: MEDIUM_DASHED, 10: MEDIUM_DASH_DOT, 11: MEDIUM_DASH_DOT_DOT, 12: SLANT_DASH_DOT, 13: THICK'
// 枚举 BORDERSTYLE，值小写
const BORDERSTYLE = {
  0: 'none',
  1: 'thin',
  2: 'hair',
  3: 'dotted',
  4: 'dashed',
  5: 'dashDot',
  6: 'dashDotDot',
  7: 'double',
  8: 'medium',
  9: 'mediumDashed',
  10: 'mediumDashDot',
  11: 'mediumDashDotDot',
  12: 'slantDashDot',
  13: 'thick'
}

const WRAP = {
  0: 'unspecified',
  1: 'overflow',
  2: 'clip',
  3: 'wrap'
}

export default {
  HORIZONTAL,
  VERTICAL,
  BORDERSTYLE,
  WRAP
}
