import { FormControl, FormLabel, Input } from '@chakra-ui/react';
import { memo, useState } from 'react';

export const QueryControl = memo(({ onChange }: { onChange: (value: string) => void }) => {
  const [query, setQuery] = useState('');

  const handleChange = (value: string) => {
    setQuery(value);
    onChange(value);
  };

  return (
    <FormControl>
      <FormLabel>검색어</FormLabel>
      <Input placeholder="과목명 또는 과목코드" value={query} onChange={(e) => handleChange(e.target.value)} />
    </FormControl>
  );
});
