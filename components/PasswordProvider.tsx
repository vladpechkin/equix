import { useRouter } from "next/navigation";
import { FC, ReactNode, useEffect, useState } from "react";

interface Props {
  children: ReactNode;
}

export const PasswordProvider: FC<Props> = (props) => {
  const { children } = props;
  const router = useRouter();
  const [pass, setPass] = useState("");
  useEffect(() => {
    let storedPass = localStorage.getItem("pass");
    setPass(storedPass as string);
    if (storedPass !== "12345678") {
      const newPass = prompt("Enter password");
      newPass && localStorage.setItem("pass", newPass);
    }
  }, [router]);
  return pass === "12345678" ? children : null;
};
