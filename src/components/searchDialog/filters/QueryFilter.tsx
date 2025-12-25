import { memo } from 'react';
import { FormControl, FormLabel, Input } from '@chakra-ui/react';

interface QueryFilterProps {
  value?: string;
  onChange: (value: string) => void;
}

const QueryFilter = memo(({ value, onChange }: QueryFilterProps) => {
  return (
    <FormControl>
      <FormLabel>검색어</FormLabel>
      <Input
        placeholder="과목명 또는 과목코드"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </FormControl>
  );
});

export default QueryFilter;
