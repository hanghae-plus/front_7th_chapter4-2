import { memo } from 'react';
import { FormControl, FormLabel, Input } from '@chakra-ui/react';
import { useSearchQuery, useSetSearchQuery } from '../../SearchOptionsContext';

export const QueryFilter = memo(() => {
  const query = useSearchQuery();
  const setQuery = useSetSearchQuery();

  // DEBUG
  console.log('QueryFilter render - query:', query);

  return (
    <FormControl>
      <FormLabel>검색어</FormLabel>
      <Input
        placeholder="과목명 또는 과목코드"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
    </FormControl>
  );
});
