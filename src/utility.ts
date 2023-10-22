import { customAlphabet } from "nanoid";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

export const generateID = (length?: number) => customAlphabet(alphabet, length ?? 16)();
