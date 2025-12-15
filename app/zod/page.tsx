'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { CodeExample } from '@/components/code-example';
import { Badge } from '@/components/ui/badge';
import { userSchema, blogPostSchema, type UserFormData } from '@/lib/validations/user';
import { toast } from 'sonner';
import { Shield, CheckCircle, XCircle } from 'lucide-react';

export default function ZodPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    password: '',
    confirmPassword: '',
    website: '',
    bio: '',
    interests: [] as string[],
    newsletter: false,
    terms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    try {
      const numericAge = formData.age ? parseInt(formData.age) : 0;
      const dataToValidate = {
        ...formData,
        age: numericAge,
        interests: formData.interests.length > 0 ? formData.interests : ['coding'], // Demo default
      };
      
      userSchema.parse(dataToValidate);
      setErrors({});
      toast.success('Form validation passed!');
      return true;
    } catch (error: any) {
      const fieldErrors: Record<string, string> = {};
      if (error.errors) {
        error.errors.forEach((err: any) => {
          if (err.path) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
      }
      setErrors(fieldErrors);
      toast.error('Form validation failed');
      return false;
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Zod Validation</h1>
        <p className="text-xl text-muted-foreground">
          Learn schema validation, form validation, and type safety with Zod.
        </p>
      </div>

      <Tabs defaultValue="basics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="basics">Basics</TabsTrigger>
          <TabsTrigger value="schemas">Schemas</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="basics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                What is Zod?
              </CardTitle>
              <CardDescription>
                TypeScript-first schema validation with static type inference
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Type Safety</h3>
                  <p className="text-sm text-muted-foreground">
                    Automatic TypeScript type inference
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Runtime Validation</h3>
                  <p className="text-sm text-muted-foreground">
                    Validate data at runtime with detailed errors
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <XCircle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Error Handling</h3>
                  <p className="text-sm text-muted-foreground">
                    Detailed error messages for debugging
                  </p>
                </div>
              </div>

              <CodeExample
                title="Basic Zod Schema"
                code={`import { z } from 'zod';

// Define a schema
const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  age: z.number().min(18, "Must be at least 18 years old"),
});

// Infer TypeScript type
type User = z.infer<typeof userSchema>;

// Validate data
const result = userSchema.safeParse({
  name: "John Doe",
  email: "john@example.com",
  age: 25
});

if (result.success) {
  console.log(result.data); // Typed as User
} else {
  console.log(result.error.issues); // Validation errors
}`}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schemas" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Schema Types</CardTitle>
              <CardDescription>
                Zod supports various data types with validation rules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeExample
                title="Common Schema Types"
                code={`import { z } from 'zod';

// Primitive types
const stringSchema = z.string();
const numberSchema = z.number();
const booleanSchema = z.boolean();
const dateSchema = z.date();

// String validations
const emailSchema = z.string().email();
const urlSchema = z.string().url();
const uuidSchema = z.string().uuid();
const regexSchema = z.string().regex(/^[a-z]+$/);

// Number validations
const positiveSchema = z.number().positive();
const integerSchema = z.number().int();
const rangeSchema = z.number().min(0).max(100);

// Array schemas
const stringArraySchema = z.array(z.string());
const numberArraySchema = z.array(z.number()).min(1).max(10);

// Object schemas
const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(50),
  email: z.string().email(),
  age: z.number().int().min(0).max(120),
  isActive: z.boolean().default(true),
});

// Optional and nullable
const optionalSchema = z.string().optional();
const nullableSchema = z.string().nullable();
const nullishSchema = z.string().nullish(); // null | undefined`}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Complex Schemas</CardTitle>
              <CardDescription>
                Advanced schema patterns for real-world applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeExample
                title="Advanced Schema Example"
                code={`// Enum schema
const StatusEnum = z.enum(['pending', 'approved', 'rejected']);

// Union types
const StringOrNumber = z.union([z.string(), z.number()]);

// Discriminated unions
const EventSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('user_created'),
    userId: z.string(),
    email: z.string().email(),
  }),
  z.object({
    type: z.literal('post_published'),
    postId: z.string(),
    title: z.string(),
  }),
]);

// Recursive schemas
type Category = {
  name: string;
  subcategories: Category[];
};

const CategorySchema: z.ZodType<Category> = z.lazy(() =>
  z.object({
    name: z.string(),
    subcategories: z.array(CategorySchema),
  })
);

// Transform data
const TransformSchema = z
  .string()
  .transform((val) => val.toLowerCase())
  .pipe(z.string().min(3));`}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Interactive Form Validation</CardTitle>
              <CardDescription>
                Try the form below to see Zod validation in action
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      className={errors.age ? 'border-red-500' : ''}
                    />
                    {errors.age && (
                      <p className="text-red-500 text-sm mt-1">{errors.age}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={errors.password ? 'border-red-500' : ''}
                    />
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className={errors.confirmPassword ? 'border-red-500' : ''}
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="website">Website (optional)</Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="https://example.com"
                      className={errors.website ? 'border-red-500' : ''}
                    />
                    {errors.website && (
                      <p className="text-red-500 text-sm mt-1">{errors.website}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio (optional)</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Tell us about yourself..."
                      className={errors.bio ? 'border-red-500' : ''}
                    />
                    {errors.bio && (
                      <p className="text-red-500 text-sm mt-1">{errors.bio}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="newsletter"
                        checked={formData.newsletter}
                        onCheckedChange={(checked) => handleInputChange('newsletter', checked)}
                      />
                      <Label htmlFor="newsletter">Subscribe to newsletter</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        checked={formData.terms}
                        onCheckedChange={(checked) => handleInputChange('terms', checked)}
                      />
                      <Label htmlFor="terms">I accept the terms and conditions *</Label>
                    </div>
                    {errors.terms && (
                      <p className="text-red-500 text-sm">{errors.terms}</p>
                    )}
                  </div>
                </div>
              </div>

              <Button onClick={validateForm} className="w-full">
                Validate Form
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Error Handling</CardTitle>
              <CardDescription>
                Advanced error handling and custom error messages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeExample
                title="Custom Error Handling"
                code={`import { z } from 'zod';

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
  age: z.number({
    required_error: "Age is required",
    invalid_type_error: "Age must be a number",
  }).min(18, "You must be at least 18 years old"),
});

// Safe parsing with error handling
const result = schema.safeParse({ email: "invalid", age: "not-a-number" });

if (!result.success) {
  // Handle errors
  result.error.errors.forEach((error) => {
    console.log(\`\${error.path.join('.')}: \${error.message}\`);
  });
  
  // Formatted errors for forms
  const fieldErrors = result.error.errors.reduce((acc, error) => {
    const path = error.path.join('.');
    acc[path] = error.message;
    return acc;
  }, {} as Record<string, string>);
}

// Custom validation with refine
const passwordSchema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], // Error will be attached here
});`}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Schema Composition</CardTitle>
              <CardDescription>
                Combine and extend schemas for reusability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeExample
                title="Schema Composition Patterns"
                code={`import { z } from 'zod';

// Base schemas
const BaseUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  createdAt: z.date(),
});

// Extend schemas
const AdminUserSchema = BaseUserSchema.extend({
  role: z.literal('admin'),
  permissions: z.array(z.string()),
});

const RegularUserSchema = BaseUserSchema.extend({
  role: z.literal('user'),
  subscription: z.enum(['free', 'premium']),
});

// Merge schemas
const ProfileSchema = z.object({
  name: z.string(),
  bio: z.string().optional(),
});

const UserWithProfileSchema = BaseUserSchema.merge(ProfileSchema);

// Partial and pick
const UpdateUserSchema = BaseUserSchema.partial(); // All fields optional
const UserSummarySchema = BaseUserSchema.pick({ id: true, email: true });

// Omit fields
const PublicUserSchema = BaseUserSchema.omit({ createdAt: true });

// Conditional schemas
const ConditionalSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('email'),
    email: z.string().email(),
  }),
  z.object({
    type: z.literal('phone'),
    phone: z.string().regex(/^\d{10}$/),
  }),
]);`}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}