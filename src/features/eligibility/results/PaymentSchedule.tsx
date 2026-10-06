import { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { formatCurrency } from '../../../lib/format';
import type { PaymentScheduleItem } from '../../../types/loans';

interface Props {
  schedule: PaymentScheduleItem[];
}

const INITIAL_ROWS = 6;

export function PaymentSchedule({ schedule }: Props) {
  const [expanded, setExpanded] = useState(false);
  const rows = expanded ? schedule : schedule.slice(0, INITIAL_ROWS);

  if (schedule.length === 0) return null;

  return (
    <Card
      title="Payment schedule"
      description="A month-by-month breakdown of your estimated repayments."
    >
      <div className="flex flex-col gap-3 sm:hidden">
        {rows.map((row) => (
          <div
            key={row.month}
            className="rounded-xl border border-slate-200 p-3 dark:border-white/10"
          >
            <div className="flex items-center justify-between text-sm font-medium">
              <span>Month {row.month}</span>
              <span>{formatCurrency(row.payment)}</span>
            </div>
            <dl className="mt-2 grid grid-cols-2 gap-2 text-xs">
              <div>
                <dt className="text-slate-500">Principal</dt>
                <dd>{formatCurrency(row.principal)}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Interest</dt>
                <dd>{formatCurrency(row.interest)}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-slate-500">Balance</dt>
                <dd>{formatCurrency(row.balance)}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>

      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500 dark:border-white/10">
              <th className="py-2 pr-4 font-medium">Month</th>
              <th className="py-2 pr-4 font-medium">Payment</th>
              <th className="py-2 pr-4 font-medium">Principal</th>
              <th className="py-2 pr-4 font-medium">Interest</th>
              <th className="py-2 font-medium">Balance</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.month}
                className="border-b border-slate-100 last:border-0 dark:border-white/10"
              >
                <td className="py-2 pr-4">{row.month}</td>
                <td className="py-2 pr-4">{formatCurrency(row.payment)}</td>
                <td className="py-2 pr-4">{formatCurrency(row.principal)}</td>
                <td className="py-2 pr-4">{formatCurrency(row.interest)}</td>
                <td className="py-2">{formatCurrency(row.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {schedule.length > INITIAL_ROWS && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          {expanded ? 'Show less' : `Show all ${schedule.length} months`}
        </button>
      )}
    </Card>
  );
}