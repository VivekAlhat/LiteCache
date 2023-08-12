import { addMilliseconds, compareAsc } from "date-fns";
import { SetParams, GetParams, DeleteParams } from "./types/types";

/**
 * Returns pong as a response
 */

const ping = () => "+PONG\r\n";

/**
 * Returns arguments passed to the command, if none passed then return error
 */

const echo = (args: any[]): string | Error => {
  if (args.length >= 1) {
    return args.join(" ");
  }

  throw new Error("expected at least 1 argument, received 0");
};

/**
 * Set value for given key, optional expiry
 * example: set key value PX expiry
 */

const set: SetParams = (db, expiryStore, key, value, duration) => {
  db.set(key, value);
  const expiryDuration: number = parseInt(duration);

  const current = new Date();
  const expiry = addMilliseconds(current, expiryDuration);

  if (duration) {
    expiryStore.set(key, expiry);
  } else {
    expiryStore.delete(key);
  }

  return "+OK\r\n";
};

/**
 * Returns value for given key, if key is expired then returns Nil
 */

const get: GetParams = (db, expiryStore, key) => {
  const value = db.get(key);
  const today = new Date();
  const expirationDate = expiryStore.get(key);

  if (expirationDate) {
    if (compareAsc(expirationDate, today) === 1) {
      return value ? `+${value}\r\n` : "-Nil\r\n";
    } else {
      return "-Nil\r\n";
    }
  } else {
    return value ? `+${value}\r\n` : "-Nil\r\n";
  }
};

/**
 * Deletes given key
 */

const remove: DeleteParams = (db, key) => {
  db.delete(key);
  return "+OK\r\n";
};

export { ping, echo, set, get, remove };
