import { Box } from "@chakra-ui/react";

import RatingIcon from "./RatingIcon";

import { RatingButtonPropsType } from "./type";

const RatingButton = (props: RatingButtonPropsType) => {
    return(
        <Box as="button" onClick={() => props.onClick(props.idx)}>
            <RatingIcon
                {...props}
                fill={props.fill}
            />
        </Box>
    )
}

export default RatingButton;