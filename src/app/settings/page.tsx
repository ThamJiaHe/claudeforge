import { ApiKeySettings } from '@/components/settings/api-key-settings';
import { PreferencesSettings } from '@/components/settings/preferences-settings';

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your API key and preferences
        </p>
      </div>
      <ApiKeySettings />
      <PreferencesSettings />
    </div>
  );
}
