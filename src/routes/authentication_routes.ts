import { Hono } from "hono";
import {
  type SignUpWithUsernameAndPasswordResult,
  SignUpWithUsernameAndPasswordError,
} from "../controllers/authentication/authentication-types.js";
import { signUpWithUsernameAndPassword } from "../controllers/authentication/authentication-controllers.js";
import { logInWithUsernameAndPassword } from "../controllers/authentication/authentication-controllers.js";
export const authenticationRoutes = new Hono();
authenticationRoutes.post("/sign-up", async (context) => {
  const { username, password, email } = await context.req.json();

  try {
    const result = await signUpWithUsernameAndPassword({
      username,
      password,
      email,
    });

    return context.json(
      {
        data: result,
      },
      201
    );
  } catch (e) {
    if (e === SignUpWithUsernameAndPasswordError.CONFLICTING_USERNAME) {
      return context.json(
        {
          message: "Username already exists",
        },
        409
      );
    }

    return context.json(
      {
        mesage: "Unknown",
      },
      500
    );
  }
});

authenticationRoutes.post("/log-in", async (context) => {
  const { username, password } = await context.req.json();

  try {
    const result = await logInWithUsernameAndPassword({
      username,
      password,
    });

    return context.json(
      {
        data: result,
      },
      201
    );
  } catch (e) {
    if (e === SignUpWithUsernameAndPasswordError.CONFLICTING_USERNAME) {
      return context.json(
        {
          message: "Username already exists",
        },
        409
      );
    }

    return context.json(
      {
        mesage: "Unknown",
      },
      500
    );
  }
});
