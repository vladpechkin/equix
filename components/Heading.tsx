import { FC, createContext, createElement, useContext } from "react";

type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> & {
  level?: number | "auto";
};

export const H1: FC<HeadingProps> = (props) => (
  <h1 {...props} className="font-semibold text-[32px] leading-tight" />
);

export const H2: FC<HeadingProps> = (props) => (
  <h2 {...props} className="font-semibold text-[24px]" />
);

export const H3: FC<HeadingProps> = (props) => (
  <h3 {...props} className="font-semibold text-[16px]" />
);

// TODO
// const HeadingLevelContext = createContext<number>(0);
// export const Heading = ({ level = "auto", ...props }: HeadingProps) => {
//   const headingLevel = useContext(HeadingLevelContext);
//   if (level === "auto" && headingLevel === 0) {
//     throw new Error(
//       "To use auto heading levels wrap your Heading in a Region."
//     );
//   }
//   if (typeof level === "number" && level <= 0) {
//     throw new Error(
//       "The level of a Heading must be a positive value greater than zero."
//     );
//   }
//   const actualLevel = level === "auto" ? headingLevel : level;
//   if (actualLevel <= 6) return createElement(`h${actualLevel}`, props);

//   return (
//     <div
//       {...props}
//       className={`${
//         actualLevel === 1
//           ? "text-[2em] leading-[2.5rem]"
//           : actualLevel === 2 && "text-[1.5em] leading-[2em]"
//       } font-medium max-w-screen-sm break-words ${props.className || ""}`}
//       role="heading"
//       aria-level={actualLevel}
//     />
//   );
// };
// export const Region = (props: React.HTMLAttributes<HTMLDivElement>) => {
//   const headingLevel = useContext(HeadingLevelContext);
//   const nextLevel = headingLevel + 1;
//   return (
//     <HeadingLevelContext.Provider value={nextLevel}>
//       <section {...props} />
//     </HeadingLevelContext.Provider>
//   );
// };

// export const Section = (props: any) => (
//   <Region
//     className="flex flex-col gap-2 rounded-lg w-full lg:max-w-screen-sm flex-1 bg-white p-4"
//     {...props}
//   >
//     {props.children}
//   </Region>
// );
