/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ["**/*.css"],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
  // serverBuildPath: "build/index.js",
  routes(defineRoutes) {
    return defineRoutes((route) => {
      route("nested_route_title/example_route", "routes/nested_route_title/example_route.tsx")
      // route("nested_route_title/:path", "routes/nested_route_title/another_example.tsx", () => {
      //   // - path is relative to parent path
      //   // - filenames are still relative to the app directory
      //   route("example_route", "routes/nested_route_title/example_route.tsx");
      // })
    });
  },
};
