import type { Disaster, Alert, Contact } from "./types";

export const disasters: Disaster[] = [
  { id: 1, title: "Flood in Delhi", location: "North Delhi", status: "pending" },
  { id: 2, title: "Fire Accident", location: "South Delhi", status: "resolved" },
];

export const alerts: Alert[] = [
  { id: 1, message: "Heavy rainfall warning ⚠️" },
  { id: 2, message: "Cyclone alert 🌪️" },
];

export const contacts: Contact[] = [
  { id: 1, name: "Police", phone: "100" },
  { id: 2, name: "Ambulance", phone: "102" },
];