import { memo, useCallback } from 'react';
import { HStack } from '@chakra-ui/react';
import { SearchOption } from './SearchDialog.utils';
import {
  QueryInput,
  CreditsSelect,
  GradeFilter,
  DayFilter,
  TimeFilter,
  MajorFilter,
} from './filters';

interface Props {
  searchOptions: SearchOption;
  allMajors: string[];
  changeSearchOption: (
    field: keyof SearchOption,
    value: SearchOption[typeof field]
  ) => void;
}

const TopFilters = memo(
  ({
    query = '',
    credits,
    onQueryChange,
    onCreditsChange,
  }: {
    query?: string;
    credits?: number;
    onQueryChange: (value: string) => void;
    onCreditsChange: (value: number | undefined) => void;
  }) => {
    return (
      <HStack spacing={4}>
        <QueryInput initialValue={query} onChange={onQueryChange} />
        <CreditsSelect value={credits} onChange={onCreditsChange} />
      </HStack>
    );
  }
);
TopFilters.displayName = 'TopFilters';

const MiddleFilters = memo(
  ({
    grades,
    days,
    onGradesChange,
    onDaysChange,
  }: {
    grades: number[];
    days: string[];
    onGradesChange: (value: number[]) => void;
    onDaysChange: (value: string[]) => void;
  }) => {
    return (
      <HStack spacing={4}>
        <GradeFilter value={grades} onChange={onGradesChange} />
        <DayFilter value={days} onChange={onDaysChange} />
      </HStack>
    );
  }
);
MiddleFilters.displayName = 'MiddleFilters';

const BottomFilters = memo(
  ({
    times,
    majors,
    allMajors,
    onTimesChange,
    onMajorsChange,
  }: {
    times: number[];
    majors: string[];
    allMajors: string[];
    onTimesChange: (value: number[]) => void;
    onMajorsChange: (value: string[]) => void;
  }) => {
    return (
      <HStack spacing={4}>
        <TimeFilter value={times} onChange={onTimesChange} />
        <MajorFilter
          value={majors}
          allMajors={allMajors}
          onChange={onMajorsChange}
        />
      </HStack>
    );
  }
);
BottomFilters.displayName = 'BottomFilters';

export const SearchFilters = memo(
  ({ searchOptions, allMajors, changeSearchOption }: Props) => {
    const handleQueryChange = useCallback(
      (value: string) => changeSearchOption('query', value),
      [changeSearchOption]
    );

    const handleCreditsChange = useCallback(
      (value: number | undefined) => changeSearchOption('credits', value),
      [changeSearchOption]
    );

    const handleGradesChange = useCallback(
      (value: number[]) => changeSearchOption('grades', value),
      [changeSearchOption]
    );

    const handleDaysChange = useCallback(
      (value: string[]) => changeSearchOption('days', value),
      [changeSearchOption]
    );

    const handleTimesChange = useCallback(
      (value: number[]) => changeSearchOption('times', value),
      [changeSearchOption]
    );

    const handleMajorsChange = useCallback(
      (value: string[]) => changeSearchOption('majors', value),
      [changeSearchOption]
    );

    return (
      <>
        <TopFilters
          query={searchOptions.query}
          credits={searchOptions.credits}
          onQueryChange={handleQueryChange}
          onCreditsChange={handleCreditsChange}
        />
        <MiddleFilters
          grades={searchOptions.grades}
          days={searchOptions.days}
          onGradesChange={handleGradesChange}
          onDaysChange={handleDaysChange}
        />
        <BottomFilters
          times={searchOptions.times}
          majors={searchOptions.majors}
          allMajors={allMajors}
          onTimesChange={handleTimesChange}
          onMajorsChange={handleMajorsChange}
        />
      </>
    );
  }
);

SearchFilters.displayName = 'SearchFilters';
