"use strict";

const PRoute = puzzle.import("http/Route", true);

const AuthenticatedUser = require("../utils/AuthenticatedUser");
const RouteAccessException = require("../exceptions/RouteAccessException");

/**
 * Web Routes base class.
 *
 * @abstract
 * @extends puzzle-framework-light.http.Route
 * @memberOf http
 */
class Route extends PRoute {
  /**
   * Creates an instance of the route.
   *
   * @param {string} path The path to the route.
   */
  constructor(path) {
    super(path);

    this.middlewares.auth = [];

    /**
     * Where to redirect unauthenticated users.
     *
     * @property {string}
     */
    this.unauthenticatedRedirectTo = "/";
  }

  /**
   * Register all the routes exposed by this route.
   */
  register() {
    this.get("/", (req, res) => {
      res.json({
        world: res.__("hello"),
        path: this.path
      });
    });
  }

  /**
   * Pushes a middleware to the auth middleware stack.
   *
   * @param {callback} middleware The middlware to be pushed to the stack.
   */
  pushAuth(middleware) {
    this.pushMiddleware("auth", middleware);
  }

  /**
   * Registers an authenticated GET route.
   *
   * @param {string} path The path of the route.
   * @param {callback} callback The callback method.
   */
  getAuth(path, callback) {
    this.routeRegisterMiddleware("get", path, "auth", callback);
  }

  /**
   * Registers an authenticated POST route.
   *
   * @param {string} path The path of the route.
   * @param {callback} callback The callback method.
   */
  postAuth(path, callback) {
    this.routeRegisterMiddleware("post", path, "auth", callback);
  }

  /**
   * Registers an authenticated PUT route.
   *
   * @param {string} path The path of the route.
   * @param {callback} callback The callback method.
   */
  putAuth(path, callback) {
    this.routeRegisterMiddleware("put", path, "auth", callback);
  }

  /**
   * Registers an authenticated PATCH route.
   *
   * @param {string} path The path of the route.
   * @param {callback} callback The callback method.
   */
  patchAuth(path, callback) {
    this.routeRegisterMiddleware("patch", path, "auth", callback);
  }

  /**
   * Registers an authenticated DELETE route.
   *
   * @param {string} path The path of the route.
   * @param {callback} callback The callback method.
   */
  deleteAuth(path, callback) {
    this.routeRegisterMiddleware("delete", path, "auth", callback);
  }

  /**
   * Redirects an unauthenticated user to the root page.
   *
   * @param {Object} user The user object.
   * @param {Object} res The response object.
   */
  redirectUnauthenticated(user, res) {
    if (!AuthenticatedUser(user)) {
      res.redirect(this.unauthenticatedRedirectTo);
    }
  }

  /**
   * Tests to see if the user is allowed to perform an action or not.
   *
   * @param {Object} user The user object.
   * @param {string} page The name of the page/method.
   * @param {string} permission The name of the permission.
   * @throws RouteAccessException
   */
  allowed(user, page, permission) {
    if (!AuthenticatedUser(user) || (!user.isAdmin() && !user.allowed(permission))) {
      throw new RouteAccessException(page);
    }
  }
}

module.exports = Route;
