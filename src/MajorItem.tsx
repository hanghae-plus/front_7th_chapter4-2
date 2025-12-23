import React from "react";
import { Box, Checkbox } from "@chakra-ui/react";

export const MajorItem = React.memo(({ major }: { major: string }) => {
  return (
    <Box key={major}>
      <Checkbox key={major} size='sm' value={major}>
        {major.replace(/<p>/gi, " ")}
      </Checkbox>
    </Box>
  );
});
