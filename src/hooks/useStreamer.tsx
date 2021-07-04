import { useContext } from "react";
import { StreamerContext } from "../contexts/StreamerContext";

export function useStreamer() {
    return useContext(StreamerContext)
}