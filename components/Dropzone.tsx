import { FC, useRef, useState } from "react";
import { Img } from "./Img";
import { Video } from "./Video";
import { Box } from "./Box";

interface Props {
  label?: string;
  isRequired?: boolean;
  value: string;
  onChange: (value: string) => void;
  filetype?: "image" | "video";
  className?: string;
}

export const Dropzone: FC<Props> = ({
  label,
  isRequired,
  value,
  filetype = "image",
  className,
  onChange,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFile = (file: File) => {
    setIsLoading(true);
    let data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "abc_mobile");
    data.append("api_key", "161524318721499");
    fetch(`https://api.cloudinary.com/v1_1/dkvneat77/${filetype}/upload`, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        onChange(res.url);
        setIsLoading(false);
      });
  };

  const handleDrag = function (e: any) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = function (e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // triggers when file is selected with click
  const handleChange = function (e: any) {
    e.preventDefault();
    console.log(e.target.files[0]);
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // triggers the input when the button is clicked
  const onButtonClick = () => {
    if (inputRef.current) inputRef.current.click();
  };

  return (
    <label className="flex flex-col gap-2 w-full max-w-md h-full max-h-[20rem]">
      {label && (
        <strong className="font-medium">
          {label} {isRequired ? "*" : null}
        </strong>
      )}
      <form
        id="form-file-upload"
        onDragEnter={handleDrag}
        onSubmit={(e) => e.preventDefault()}
        className={`w-full flex flex-col items-center gap-4 h-full ${
          !value ? "relative" : ""
        }`}
      >
        <label
          className={
            value
              ? "h-0 mt-[-1rem]"
              : `bg-stone-50 border border-dashed border-stone-400 rounded-md relative w-full flex flex-col items-center justify-center gap-4 p-4 ${
                  className || ""
                }`
          }
        >
          <input
            ref={inputRef}
            type="file"
            id="input-file-upload"
            onChange={handleChange}
            disabled={!!value}
            className={"absolute top-0 left-0 w-full h-full invisible"}
          />
          {isLoading ? (
            <p className="text-indigo-600">Uploading file...</p>
          ) : (
            !value && (
              <>
                <p className="text-stone-400 z-10">
                  Drag and drop your file here or
                </p>
                <Box className="z-10" onClick={onButtonClick}>
                  Upload a file
                </Box>
                {dragActive && (
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className="bg-red h-full w-full z-50 absolute top-0 left-0"
                  ></div>
                )}
              </>
            )
          )}
        </label>
        {value && (
          <div className="flex flex-col gap-4">
            {filetype === "video" ? (
              <Video
                width={448}
                height={240}
                src={value}
                className="max-h-60"
              />
            ) : (
              <Img
                width={448}
                height={240}
                src={value}
                alt={label || ""}
                className="max-h-60"
              />
            )}
            <button
              className="flex gap-4 font-medium text-indigo-600"
              onClick={() => onChange("")}
            >
              Change
            </button>
          </div>
        )}
      </form>
    </label>
  );
};
// <Dropzone
//   label="Clip"
//   isRequired
//   filetype="video"
//   value={clip.video.video}
//   onChange={(value) =>
//       setClip((prevState) => ({
//       ...prevState,
//       video: { ...prevState.video, video: value },
//     }))
//   }
// />
