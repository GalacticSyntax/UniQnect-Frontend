import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/about", "routes/about.tsx"),
  layout("routes/auth/layout.tsx", [route("login", "./routes/auth/login.tsx")]),

  layout("routes/dashboard/layout.tsx", [
    ...prefix("dashboard", [
      index("routes/dashboard/dashboard.tsx"),

      /* profile routes */
      layout("routes/dashboard/profile/layout.tsx", [
        ...prefix("profile", [
          route(":id?", "routes/dashboard/profile/profile.tsx"),
        ]),
      ]),

      /* student routes */
      layout("routes/dashboard/student/layout.tsx", [
        ...prefix("student", [index("routes/dashboard/student/student.tsx")]),
      ]),

      /* teacher routes */
      layout("routes/dashboard/teacher/layout.tsx", [
        ...prefix("teacher", [
          index("routes/dashboard/teacher/teacher.tsx"),
          route("add-teacher", "routes/dashboard/teacher/add-teacher.tsx"),
        ]),
      ]),

      /* school routes */
      layout("routes/dashboard/school/layout.tsx", [
        ...prefix("school", [index("routes/dashboard/school/school.tsx")]),
      ]),

      /* user routes */
      layout("routes/dashboard/user/layout.tsx", [
        ...prefix("user", [
          index("routes/dashboard/user/user.tsx"),
          route("add-user", "routes/dashboard/user/add-user.tsx"),
        ]),
      ]),

      /* result routes */
      layout("routes/dashboard/result/layout.tsx", [
        ...prefix("result", [index("routes/dashboard/result/result.tsx")]),
      ]),

      /* department routes */
      layout("routes/dashboard/department/layout.tsx", [
        ...prefix("department", [
          index("routes/dashboard/department/department.tsx"),
          route(
            "add-department",
            "routes/dashboard/department/add-department.tsx"
          ),
        ]),
      ]),

      /* curriculum routes */
      layout("routes/dashboard/curriculum/layout.tsx", [
        ...prefix("curriculum", [
          index("routes/dashboard/curriculum/curriculum.tsx"),
        ]),
      ]),

      /* course routes */
      ...prefix("course", [
        layout("routes/dashboard/course/layout.tsx", [
          index("routes/dashboard/course/course.tsx"),
          route("advisor", "routes/dashboard/course/advisor.tsx"),
          route("offered", "routes/dashboard/course/offered.tsx"),
          route("registered", "routes/dashboard/course/registered.tsx"),
        ]),
      ]),

      /* attendance routes */
      layout("routes/dashboard/attendance/layout.tsx", [
        ...prefix("attendance", [
          index("routes/dashboard/attendance/attendance.tsx"),
        ]),
      ]),
    ]),
  ]),
] satisfies RouteConfig;
