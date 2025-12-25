import { ChakraProvider } from '@chakra-ui/react';

import { ScheduleProvider } from '@/contexts/schedule';
import { ScheduleTables } from '@/components/schedule/ScheduleTables';

function App() {
  return (
    <ChakraProvider>
      <ScheduleProvider>
        <ScheduleTables />
      </ScheduleProvider>
    </ChakraProvider>
  );
}

export default App;
