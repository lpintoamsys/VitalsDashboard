import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const staticUsers = [
    {
        firstName: "Alice",
        lastName: "Smith",
        sex: "Female",
        age: 24,
        email: "alicesmith@pulsecare.com",
        ssn: "19242427"
    },
];

// Heart rate ranges by age group and sex
const heartRateRanges = {
    Male: {
        "18-25": {
            Athlete: [49, 55],
            Excellent: [56, 61],
            Good: [62, 65],
            "Above Average": [66, 69],
            Average: [70, 73],
            "Below Average": [74, 81],
            Poor: [82, 100]
        },
        "26-35": {
            Athlete: [49, 54],
            Excellent: [55, 61],
            Good: [62, 65],
            "Above Average": [66, 70],
            Average: [71, 74],
            "Below Average": [75, 81],
            Poor: [82, 100]
        },
        "36-45": {
            Athlete: [50, 56],
            Excellent: [57, 62],
            Good: [63, 66],
            "Above Average": [67, 70],
            Average: [71, 75],
            "Below Average": [76, 82],
            Poor: [83, 100]
        },
        "46-55": {
            Athlete: [50, 57],
            Excellent: [58, 63],
            Good: [64, 67],
            "Above Average": [68, 71],
            Average: [72, 76],
            "Below Average": [77, 83],
            Poor: [84, 100]
        },
        "56-65": {
            Athlete: [51, 56],
            Excellent: [57, 61],
            Good: [62, 67],
            "Above Average": [68, 71],
            Average: [72, 75],
            "Below Average": [76, 81],
            Poor: [82, 100]
        },
        "65+": {
            Athlete: [50, 55],
            Excellent: [56, 61],
            Good: [62, 65],
            "Above Average": [66, 69],
            Average: [70, 73],
            "Below Average": [74, 79],
            Poor: [80, 100]
        }
    },
    Female: {
        "18-25": {
            Athlete: [54, 60],
            Excellent: [61, 65],
            Good: [66, 69],
            "Above Average": [70, 73],
            Average: [74, 78],
            "Below Average": [79, 84],
            Poor: [85, 100]
        },
        "26-35": {
            Athlete: [54, 59],
            Excellent: [60, 64],
            Good: [65, 68],
            "Above Average": [69, 72],
            Average: [73, 76],
            "Below Average": [77, 82],
            Poor: [83, 100]
        },
        "36-45": {
            Athlete: [54, 59],
            Excellent: [60, 64],
            Good: [65, 69],
            "Above Average": [70, 73],
            Average: [74, 78],
            "Below Average": [79, 84],
            Poor: [85, 100]
        },
        "46-55": {
            Athlete: [54, 60],
            Excellent: [61, 65],
            Good: [66, 69],
            "Above Average": [70, 73],
            Average: [74, 77],
            "Below Average": [78, 83],
            Poor: [84, 100]
        },
        "56-65": {
            Athlete: [54, 59],
            Excellent: [60, 64],
            Good: [65, 68],
            "Above Average": [69, 73],
            Average: [74, 77],
            "Below Average": [78, 83],
            Poor: [84, 100]
        },
        "65+": {
            Athlete: [54, 59],
            Excellent: [60, 64],
            Good: [65, 68],
            "Above Average": [69, 72],
            Average: [73, 76],
            "Below Average": [77, 84],
            Poor: [84, 100]
        }
    }
};

// Get age group for a given age
const getAgeGroup = (age) => {
    if (age <= 25) return "18-25";
    if (age <= 35) return "26-35";
    if (age <= 45) return "36-45";
    if (age <= 55) return "46-55";
    if (age <= 65) return "56-65";
    return "65+";
};

// Generate a random heart rate within a range
const getRandomInRange = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Get random fitness level and corresponding heart rate
const getHeartRateAndFitness = (sex, age) => {
    const ageGroup = getAgeGroup(age);
    const ranges = heartRateRanges[sex][ageGroup];
    const fitnessLevels = Object.keys(ranges);
    const randomFitnessLevel = fitnessLevels[Math.floor(Math.random() * fitnessLevels.length)];
    const [min, max] = ranges[randomFitnessLevel];

    return {
        heartRate: getRandomInRange(min, max),
        fitnessLevel: randomFitnessLevel
    };
};

// Hard-coded API key as a fallback
const API_KEY = "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";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || API_KEY,
});

// Rest of your code remains the same until the OpenAI function

// OpenAI function to generate summary - FIXED FORMAT
const generateSummaryWithOpenAI = async (vitals) => {
    const prompt = `
    Given the following health data of a person, generate a shorter and concise medical summary:

    - Name: ${vitals.firstName} ${vitals.lastName}
    - Age: ${vitals.age}
    - Sex: ${vitals.sex}
    - Heart Rate: ${vitals.heartRate} BPM
    - Fitness Level: ${vitals.fitnessLevel}
    - Blood Pressure: ${vitals.bloodPressure}
    - Steps Taken: ${vitals.stepsTaken}

    Provide a brief health summary highlighting key points and potential health risks (if any).
    `;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a healthcare assistant providing brief patient summaries." },
                { role: "user", content: prompt }
            ],
            max_tokens: 200,
        });

        return response.choices[0].message.content.trim();
    } catch (error) {
        console.error("Error generating summary:", error);
        return `Health summary for ${vitals.firstName} ${vitals.lastName}: Heart rate ${vitals.heartRate} BPM indicates ${vitals.fitnessLevel.toLowerCase()} fitness level. Blood pressure: ${vitals.bloodPressure}. Patient has taken ${vitals.stepsTaken} steps today.`;
    }
};

const generateRandomVitals = async () => {
    const user = staticUsers[Math.floor(Math.random() * staticUsers.length)];
    const { heartRate, fitnessLevel } = getHeartRateAndFitness(user.sex, user.age);

    const vitals = {
        timestamp: new Date().toISOString(),
        ...user,
        heartRate,
        fitnessLevel,
        bloodPressure: `${Math.floor(Math.random() * 50) + 80}/${Math.floor(Math.random() * 30) + 60}`,
        stepsTaken: Math.floor(Math.random() * 10000),
    };

    try {
        // Get AI-generated summary
        vitals.notes = await generateSummaryWithOpenAI(vitals);
    } catch (error) {
        console.error("Failed to generate AI summary:", error);
        vitals.notes = `Health summary for ${vitals.firstName} ${vitals.lastName}: Heart rate ${vitals.heartRate} BPM indicates ${vitals.fitnessLevel.toLowerCase()} fitness level. Blood pressure: ${vitals.bloodPressure}.`;
    }

    return vitals;
};

export default generateRandomVitals;