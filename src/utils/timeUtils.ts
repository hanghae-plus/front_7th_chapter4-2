import { 분 } from "../constants.ts";
import { parseHnM } from "../utils.ts";

/**
 * 시간표에 표시할 시간 슬롯 목록을 생성합니다.
 */
export const generateTimeSlots = (): readonly string[] => {
  return [
    ...Array(18)
      .fill(0)
      .map((v, k) => v + k * 30 * 분)
      .map((v) => `${parseHnM(v)}~${parseHnM(v + 30 * 분)}`),

    ...Array(6)
      .fill(18 * 30 * 분)
      .map((v, k) => v + k * 55 * 분)
      .map((v) => `${parseHnM(v)}~${parseHnM(v + 50 * 분)}`),
  ] as const;
};
