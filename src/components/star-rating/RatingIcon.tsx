import { Icon, Box } from "@chakra-ui/react";

import { RatingIconPropsType } from "./type";

const RatingIcon = ({icon, size, fillColor, strokeColor, fill}: RatingIconPropsType) => {
    console.log(strokeColor)
    return(
        <Box sx={{ "> svg": {fill: fillColor}, " > svg path" : {
            stroke: strokeColor,
            strokeWidth: "4px"
        } }}>
            <Icon
                as={icon}
                boxSize={`${size}px`}
                fillOpacity={fill ? "100%" : "0"}
            />
        </Box>
    )
}

export default RatingIcon;