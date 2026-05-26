import { Router, Request, Response, NextFunction } from "express";
import { authService } from "./auth.service";
import { BadRequestError, currentUser } from "@mainshopapp/common";

type RequestWithSession = Request & { session?: { jwt: string } };

const router = Router();

router.post("/signup", async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const result = await authService.signUp({ email, password });

    if (typeof result !== "string") {
      return next(new BadRequestError(result.message));
    }

    const request = req as RequestWithSession;
    request.session = { jwt: result };

    res.status(201).send(true);
  },
);

router.post('/signin', async (req: Request, res: Response, next: NextFunction) => { 
    const { email, password } = req.body;
    const result = await authService.Login({ email, password });

    if (typeof result !== "string") {
      return next(new BadRequestError(result.message));
    }

    const request = req as RequestWithSession;
    request.session = { jwt: result };

    res.status(201).send(true);
});



router.get(
  "/current-user",
  // cast to any to satisfy Express typings when middleware has a custom request type
  currentUser(process.env.JWT_KEY!) as any,
  (req: Request & { currentUser?: any }, res: Response) => {
    res.status(200).send((req as any).currentUser || null);
  },
);

export { router as authRouter };
