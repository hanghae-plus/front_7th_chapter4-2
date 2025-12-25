import { memo } from 'react';
import {
  CheckboxGroup,
  FormControl,
  FormLabel,
  Stack,
  Tag,
  TagCloseButton,
  TagLabel,
  Wrap,
} from '@chakra-ui/react';
import { MajorCheckboxList } from '../MajorCheckboxList';

interface MajorFilterProps {
  value: string[];
  allMajors: string[];
  onChange: (value: string[]) => void;
}

export const MajorFilter = memo(({ value, allMajors, onChange }: MajorFilterProps) => {
  const handleRemove = (major: string) => {
    onChange(value.filter((v) => v !== major));
  };

  return (
    <FormControl>
      <FormLabel>전공</FormLabel>
      <CheckboxGroup
        colorScheme="green"
        value={value}
        onChange={(v) => onChange(v as string[])}
      >
        <Wrap spacing={1} mb={2}>
          {value.map((major) => (
            <Tag key={major} size="sm" variant="outline" colorScheme="blue">
              <TagLabel>{major.split('<p>').pop()}</TagLabel>
              <TagCloseButton onClick={() => handleRemove(major)} />
            </Tag>
          ))}
        </Wrap>
        <Stack
          spacing={2}
          overflowY="auto"
          h="100px"
          border="1px solid"
          borderColor="gray.200"
          borderRadius={5}
          p={2}
        >
          <MajorCheckboxList majors={allMajors} />
        </Stack>
      </CheckboxGroup>
    </FormControl>
  );
});

MajorFilter.displayName = 'MajorFilter';
