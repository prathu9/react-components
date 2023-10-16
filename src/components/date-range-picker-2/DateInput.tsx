import "./DateRange.css";

import { Box, Input, useColorModeValue } from "@chakra-ui/react";
import classnames from "classnames";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

type DateDisplayType = {
  value: Date;
  dateDisplayFormat: string;
  dateOptions: { locale: any; weekStartsOn?: any };
};

const formatDate = ({
  value,
  dateDisplayFormat,
  dateOptions,
}: DateDisplayType) => {
  if (value && dayjs(value).isValid()) {
    return dayjs(value).format(dateDisplayFormat);
  }
  return "";
};

export const DateInput = (props: any) => {
  const [invalid, setInvalid] = useState(false);
  const [changed, setChanged] = useState(false);
  const [dateDisplayValue, setDateDisplayValue] = useState<DateDisplayType>({
    value: props.value,
    dateDisplayFormat: props.dateDisplayFormat,
    dateOptions: props.dateOptions,
  });
  const borderActiveColorDateInput = useColorModeValue("#000", "#fff");
  const borderInActiveColorDateInput = useColorModeValue("#fff", "#000");
  useEffect(() => {
    if (!dayjs(props.value).isSame(dayjs(dateDisplayValue.value))) {
      setDateDisplayValue({
        ...dateDisplayValue,
        value: props.value,
      });
    }
  }, [props.value]);

  // const update = (dateValue: Date) => {
  //     if (invalid || !changed || !dateValue) {
  //       return;
  //     }
  //     const { onChange, dateDisplayFormat, dateOptions } = props;
  //     const parsed = parse(""+dateValue, dateDisplayFormat, new Date(), dateOptions);

  //     if (isValid(parsed)) {
  //       setChanged(false);
  //       onChange(parsed);
  //     } else {
  //     setInvalid(true);
  //     }
  // }

  // const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>)=> {
  //     if (event.key === 'Enter') {
  //       update(dateDisplayValue.value);
  //     }
  // };

  // const onBlur = () => {
  //     update(dateDisplayValue.value);
  // };

  const { className, placeholder, ariaLabel, onFocus } = props;

  const readOnly = props.readOnly ?? true;
  const disabled = props.disabled ?? false;
  return (
    <Box
      as="span"
      className={classnames("rdrDateInput", className)}
      w="49%"
      textAlign="center"
      border="1px"
      borderRadius="4px"
      borderColor={
        props.isActive
          ? borderActiveColorDateInput
          : borderInActiveColorDateInput
      }
    >
      <Input
        textAlign="center"
        cursor="pointer"
        readOnly={readOnly}
        disabled={disabled}
        value={formatDate(dateDisplayValue)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        // onKeyDown={onKeyDown}
        // onChange={onChange}
        // onBlur={onBlur}
        onFocus={onFocus}
      />
      {invalid && <span className="rdrWarning">&#9888;</span>}
    </Box>
  );
};
