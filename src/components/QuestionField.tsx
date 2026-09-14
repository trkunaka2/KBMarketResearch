import type { Question } from '../data/questions'
import type { AnswerValue } from '../types'
import { toggleMultiValue } from '../lib/answers'

interface Props {
  question: Question
  value: AnswerValue
  otherValue?: string
  onChange: (value: AnswerValue) => void
  onOtherChange?: (value: string) => void
}

const optionBase =
  'w-full text-left rounded-xl border px-4 py-3 text-[15px] leading-snug transition-colors active:scale-[0.99]'
const optionOn =
  'border-blueberry-500 bg-blueberry-50 text-blueberry-800 dark:bg-blueberry-500/20 dark:border-blueberry-400 dark:text-blueberry-100'
const optionOff =
  'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-neutral-600'

export function QuestionField({ question, value, otherValue, onChange, onOtherChange }: Props) {
  if (question.type === 'text') {
    return (
      <textarea
        value={(value as string) ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={question.placeholder ?? 'Type their answer…'}
        rows={2}
        className="w-full resize-y rounded-xl border border-neutral-200 bg-white px-4 py-3 text-[15px] text-neutral-800 outline-none focus:border-blueberry-400 focus:ring-2 focus:ring-blueberry-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:ring-blueberry-500/20"
      />
    )
  }

  if (question.type === 'boolean') {
    const trueLabel = question.trueLabel ?? 'Yes'
    const falseLabel = question.falseLabel ?? 'No'
    return (
      <div className="flex gap-3">
        {[true, false].map((opt) => (
          <button
            key={String(opt)}
            type="button"
            onClick={() => onChange(opt)}
            className={`${optionBase} flex-1 text-center font-medium ${value === opt ? optionOn : optionOff}`}
          >
            {opt ? trueLabel : falseLabel}
          </button>
        ))}
      </div>
    )
  }

  const options = question.options
  const isMulti = question.type === 'multi'
  const selected = isMulti ? ((value as string[]) ?? []) : value ? [value as string] : []
  const showOther = question.otherId && selected.includes('Other')

  const handlePick = (opt: string) => {
    if (isMulti) {
      onChange(toggleMultiValue(selected, opt))
    } else {
      onChange(value === opt ? undefined : opt)
    }
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => handlePick(opt)}
            className={`${optionBase} ${selected.includes(opt) ? optionOn : optionOff}`}
          >
            {opt}
          </button>
        ))}
      </div>
      {showOther && (
        <input
          value={otherValue ?? ''}
          onChange={(e) => onOtherChange?.(e.target.value)}
          placeholder="Tell us more…"
          className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-[15px] outline-none focus:border-caramel-400 focus:ring-2 focus:ring-caramel-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:ring-caramel-500/20"
        />
      )}
    </div>
  )
}
