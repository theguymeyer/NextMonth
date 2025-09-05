import { supabase } from '../supabaseClient'

/**
 * Save monthly insights for the logged-in user
 * @param {Object} insights - calculated insights object
 * @param {string} month - e.g. "August"
 * @param {string} year - e.g. "2025"
 */
export async function saveInsights(insights, month, year) {
  // get the logged-in user
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()

  if (userError) throw userError
  if (!user) throw new Error('No logged-in user found')

  // insert into monthly_insights
  const { error } = await supabase.from('monthly_insights').insert([
    {
      user_id: user.id,
      month,
      year,
      income_total: insights.incomeTotal,
      foreseeable_total: insights.foreseeableTotal,
      unforeseeable_total: insights.unforeseeableTotal,
      net: insights.net,
      buffer_target: insights.bufferTarget ?? 0,
      reserve_now: insights.reserveNow ?? 0,
      investable_now: insights.investableNow ?? 0
    }
  ])

  if (error) throw error
  return true
}
