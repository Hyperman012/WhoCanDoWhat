import {useMemo, useState} from 'react'
import {Env, PermId, perms, Role} from "./seeds";

export function LegacyAccess() {
  const [role, setRole] = useState<Role>('Support')
  const [env, setEnv] = useState<Env>('staging')
  const [mfa, setMfa] = useState(false)
  const [showHelp, setShowHelp] = useState(true)

  const effective = useMemo(() => {
    const allow: Record<PermId, boolean> = {
      'users.read': false,
      'billing.refund': false,
      'users.impersonate': false,
    }

    if (role === 'Admin') {
      allow['users.read'] = true
      allow['billing.refund'] = true
      allow['users.impersonate'] = true
    } else {
      allow['users.read'] = true
    }

    if (env === 'prod' && allow['billing.refund'] && !mfa) allow['billing.refund'] = false
    if (allow['users.impersonate']) allow['billing.refund'] = false

    return allow
  }, [role, env, mfa])

  function statusFor(id: PermId) {
    if (id === 'billing.refund' && env === 'prod' && role === 'Admin' && !mfa) return { tone: 'warn', text: 'Blocked (needs MFA)' }
    if (id === 'users.impersonate' && role === 'Support') return { tone: 'bad', text: 'Denied (support policy)' }
    if (id === 'billing.refund' && role === 'Support') return { tone: 'bad', text: 'Denied (support policy)' }
    return effective[id] ? { tone: 'good', text: 'Allowed' } : { tone: 'bad', text: 'Denied' }
  }

  const toneClass = (t: string) =>
    t === 'good' ? 'border-emerald-700 text-emerald-300'
    : t === 'warn' ? 'border-amber-700 text-amber-300'
    : 'border-rose-700 text-rose-300'

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 rounded-full border border-slate-700 px-3 py-1 text-sm">
          <span className="text-slate-400">Role</span>
          <select aria-label="role" className="bg-transparent" value={role} onChange={e => setRole(e.target.value as Role)}>
            <option>Admin</option>
            <option>Support</option>
          </select>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-slate-700 px-3 py-1 text-sm">
          <span className="text-slate-400">Env</span>
          <select aria-label="env" className="bg-transparent" value={env} onChange={e => setEnv(e.target.value as Env)}>
            <option value="staging">staging</option>
            <option value="prod">prod</option>
          </select>
        </div>

        <label className="flex items-center gap-2 rounded-full border border-slate-700 px-3 py-1 text-sm">
          <input aria-label="mfa" type="checkbox" checked={mfa} onChange={e => setMfa(e.target.checked)} />
          MFA
        </label>

        <label className="flex items-center gap-2 rounded-full border border-slate-700 px-3 py-1 text-sm">
          <input aria-label="show help" type="checkbox" checked={showHelp} onChange={e => setShowHelp(e.target.checked)} />
          Show help
        </label>
      </div>

      <div className="mt-4 rounded-lg border border-slate-800 bg-slate-950">
        <table className="w-full text-sm" aria-label="permissions table">
          <thead className="bg-slate-900">
            <tr>
              <th className="px-3 py-2 text-left">Permission</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Notes</th>
            </tr>
          </thead>
          <tbody>
            {perms.map(p => {
              const s = statusFor(p.id)
              return (
                <tr key={p.id} data-testid={`perm-${p.id}`} className="border-t border-slate-800" data-status={statusFor(p.id).text.toLowerCase()}>
                  <td className="px-3 py-2">
                    <div className="font-medium">{p.label}</div>
                    {showHelp && <div className="text-xs text-slate-400">{p.help}</div>}
                  </td>
                  <td className="px-3 py-2">
                    <span className={`inline-flex items-center gap-2 rounded-full border px-2 py-0.5 ${toneClass(s.tone)}`}>
                      {s.text}
                    </span>
                    <div className="mt-1 text-xs text-slate-400">
                      {p.id === 'billing.refund' && env === 'prod'
                        ? 'Policy: refunds require MFA in prod.'
                        : 'Policy: standard access rules apply.'}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-xs text-slate-400">
                    {p.id === 'users.read' && 'Low risk. Used by directory.'}
                    {p.id === 'billing.refund' && 'High risk. Audited action.'}
                    {p.id === 'users.impersonate' && 'Very high risk. Often denied.'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
