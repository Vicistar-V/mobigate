/**
 * useAuth.ts
 * Hook-only file — no components here.
 *
 * Vite's SWC plugin requires that a file either exports only components
 * OR only hooks/values — not both. This file exports only the hook.
 *
 * Import useAuth from here everywhere:
 *   import { useAuth } from "@/contexts/useAuth";
 */

import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

export const useAuth = () => useContext(AuthContext);
