import { Container, Stack, Flex,IconButton, useColorModeValue, useColorMode } from '@chakra-ui/react';

import { FaMoon, FaSun } from 'react-icons/fa'
import React, {useState} from "react";
import TestComponent from './test-component';


const App = () => {
  const { toggleColorMode: toggleMode } = useColorMode()
  const text = useColorModeValue('dark', 'light')
  const SwitchIcon = useColorModeValue(FaMoon, FaSun)

  
  return(
    <Container mt="20px" maxWidth="100%">
      <Flex justifyContent={"flex-end"}>
      <IconButton
              size="md"
              fontSize="lg"
              aria-label={`Switch to ${text} mode`}
              variant="ghost"
              color="current"
              ml={{ base: '0', md: '3' }}
              onClick={toggleMode}
              icon={<SwitchIcon />}
          />
      </Flex>
      <Stack gap="10">
        <TestComponent />
      </Stack>
    </Container>
  )
}

export default App;