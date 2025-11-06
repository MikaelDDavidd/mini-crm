import { AppLayout } from '@/components/layout/AppLayout'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { LeadsTable } from '@/components/dashboard/LeadsTable'
import { ActivityChart } from '@/components/dashboard/ActivityChart'
import { LeadsByStatusChart } from '@/components/dashboard/LeadsByStatusChart'
import { LeadsBySourceChart } from '@/components/dashboard/LeadsBySourceChart'
import { useLeads, useLeadStats } from '@/hooks/useLeads'
import {
  Users,
  UserCheck,
  CheckCircle,
  TrendingUp,
  Sparkles,
  XCircle,
} from 'lucide-react'

export function Dashboard() {
  const { data: leads = [], isLoading: leadsLoading } = useLeads()
  const { data: stats, isLoading: statsLoading } = useLeadStats()

  const recentLeads = leads.slice(0, 5)

  return (
    <AppLayout title="Dashboard">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <StatsCard
            icon={Users}
            label="Total Leads"
            value={statsLoading ? '...' : stats?.total || 0}
          />
          <StatsCard
            icon={UserCheck}
            label="Active Leads"
            value={statsLoading ? '...' : stats?.active || 0}
          />
          <StatsCard
            icon={CheckCircle}
            label="Converted"
            value={statsLoading ? '...' : stats?.won || 0}
            iconColor="text-[#027A48]"
          />
          <StatsCard
            icon={TrendingUp}
            label="Conversion Rate"
            value={statsLoading ? '...' : `${stats?.conversionRate}%`}
            iconColor="text-[#027A48]"
          />
          <StatsCard
            icon={Sparkles}
            label="New Today"
            value={statsLoading ? '...' : stats?.newToday || 0}
          />
          <StatsCard
            icon={XCircle}
            label="Lost"
            value={statsLoading ? '...' : stats?.lost || 0}
            iconColor="text-[#C11574]"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ActivityChart leads={leads} />
          </div>
          <div>
            <LeadsByStatusChart leads={leads} />
          </div>
        </div>

        <div>
          <LeadsBySourceChart leads={leads} />
        </div>

        {/* Recent Leads */}
        <div>
          <h2 className="text-[#101828] text-xl font-semibold leading-tight tracking-[-0.015em] pb-3 pt-8">
            Recent Leads
          </h2>
          {leadsLoading ? (
            <div className="bg-white rounded-xl border border-[#EAECF0] p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : (
            <LeadsTable leads={recentLeads} />
          )}
        </div>
      </div>
    </AppLayout>
  )
}
