import { RealtimeChannel, Session } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

import { supaClient } from '../supa-client'

export interface UserProfile {
  username: string
  avatarUrl: string
}

export interface SupashipUserInfo {
  session: Session | null
  profile: UserProfile | null
}

export const useSession = (): SupashipUserInfo => {
  const [userInfo, setUserInfo] = useState<SupashipUserInfo>({
    profile: null,
    session: null,
  })

  const [channel, setChannel] = useState<RealtimeChannel | null>(null)

  const listenToUserProfileChanges = async (userId: string): Promise<RealtimeChannel> => {
    const { data } = await supaClient
      .from('user_profiles')
      .select('*')
      .filter('user_id', 'eq', userId)

    if (data?.[0]) {
      setUserInfo((prev) => ({ ...prev, profile: data[0] as unknown as UserProfile }))
    }

    return supaClient
      .channel('public:user_profiles')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_profiles',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setUserInfo((prev) => ({ ...prev, profile: payload.new as UserProfile }))
        }
      )
      .subscribe()
  }

  useEffect(() => {
    supaClient.auth.getSession().then(({ data: { session } }) => {
      setUserInfo((prev) => ({ ...prev, session }))

      supaClient.auth.onAuthStateChange((_event, session) => {
        setUserInfo({ session, profile: null })
      })
    })
  }, [])

  useEffect(() => {
    const hasUserButNoProfile = !!userInfo.session?.user && !userInfo.profile
    const userDoesntExist = !userInfo.session?.user

    if (hasUserButNoProfile) {
      listenToUserProfileChanges(userInfo.session?.user.id as string).then((newChannel) => {
        if (channel) {
          channel.unsubscribe()
        }
        setChannel(newChannel)
      })
    } else if (userDoesntExist) {
      channel?.unsubscribe()
      setChannel(null)
    }
  }, [userInfo.session])

  return userInfo
}
