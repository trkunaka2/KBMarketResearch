// Survey schema for the Kestrel Bags tote bag market research questionnaire.
// Mirrors the 15 questions in the source PDF 1:1 so entries map cleanly back to it.

export type QuestionType = 'single' | 'multi' | 'text' | 'boolean'

interface BaseQuestion {
  id: string
  number: number
  prompt: string
  /** Only render this question when the given question's answer matches/includes `value`. */
  dependsOn?: { questionId: string; value: string | boolean }
}

export interface ChoiceQuestion extends BaseQuestion {
  type: 'single' | 'multi'
  options: string[]
  /** Adds a free-text "Other" option; answers store the option label "Other" plus this id holds the detail. */
  otherId?: string
}

export interface TextQuestion extends BaseQuestion {
  type: 'text'
  placeholder?: string
}

export interface BooleanQuestion extends BaseQuestion {
  type: 'boolean'
  trueLabel?: string
  falseLabel?: string
}

export type Question = ChoiceQuestion | TextQuestion | BooleanQuestion

export const QUESTIONS: Question[] = [
  {
    id: 'situations',
    number: 1,
    type: 'multi',
    prompt: 'Which situation would make you choose a tote bag over your usual handbag/backpack?',
    options: [
      'Going to class',
      'Going to work',
      'Running errands',
      'Travelling',
      'Carrying a laptop',
      'Shopping',
      'None of the above',
    ],
  },
  {
    id: 'dealbreakerFeature',
    number: 2,
    type: 'text',
    prompt:
      'Pretend you find a tote bag that looks EXACTLY how you want it to look — what practical feature would still make you decide not to buy it?',
  },
  {
    id: 'priceRange',
    number: 3,
    type: 'single',
    prompt: 'How much are you willing to pay for a high quality tote bag?',
    options: ['Under R150', 'R150–R249', 'R250–R399', 'R400–R500', 'R600+'],
  },
  {
    id: 'worthPremium',
    number: 3,
    type: 'text',
    prompt: 'What would make a tote bag feel worth paying R400+ instead of a cheaper, flimsy one?',
  },
  {
    id: 'styleVsFunction',
    number: 4,
    type: 'single',
    prompt:
      'Would you rather have an aesthetically pleasing bag with fewer practical features, or a highly functional tote bag with a simple design?',
    options: [
      'Aesthetically pleasing bag with fewer practical features',
      'Highly functional tote bag with a simple design',
      'A good mix of both',
    ],
  },
  {
    id: 'changeOneThing',
    number: 5,
    type: 'text',
    prompt: 'If you could change one thing about the tote bags currently available to you, what would it be?',
  },
  {
    id: 'discomfortFactors',
    number: 6,
    type: 'multi',
    prompt: 'When you are carrying your tote bag for hours, what makes it uncomfortable?',
    options: [
      'Handles breaking',
      'Handles uncomfortable around your shoulder',
      'Fabric is uncomfortable',
      'Bag losing its shape',
      'Other',
    ],
    otherId: 'discomfortOther',
  },
  {
    id: 'typicalItems',
    number: 7,
    type: 'text',
    prompt: 'What do you usually have to carry in your bag on a typical/standard day?',
  },
  {
    id: 'ownsToteBag',
    number: 8,
    type: 'boolean',
    prompt: 'Do you own a tote bag?',
  },
  {
    id: 'frustrations',
    number: 8,
    type: 'multi',
    prompt: 'What are the things that frustrate you about your tote bag most?',
    options: ['Fabric tearing', 'No pockets/compartments', 'Not enough space', 'Difficult to clean', 'Other'],
    otherId: 'frustrationsOther',
    dependsOn: { questionId: 'ownsToteBag', value: true },
  },
  {
    id: 'reasonNoTote',
    number: 9,
    type: 'text',
    prompt: "If you don't own a tote bag, what is the reason?",
    dependsOn: { questionId: 'ownsToteBag', value: false },
  },
  {
    id: 'designOwn',
    number: 10,
    type: 'text',
    prompt: 'If you could design your own tote bag, what would you add and what would you change?',
  },
  {
    id: 'sizePreference',
    number: 11,
    type: 'single',
    prompt: 'What size tote bag would you prefer?',
    options: [
      'Small – essentials only',
      'Medium – everyday items',
      'Large – laptop/books/clothing',
      'Extra large – shopping and travelling',
    ],
  },
  {
    id: 'usageFrequency',
    number: 12,
    type: 'single',
    prompt: 'How often do you use a tote bag?',
    options: ['Daily', 'A few times a week', 'Weekly', 'Occasionally', 'Rarely', 'Never'],
  },
  {
    id: 'importantQualities',
    number: 13,
    type: 'multi',
    prompt: 'What are the most important qualities you look for in a tote bag?',
    options: [
      'Durability',
      'Size/capacity',
      'Comfort',
      'Design aesthetics',
      'Price',
      'Quality of fabrics',
      'Sustainability',
      'Other',
    ],
    otherId: 'qualitiesOther',
  },
  {
    id: 'buyingFeatures',
    number: 14,
    type: 'multi',
    prompt: 'What features make you buy a tote bag?',
    options: ['Inside compartments', 'Zip closures', 'Key holder', 'Fabric choice', 'Laptop compartment'],
  },
  {
    id: 'stylePreference',
    number: 15,
    type: 'single',
    prompt: 'What style of tote bag would you be most interested in?',
    options: ['Minimalistic', 'Trend forward', 'Classic', 'Sporty', 'Luxurious', 'Artistic/unique'],
  },
]

export const CHOICE_QUESTIONS = QUESTIONS.filter(
  (q): q is ChoiceQuestion => q.type === 'single' || q.type === 'multi',
)

export function getQuestion(id: string): Question | undefined {
  return QUESTIONS.find((q) => q.id === id)
}
