import { ScheduleProvider } from './context';
import ScheduleTables from './components/schedule/ScheduleTables.tsx';
import ScheduleDndProvider from './ScheduleDndProvider.tsx';
import { ChakraProvider } from '@chakra-ui/react';

function App() {
  return (
    <ChakraProvider>
      <ScheduleProvider>
        <ScheduleDndProvider>
          <ScheduleTables />
        </ScheduleDndProvider>
      </ScheduleProvider>
    </ChakraProvider>
  );
}

export default App;
