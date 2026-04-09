export interface Disaster {
  id: number;
  title: string;
  location: string;
  status: "pending" | "resolved";
}

export interface Alert {
  id: number;
  message: string;
}

export interface Contact {
  id: number;
  name: string;
  phone: string;
}