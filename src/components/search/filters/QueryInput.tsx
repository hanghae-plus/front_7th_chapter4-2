import { memo, useEffect, useState } from 'react';
import { FormControl, FormLabel, Input } from '@chakra-ui/react';
import { useDebounce } from '@/hooks/useDebounce';

interface QueryInputProps {
  initialValue: string;
  onChange: (value: string) => void;
}

export const QueryInput = memo(({ initialValue, onChange }: QueryInputProps) => {
  const [value, setValue] = useState(initialValue);
  const debouncedValue = useDebounce(value, 300);

  useEffect(() => {
    if (debouncedValue !== initialValue) {
      onChange(debouncedValue);
    }
  }, [debouncedValue, onChange, initialValue]);

  return (
    <FormControl>
      <FormLabel>검색어</FormLabel>
      <Input
        placeholder="과목명 또는 과목코드"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </FormControl>
  );
});

QueryInput.displayName = 'QueryInput';
