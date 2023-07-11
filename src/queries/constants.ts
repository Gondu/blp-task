import { v4 as uuidv4 } from "uuid";
import { Entity } from "./types";

export const storageKey = "usersToUserGroups";

export const MOCK_USERS: Entity[] = [
  { 
    id: uuidv4(), 
    name: "David", 
    surname: "Marx",
    email: "david.marx@blp-digital.com",
    country: "Switzerland",
    city: "Zurich" ,
  },
  { 
    id: uuidv4(), 
    name: "Victor", 
    surname: "Semencenco",
    email: "victor.semencenco@gmail.com",
    country: "Italy",
    city: "Venice" ,
  },
  { 
    id: uuidv4(), 
    name: "Kavya", 
    surname: "Kommuri",
    email: "kavya.kommuri@gmail.com",
    country: "India",
    city: "Hyderabad" ,
  },
  { 
    id: uuidv4(), 
    name: "Federico", 
    surname: "Sartor",
    email: "fede.sartor@gmail.com",
    country: "Italy",
    city: "Rome" ,
  },
  { 
    id: uuidv4(), 
    name: "Francesca", 
    surname: "Bormida",
    email: "france.bormida@gmail.com",
    country: "Germany",
    city: "Berlin" ,
  },
  { 
    id: uuidv4(), 
    name: "Nina", 
    surname: "Petic",
    email: "nina.petic@gmail.com",
    country: "Moldova",
    city: "Chisinau" ,
  },
  { 
    id: uuidv4(), 
    name: "Mirko", 
    surname: "Macchia",
    email: "mirko.macchia@gmail.com",
    country: "France",
    city: "Paris" ,
  },
];

export const MOCK_USERS_GROUPS: Entity[] = [
  { id: uuidv4(), name: "Accounting" },
  { id: uuidv4(), name: "C Level" },
  { id: uuidv4(), name: "Key Users" },
  { id: uuidv4(), name: "PMs" },
  { id: uuidv4(), name: "Developers" },
  { id: uuidv4(), name: "Designers" },
  { id: uuidv4(), name: "Data Entry" },
  { id: uuidv4(), name: "Backend" },
  { id: uuidv4(), name: "Frontend" },
  { id: uuidv4(), name: "Scrum Masters" },
  { id: uuidv4(), name: "MiddleWare" },
  { id: uuidv4(), name: "Managers" },
  { id: uuidv4(), name: "Marketing" },
  { id: uuidv4(), name: "Finance" },
  { id: uuidv4(), name: "Sales" },
  { id: uuidv4(), name: "HR" },
  { id: uuidv4(), name: "Corporate" },
  { id: uuidv4(), name: "Coaches" },
  { id: uuidv4(), name: "Coordinators" },
  { id: uuidv4(), name: "Owners" },
  { id: uuidv4(), name: "Stakeholders" },
  { id: uuidv4(), name: "Business" },
  { id: uuidv4(), name: "POs" },
  { id: uuidv4(), name: "Technicians" },
  { id: uuidv4(), name: "Electricians" },
  { id: uuidv4(), name: "Support" },
];

export const storageInit: Record<string, string[]> = MOCK_USERS.reduce<
  Record<string, string[]>
>((acc, cur) => {
  acc[cur.id] = [];
  return acc;
}, {});
