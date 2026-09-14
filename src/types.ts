export type AnswerValue = string | string[] | boolean | undefined

export interface Entry {
  id: string
  createdAt: string // ISO timestamp
  notes?: string
  answers: Record<string, AnswerValue>
}

export interface Settings {
  /** Target number of survey responses the team is aiming to collect. */
  goal: number
}
