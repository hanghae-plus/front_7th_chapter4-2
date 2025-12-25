import { useEffect, useState } from 'react';
import useAutoCallback from './useAutoCallback';

export interface SearchOption {
  query?: string;
  grades: number[];
  days: string[];
  times: number[];
  majors: string[];
  credits?: number;
}

interface SearchInfo {
  tableId: string;
  day?: string;
  time?: number;
}

const INITIAL_OPTIONS: SearchOption = {
  query: '',
  grades: [],
  days: [],
  times: [],
  majors: [],
};

interface UseSearchOptionsReturn {
  searchOptions: SearchOption;
  changeOption: (
    field: keyof SearchOption,
    value: SearchOption[keyof SearchOption],
  ) => void;
}

const useSearchOptions = (
  searchInfo: SearchInfo | null,
): UseSearchOptionsReturn => {
  const [searchOptions, setSearchOptions] =
    useState<SearchOption>(INITIAL_OPTIONS);

  const changeOption = useAutoCallback(
    (field: keyof SearchOption, value: SearchOption[keyof SearchOption]) => {
      setSearchOptions((prev) => ({ ...prev, [field]: value }));
    },
  );

  // searchInfo 변경 시 days, times 동기화
  useEffect(() => {
    setSearchOptions((prev) => ({
      ...prev,
      days: searchInfo?.day ? [searchInfo.day] : [],
      times: searchInfo?.time ? [searchInfo.time] : [],
    }));
  }, [searchInfo]);

  return { searchOptions, changeOption };
};

export default useSearchOptions;
