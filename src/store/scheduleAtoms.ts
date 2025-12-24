import { atom, PrimitiveAtom } from 'jotai';
import { Schedule } from '../types';
import dummyScheduleMap from '../dummyScheduleMap';

// 전체 테이블 ID 목록 atom
export const tableIdsAtom = atom<string[]>(Object.keys(dummyScheduleMap));

// 테이블별 스케줄 atom 저장소 (Map으로 직접 관리)
const scheduleAtomsMap = new Map<string, PrimitiveAtom<Schedule[]>>();

// 초기 데이터로 atom 생성
Object.entries(dummyScheduleMap).forEach(([tableId, schedules]) => {
  scheduleAtomsMap.set(tableId, atom<Schedule[]>(schedules as Schedule[]));
});

// 테이블별 스케줄 atom getter (없으면 생성)
export const getScheduleAtom = (tableId: string): PrimitiveAtom<Schedule[]> => {
  let scheduleAtom = scheduleAtomsMap.get(tableId);
  if (!scheduleAtom) {
    scheduleAtom = atom<Schedule[]>([]);
    scheduleAtomsMap.set(tableId, scheduleAtom);
  }
  return scheduleAtom;
};

// 새 테이블 추가용 derived atom
export const addTableAtom = atom(null, (get, set, sourceTableId: string) => {
  const newTableId = `schedule-${Date.now()}`;
  const sourceSchedules = get(getScheduleAtom(sourceTableId));
  const newAtom = atom<Schedule[]>([...sourceSchedules]);
  scheduleAtomsMap.set(newTableId, newAtom);
  set(tableIdsAtom, [...get(tableIdsAtom), newTableId]);
});

// 테이블 삭제용 derived atom
export const removeTableAtom = atom(null, (get, set, tableId: string) => {
  scheduleAtomsMap.delete(tableId);
  set(tableIdsAtom, get(tableIdsAtom).filter((id) => id !== tableId));
});
