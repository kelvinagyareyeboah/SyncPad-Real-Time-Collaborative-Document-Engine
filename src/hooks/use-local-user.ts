import { useEffect, useState } from "react";

export interface LocalUser {
  id: string;
  name: string;
}

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function useLocalUser(): [LocalUser | null, (name: string) => void] {
  const [user, setUser] = useState<LocalUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("syncpad_user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const setName = (name: string) => {
    const existing = localStorage.getItem("syncpad_user");
    const id = existing ? JSON.parse(existing).id : generateId();
    const newUser = { id, name };
    localStorage.setItem("syncpad_user", JSON.stringify(newUser));
    setUser(newUser);
  };

  return [user, setName];
}
