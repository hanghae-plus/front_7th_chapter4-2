import { ScheduleProvider } from './context';
import ScheduleTables from './components/schedule/ScheduleTables.tsx';
import { ChakraProvider } from '@chakra-ui/react';

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
