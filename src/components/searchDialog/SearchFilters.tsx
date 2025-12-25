import { memo } from 'react';
import { HStack } from '@chakra-ui/react';
import {
  QueryFilter,
  CreditsFilter,
  GradeFilter,
  DayFilter,
  TimeFilter,
  MajorFilter,
} from './filters';
import useAutoCallback from '../../hooks/useAutoCallback';

interface SearchOption {
  query?: string;
  grades: number[];
  days: string[];
  times: number[];
  majors: string[];
  credits?: number;
}

interface SearchFiltersProps {
  searchOptions: SearchOption;
  allMajors: string[];
  onChangeOption: (
    field: keyof SearchOption,
    value: SearchOption[keyof SearchOption],
  ) => void;
}

const SearchFilters = memo(
  ({ searchOptions, allMajors, onChangeOption }: SearchFiltersProps) => {
    const handleQueryChange = useAutoCallback((value: string) => {
      onChangeOption('query', value);
    });

    const handleCreditsChange = useAutoCallback((value: string) => {
      onChangeOption('credits', value);
    });

    const handleGradesChange = useAutoCallback((value: number[]) => {
      onChangeOption('grades', value);
    });

    const handleDaysChange = useAutoCallback((value: string[]) => {
      onChangeOption('days', value);
    });

    const handleTimesChange = useAutoCallback((value: number[]) => {
      onChangeOption('times', value);
    });

    const handleMajorsChange = useAutoCallback((value: string[]) => {
      onChangeOption('majors', value);
    });

    return (
      <>
        <HStack spacing={4}>
          <QueryFilter
            value={searchOptions.query}
            onChange={handleQueryChange}
          />
          <CreditsFilter
            value={searchOptions.credits}
            onChange={handleCreditsChange}
          />
        </HStack>

        <HStack spacing={4}>
          <GradeFilter
            value={searchOptions.grades}
            onChange={handleGradesChange}
          />
          <DayFilter value={searchOptions.days} onChange={handleDaysChange} />
        </HStack>

        <HStack spacing={4}>
          <TimeFilter
            value={searchOptions.times}
            onChange={handleTimesChange}
          />
          <MajorFilter
            value={searchOptions.majors}
            allMajors={allMajors}
            onChange={handleMajorsChange}
          />
        </HStack>
      </>
    );
  },
);

export default SearchFilters;
