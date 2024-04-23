import { FC } from "react";

interface Props {
  height: number;
  width: number;
  src: string;
  className?: string;
}

export const Video: FC<Props> = (props) => (
  <video {...props} className={`rounded-md ${props.className || ""}`} controls>
    <source src={props.src} type="video/mp4" />
  </video>
);
