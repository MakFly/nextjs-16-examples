'use client';

import { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { CodeExample } from '@/components/code-example';
import { Badge } from '@/components/ui/badge';
import { 
  FormInput, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'sonner';

// Schemas for different examples
const simpleSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  age: z.number().min(18, 'Must be at least 18 years old'),
});

const complexSchema = z.object({
  personalInfo: z.object({
    firstName: z.string().min(2, 'First name is required'),
    lastName: z.string().min(2, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
  }),
  address: z.object({
    street: z.string().min(5, 'Street address is required'),
    city: z.string().min(2, 'City is required'),
    zipCode: z.string().regex(/^\d{5}$/, 'ZIP code must be 5 digits'),
    country: z.string().min(2, 'Country is required'),
  }),
  preferences: z.object({
    newsletter: z.boolean(),
    notifications: z.boolean(),
    theme: z.enum(['light', 'dark', 'system']),
  }),
  skills: z.array(z.object({
    name: z.string().min(1, 'Skill name is required'),
    level: z.enum(['beginner', 'intermediate', 'advanced']),
  })).min(1, 'At least one skill is required'),
});

const advancedSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
  confirmPassword: z.string(),
  bio: z.string().max(500, 'Bio must not exceed 500 characters').optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  socialLinks: z.array(z.object({
    platform: z.string().min(1, 'Platform is required'),
    url: z.string().url('Invalid URL'),
  })).optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SimpleFormData = z.infer<typeof simpleSchema>;
type ComplexFormData = z.infer<typeof complexSchema>;
type AdvancedFormData = z.infer<typeof advancedSchema>;

// Simple Form Component
function SimpleForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SimpleFormData>({
    resolver: zodResolver(simpleSchema),
  });

  const onSubmit = async (data: SimpleFormData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Simple form submitted successfully!');
    console.log('Simple form data:', data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="simple-name">Name</Label>
        <Input
          id="simple-name"
          {...register('name')}
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="simple-email">Email</Label>
        <Input
          id="simple-email"
          type="email"
          {...register('email')}
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="simple-age">Age</Label>
        <Input
          id="simple-age"
          type="number"
          {...register('age', { valueAsNumber: true })}
          className={errors.age ? 'border-red-500' : ''}
        />
        {errors.age && (
          <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Submitting...' : 'Submit Simple Form'}
      </Button>
    </form>
  );
}

// Complex Form Component
function ComplexForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<ComplexFormData>({
    resolver: zodResolver(complexSchema),
    defaultValues: {
      preferences: {
        newsletter: false,
        notifications: true,
        theme: 'system',
      },
      skills: [{ name: '', level: 'beginner' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'skills',
  });

  const watchedTheme = watch('preferences.theme');

  const onSubmit = async (data: ComplexFormData) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast.success('Complex form submitted successfully!');
    console.log('Complex form data:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                {...register('personalInfo.firstName')}
                className={errors.personalInfo?.firstName ? 'border-red-500' : ''}
              />
              {errors.personalInfo?.firstName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.personalInfo.firstName.message}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                {...register('personalInfo.lastName')}
                className={errors.personalInfo?.lastName ? 'border-red-500' : ''}
              />
              {errors.personalInfo?.lastName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.personalInfo.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="complex-email">Email</Label>
            <Input
              id="complex-email"
              type="email"
              {...register('personalInfo.email')}
              className={errors.personalInfo?.email ? 'border-red-500' : ''}
            />
            {errors.personalInfo?.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.personalInfo.email.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              {...register('personalInfo.phone')}
              placeholder="1234567890"
              className={errors.personalInfo?.phone ? 'border-red-500' : ''}
            />
            {errors.personalInfo?.phone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.personalInfo.phone.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Address */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="street">Street Address</Label>
            <Input
              id="street"
              {...register('address.street')}
              className={errors.address?.street ? 'border-red-500' : ''}
            />
            {errors.address?.street && (
              <p className="text-red-500 text-sm mt-1">
                {errors.address.street.message}
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                {...register('address.city')}
                className={errors.address?.city ? 'border-red-500' : ''}
              />
              {errors.address?.city && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.address.city.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                {...register('address.zipCode')}
                className={errors.address?.zipCode ? 'border-red-500' : ''}
              />
              {errors.address?.zipCode && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.address.zipCode.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                {...register('address.country')}
                className={errors.address?.country ? 'border-red-500' : ''}
              />
              {errors.address?.country && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.address.country.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Controller
                name="preferences.newsletter"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="newsletter"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="newsletter">Subscribe to newsletter</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Controller
                name="preferences.notifications"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="notifications"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="notifications">Enable notifications</Label>
            </div>
          </div>

          <div>
            <Label htmlFor="theme">Theme Preference</Label>
            <select
              id="theme"
              {...register('preferences.theme')}
              className="w-full p-2 border rounded-md"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
            <p className="text-sm text-muted-foreground mt-1">
              Current selection: {watchedTheme}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Skills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-end">
              <div className="flex-1">
                <Label htmlFor={`skill-${index}`}>Skill Name</Label>
                <Input
                  id={`skill-${index}`}
                  {...register(`skills.${index}.name`)}
                  className={errors.skills?.[index]?.name ? 'border-red-500' : ''}
                />
                {errors.skills?.[index]?.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.skills[index]?.name?.message}
                  </p>
                )}
              </div>
              
              <div className="flex-1">
                <Label htmlFor={`level-${index}`}>Level</Label>
                <select
                  id={`level-${index}`}
                  {...register(`skills.${index}.level`)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => remove(index)}
                disabled={fields.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            onClick={() => append({ name: '', level: 'beginner' })}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Skill
          </Button>
          
          {errors.skills && (
            <p className="text-red-500 text-sm">{errors.skills.message}</p>
          )}
        </CardContent>
      </Card>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Submitting...' : 'Submit Complex Form'}
      </Button>
    </form>
  );
}

// Advanced Form Component
function AdvancedForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, touchedFields, dirtyFields },
    reset,
    watch,
    trigger,
  } = useForm<AdvancedFormData>({
    resolver: zodResolver(advancedSchema),
    mode: 'onChange',
    defaultValues: {
      socialLinks: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'socialLinks',
  });

  const watchedUsername = watch('username');
  const watchedPassword = watch('password');

  const onSubmit = async (data: AdvancedFormData) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast.success('Advanced form submitted successfully!');
    console.log('Advanced form data:', data);
  };

  const checkUsernameAvailability = async () => {
    if (watchedUsername && watchedUsername.length >= 3) {
      await new Promise(resolve => setTimeout(resolve, 500));
      // Simulate username check
      const isAvailable = !['admin', 'user', 'test'].includes(watchedUsername.toLowerCase());
      if (isAvailable) {
        toast.success('Username is available!');
      } else {
        toast.error('Username is already taken');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <div className="flex gap-2">
              <Input
                id="username"
                {...register('username')}
                className={errors.username ? 'border-red-500' : 
                  touchedFields.username && !errors.username ? 'border-green-500' : ''}
              />
              <Button
                type="button"
                variant="outline"
                onClick={checkUsernameAvailability}
                disabled={!watchedUsername || watchedUsername.length < 3}
              >
                Check
              </Button>
            </div>
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
            )}
            {touchedFields.username && !errors.username && (
              <p className="text-green-500 text-sm mt-1 flex items-center">
                <CheckCircle className="h-4 w-4 mr-1" />
                Username looks good!
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                className={errors.password ? 'border-red-500' : ''}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
            
            {/* Password strength indicator */}
            {watchedPassword && (
              <div className="mt-2">
                <div className="text-xs text-muted-foreground mb-1">Password strength:</div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((level) => {
                    const strength = 
                      (watchedPassword.length >= 8 ? 1 : 0) +
                      (/[a-z]/.test(watchedPassword) ? 1 : 0) +
                      (/[A-Z]/.test(watchedPassword) ? 1 : 0) +
                      (/\d/.test(watchedPassword) ? 1 : 0);
                    
                    return (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded ${
                          strength >= level ? 'bg-green-500' : 'bg-gray-200'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                {...register('confirmPassword')}
                className={errors.confirmPassword ? 'border-red-500' : ''}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="bio">Bio (Optional)</Label>
            <Textarea
              id="bio"
              {...register('bio')}
              placeholder="Tell us about yourself..."
              className={errors.bio ? 'border-red-500' : ''}
            />
            {errors.bio && (
              <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="website">Website (Optional)</Label>
            <Input
              id="website"
              {...register('website')}
              placeholder="https://example.com"
              className={errors.website ? 'border-red-500' : ''}
            />
            {errors.website && (
              <p className="text-red-500 text-sm mt-1">{errors.website.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Social Links (Optional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-end">
              <div className="flex-1">
                <Label htmlFor={`platform-${index}`}>Platform</Label>
                <Input
                  id={`platform-${index}`}
                  {...register(`socialLinks.${index}.platform`)}
                  placeholder="Twitter, LinkedIn, etc."
                />
              </div>
              
              <div className="flex-1">
                <Label htmlFor={`url-${index}`}>URL</Label>
                <Input
                  id={`url-${index}`}
                  {...register(`socialLinks.${index}.url`)}
                  placeholder="https://..."
                />
              </div>
              
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            onClick={() => append({ platform: '', url: '' })}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Social Link
          </Button>
        </CardContent>
      </Card>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  );
}

export default function ReactHookFormPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">React Hook Form</h1>
        <p className="text-xl text-muted-foreground">
          Advanced form handling with validation, performance optimization, and user experience enhancements.
        </p>
      </div>

      <Tabs defaultValue="basics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="basics">Basics</TabsTrigger>
          <TabsTrigger value="simple">Simple Form</TabsTrigger>
          <TabsTrigger value="complex">Complex Form</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Form</TabsTrigger>
        </TabsList>

        <TabsContent value="basics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FormInput className="mr-2 h-5 w-5" />
                Why React Hook Form?
              </CardTitle>
              <CardDescription>
                Performant, flexible forms with easy validation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Performance</h3>
                  <p className="text-sm text-muted-foreground">
                    Minimal re-renders and fast validation
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <FormInput className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Developer Experience</h3>
                  <p className="text-sm text-muted-foreground">
                    Simple API with TypeScript support
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <AlertCircle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Validation</h3>
                  <p className="text-sm text-muted-foreground">
                    Built-in and custom validation rules
                  </p>
                </div>
              </div>

              <CodeExample
                title="Basic React Hook Form Setup"
                code={`import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  age: z.number().min(18, 'Must be at least 18 years old'),
});

type FormData = z.infer<typeof schema>;

function MyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      {errors.name && <span>{errors.name.message}</span>}
      
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      
      <input {...register('age', { valueAsNumber: true })} />
      {errors.age && <span>{errors.age.message}</span>}
      
      <button type="submit" disabled={isSubmitting}>
        Submit
      </button>
    </form>
  );
}`}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Features</CardTitle>
              <CardDescription>
                What makes React Hook Form powerful
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 text-green-600">Performance Benefits</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <Badge variant="secondary" className="mr-2 mt-0.5">✓</Badge>
                      Uncontrolled components (minimal re-renders)
                    </li>
                    <li className="flex items-start">
                      <Badge variant="secondary" className="mr-2 mt-0.5">✓</Badge>
                      Subscription-based form state
                    </li>
                    <li className="flex items-start">
                      <Badge variant="secondary" className="mr-2 mt-0.5">✓</Badge>
                      Lazy validation and async validation
                    </li>
                    <li className="flex items-start">
                      <Badge variant="secondary" className="mr-2 mt-0.5">✓</Badge>
                      Built-in performance optimizations
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3 text-blue-600">Developer Features</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• TypeScript support out of the box</li>
                    <li>• Integration with validation libraries</li>
                    <li>• Field arrays and dynamic forms</li>
                    <li>• Custom hooks and components</li>
                    <li>• DevTools for debugging</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="simple" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Simple Form Example</CardTitle>
              <CardDescription>
                Basic form with validation and error handling
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SimpleForm />
            </CardContent>
          </Card>

          <CodeExample
            title="Simple Form Implementation"
            code={`import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  age: z.number().min(18, 'Must be at least 18 years old'),
});

type FormData = z.infer<typeof schema>;

function SimpleForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Form data:', data);
    reset(); // Clear form after submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          {...register('name')}
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="age">Age</label>
        <input
          id="age"
          type="number"
          {...register('age', { valueAsNumber: true })}
          className={errors.age ? 'border-red-500' : ''}
        />
        {errors.age && (
          <p className="text-red-500 text-sm">{errors.age.message}</p>
        )}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}`}
          />
        </TabsContent>

        <TabsContent value="complex" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Complex Form Example</CardTitle>
              <CardDescription>
                Multi-section form with nested objects, arrays, and conditional fields
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ComplexForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Form Example</CardTitle>
              <CardDescription>
                Advanced patterns with dynamic fields, real-time validation, and custom components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AdvancedForm />
            </CardContent>
          </Card>

          <CodeExample
            title="Advanced Form Patterns"
            code={`// Custom hook for form validation
function useAdvancedForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange', // Real-time validation
    defaultValues: {
      socialLinks: [],
    },
  });

  // Custom validation trigger
  const validateUsername = async (username: string) => {
    const response = await fetch(\`/api/check-username?username=\${username}\`);
    const { available } = await response.json();
    return available || 'Username is already taken';
  };

  return {
    ...form,
    validateUsername,
  };
}

// Field Array for dynamic fields
function SocialLinksField({ control, register }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'socialLinks',
  });

  return (
    <div>
      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-2">
          <input {...register(\`socialLinks.\${index}.platform\`)} />
          <input {...register(\`socialLinks.\${index}.url\`)} />
          <button onClick={() => remove(index)}>Remove</button>
        </div>
      ))}
      <button onClick={() => append({ platform: '', url: '' })}>
        Add Social Link
      </button>
    </div>
  );
}

// Custom validation with async rules
const advancedSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .refine(async (username) => {
      const response = await fetch(\`/api/check-username?username=\${username}\`);
      const { available } = await response.json();
      return available;
    }, 'Username is already taken'),
});`}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}