import { Photo } from "./photos";

export interface Members {
    id: number;
    userName: string;
    age: number;
    photoUrl: string;
    knownAs: string;
    created: string;
    lastActive: string;
    gender: string;
    introduction: string;
    lookingFor: string;
    interests: string;
    city: string;
    country: string;
    photos: Photo[];
  }