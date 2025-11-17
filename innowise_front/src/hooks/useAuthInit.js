import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { validateToken, getAccessToken } from "../store/slices/authSlice";

export function useAuthInit() {
  const dispatch = useDispatch();
  const validatedOnceRef = useRef(false);

  useEffect(() => {
    const accessToken = getAccessToken();
    if (!accessToken) {
      validatedOnceRef.current = false;
      return;
    }
    if (validatedOnceRef.current) {
      return;
    }
    validatedOnceRef.current = true;
    dispatch(validateToken());
  }, [dispatch]);
}
