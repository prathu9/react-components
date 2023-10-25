import { Stepper, StepperStep, StepperCompleted } from "./components/stepper";
import { ChatIcon } from "@chakra-ui/icons";
import {
  useBreakpointValue,
  Button,
  ButtonGroup,
  Spacer,
  Box,
  Flex
} from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";
import { DateRangePicker } from "./components/date-range-picker";
import { DateRangePicker as DateRange } from "./components/date-range-picker-2";
import UserList from "./components/user-list/UserList";
import { VariableSizeList as List } from 'react-window';
import { useMultiSelect, MultiSelect } from "./components/multi-select";

import JSONSchemaEditor from "./components/json-schema-editor/JsonSchemaEditor";
import { JSONSchema7 } from "json-schema";
import Editor from "@monaco-editor/react";

const initialSchema = {
  type: "object",
  properties: {
    cars: {
      type: "string"
      // type: "array",
      // items: {
      //       type: "object",
      //       properties: {
      //         electric: {
      //           type: "string"
      //         }
      //       }
      // }
    },
  },
  required: ["cars", "bmw"]
} as JSONSchema7

const TestComponent = () => {
  const [value, setValue] = useState(initialSchema);
  
  return (
    <>
    <Box minW="500px" w="100%" display="flex" flexWrap="wrap" gap="20px">
      <Box w="400px">
        <JSONSchemaEditor value={value} setValue={setValue} />
      </Box>
      
      <Editor
              width="400px"
              height="300px"
              theme="vs-dark"
              defaultLanguage="json"
              defaultValue={JSON.stringify(value)}
              onChange={(v) =>{console.log(JSON.parse(v)); v && setValue(JSON.parse(v))}}
              options={{}}
              value={JSON.stringify(value)}
            />
    </Box>
    {/* <MultiSelectExample single={false}/> */}
      {/* <Stepper step={1} orientation={useBreakpointValue({ base: 'vertical', md: 'horizontal' })}>
                <StepperStep title="Personal information" icon={<ChatIcon />}/>
                <StepperStep title="Account" icon={<ChatIcon />}/>
                <StepperStep title="Confirmation" icon={<ChatIcon />}/>
            </Stepper> */}
            {/* <WithContent/> */}
            {/* <Flex flexWrap={"wrap"}>
              <DateRangeComponent
                minDateOffset="-300"
                maxDateOffset="900"
                direction="vertical"
              />
            </Flex> */}
            {/* <ReactWindowList /> */}
            {/* <UserList /> */}
            {/* <WithVerticalContent /> */}

    </>
  );
};

const usePreviousValue = (value: any) => {
  const ref = useRef();
  console.log(value)
  useEffect(() => {
    ref.current = value;
  });
  console.log("ref",ref)
  return ref.current;
};

const MyComponent = ({ count }: any) => {
  console.log(count)
  const prevCount = usePreviousValue(count);
  console.log(count, prevCount)

  return (<div> {count} | {prevCount}</div>);
} 


// const MultiSelectExample = ({single}: {single: boolean}) => {
//   const { value, options, onChange } = useMultiSelect({
//                                           value: single? '' : [],
//                                           options: []
//                                       })

//   return(
//       <MultiSelect
//           options={options}
//           value={value}
//           label='Choose an item'
//           onChange={onChange!}
//           create
//       />
//   )
// }


const DateRangeComponent = (props: any) => {
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ])

  const prev = usePreviousValue(state);

  return(<DateRangePicker
      {...props}
      onChange={item => setState([{...item.selection}])}
      ranges={state}
      minDate={props.direction === 'vertical' ? dayjs(new Date()).add(props.minDateOffset, 'day').toDate() : undefined}
      maxDate={props.direction === 'vertical' ? dayjs(new Date()).add(props.maxDateOffset, 'day').toDate() : undefined}
      scroll={props.direction === 'vertical' ? { enabled: true } : { enabled: false }}
    />)
}

const DateRangeComponent2 = (props: any) => {
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ])

  return(<DateRange
      {...props}
      onChange={item => setState([item.selection])}
      ranges={state}
      minDate={props.direction === 'vertical' ? dayjs(new Date()).add(props.minDateOffset, 'day').toDate() : undefined}
      maxDate={props.direction === 'vertical' ? dayjs(new Date()).add(props.maxDateOffset, 'day').toDate() : undefined}
      scroll={props.direction === 'vertical' ? { enabled: true } : { enabled: false }}
    />)
}

const rowHeights = new Array(1000)
  .fill(true)
  .map(() => 25 + Math.round(Math.random() * 50));
 
const getItemSize = (index:number) => rowHeights[index];

const Row = ({ index, style }: {index: number, style: any}) => (
  <div style={style}>Row {index}</div>
);

const ReactWindowList = () => {
  return(
    <List
      height={150}
      itemCount={1000}
      itemSize={getItemSize}
      width={300}
    >
      {Row}
    </List>
  )
}


const WithContent = () => {
  const [step, setStep] = useState(0);

  const back = () => {
    setStep(step - 1);
  };

  const next = () => {
    setStep(step + 1);
  };

  const steps = [
    {
      name: "step 1",
      title: "First step",
      children: <Box py="4">Content step 1</Box>,
    },
    {
      name: "step 2",
      title: "Second step",
      children: <Box py="4">Content step 2</Box>,
    },
    {
      name: "step 3",
      title: "Third step",
      children: <Box py="4">Content step 3</Box>,
    },
  ];

  return (
    <>
      <Stepper step={step} mb="2">
        {steps.map((args, i) => (
          <StepperStep key={i} {...args} />
        ))}
        <StepperCompleted py="4">Completed</StepperCompleted>
      </Stepper>
      <ButtonGroup width="100%">
        <Button onClick={back} isDisabled={step === 0} variant="ghost">
          back
        </Button>
        <Spacer />
        <Button onClick={next} isDisabled={step >= 3} colorScheme="primary">
          Next
        </Button>
      </ButtonGroup>
    </>
  );
};

const WithVerticalContent = () => {
    const [step, setStep] = useState(0)

  const back = () => {
    setStep(step - 1)
  }

  const next = () => {
    setStep(step + 1)
  }

  const steps = [
    {
      name: 'step 1',
      title: 'First step',
      children: (
        <>
          <Box py="4">Content step 1</Box>
          <ButtonGroup>
            <Button
              onClick={next}
              isDisabled={step >= 3}
              colorScheme="primary"
            >Next</Button>
          </ButtonGroup>
        </>
      ),
    },
    {
      name: 'step 2',
      title: 'Second step',
      children: (
        <>
          <Box py="4">Content step 2</Box>{' '}
          <ButtonGroup>
            <Button
              onClick={next}
              isDisabled={step >= 3}
              colorScheme="primary"
            >Next</Button>
            <Button
              onClick={back}
              isDisabled={step === 0}
              variant="ghost"
            >Back</Button>
          </ButtonGroup>
        </>
      ),
    },
    {
      name: 'step 3',
      title: 'Third step',
      children: (
        <>
          <Box py="4">Content step 3</Box>
          <ButtonGroup>
            <Button
              onClick={next}
              isDisabled={step >= 3}
              colorScheme="primary"
            >Next</Button>
            <Button
              onClick={back}
              isDisabled={step === 0}
              variant="ghost"
            >Back</Button>
          </ButtonGroup>
        </>
      ),
    },
  ]

  return (
    <>
      <Stepper step={step} mb="2" orientation="vertical">
        {steps.map((args, i) => (
          <StepperStep key={i} {...args} />
        ))}
        <StepperCompleted py="4">Completed</StepperCompleted>
      </Stepper>
    </>
  )
}

export default TestComponent;
