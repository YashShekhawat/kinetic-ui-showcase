import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { PRO_CONFIG } from '@/config/proConfig'

interface ProState {
  isPro: boolean
  isLoading: boolean
}

export function usePro(): ProState {
  const { user, session } = useAuth()
  const [isPro, setIsPro] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // If pro mode is disabled globally, everyone gets access
    if (!PRO_CONFIG.proModeEnabled) {
      setIsPro(true)
      setIsLoading(false)
      return
    }

    // No user = not pro
    if (!user || !session) {
      setIsPro(false)
      setIsLoading(false)
      return
    }

    // Fetch pro status from profiles table
    // Never trust localStorage or frontend flags
    const fetchProStatus = async () => {
      setIsLoading(true)

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('is_pro, is_active')
        .eq('id', user.id)
        .single()

      if (error || !profile) {
        setIsPro(false)
        setIsLoading(false)
        return
      }

      // Both is_pro AND is_active must be true
      setIsPro(profile.is_pro === true && profile.is_active === true)
      setIsLoading(false)
    }

    fetchProStatus()
  }, [user, session])

  return { isPro, isLoading }
}
