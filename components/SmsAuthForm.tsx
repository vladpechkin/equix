import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { fetchApi } from "../utils";
import { Box } from "./Box";
import { Input } from "./Input";

interface Props {
  codeLength: number;
  postPhoneNumber: (phoneNumber: string) => Promise<Response>;
  postConfirmationCode: (code: string) => Promise<Response>;
}

export const SmsAuthForm: FC<Props> = (props) => {
  const { codeLength, postPhoneNumber, postConfirmationCode } = props;
  const [phone, setPhone] = useState("");
  const [isSmsSent, setIsSmsSent] = useState(false);
  const [code, setCode] = useState("");
  const router = useRouter();

  return (
    <div className="flex flex-col absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 gap-2">
      {isSmsSent ? (
        <>
          <Input type="text" label="SMS code" value={code} onChange={setCode} />
          {code.length === codeLength && (
            <Box
              className="text-white bg-black flex justify-center"
              onClick={() => {
                postConfirmationCode(code)
                  .then((res) => (res.ok ? res.json() : null))
                  .then((res) => {
                    if (res.data.accessToken && res.data.refreshToken) {
                      localStorage.setItem("accessToken", res.data.accessToken);
                      localStorage.setItem(
                        "refreshToken",
                        res.data.refreshToken
                      );
                      router.push("/");
                    }
                  });
              }}
            >
              Confirm phone number
            </Box>
          )}
        </>
      ) : (
        <>
          <Input
            type="tel"
            label="Phone number"
            value={`+${phone}`}
            onChange={(value: string) => setPhone(value.slice(1))}
          />
          {phone.length > 10 && (
            <Box
              className="text-white bg-black flex justify-center"
              onClick={() => {
                postPhoneNumber(phone).then((res) =>
                  res.ok ? setIsSmsSent(true) : null
                );
              }}
            >
              Get code via SMS
            </Box>
          )}
        </>
      )}
    </div>
  );
};
