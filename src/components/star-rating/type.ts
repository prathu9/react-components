export interface RatingPropsType{
    size: number,
    icon: any,
    scale: number,
    fillColor: string,
    strokeColor: string
}

export interface RatingButtonPropsType extends RatingPropsType{
    fill: boolean,
    idx: number,
    onClick: (idx: number) => void
}

export interface RatingIconPropsType extends RatingButtonPropsType {} 