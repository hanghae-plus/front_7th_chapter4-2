import { memo } from 'react';
import {
  Box,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  Stack,
  Tag,
  TagCloseButton,
  TagLabel,
  Wrap,
} from '@chakra-ui/react';

interface MajorFilterProps {
  value: string[];
  allMajors: string[];
  onChange: (value: string[]) => void;
}

const MajorFilter = memo(({ value, allMajors, onChange }: MajorFilterProps) => {
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
              <TagCloseButton
                onClick={() => onChange(value.filter((v) => v !== major))}
              />
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
          {allMajors.map((major) => (
            <Box key={major}>
              <Checkbox key={major} size="sm" value={major}>
                {major.replace(/<p>/gi, ' ')}
              </Checkbox>
            </Box>
          ))}
        </Stack>
      </CheckboxGroup>
    </FormControl>
  );
});

export default MajorFilter;
