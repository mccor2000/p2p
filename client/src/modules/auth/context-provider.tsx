import { createContext, FC, useEffect, useMemo, useState } from "react";
import axios from "axios";

export type User = {
  uid: string;
  username: string;
};

export const AuthContext = createContext<{
  user: User | null;
  setUser: (u: User) => void;
}>({
  user: null,
  setUser: () => {},
});

export const AuthProvider: FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const u = localStorage.getItem("user")
    if (u) {
      setUser(JSON.parse(u));
      return;
    }

    axios
      .get("http://localhost:8080/auth", { withCredentials: true })
      .then((res) => {
        localStorage.setItem("user", JSON.stringify(res.data));
        setUser(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <AuthContext.Provider
      value={useMemo(
        () => ({
          user,
          setUser,
        }),
        [user, setUser]
      )}
    >
      {children}
    </AuthContext.Provider>
  );
};
