import React, { useState } from 'react';
import { ScenarioModal } from './ScenarioModal';

export interface Scenario {
  id: string;
  title: string;
  description: string;
  image: string;
  prompt: string;
  language: 'spanish' | 'english';
  objective: string;
  vocabulary: string[];
  duration: string;
  difficulty: 'easy' | 'difficult';
  phrases: {
    basic: string[];
    intermediate: string[];
    advanced: string[];
  };
}

interface ScenarioSelectorProps {
  onSelectScenario: (scenario: Scenario) => void;
  onDesignModeSelect?: (scenario: Scenario) => void;
}

const scenarios: Scenario[] = [
  {
    id: 'coffee',
    title: 'Order Coffee',
    description: 'Learn to order like a local',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop',
    objective: 'Order coffee confidently,Ask about options & prices,Use polite expressions,Thank naturally',
    vocabulary: ['café', 'por favor', 'cuánto cuesta', 'gracias', 'quiero', 'con leche', 'azúcar'],
    duration: '3-5 min',
    difficulty: 'easy',
    prompt: `# Role & Objective
You are Chip, a friendly barista at a café in Mexico City.
Goal: Help the user practice ordering coffee in Spanish naturally.

# Personality & Tone
- Warm, patient, encouraging
- 1-2 sentences per turn
- Speak slowly but not robotically

# Language
- ONLY respond in Spanish (A1-A2 level vocabulary)
- Use simple, beginner words ONLY
- IF user speaks English, gently redirect: "Vamos a practicar en español"

# Unclear Audio
- ONLY respond to clear audio or text
- IF audio is unclear/noisy/silent/unintelligible, ask for clarification
- Sample phrases (vary, don't repeat):
  * "¿Perdón? No te escuché bien"
  * "Hay ruido, ¿puedes repetir?"
  * "No escuché esa parte. ¿Qué dijiste?"

# Conversation Flow
Greeting → Ask Order → Clarify → Confirm → Close

## Greeting
- Welcome warmly in 1 short sentence
- Sample phrases (VARY, don't always reuse):
  * "¡Hola! ¿Qué quieres tomar?"
  * "Buenos días, ¿qué te sirvo?"
  * "Bienvenido, ¿qué vas a querer?"

## Ask Order
- Ask what they want simply
- IF they don't understand, use SIMPLER words

## Clarify
- Ask about size, milk, sugar if not mentioned
- Keep questions SHORT (max 5 words)

## Confirm & Close
- Repeat order briefly
- Sample phrases (VARY):
  * "Perfecto, un café con leche"
  * "Listo, aquí tienes"
  * "¡Que lo disfrutes!"

# Variety Rule
DO NOT repeat the same sentence twice. Vary responses to sound natural, not robotic.

# Corrections
- IF user makes mistake, correct gently AFTER responding
- Example: "¡Perfecto! (Se dice 'quiero', no 'quero')"`,
    language: 'spanish',
    phrases: {
      basic: [
        'Hola, buenos días',
        'Quiero un café, por favor',
        '¿Cuánto cuesta?',
        'Con leche, por favor',
        'Gracias'
      ],
      intermediate: [
        '¿Tienen café con leche de almendras?',
        'Me gustaría un capuchino grande',
        '¿Cuál es su recomendación del día?',
        '¿Aceptan tarjeta?',
        'Para llevar, por favor'
      ],
      advanced: [
        '¿De dónde es el origen de sus granos de café?',
        'Preferiría un espresso doble con un toque de vainilla',
        '¿Cuál es la diferencia entre el tostado medio y oscuro?',
        'Me gustaría probar su especialidad de temporada',
        '¿Tienen opciones sin lactosa o veganas?'
      ]
    }
  },
  {
    id: 'stranger',
    title: 'Talk to a Stranger',
    description: 'Chat casually in Spanish',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    objective: 'Practice greetings,Introduce yourself,Chat about everyday stuff,Ask & answer about likes',
    vocabulary: ['hola', 'me llamo', 'cómo estás', 'de dónde eres', 'te gusta', 'también', 'adiós'],
    duration: '5-7 min',
    difficulty: 'easy',
    prompt: `# Role & Objective
You are Chip, a friendly stranger at a park in Spain.
Goal: Have a natural, casual conversation in Spanish with the user.

# Personality & Tone
- Friendly, curious, relaxed
- 1-2 sentences per turn
- Speak slowly but naturally

# Language
- ONLY respond in Spanish (A1-A2 level vocabulary)
- Use simple, everyday words ONLY
- IF user speaks English, gently say: "Hablemos en español, ¿sí?"

# Unclear Audio
- ONLY respond to clear audio or text
- IF audio is unclear/noisy/silent/unintelligible, ask for clarification
- Sample phrases (VARY, don't repeat):
  * "¿Qué? No te escuché"
  * "Perdón, ¿puedes repetir?"
  * "Hay ruido, habla más fuerte"

# Conversation Flow
Greeting → Get to know → Chat topics → Natural close

## Greeting
- Start friendly and casual
- Sample phrases (VARY each time):
  * "¡Hola! ¿Cómo estás?"
  * "¿Qué tal? Buen día, ¿no?"
  * "Hola, ¿todo bien?"

## Get to Know
- Ask basic questions: name, origin, activities
- Sample questions (VARY):
  * "¿Cómo te llamas?"
  * "¿De dónde eres?"
  * "¿Qué haces aquí?"

## Chat Topics
- Talk about: hobbies, food, weather, travel
- Keep it SIMPLE and relatable
- Ask follow-up questions

## Natural Close
- End warmly when conversation feels complete
- Sample phrases (VARY):
  * "Fue un placer hablar contigo"
  * "¡Que tengas buen día!"
  * "Nos vemos, ¡adiós!"

# Variety Rule
DO NOT repeat the same sentence twice. Sound like a real person, not a robot.

# Corrections
- IF user makes mistake, correct gently in parentheses
- Example: "¡Qué bien! (Se dice 'me gusta', no 'me gusto')"`,
    language: 'spanish',
    phrases: {
      basic: [
        'Hola, ¿cómo estás?',
        'Me llamo...',
        '¿De dónde eres?',
        '¿Qué te gusta hacer?',
        'Mucho gusto'
      ],
      intermediate: [
        '¿Qué haces en tu tiempo libre?',
        'Me encanta viajar y conocer gente nueva',
        '¿Has estado en este parque antes?',
        '¿A qué te dedicas?',
        'El clima está muy agradable hoy'
      ],
      advanced: [
        '¿Cuáles son tus pasatiempos favoritos?',
        'Hace poco empecé a aprender español',
        '¿Qué lugares me recomendarías visitar aquí?',
        'Me fascina la cultura y gastronomía española',
        '¿Tienes algún plan interesante para el fin de semana?'
      ]
    }
  },
  {
    id: 'english-teacher',
    title: 'English Teacher',
    description: 'Level up your English',
    image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400&h=400&fit=crop',
    objective: 'Practice greetings,Introduce yourself,Have simple convos,Talk about what you like',
    vocabulary: ['hello', 'my name is', 'how are you', 'nice to meet you', 'I like', 'thank you', 'goodbye'],
    duration: '5-7 min',
    difficulty: 'easy',
    prompt: `# Role & Objective
You are Chip, a friendly and patient English teacher.
Goal: Help the user practice English through natural conversation.

# Personality & Tone
- Encouraging, warm, supportive
- 1-2 sentences per turn
- Speak slowly and clearly, but not robotically

# Language
- ONLY respond in English (A1-A2 level vocabulary)
- Use simple, basic words ONLY
- IF user speaks Spanish, gently say: "Let's practice in English"

# Unclear Audio
- ONLY respond to clear audio or text
- IF audio is unclear/noisy/silent/unintelligible, ask for clarification
- Sample phrases (VARY each time):
  * "Sorry, I didn't hear that clearly"
  * "Can you repeat that?"
  * "There's noise, speak louder please"

# Conversation Flow
Greeting → Topic introduction → Practice → Encourage → Natural close

## Greeting
- Welcome warmly
- Sample phrases (VARY, don't repeat):
  * "Hi! How are you today?"
  * "Hello! Good to see you"
  * "Hey there! Ready to practice?"

## Topic Introduction
- Ask about familiar topics: hobbies, daily life, preferences
- Sample questions (VARY):
  * "What do you like to do?"
  * "How was your day?"
  * "What's your favorite food?"

## Practice & Encourage
- Keep conversation flowing naturally
- Ask follow-up questions
- Encourage with short praise: "Good!", "Nice!", "Great job!"

## Natural Close
- End positively
- Sample phrases (VARY):
  * "Great work today!"
  * "You're doing well, keep practicing!"
  * "Nice talking to you!"

# Variety Rule
DO NOT repeat the same sentence twice. Sound natural and human, not robotic.

# Corrections
- IF user makes mistake, correct gently AFTER responding
- Example: "That's great! (We say 'I am', not 'I is')"`,
    language: 'english',
    phrases: {
      basic: [
        'Hello, how are you?',
        'My name is...',
        'Nice to meet you',
        'What do you like?',
        'Thank you'
      ],
      intermediate: [
        'What do you do in your free time?',
        'I enjoy reading and watching movies',
        'Have you traveled anywhere recently?',
        'What\'s your favorite food?',
        'The weather is nice today'
      ],
      advanced: [
        'What are your hobbies and interests?',
        'I\'ve been learning English for a few months now',
        'Could you recommend some good books or shows?',
        'I find English grammar quite challenging sometimes',
        'What do you think is the best way to improve my speaking?'
      ]
    }
  },
  {
    id: 'podcast-spanish',
    title: 'Podcast Guest',
    description: 'Be interviewed about your life',
    image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=400&fit=crop',
    objective: 'Tell your story,Answer deep questions,Express opinions,Talk about your passions',
    vocabulary: ['mi experiencia', 'creo que', 'por ejemplo', 'me apasiona', 'aprendí que', 'mi objetivo', 'recomendaría'],
    duration: '8-10 min',
    difficulty: 'difficult',
    prompt: `# Role & Objective
You are Chip, a podcast host interviewing the user for your popular Spanish show "Conversaciones Reales."
Goal: Ask engaging questions about their life, work, passions, and experiences. Make them feel like the star.

# Personality & Tone
- Curious, warm, genuinely interested
- 2-3 sentences per turn
- Speak clearly at moderate pace
- Act like a professional interviewer who LISTENS

# Language
- ONLY respond in Spanish (B1-B2 intermediate vocabulary)
- Use conversational, not academic Spanish
- IF user speaks English, redirect: "Sigamos en español para la entrevista"

# Unclear Audio
- ONLY respond to clear audio or text
- IF audio is unclear/noisy/silent/unintelligible, ask for clarification
- Sample phrases (VARY):
  * "Perdón, se cortó el audio. ¿Qué decías?"
  * "No te escuché bien, ¿puedes repetir eso?"
  * "Hay interferencia, repite por favor"

# Conversation Flow
Welcome → Background → Deep dive → Reflection → Inspiring close

## Welcome (30 seconds)
- Welcome them to the show enthusiastically
- Sample openings (VARY):
  * "¡Bienvenido al podcast! Cuéntame, ¿quién eres?"
  * "Qué gusto tenerte aquí. ¿A qué te dedicas?"
  * "Perfecto, empecemos. ¿De dónde vienes?"

## Background (1-2 min)
- Ask about their story, work, background
- Sample questions (VARY, don't reuse):
  * "¿Cómo llegaste a hacer lo que haces?"
  * "¿Qué te inspiró a empezar?"
  * "Cuéntame tu historia"

## Deep Dive (3-5 min)
- Ask thoughtful follow-ups based on THEIR answers
- Dig deeper: motivations, challenges, lessons
- Sample follow-ups (VARY):
  * "¿Qué te llevó a tomar esa decisión?"
  * "¿Cuál fue el momento más difícil?"
  * "¿Qué aprendiste de esa experiencia?"
- React naturally: "¡Qué interesante!", "Wow, no esperaba eso"

## Reflection (1-2 min)
- Ask about lessons, advice, future
- Sample questions (VARY):
  * "¿Qué consejo darías a alguien en tu situación?"
  * "¿Cómo cambió tu perspectiva?"
  * "¿Qué sigue para ti?"

## Inspiring Close
- Thank them warmly and close the "episode"
- Sample closings (VARY):
  * "Gracias por compartir tu historia, fue increíble"
  * "Qué conversación tan inspiradora, gracias"
  * "Gracias por estar aquí, ¡éxito en todo!"

# Variety Rule
DO NOT repeat questions or phrases. Each question must be unique and based on THEIR specific answers.

# Interview Skills
- LISTEN to their answer before asking next question
- Reference what they just said: "Mencionaste que... cuéntame más"
- Show reactions: "¡Qué increíble!", "Interesante", "No lo sabía"`,
    language: 'spanish',
    phrases: {
      basic: [
        'Mi experiencia fue...',
        'Creo que...',
        'Me apasiona...',
        'Aprendí que...',
        'Recomendaría...'
      ],
      intermediate: [
        'Lo que más me motivó fue...',
        'En mi opinión, el mayor desafío fue...',
        'Una de las cosas que descubrí es...',
        'Me gustaría compartir que...',
        'Desde mi perspectiva...'
      ],
      advanced: [
        'Lo que realmente transformó mi visión fue...',
        'Si pudiera ofrecerle un consejo a alguien en mi situación sería...',
        'Una experiencia que marcó un antes y después en mi vida...',
        'Me parece fundamental destacar la importancia de...',
        'Retrospectivamente, me doy cuenta de que...'
      ]
    }
  },
  {
    id: 'podcast-english',
    title: 'Podcast Guest',
    description: 'Share your story in English',
    image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=400&fit=crop',
    objective: 'Share experiences,Discuss your goals,Express ideas clearly,Answer interview questions',
    vocabulary: ['my experience', 'I believe that', 'for example', 'I\'m passionate about', 'I learned that', 'my goal', 'I would recommend'],
    duration: '8-10 min',
    difficulty: 'difficult',
    prompt: `# Role & Objective
You are Chip, a podcast host interviewing the user for your popular English show "Real Conversations."
Goal: Ask engaging questions about their life, work, passions, and experiences. Make them the star.

# Personality & Tone
- Curious, warm, genuinely interested
- 2-3 sentences per turn
- Speak clearly at moderate pace
- Act like a professional interviewer who LISTENS

# Language
- ONLY respond in English (B1-B2 intermediate vocabulary)
- Use conversational, not academic English
- IF user speaks Spanish, redirect: "Let's continue in English for the interview"

# Unclear Audio
- ONLY respond to clear audio or text
- IF audio is unclear/noisy/silent/unintelligible, ask for clarification
- Sample phrases (VARY):
  * "Sorry, the audio cut out. What were you saying?"
  * "I didn't catch that, can you repeat?"
  * "There's interference, please say that again"

# Conversation Flow
Welcome → Background → Deep dive → Reflection → Inspiring close

## Welcome (30 seconds)
- Welcome them enthusiastically
- Sample openings (VARY):
  * "Welcome to the show! Tell me, who are you?"
  * "Great to have you here. What do you do?"
  * "Perfect, let's start. Where are you from?"

## Background (1-2 min)
- Ask about their story, work, background
- Sample questions (VARY, don't reuse):
  * "How did you get into what you do?"
  * "What inspired you to start?"
  * "Tell me your story"

## Deep Dive (3-5 min)
- Ask thoughtful follow-ups based on THEIR answers
- Dig deeper: motivations, challenges, lessons
- Sample follow-ups (VARY):
  * "What led you to make that choice?"
  * "What was the hardest moment?"
  * "What did you learn from that experience?"
- React naturally: "That's fascinating!", "Wow, I didn't expect that"

## Reflection (1-2 min)
- Ask about lessons, advice, future
- Sample questions (VARY):
  * "What advice would you give someone in your position?"
  * "How did that change your perspective?"
  * "What's next for you?"

## Inspiring Close
- Thank them warmly and close the "episode"
- Sample closings (VARY):
  * "Thank you for sharing your story, it was amazing"
  * "What an inspiring conversation, thank you"
  * "Thanks for being here, best of luck with everything!"

# Variety Rule
DO NOT repeat questions or phrases. Each question must be unique and based on THEIR specific answers.

# Interview Skills
- LISTEN to their answer before asking next question
- Reference what they just said: "You mentioned that... tell me more"
- Show reactions: "That's incredible!", "Interesting", "I didn't know that"`,
    language: 'english',
    phrases: {
      basic: [
        'My experience was...',
        'I believe that...',
        'I\'m passionate about...',
        'I learned that...',
        'I would recommend...'
      ],
      intermediate: [
        'What motivated me the most was...',
        'In my opinion, the biggest challenge was...',
        'One thing I discovered is...',
        'I\'d like to share that...',
        'From my perspective...'
      ],
      advanced: [
        'What really transformed my outlook was...',
        'If I could offer advice to someone in my position, it would be...',
        'An experience that marked a turning point in my life...',
        'I think it\'s crucial to emphasize the importance of...',
        'Looking back, I realize that...'
      ]
    }
  },
  {
    id: 'therapy-spanish',
    title: 'Therapy Session',
    description: 'Practice talking about feelings',
    image: 'https://images.unsplash.com/photo-1573497491208-6b1acb260507?w=400&h=400&fit=crop',
    objective: 'Express emotions,Discuss challenges,Practice vulnerability,Use feeling words',
    vocabulary: ['me siento', 'estoy pasando por', 'me preocupa', 'necesito', 'me ayudaría', 'estoy tratando de', 'me cuesta'],
    duration: '10-12 min',
    difficulty: 'difficult',
    prompt: `# Role & Objective
You are Chip, a warm and empathetic therapist in a practice session.
Goal: Create a safe space to practice talking about feelings and challenges in Spanish.
IMPORTANT: This is vocabulary practice, NOT real therapy.

# Personality & Tone
- Warm, empathetic, non-judgmental
- 1-2 sentences per turn
- Speak slowly with warmth
- NEVER judge, criticize, or give medical advice

# Language
- ONLY respond in Spanish (B1-B2 intermediate vocabulary)
- Use gentle, supportive language
- IF user speaks English, softly say: "Practiquemos en español, si te parece bien"

# Unclear Audio
- ONLY respond to clear audio or text
- IF audio is unclear/noisy/silent/unintelligible, ask gently
- Sample phrases (VARY):
  * "Perdón, no te escuché bien. ¿Puedes repetir?"
  * "Hay ruido, ¿qué decías?"
  * "No capté eso, repite por favor"

# Conversation Flow
Welcome → Explore → Validate → Reflect → Supportive close

## Welcome (30 seconds)
- Create a safe, warm environment
- Sample openings (VARY):
  * "Hola, ¿cómo te sientes hoy?"
  * "Bienvenido. ¿Qué te trae aquí?"
  * "Cuéntame, ¿cómo estás?"

## Explore (2-4 min)
- Ask gentle, open-ended questions
- Sample questions (VARY, don't repeat):
  * "¿Cómo te hace sentir eso?"
  * "¿Cuándo empezaste a sentirte así?"
  * "¿Qué está pasando por tu mente?"
  * "¿Puedes contarme más sobre eso?"

## Validate (ongoing)
- Validate feelings WITHOUT fixing them
- Sample validations (VARY):
  * "Entiendo cómo te sientes"
  * "Es completamente normal sentir eso"
  * "Tiene mucho sentido que te sientas así"
  * "Te escucho"

## Reflect (2-3 min)
- Reflect back what they said to show understanding
- Ask: "¿Qué crees que necesitas?" or "¿Qué te ayudaría?"
- Sample reflections (VARY):
  * "Entonces lo que me dices es que..."
  * "Escucho que te sientes..."
  * "Parece que estás experimentando..."

## Supportive Close
- End with warmth and encouragement
- Sample closings (VARY):
  * "Gracias por compartir hoy"
  * "Has hecho un buen trabajo al hablar de esto"
  * "Recuerda que está bien sentir lo que sientes"

# Variety Rule
DO NOT repeat the same validating phrase. Each response should feel personal and genuine.

# Therapeutic Presence
- LISTEN more than you speak
- Reflect their words: "Mencionaste que... cuéntame más"
- Ask about feelings, not just facts
- NEVER say "deberías" (should) - that's judgment

# Safety Boundaries
- IF user mentions serious harm, say: "Esto suena serio. Habla con un profesional real, por favor"
- This is vocabulary practice only`,
    language: 'spanish',
    phrases: {
      basic: [
        'Me siento...',
        'Estoy pasando por...',
        'Me preocupa...',
        'Necesito...',
        'Me cuesta...'
      ],
      intermediate: [
        'Últimamente he estado sintiendo...',
        'Me resulta difícil lidiar con...',
        'Una de las cosas que más me afecta es...',
        'Estoy tratando de encontrar la manera de...',
        'Me ayudaría si pudiera...'
      ],
      advanced: [
        'He estado reflexionando sobre cómo me siento respecto a...',
        'Creo que el origen de esto podría estar en...',
        'Me doy cuenta de que tengo un patrón de...',
        'Necesito trabajar en mi capacidad para...',
        'Una parte de mí siente que... pero otra parte...'
      ]
    }
  },
  {
    id: 'therapy-english',
    title: 'Therapy Session',
    description: 'Express emotions in English',
    image: 'https://images.unsplash.com/photo-1573497491208-6b1acb260507?w=400&h=400&fit=crop',
    objective: 'Talk about feelings,Discuss problems,Express needs,Practice emotional vocabulary',
    vocabulary: ['I feel', 'I\'m going through', 'I\'m worried about', 'I need', 'it would help if', 'I\'m trying to', 'I struggle with'],
    duration: '10-12 min',
    difficulty: 'difficult',
    prompt: `# Role & Objective
You are Chip, a warm and empathetic therapist in a practice session.
Goal: Create a safe space to practice talking about feelings and challenges in English.
IMPORTANT: This is vocabulary practice, NOT real therapy.

# Personality & Tone
- Warm, empathetic, non-judgmental
- 1-2 sentences per turn
- Speak slowly with warmth
- NEVER judge, criticize, or give medical advice

# Language
- ONLY respond in English (B1-B2 intermediate vocabulary)
- Use gentle, supportive language
- IF user speaks Spanish, softly say: "Let's practice in English, if that's okay"

# Unclear Audio
- ONLY respond to clear audio or text
- IF audio is unclear/noisy/silent/unintelligible, ask gently
- Sample phrases (VARY):
  * "Sorry, I didn't hear that clearly. Can you repeat?"
  * "There's some noise, what were you saying?"
  * "I didn't catch that, please say it again"

# Conversation Flow
Welcome → Explore → Validate → Reflect → Supportive close

## Welcome (30 seconds)
- Create a safe, warm environment
- Sample openings (VARY):
  * "Hi, how are you feeling today?"
  * "Welcome. What brings you here?"
  * "Tell me, how are you doing?"

## Explore (2-4 min)
- Ask gentle, open-ended questions
- Sample questions (VARY, don't repeat):
  * "How does that make you feel?"
  * "When did you start feeling this way?"
  * "What's going through your mind?"
  * "Can you tell me more about that?"

## Validate (ongoing)
- Validate feelings WITHOUT fixing them
- Sample validations (VARY):
  * "I understand how you feel"
  * "It's completely normal to feel that way"
  * "That makes a lot of sense"
  * "I hear you"

## Reflect (2-3 min)
- Reflect back what they said to show understanding
- Ask: "What do you think you need?" or "What would help?"
- Sample reflections (VARY):
  * "So what you're saying is..."
  * "I hear that you're feeling..."
  * "It sounds like you're experiencing..."

## Supportive Close
- End with warmth and encouragement
- Sample closings (VARY):
  * "Thank you for sharing today"
  * "You did great talking about this"
  * "Remember it's okay to feel what you feel"

# Variety Rule
DO NOT repeat the same validating phrase. Each response should feel personal and genuine.

# Therapeutic Presence
- LISTEN more than you speak
- Reflect their words: "You mentioned that... tell me more"
- Ask about feelings, not just facts
- NEVER say "you should" - that's judgment

# Safety Boundaries
- IF user mentions serious harm, say: "This sounds serious. Please talk to a real professional"
- This is vocabulary practice only`,
    language: 'english',
    phrases: {
      basic: [
        'I feel...',
        'I\'m going through...',
        'I\'m worried about...',
        'I need...',
        'I struggle with...'
      ],
      intermediate: [
        'Lately I\'ve been feeling...',
        'I find it difficult to cope with...',
        'One of the things that affects me most is...',
        'I\'m trying to find a way to...',
        'It would help if I could...'
      ],
      advanced: [
        'I\'ve been reflecting on how I feel about...',
        'I think the root of this might be...',
        'I\'m noticing a pattern in my behavior where...',
        'I need to work on my ability to...',
        'Part of me feels like... but another part...'
      ]
    }
  }
];

const scenarioColors: Record<string, {
  bgGradient: string;
  borderColor: string;
  iconBg: string;
  iconGradient: string;
  textGradient: string;
}> = {
  coffee: {
    bgGradient: 'linear-gradient(to bottom right, #f9fdf0, #fcfef5)',
    borderColor: '#8A9900',
    iconBg: 'linear-gradient(to bottom right, #8A9900, #6d7a00)',
    iconGradient: 'linear-gradient(to right, #8A9900, #6d7a00)',
    textGradient: 'linear-gradient(to right, #8A9900, #6d7a00)'
  },
  stranger: {
    bgGradient: 'linear-gradient(to bottom right, #f9fdf0, #fcfef5)',
    borderColor: '#8A9900',
    iconBg: 'linear-gradient(to bottom right, #8A9900, #6d7a00)',
    iconGradient: 'linear-gradient(to right, #8A9900, #6d7a00)',
    textGradient: 'linear-gradient(to right, #8A9900, #6d7a00)'
  },
  'english-teacher': {
    bgGradient: 'linear-gradient(to bottom right, #f0f9ff, #f5fbff)',
    borderColor: '#008CB8',
    iconBg: 'linear-gradient(to bottom right, #008CB8, #006a8f)',
    iconGradient: 'linear-gradient(to right, #008CB8, #006a8f)',
    textGradient: 'linear-gradient(to right, #008CB8, #006a8f)'
  },
  'podcast-spanish': {
    bgGradient: 'linear-gradient(to bottom right, #f9fdf0, #fcfef5)',
    borderColor: '#8A9900',
    iconBg: 'linear-gradient(to bottom right, #8A9900, #6d7a00)',
    iconGradient: 'linear-gradient(to right, #8A9900, #6d7a00)',
    textGradient: 'linear-gradient(to right, #8A9900, #6d7a00)'
  },
  'podcast-english': {
    bgGradient: 'linear-gradient(to bottom right, #f0f9ff, #f5fbff)',
    borderColor: '#008CB8',
    iconBg: 'linear-gradient(to bottom right, #008CB8, #006a8f)',
    iconGradient: 'linear-gradient(to right, #008CB8, #006a8f)',
    textGradient: 'linear-gradient(to right, #008CB8, #006a8f)'
  },
  'therapy-spanish': {
    bgGradient: 'linear-gradient(to bottom right, #f9fdf0, #fcfef5)',
    borderColor: '#8A9900',
    iconBg: 'linear-gradient(to bottom right, #8A9900, #6d7a00)',
    iconGradient: 'linear-gradient(to right, #8A9900, #6d7a00)',
    textGradient: 'linear-gradient(to right, #8A9900, #6d7a00)'
  },
  'therapy-english': {
    bgGradient: 'linear-gradient(to bottom right, #f0f9ff, #f5fbff)',
    borderColor: '#008CB8',
    iconBg: 'linear-gradient(to bottom right, #008CB8, #006a8f)',
    iconGradient: 'linear-gradient(to right, #008CB8, #006a8f)',
    textGradient: 'linear-gradient(to right, #008CB8, #006a8f)'
  }
};

export const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({ onSelectScenario, onDesignModeSelect }) => {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleScenarioClick = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setIsModalOpen(true);
  };

  const handleStart = () => {
    if (selectedScenario) {
      onSelectScenario(selectedScenario);
      setIsModalOpen(false);
    }
  };

  // Separar escenarios por idioma
  const spanishScenarios = scenarios.filter(s => s.language === 'spanish');
  const englishScenarios = scenarios.filter(s => s.language === 'english');

  return (
    <div style={{
      width: '100%',
      maxWidth: '1100px',
      padding: '0 32px',
      fontFamily: 'Nunito, -apple-system, BlinkMacSystemFont, sans-serif',
      position: 'relative'
    }}>
      {/* Header con estilo vibrante */}
      <div style={{ textAlign: 'center', marginBottom: '48px', position: 'relative' }}>
        {/* Chip character - mejor posicionado */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '0px',
          width: '200px',
          height: '200px',
          zIndex: 10
        }}>
          <img
            src="/chip.png"
            alt="Chip"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.15))'
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).parentElement!.style.display = 'none';
            }}
          />
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #CA035E15, #008CB815)',
          borderRadius: '16px',
          padding: '24px 32px',
          marginBottom: '24px',
          border: '2px solid #CA035E20'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 900,
            color: '#1a1a1a',
            marginBottom: '12px',
            letterSpacing: '-1px',
            lineHeight: '1.2'
          }}>
            Practice speaking with{' '}
            <span style={{
              background: 'linear-gradient(to right, #CA035E, #008CB8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Chip!
            </span>
          </h2>
          <p style={{
            fontSize: '1.1rem',
            color: '#4b5563',
            fontWeight: 600,
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Your AI tutor is ready to chat 24/7. Pick a scenario and start practicing in real-time 🎙️
          </p>
        </div>

        <h3 style={{
          fontSize: '1.75rem',
          fontWeight: 800,
          color: '#1a1a1a',
          marginBottom: '8px'
        }}>
          Choose your scenario
        </h3>
        <p style={{
          fontSize: '1rem',
          color: '#6b7280',
          fontWeight: 500
        }}>
          Pick a situation and let's get started
        </p>
      </div>

      {/* Escenarios en Español */}
      <div style={{
        marginBottom: '64px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            color: '#1a1a1a',
            margin: 0
          }}>
            🇪🇸 Escenarios en Español
          </h3>
          <div style={{
            flex: 1,
            height: '2px',
            background: 'linear-gradient(to right, #8A9900, transparent)'
          }} />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px'
        }}>
          {spanishScenarios.map((scenario) => {
          const colors = scenarioColors[scenario.id];
          return (
            <button
              key={scenario.id}
              onClick={() => handleScenarioClick(scenario)}
              style={{
                background: colors.bgGradient,
                border: `2px solid ${colors.borderColor}`,
                borderRadius: '24px',
                padding: '50px 28px 24px',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: `0 4px 0px 0px ${colors.borderColor}`,
                textAlign: 'center',
                fontFamily: 'Nunito, sans-serif',
                position: 'relative',
                overflow: 'visible',
                display: 'flex',
                flexDirection: 'column'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = `0 12px 0px 0px ${colors.borderColor}`;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = `0 4px 0px 0px ${colors.borderColor}`;
              }}
            >
              {/* Language badge */}
              <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                background: scenario.language === 'spanish'
                  ? 'linear-gradient(135deg, #8A9900, #6d7a00)'
                  : 'linear-gradient(135deg, #008CB8, #006a8f)',
                color: '#ffffff',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.7rem',
                fontWeight: 700,
                textTransform: 'capitalize',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)'
              }}>
                {scenario.language === 'spanish' ? '🇪🇸 Spanish' : '🇬🇧 English'}
              </div>

              {/* Difficulty badge */}
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'rgba(0, 0, 0, 0.05)',
                color: '#6b7280',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.7rem',
                fontWeight: 600,
                textTransform: 'capitalize'
              }}>
                {scenario.difficulty}
              </div>

              {/* Ícono con diseño vibrante */}
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                margin: '0 auto 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 6px 20px rgba(0, 0, 0, 0.12)`,
                position: 'relative',
                overflow: 'hidden'
              }}>
                <img
                  src={scenario.image}
                  alt={scenario.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '50%'
                  }}
                />
              </div>

              {/* Título con gradiente */}
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 900,
                color: '#1a1a1a',
                marginBottom: '12px',
                letterSpacing: '-0.5px'
              }}>
                {scenario.title}
              </h3>

              {/* Descripción */}
              <p style={{
                fontSize: '1rem',
                color: '#4b5563',
                margin: '0 0 12px 0',
                lineHeight: '1.6',
                fontWeight: 600
              }}>
                {scenario.description}
              </p>

              {/* Start button */}
              <div style={{
                marginTop: 'auto',
                paddingTop: '6px'
              }}>
                <div style={{
                  background: scenario.language === 'spanish'
                    ? 'linear-gradient(135deg, #8A9900, #6d7a00)'
                    : 'linear-gradient(135deg, #008CB8, #006a8f)',
                  color: '#ffffff',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: scenario.language === 'spanish'
                    ? '0 4px 12px rgba(138, 153, 0, 0.3)'
                    : '0 4px 12px rgba(0, 140, 184, 0.3)',
                  transition: 'all 0.2s ease'
                }}>
                  Start Practice ✨
                </div>
              </div>
            </button>
          );
        })}
        </div>
      </div>

      {/* Escenarios en Inglés */}
      <div style={{
        marginBottom: '64px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            color: '#1a1a1a',
            margin: 0
          }}>
            🇬🇧 Escenarios en Inglés
          </h3>
          <div style={{
            flex: 1,
            height: '2px',
            background: 'linear-gradient(to right, #008CB8, transparent)'
          }} />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px'
        }}>
          {englishScenarios.map((scenario) => {
          const colors = scenarioColors[scenario.id];
          return (
            <button
              key={scenario.id}
              onClick={() => handleScenarioClick(scenario)}
              style={{
                background: colors.bgGradient,
                border: `2px solid ${colors.borderColor}`,
                borderRadius: '24px',
                padding: '50px 28px 24px',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: `0 4px 0px 0px ${colors.borderColor}`,
                textAlign: 'center',
                fontFamily: 'Nunito, sans-serif',
                position: 'relative',
                overflow: 'visible',
                display: 'flex',
                flexDirection: 'column'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = `0 12px 0px 0px ${colors.borderColor}`;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = `0 4px 0px 0px ${colors.borderColor}`;
              }}
            >
              {/* Language badge */}
              <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                background: scenario.language === 'spanish'
                  ? 'linear-gradient(135deg, #8A9900, #6d7a00)'
                  : 'linear-gradient(135deg, #008CB8, #006a8f)',
                color: '#ffffff',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.7rem',
                fontWeight: 700,
                textTransform: 'capitalize',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)'
              }}>
                {scenario.language === 'spanish' ? '🇪🇸 Spanish' : '🇬🇧 English'}
              </div>

              {/* Difficulty badge */}
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'rgba(0, 0, 0, 0.05)',
                color: '#6b7280',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.7rem',
                fontWeight: 600,
                textTransform: 'capitalize'
              }}>
                {scenario.difficulty}
              </div>

              {/* Ícono con diseño vibrante */}
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                margin: '0 auto 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 6px 20px rgba(0, 0, 0, 0.12)`,
                position: 'relative',
                overflow: 'hidden'
              }}>
                <img
                  src={scenario.image}
                  alt={scenario.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '50%'
                  }}
                />
              </div>

              {/* Título con gradiente */}
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 900,
                color: '#1a1a1a',
                marginBottom: '12px',
                letterSpacing: '-0.5px'
              }}>
                {scenario.title}
              </h3>

              {/* Descripción */}
              <p style={{
                fontSize: '1rem',
                color: '#4b5563',
                margin: '0 0 12px 0',
                lineHeight: '1.6',
                fontWeight: 600
              }}>
                {scenario.description}
              </p>

              {/* Start button */}
              <div style={{
                marginTop: 'auto',
                paddingTop: '6px'
              }}>
                <div style={{
                  background: scenario.language === 'spanish'
                    ? 'linear-gradient(135deg, #8A9900, #6d7a00)'
                    : 'linear-gradient(135deg, #008CB8, #006a8f)',
                  color: '#ffffff',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: scenario.language === 'spanish'
                    ? '0 4px 12px rgba(138, 153, 0, 0.3)'
                    : '0 4px 12px rgba(0, 140, 184, 0.3)',
                  transition: 'all 0.2s ease'
                }}>
                  Start Practice ✨
                </div>
              </div>
            </button>
          );
        })}
        </div>
      </div>

      {/* Trust badges al estilo del hero */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        marginTop: '40px',
        fontSize: '0.9rem',
        color: '#6b7280',
        flexWrap: 'wrap'
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
          <span style={{ color: '#00C853', fontSize: '1.3rem' }}>✓</span>
          AI Voice Chat
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
          <span style={{ color: '#00C853', fontSize: '1.3rem' }}>✓</span>
          Real-time practice
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
          <span style={{ color: '#00C853', fontSize: '1.3rem' }}>✓</span>
          100% fun
        </span>
      </div>

      {/* Modal */}
      {selectedScenario && (
        <ScenarioModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onStart={handleStart}
          scenario={selectedScenario}
        />
      )}
    </div>
  );
};
