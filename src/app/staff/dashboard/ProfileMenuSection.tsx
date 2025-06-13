import { ProfileMenu } from '@/components/layout/ProfileMenu';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileMenuSection() {
  const { user } = useAuth();
  return (
    <div className="flex justify-end w-full mb-8">
      <ProfileMenu user={{ name: user?.name || 'James Aldrino', avatarUrl: user?.avatarUrl }} />
    </div>
  );
}
