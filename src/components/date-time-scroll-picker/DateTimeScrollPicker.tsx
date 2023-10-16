import "./DateTimeScrollPicker.styles.css";

import { useState } from "react";
import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";

import Wheel from "./Wheel";

type DateTimeScrollPickerPropType = {
  dateTime?: "date" | "time" | "dateTime";
};

export const DateTimeScrollPicker = ({
  dateTime = "dateTime",
}: DateTimeScrollPickerPropType) => {
  const [focusedWheelID, setFocusedWheelID] = useState<string>("");

  function formateDate(_relative: number, absolute: number) {
    return dayjs(new Date()).subtract(absolute, "days").format("ddd DD MMM YYYY");
  }

  const handleKeyDown = (event: React.KeyboardEvent, wheelID: string) => {
    
    if(event.code === "ArrowLeft"){
      if(wheelID === "date-wheel-container" && dateTime === "dateTime"){
        document.getElementById("minutes-wheel-container")!.focus();
      }
      else if(wheelID === "hours-wheel-container"){
        dateTime === "dateTime"? document.getElementById("date-wheel-container")!.focus()
                                : document.getElementById("minutes-wheel-container")!.focus();
      }
      else if(wheelID === "minutes-wheel-container"){
        document.getElementById("hours-wheel-container")!.focus();
      }
    }

    if(event.code === "ArrowRight"){
      if(wheelID === "date-wheel-container" && dateTime === "dateTime"){
        document.getElementById("hours-wheel-container")!.focus();
      }
      else if(wheelID === "hours-wheel-container"){
        document.getElementById("minutes-wheel-container")!.focus();
      }
      else if(wheelID === "minutes-wheel-container"){
        dateTime === "dateTime"? document.getElementById("date-wheel-container")!.focus()
                                : document.getElementById("hours-wheel-container")!.focus();
      }
    }
  }

  return (
    <Box
      style={{
        height: "240px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#000",
      }}
    >
      {dateTime !== "time" && (
        <Box style={{ width: 205, height: 180 }} 
             tabIndex={1} 
             onKeyDown={(event) => handleKeyDown(event, "date-wheel-container")} 
             onFocus={() => setFocusedWheelID("date")}
             id="date-wheel-container"
        >
          <Wheel
            loop
            length={24}
            width={180}
            perspective="right"
            setValue={(relative: number, absolute: number) =>
              formateDate(relative, absolute)
            }
            identifier="date"
            isFocused={focusedWheelID === "date"}
            tabIndex = {1}
          />
        </Box>
      )}
      {dateTime !== "date" && (
        <>
          <Box style={{ width: 70, height: 180 }} 
               tabIndex={2} 
               onKeyDown={(event) => handleKeyDown(event, "hours-wheel-container")} 
               onFocus={() => setFocusedWheelID("hours")}
               id="hours-wheel-container"
          >
            <Wheel
              loop
              initIdx={new Date().getHours()}
              length={24}
              width={23}
              identifier="hours"
              isFocused={focusedWheelID === "hours"}
              tabIndex = {2}
            />
          </Box>
          <Box style={{ width: 70, height: 180 }} 
               tabIndex={3} 
               onKeyDown={(event) => handleKeyDown(event, "minutes-wheel-container")} 
               onFocus={() => setFocusedWheelID("minutes")}
               id="minutes-wheel-container"
          >
            <Wheel
              loop
              initIdx={new Date().getMinutes()}
              length={60}
              width={23}
              perspective="left"
              identifier="minutes"
              isFocused={focusedWheelID === "minutes"}
              tabIndex = {3}
            />
          </Box>
        </>
      )}
    </Box>
  );
};
