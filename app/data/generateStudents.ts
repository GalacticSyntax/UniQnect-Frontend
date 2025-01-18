import { faker } from "@faker-js/faker";

export const generateStudents = (count = 10) => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(), // Updated to use faker.string.uuid()
    name: faker.name.fullName(),
    grade: faker.helpers.arrayElement(["A", "B", "C", "D", "F"]),
    email: faker.internet.email(),
  }));
};
