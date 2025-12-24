import { ChakraProvider } from '@chakra-ui/react';
import { ScheduleTables } from './features/schedules/ScheduleTables.tsx';

function App() {
  return (
    <ChakraProvider>
      <ScheduleTables />
    </ChakraProvider>
  );
}

export default App;
