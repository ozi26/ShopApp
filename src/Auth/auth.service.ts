import { UserService, userService } from "./user/user.service";
import { AuthDto } from "./dtos/auth.dto";
import { AuthenticationService } from "@mainshopapp/common";

export class AuthService {
  constructor(
    public userService: UserService,
    public authenticationService: AuthenticationService,
  ) {}

  async signUp(createUserDto: AuthDto) {
    const existingUser = await this.userService.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      return { message: "Email already in use" };
    }
    const newUser = await this.userService.create(createUserDto);

    const jwt = this.authenticationService.generateJwt(
      { email: createUserDto.email, userId: newUser._id.toString() },
      process.env.JWT_KEY!,
    );

    return jwt;
  }

  async Login(loginDto: AuthDto) {
    const user = await this.userService.findByEmail(loginDto.email);

    if (!user) {
      return { message: "Invalid credentials" };
    }

    const passwordMatch = await this.authenticationService.pwdCompare(
      user.password,
      loginDto.password,
    );
    if (!passwordMatch) {
      return { message: "Invalid credentials" };
    }

    const jwt = this.authenticationService.generateJwt(
      { email: user.email, userId: user._id.toString() },
      process.env.JWT_KEY!,
    );
    return jwt;
  }
}

export const authService = new AuthService(
  userService,
  new AuthenticationService(),
);
