import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    });
  }

  async validate(payload: any) {
    console.log('JWT Strategy - Received payload:', payload);
    console.log(
      'JWT Strategy - Secret used:',
      process.env.JWT_SECRET || 'your-secret-key',
    );

    const result = {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
    };

    console.log('JWT Strategy - Returning user:', result);
    return result;
  }
}
