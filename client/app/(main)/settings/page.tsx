'use client';

import { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ProfileForm } from '@/components/settings/profile-form';
import { AccountForm } from '@/components/settings/account-form';
import { AppearanceForm } from '@/components/settings/appearance-form';
import { NotificationsForm } from '@/components/settings/notifications-form';
import { SecurityForm } from '@/components/settings/security-form';
import { SettingsSidebar } from '@/components/settings/settings-sidebar';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className='container mx-auto max-w-7xl'>
      <div className='space-y-0.5'>
        <h2 className='text-2xl font-bold tracking-tight'>Settings</h2>
        <p className='text-muted-foreground'>
          Manage your account settings and set e-mail preferences.
        </p>
      </div>
      <Separator className='my-6' />
      <div className='flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 mx-auto'>
        <aside className='lg:w-1/5'>
          <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </aside>
        <div className='flex-1 lg:max-w-3xl'>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className='space-y-6'
          >
            <TabsContent value='profile' className='space-y-6'>
              <ProfileForm />
            </TabsContent>
            <TabsContent value='account' className='space-y-6'>
              <AccountForm />
            </TabsContent>
            <TabsContent value='appearance' className='space-y-6'>
              <AppearanceForm />
            </TabsContent>
            <TabsContent value='notifications' className='space-y-6'>
              <NotificationsForm />
            </TabsContent>
            <TabsContent value='security' className='space-y-6'>
              <SecurityForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
