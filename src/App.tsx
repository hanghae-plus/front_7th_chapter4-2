import { ChakraProvider } from "@chakra-ui/react";
import { ScheduleTables } from "./components/ScheduleTables.tsx";

function App() {
  return (
    <ChakraProvider>
      <ScheduleTables />
    </ChakraProvider>
  );
}

export default App;
