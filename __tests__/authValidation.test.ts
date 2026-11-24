import { loginSchema, registerSchema } from '../src/features/auth/schemas/authSchemas';

describe('Authentication Validation Rules', () => {
  describe('Login Validation', () => {
    it('should validate successfully with correct credentials', () => {
      const validData = {
        username: 'emilys',
        password: 'emilyspass',
      };
      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should fail validation when username is empty', () => {
      const invalidData = {
        username: '   ',
        password: 'password123',
      };
      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Username');
      }
    });

    it('should fail validation when password is empty', () => {
      const invalidData = {
        username: 'validuser',
        password: '',
      };
      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Password is required');
      }
    });
  });

  describe('Registration Validation', () => {
    it('should validate successfully with compliant input', () => {
      const validData = {
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        email: 'john.doe@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      };
      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject passwords shorter than 8 characters', () => {
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        email: 'john@example.com',
        password: 'short',
        confirmPassword: 'short',
      };
      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.issues.find(i => i.path.includes('password'));
        expect(error?.message).toContain('at least 8 characters');
      }
    });

    it('should reject mismatched passwords', () => {
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password456',
      };
      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.issues.find(i => i.path.includes('confirmPassword'));
        expect(error?.message).toContain('Passwords do not match');
      }
    });

    it('should reject invalid email formats', () => {
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        email: 'invalid-email-address',
        password: 'password123',
        confirmPassword: 'password123',
      };
      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.issues.find(i => i.path.includes('email'));
        expect(error?.message).toContain('valid email address');
      }
    });
  });
});
