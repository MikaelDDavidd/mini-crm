import { useState } from 'react'
import { User, Mail, Calendar, Camera } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { AppLayout } from '@/components/layout/AppLayout'

export function Settings() {
  const { user, profile } = useAuth()
  const [uploading, setUploading] = useState(false)

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        return
      }

      const file = event.target.files[0]

      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg']
      if (!allowedTypes.includes(file.type)) {
        alert('Only PNG and JPG images are allowed')
        setUploading(false)
        return
      }

      const fileExt = file.name.split('.').pop()
      const fileName = `${user?.id}-${Math.random()}.${fileExt}`
      const filePath = fileName

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user?.id)

      if (updateError) throw updateError

      window.location.reload()
    } catch (error) {
      console.error('Error uploading avatar:', error)
      alert('Error uploading avatar')
    } finally {
      setUploading(false)
    }
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Not set'

    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch {
      return 'Not set'
    }
  }

  return (
    <AppLayout title="Settings">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-[#EAECF0] overflow-hidden">
          <div className="bg-gradient-to-r from-[#7F56D9] to-[#6941C6] h-32" />

          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 mb-6">
              <div className="relative inline-block">
                <div
                  className="size-32 rounded-full border-4 border-white bg-center bg-cover bg-no-repeat"
                  style={{
                    backgroundImage: profile?.avatar_url
                      ? `url(${profile.avatar_url})`
                      : `url(https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email})`,
                  }}
                />
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-2 right-2 size-10 bg-[#7F56D9] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#6941C6] transition-colors shadow-lg"
                >
                  <Camera className="h-5 w-5 text-white" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleAvatarUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[#101828] mb-1">
                  {profile?.full_name || user?.email?.split('@')[0] || 'User'}
                </h2>
              </div>

              <div className="border-t border-[#EAECF0] pt-6">
                <h3 className="text-lg font-semibold text-[#101828] mb-4">
                  Account Information
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 p-2 bg-[#F9FAFB] rounded-lg">
                      <Mail className="h-5 w-5 text-[#7F56D9]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#344054]">Email</p>
                      <p className="text-base text-[#101828]">{user?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-1 p-2 bg-[#F9FAFB] rounded-lg">
                      <User className="h-5 w-5 text-[#7F56D9]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#344054]">Full Name</p>
                      <p className="text-base text-[#101828]">
                        {profile?.full_name || 'Not set'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-1 p-2 bg-[#F9FAFB] rounded-lg">
                      <Calendar className="h-5 w-5 text-[#7F56D9]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#344054]">Member Since</p>
                      <p className="text-base text-[#101828]">
                        {formatDate(user?.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#EAECF0] pt-6">
                <h3 className="text-lg font-semibold text-[#101828] mb-4">
                  Account ID
                </h3>
                <div className="bg-[#F9FAFB] rounded-lg p-4">
                  <p className="text-sm font-mono text-[#667085] break-all">
                    {user?.id}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
