import type { Question } from '../data/questions'
import type { AnswerValue } from '../types'

export function isVisible(question: Question, answers: Record<string, AnswerValue>): boolean {
  if (!question.dependsOn) return true
  const dep = answers[question.dependsOn.questionId]
  if (typeof question.dependsOn.value === 'boolean') return dep === question.dependsOn.value
  if (Array.isArray(dep)) return dep.includes(question.dependsOn.value)
  return dep === question.dependsOn.value
}

export function toggleMultiValue(current: string[] | undefined, option: string): string[] {
  const set = new Set(current ?? [])
  if (set.has(option)) set.delete(option)
  else set.add(option)
  return Array.from(set)
}
