'use server';

import { RegisterDto } from './register-schema';

export async function sendVerificationCode(registerDto: RegisterDto) {
  const response = await fetch(
    `${process.env.API_BASE_URL}/api/auth/send-verification-code`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: registerDto.email }),
    }
  );

  console.log(await response.json());
}
