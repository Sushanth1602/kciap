import { EventEmitter } from "events";

const globalForEmitter = global as unknown as { progressEmitter?: EventEmitter };
export const progressEmitter = globalForEmitter.progressEmitter ?? new EventEmitter();
if (process.env.NODE_ENV !== "production") {
  globalForEmitter.progressEmitter = progressEmitter;
}
