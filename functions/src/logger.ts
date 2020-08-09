const isEmulator = process.env.FUNCTIONS_EMULATOR === "true";

export function debug(label: string, ...values: any) {
  if (isEmulator) {
    console.log(label, ...values.map(JSON.stringify));
  }
}

export function warn(label: string, value: any) {
  console.warn(label, JSON.stringify(value));
}

export function secret(label: string, value: any) {
  if (isEmulator) {
    console.log(label, JSON.stringify(value));
  } else {
    console.log(label, "********");
  }
}
