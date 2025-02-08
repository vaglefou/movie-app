declare module "react-star-rating-component" {
  import * as React from "react";

  interface StarRatingComponentProps {
    name: string;
    value: number;
    starCount: number;
    onStarClick?: (nextValue: number, prevValue: number, name: string) => void;
    onStarHover?: (nextValue: number, prevValue: number, name: string) => void;
    onStarHoverOut?: (
      nextValue: number,
      prevValue: number,
      name: string
    ) => void;
    editing?: boolean;
    renderStarIcon?: (index: number, value: number) => React.ReactNode;
    renderStarIconHalf?: (index: number, value: number) => React.ReactNode;
    starColor?: string;
    emptyStarColor?: string;
    starSize?: string;
    className?: string;
  }

  export default class StarRatingComponent extends React.Component<StarRatingComponentProps> {}
}
