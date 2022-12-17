import { createContext, FC, useEffect, useMemo, useState } from "react";
import { v4 } from 'uuid'

import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';

export type User = {
    id: string;
    displayName: string;
};

export const AuthContext = createContext<{
    user: User | null;
    setUser: (u: User) => void;
}>({
    user: null,
    setUser: () => { },
});

export const AuthProvider: FC = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const exist = localStorage.getItem("user")

        const user = exist ? JSON.parse(exist) : {
            id: v4(),
            displayName: uniqueNamesGenerator({
                dictionaries: [adjectives, animals],
                length: 2
            })
        }

        localStorage.setItem('user', JSON.stringify(user))
        setUser(user);
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
