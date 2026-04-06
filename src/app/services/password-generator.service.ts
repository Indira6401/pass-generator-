import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PasswordGeneratorService {
  private readonly uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  private readonly lowercase = 'abcdefghjkmnpqrstuvwxyz';
  private readonly digits = '23456789';
  private readonly symbols = '!@#$%^&*_+-=?';

  private readonly PASSWORD_LENGTH = 16;

  /**
   * Generate a cryptographically strong password using the Web Crypto API.
   * Every password is guaranteed to contain uppercase, lowercase, digit, and symbol characters.
   * Passwords are validated against weak/predictable patterns.
   */
  generate(): string {
    let password: string;
    do {
      password = this.buildPassword();
    } while (!this.isStrong(password));
    return password;
  }

  private buildPassword(): string {
    const allChars = this.uppercase + this.lowercase + this.digits + this.symbols;

    // Guarantee at least 2 from each category
    const guaranteed: string[] = [
      this.randomFrom(this.uppercase),
      this.randomFrom(this.uppercase),
      this.randomFrom(this.lowercase),
      this.randomFrom(this.lowercase),
      this.randomFrom(this.digits),
      this.randomFrom(this.digits),
      this.randomFrom(this.symbols),
      this.randomFrom(this.symbols),
    ];

    // Fill the remaining length with random chars from the full set
    const remaining = this.PASSWORD_LENGTH - guaranteed.length;
    for (let i = 0; i < remaining; i++) {
      guaranteed.push(this.randomFrom(allChars));
    }

    // Shuffle using Fisher-Yates with crypto random
    return this.shuffle(guaranteed).join('');
  }

  /** Pick a cryptographically random character from a string */
  private randomFrom(chars: string): string {
    const index = this.secureRandomInt(chars.length);
    return chars[index];
  }

  /** Return a uniform random integer in [0, max) using Web Crypto API */
  private secureRandomInt(max: number): number {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] % max;
  }

  /** Fisher-Yates shuffle with crypto-random swaps */
  private shuffle(arr: string[]): string[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = this.secureRandomInt(i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /** Validate that a password has no weak or predictable patterns */
  private isStrong(password: string): boolean {
    // Must contain all character classes
    if (!/[A-Z]/.test(password)) return false;
    if (!/[a-z]/.test(password)) return false;
    if (!/[0-9]/.test(password)) return false;
    if (!/[!@#$%^&*_+\-=?]/.test(password)) return false;

    // Reject 3+ repeated characters (aaa, 111)
    if (/(.)\1{2,}/.test(password)) return false;

    // Reject repeating 2-char patterns (abab)
    if (/(.{2})\1{1,}/.test(password)) return false;

    // Reject sequential characters (ascending or descending, 3+)
    if (this.hasSequential(password, 3)) return false;

    // Reject common keyboard patterns
    const lowerPwd = password.toLowerCase();
    const weakPatterns = [
      'qwerty', 'asdf', 'zxcv', 'password', 'admin',
      'letmein', 'welcome', '1234', 'abcd',
    ];
    for (const pattern of weakPatterns) {
      if (lowerPwd.includes(pattern)) return false;
    }

    return true;
  }

  /** Check for 3+ sequential ascending or descending characters */
  private hasSequential(str: string, minRun: number): boolean {
    let ascRun = 1;
    let descRun = 1;
    for (let i = 1; i < str.length; i++) {
      const diff = str.charCodeAt(i) - str.charCodeAt(i - 1);
      if (diff === 1) {
        ascRun++;
        descRun = 1;
      } else if (diff === -1) {
        descRun++;
        ascRun = 1;
      } else {
        ascRun = 1;
        descRun = 1;
      }
      if (ascRun >= minRun || descRun >= minRun) return true;
    }
    return false;
  }
}
