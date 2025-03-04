'use client';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

const accountFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  dob: z.date({
    required_error: 'A date of birth is required.',
  }),
  language: z.string({
    required_error: 'Please select a language.',
  }),
  timezone: z.string({
    required_error: 'Please select a timezone.',
  }),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

export function AccountForm() {
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: 'John Doe',
      language: 'en',
      timezone: 'utc-5',
    },
  });

  function onSubmit(data: AccountFormValues) {
    toast({
      title: 'Account updated',
      description: 'Your account settings have been updated successfully.',
    });
    console.log(data);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>
          Update your account settings. Set your preferred language and
          timezone.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Your name' {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the name that will be displayed on your profile and
                    in emails.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='dob'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Date of birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Your date of birth is used to calculate your age.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='language'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Language</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select language' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='en'>English</SelectItem>
                      <SelectItem value='fr'>French</SelectItem>
                      <SelectItem value='de'>German</SelectItem>
                      <SelectItem value='es'>Spanish</SelectItem>
                      <SelectItem value='pt'>Portuguese</SelectItem>
                      <SelectItem value='ja'>Japanese</SelectItem>
                      <SelectItem value='zh'>Chinese</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    This is the language that will be used in the dashboard.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='timezone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timezone</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select timezone' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='utc-12'>UTC-12:00</SelectItem>
                      <SelectItem value='utc-11'>UTC-11:00</SelectItem>
                      <SelectItem value='utc-10'>UTC-10:00</SelectItem>
                      <SelectItem value='utc-9'>UTC-09:00</SelectItem>
                      <SelectItem value='utc-8'>UTC-08:00</SelectItem>
                      <SelectItem value='utc-7'>UTC-07:00</SelectItem>
                      <SelectItem value='utc-6'>UTC-06:00</SelectItem>
                      <SelectItem value='utc-5'>UTC-05:00</SelectItem>
                      <SelectItem value='utc-4'>UTC-04:00</SelectItem>
                      <SelectItem value='utc-3'>UTC-03:00</SelectItem>
                      <SelectItem value='utc-2'>UTC-02:00</SelectItem>
                      <SelectItem value='utc-1'>UTC-01:00</SelectItem>
                      <SelectItem value='utc'>UTC</SelectItem>
                      <SelectItem value='utc+1'>UTC+01:00</SelectItem>
                      <SelectItem value='utc+2'>UTC+02:00</SelectItem>
                      <SelectItem value='utc+3'>UTC+03:00</SelectItem>
                      <SelectItem value='utc+4'>UTC+04:00</SelectItem>
                      <SelectItem value='utc+5'>UTC+05:00</SelectItem>
                      <SelectItem value='utc+6'>UTC+06:00</SelectItem>
                      <SelectItem value='utc+7'>UTC+07:00</SelectItem>
                      <SelectItem value='utc+8'>UTC+08:00</SelectItem>
                      <SelectItem value='utc+9'>UTC+09:00</SelectItem>
                      <SelectItem value='utc+10'>UTC+10:00</SelectItem>
                      <SelectItem value='utc+11'>UTC+11:00</SelectItem>
                      <SelectItem value='utc+12'>UTC+12:00</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Your timezone will be used to display dates and times
                    correctly.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type='submit'>Update account</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
