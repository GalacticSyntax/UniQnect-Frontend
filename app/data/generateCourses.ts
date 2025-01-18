import { faker } from "@faker-js/faker";

export const generateCourses = (count = 5) => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    courseName: `${faker.hacker.adjective()} ${faker.hacker.noun()}`, // A creative name for a course
    instructor: faker.name.fullName(),
    duration: `${faker.number.int({ min: 12, max: 16 })} weeks`, // Duration in weeks
    credits: faker.number.int({ min: 2, max: 5 }), // Credit value for the course
    department: `${faker.commerce.department()} Department`, // Department name
  }));
};
