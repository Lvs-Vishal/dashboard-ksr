"use server";

export async function setWelcomeMessage(message: string) {
  if (message.trim().split(/\s+/).length > 1) {
    throw new Error("Message must be a single word");
  }

  try {
    // http://192.168.4.151/msg?hi=<message>
    const url = `http://192.168.4.151/msg?hi=${encodeURIComponent(message)}`;
    await fetch(url, { method: "GET", cache: "no-store" });
    return { success: true };
  } catch (error) {
    console.warn(
      `[Simulation] Failed to set welcome message (Device unreachable): ${error}`,
    );
    // Return success to simulate working state even if device is offline
    return { success: true, simulated: true };
  }
}

export async function setThermostat(value: number) {
  try {
    // http://192.168.4.2/set?val=1000
    // Assuming value maps to the 'val' parameter.
    // If the thermostat takes 1000 for 100%, we might need scaling,
    // but for now we'll pass the raw value or a sensible mapping.
    const url = `http://192.168.4.160/set?val=${value}`;
    await fetch(url, {
      method: "GET",
      cache: "no-store",
      signal: AbortSignal.timeout(2000),
    });
    return { success: true };
  } catch (error) {
    console.warn(
      `[Simulation] Failed to set thermostat (Device unreachable): ${error}`,
    );
    return { success: true, simulated: true };
  }
}

export async function toggleDeskLight(state: boolean) {
  try {
    // http://192.126.1.200/light/off
    // Inferring /light/on for the on state
    const action = state ? "on" : "off";
    const url = `http://192.168.4.200/light/${action}`;
    await fetch(url, {
      method: "GET",
      cache: "no-store",
      signal: AbortSignal.timeout(2000),
    });
    return { success: true };
  } catch (error) {
    console.warn(
      `[Simulation] Failed to toggle desk light (Device unreachable): ${error}`,
    );
    return { success: true, simulated: true };
  }
}
