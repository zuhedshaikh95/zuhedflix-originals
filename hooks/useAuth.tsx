import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    User,
} from 'firebase/auth';
import React, { useState, createContext, useEffect, useMemo, useContext } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../lib/firebase';

interface Props {
  children: React.ReactNode
}

interface IAuth {
  user: User | null,
  signUp: (email: string, password: string) => Promise<void>,
  signIn: (email: string, password: string) => Promise<void>,
  logout: () => Promise<void>,
  error: string | null,
  loading: boolean
}

const AuthContext = createContext<IAuth>({
  user: null,
  signUp: async () => {},
  signIn: async () => {},
  logout: async () => {},
  error: null,
  loading: false
});

export const AuthProvider = ({ children }: Props) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => (
    onAuthStateChanged(auth, (user) => {
      if(user) {
        setUser(user);
        setLoading(false);
      }
      else {
        setUser(null);
        setLoading(true);
        router.push('/login');
      }

      setInitialLoading(false);
    })
  ), [auth]);

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      setUser(userCredential.user);
      router.push('/');
    })
    .catch(({message}) => (setError(message), alert(message)))
    .finally(() => setLoading(false))
  }

  const signIn = async (email: string, password: string) => {
    setLoading(true);

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      setUser(userCredential.user);
      router.push('/');
    })
    .catch(({ message }) => (setError(message), alert(message)))
    .finally(() => setLoading(false))
  }

  const logout = async () => {
    setLoading(true);

    signOut(auth)
    .then(() => {
      setUser(null);
    })
    .catch(({ message }) => (setError(message), alert(message)))
    .finally(() => setLoading(false));
  }

  const memiozedValue = useMemo(() => ({
    user, signUp, signIn, logout, loading, error
  }), [user, loading, error])

  return (
    <AuthContext.Provider value={memiozedValue}>
      { !initialLoading && children }
    </AuthContext.Provider>
  )
}

export default function useAuth() {
  return useContext(AuthContext);
}