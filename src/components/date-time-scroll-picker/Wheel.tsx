import { Box } from "@chakra-ui/react";
import { KeenSliderOptions, TrackDetails, useKeenSlider } from "../keen-slider/react";
import dayjs from "dayjs";
import { useEffect, useId, useRef, useState } from "react";

const initialDateTimePickerValue = () => {
  const currDate = new Date();

  return {
    date: dayjs(currDate).format("ddd DD MMM"),
    hours: currDate.getHours(),
    minutes: currDate.getMinutes(),
  };
};

type outputDateValue = { date?: string; hours?: number; minutes?: number };

type WheelPropType = {
  initIdx?: number;
  label?: string;
  length: number;
  loop?: boolean;
  perspective?: "left" | "right" | "center";
  setValue?: (relative: number, absolute: number) => string;
  width: number;
  identifier?: string;
  isFocused: boolean;
  tabIndex: number;
};

export default function Wheel(props: WheelPropType) {
  const perspective = props.perspective || "center";
  const wheelSize = 20;
  const slides = props.length;
  const slideDegree = 360 / wheelSize;
  const slidesPerView = props.loop ? 9 : 1;
  const uniqueSlideID = useId();

  const [sliderState, setSliderState] = useState<TrackDetails | null>(null);
  const [selectedDate, setSelectedDate] = useState<outputDateValue>(
    initialDateTimePickerValue(),
  );
  const isFocused = props.isFocused;
  const size = useRef(0);

  const getCurrentDateTimeValue = (slider: any) => {
    const sliderIdentifier = slider.options.identifier;
    let value;
    if (sliderIdentifier === "date") {
      const d = new Date();
      value = dayjs(
        new Date(d.setDate(d.getDate() - slider.track.details.abs)),
      ).format("ddd DD MMM");
    } else if (sliderIdentifier === "hours") {
      value = slider.track.details.rel;
    } else if (sliderIdentifier === "minutes") {
      value = slider.track.details.rel;
    }

    setSelectedDate({
      ...selectedDate,
      [sliderIdentifier]: value,
    });
  };

  const options = useRef<
    KeenSliderOptions & { identifier: string | undefined }
  >({
    slides: {
      number: slides,
      origin: props.loop ? "center" : "auto",
      perView: slidesPerView,
    },

    vertical: true,

    initial: props.initIdx || 0,
    loop: props.loop,
    dragSpeed: (val) => {
      const height = size.current;
      return (
        val *
        (height /
          ((height / 2) * Math.tan(slideDegree * (Math.PI / 180))) /
          slidesPerView)
      );
    },
    created: (s) => {
      size.current = s.size;
    },
    updated: (s) => {
      size.current = s.size;
    },
    detailsChanged: (s) => {
      getCurrentDateTimeValue(s);
      setSliderState(s.track.details);
    },
    rubberband: !props.loop,
    mode: "free-snap",
    identifier: props.identifier,
  });

  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>(options.current);

  const [radius, setRadius] = useState(0);

  useEffect(() => {
    if (slider.current) setRadius(slider.current.size / 2);
  }, [slider]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if(event.code === "ArrowUp"){
        slider?.current?.next();
      }
      else if(event.code === "ArrowDown"){
        slider?.current?.prev();
      }
      if(event.code === "Escape"){
        slider?.current?.container.blur();
      }
    }

    if(isFocused){
      slider?.current?.container.focus();
      slider?.current?.container.addEventListener("keydown", onKeyDown);
    }

    return () => slider?.current?.container.removeEventListener("keydown", onKeyDown);
  },[isFocused])

  function slideValues() {
    if (!sliderState) return [];
    const offset = props.loop ? 1 / 2 - 1 / slidesPerView / 2 : 0;

    const values = [];
    for (let i = 0; i < slides; i += 1) {
      const distance = sliderState
        ? (sliderState.slides[i].distance - offset) * slidesPerView
        : 0;
      const rotate =
        Math.abs(distance) > wheelSize / 2
          ? 180
          : distance * (360 / wheelSize) * -1;
      const style = {
        transform: `rotateX(${rotate}deg) translateZ(${radius}px)`,
        WebkitTransform: `rotateX(${rotate}deg) translateZ(${radius}px)`,
      };
      const value = props.setValue
        ? props.setValue(i, sliderState.abs + Math.round(distance))
        : i;
      values.push({ style, value });
    }
    return values;
  }

  return (
    <Box
      className={`wheel keen-slider wheel--perspective-${perspective}`}
      ref={sliderRef}
      tabIndex={props.tabIndex}
    >
      <Box
        className="wheel__shadow-top"
        style={{
          transform: `translateZ(${radius}px)`,
          WebkitTransform: `translateZ(${radius}px)`,
        }}
      />
      <Box className="wheel__inner">
        <Box className="wheel__slides" style={{ width: `${props.width}px` }}>
          {slideValues().map(({ style, value }, index) => {
            const keyValue = `wheel__slide-${uniqueSlideID}-${index}`;
            return (
              <Box className="wheel__slide" style={style} key={keyValue}>
                <span>{value}</span>
              </Box>
            );
          })}
        </Box>
        {props.label && (
          <Box
            className="wheel__label"
            style={{
              transform: `translateZ(${radius}px)`,
              WebkitTransform: `translateZ(${radius}px)`,
            }}
          >
            {props.label}
          </Box>
        )}
      </Box>
      <Box
        className="wheel__shadow-bottom"
        style={{
          transform: `translateZ(${radius}px)`,
          WebkitTransform: `translateZ(${radius}px)`,
        }}
      />
    </Box>
  );
}
