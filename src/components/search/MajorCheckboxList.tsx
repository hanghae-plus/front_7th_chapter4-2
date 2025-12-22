import { memo } from 'react';
import { Box, Checkbox } from '@chakra-ui/react';

interface Props {
  majors: string[];
}

export const MajorCheckboxList = memo(({ majors }: Props) => (
  <>
    {majors.map((major) => (
      <Box key={major}>
        <Checkbox key={major} size="sm" value={major}>
          {major.replace(/<p>/gi, ' ')}
        </Checkbox>
      </Box>
    ))}
  </>
));

MajorCheckboxList.displayName = 'MajorCheckboxList';
