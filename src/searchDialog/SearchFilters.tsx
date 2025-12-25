import { memo } from 'react';
import { HStack } from '@chakra-ui/react';
import {
  QueryFilter,
  CreditsFilter,
  GradesFilter,
  DaysFilter,
  TimesFilter,
  MajorsFilter,
} from './filters';

interface SearchFiltersProps {
  allMajors: string[];
}

export const SearchFilters = memo(({ allMajors }: SearchFiltersProps) => {
  return (
    <>
      <HStack spacing={4}>
        <QueryFilter />
        <CreditsFilter />
      </HStack>

      <HStack spacing={4}>
        <GradesFilter />
        <DaysFilter />
      </HStack>

      <HStack spacing={4}>
        <TimesFilter />
        <MajorsFilter allMajors={allMajors} />
      </HStack>
    </>
  );
});
