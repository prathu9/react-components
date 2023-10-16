import { useState } from "react";
import { Stack, Box, Text } from "@chakra-ui/react";

import RatingButton from "./RatingButton";

import { RatingPropsType } from "./type";


export const Rating = (props: RatingPropsType ) => {
    const [rating, setRating] = useState(0);

    const onClick = (idx: number) => {
        if (!isNaN(idx)) {
          if (rating === 1 && idx === 1) {
            setRating(0);
          } else {
            setRating(idx);
          }
        }
    };

    return(
        <Stack isInline mt={8} justify="center">
            {
                [...Array(props.scale)].map((_, i) => (
                    <RatingButton {...props} onClick={onClick} key={i} idx={i+1} fill={i+1 <= rating} />
                ))
            }
            <Box width={`${props.size * 1.5}px`} textAlign="center">
            <Text fontSize="sm" textTransform="uppercase">
                Rating
            </Text>
            <Text fontSize="2xl" fontWeight="semibold" lineHeight="1.2em">
                {rating}
            </Text>
            </Box>
        </Stack>
    )
}