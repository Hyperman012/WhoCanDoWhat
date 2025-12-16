import { LegacyAccess } from './LegacyAccess'

export function App() {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 shadow">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold">Who Can Do What?</h1>
          </div>
        </div>

        <hr className="my-4 border-slate-800" />

        <LegacyAccess />
      </div>
    </div>
  )
}
