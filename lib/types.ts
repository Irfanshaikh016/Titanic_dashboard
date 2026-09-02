export interface RawPassenger {
  PassengerId: string;
  Survived: string;
  Pclass: string;
  Name: string;
  Sex: string;
  Age: string;
  SibSp: string;
  Parch: string;
  Ticket: string;
  Fare: string;
}

export interface Passenger {
  PassengerId: number;
  Survived: 0 | 1;
  Pclass: 1 | 2 | 3;
  Name: string;
  Sex: "male" | "female";
  Age: number | null;
  AgeWasMissing: boolean;
  SibSp: number;
  Parch: number;
  Ticket: string;
  Fare: number;
  FamilySize: number;
}

export interface FilterState {
  sex: "All" | "male" | "female";
  pclass: "All" | 1 | 2 | 3;
  survived: "All" | 0 | 1;
  ageRange: [number, number];
  fareRange: [number, number];
  search: string;
}

export interface DataBounds {
  minAge: number;
  maxAge: number;
  minFare: number;
  maxFare: number;
}
