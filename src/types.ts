export type AnswerValue = string | string[] | boolean | undefined

export const RECORDERS = ['Stephanie', 'Tendayi', 'Other'] as const
export type Recorder = (typeof RECORDERS)[number]

export interface Entry {
  id: string
  createdAt: string // ISO timestamp
  recordedBy: Recorder
  notes?: string
  answers: Record<string, AnswerValue>
}

export interface Settings {
  /** Target number of survey responses the team is aiming to collect. */
  goal: number
}
