'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Check, Copy, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(8, {
      message: 'Password must be at least 8 characters.',
    }),
    newPassword: z.string().min(8, {
      message: 'Password must be at least 8 characters.',
    }),
    confirmPassword: z.string().min(8, {
      message: 'Password must be at least 8 characters.',
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const securityFormSchema = z.object({
  twoFactorAuth: z.boolean().default(false),
  sessionTimeout: z.boolean().default(false),
});

type PasswordFormValues = z.infer<typeof passwordFormSchema>;
type SecurityFormValues = z.infer<typeof securityFormSchema>;

export function SecurityForm() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('ABCDEF123456');

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const securityForm = useForm<SecurityFormValues>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      twoFactorAuth: false,
      sessionTimeout: false,
    },
  });

  function onPasswordSubmit(data: PasswordFormValues) {
    toast({
      title: 'Password updated',
      description: 'Your password has been updated successfully.',
    });
    console.log(data);
    passwordForm.reset();
  }

  function onSecuritySubmit(data: SecurityFormValues) {
    toast({
      title: 'Security settings updated',
      description: 'Your security settings have been updated successfully.',
    });
    console.log(data);

    if (data.twoFactorAuth && !showTwoFactorSetup) {
      setShowTwoFactorSetup(true);
    }
  }

  function sendVerificationEmail() {
    toast({
      title: 'Verification email sent',
      description: 'Please check your inbox for the verification link.',
    });
    setIsEmailVerified(false);
  }

  function copyTwoFactorCode() {
    navigator.clipboard.writeText(twoFactorCode);
    toast({
      title: 'Code copied',
      description: 'Two-factor authentication code copied to clipboard.',
    });
    setTwoFactorCode('ABCDEF123456');
  }

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>Email Verification</CardTitle>
          <CardDescription>
            Verify your email address to secure your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isEmailVerified ? (
            <Alert className='bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900/30'>
              <Check className='h-4 w-4 text-green-600 dark:text-green-400' />
              <AlertTitle>Email verified</AlertTitle>
              <AlertDescription>
                Your email address has been verified.
              </AlertDescription>
            </Alert>
          ) : (
            <div className='space-y-4'>
              <Alert variant='destructive'>
                <AlertCircle className='h-4 w-4' />
                <AlertTitle>Email not verified</AlertTitle>
                <AlertDescription>
                  Please verify your email address to secure your account.
                </AlertDescription>
              </Alert>
              <Button onClick={sendVerificationEmail}>
                Send verification email
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your password to keep your account secure.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
              className='space-y-8'
            >
              <FormField
                control={passwordForm.control}
                name='currentPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <div className='relative'>
                      <FormControl>
                        <Input
                          type={showCurrentPassword ? 'text' : 'password'}
                          placeholder='Enter your current password'
                          {...field}
                        />
                      </FormControl>
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                      >
                        {showCurrentPassword ? (
                          <EyeOff className='h-4 w-4' />
                        ) : (
                          <Eye className='h-4 w-4' />
                        )}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name='newPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <div className='relative'>
                      <FormControl>
                        <Input
                          type={showNewPassword ? 'text' : 'password'}
                          placeholder='Enter your new password'
                          {...field}
                        />
                      </FormControl>
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className='h-4 w-4' />
                        ) : (
                          <Eye className='h-4 w-4' />
                        )}
                      </Button>
                    </div>
                    <FormDescription>
                      Password must be at least 8 characters long.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <div className='relative'>
                      <FormControl>
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder='Confirm your new password'
                          {...field}
                        />
                      </FormControl>
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className='h-4 w-4' />
                        ) : (
                          <Eye className='h-4 w-4' />
                        )}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type='submit'>Update password</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>
            Manage your security settings and two-factor authentication.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...securityForm}>
            <form
              onSubmit={securityForm.handleSubmit(onSecuritySubmit)}
              className='space-y-8'
            >
              <FormField
                control={securityForm.control}
                name='twoFactorAuth'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-base'>
                        Two-factor Authentication
                      </FormLabel>
                      <FormDescription>
                        Add an extra layer of security to your account.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {showTwoFactorSetup && (
                <div className='rounded-lg border p-4 space-y-4'>
                  <div className='space-y-2'>
                    <h4 className='font-medium'>
                      Set up Two-factor Authentication
                    </h4>
                    <p className='text-sm text-muted-foreground'>
                      Scan the QR code with your authenticator app or enter the
                      code manually.
                    </p>
                  </div>
                  <div className='flex justify-center'>
                    <div className='bg-white p-4 rounded-lg'>
                      <div className='relative w-40 h-40'>
                        <Image
                          src='/placeholder.svg?height=200&width=200'
                          alt='Two-factor authentication QR code'
                          fill
                        />
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Input
                      value={twoFactorCode}
                      readOnly
                      className='font-mono'
                    />
                    <Button
                      type='button'
                      variant='outline'
                      size='icon'
                      onClick={copyTwoFactorCode}
                    >
                      <Copy className='h-4 w-4' />
                    </Button>
                  </div>
                  <div className='space-y-2'>
                    <h4 className='font-medium'>Verify Code</h4>
                    <p className='text-sm text-muted-foreground'>
                      Enter the 6-digit code from your authenticator app.
                    </p>
                    <div className='flex space-x-2'>
                      <Input placeholder='Enter verification code' />
                      <Button type='button'>Verify</Button>
                    </div>
                  </div>
                </div>
              )}

              <FormField
                control={securityForm.control}
                name='sessionTimeout'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-base'>
                        Automatic Session Timeout
                      </FormLabel>
                      <FormDescription>
                        Automatically log out after 30 minutes of inactivity.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type='submit'>Update security settings</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
