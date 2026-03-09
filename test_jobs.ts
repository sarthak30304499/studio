import { matchJobsToUserProfile } from "./src/ai/flows/match-jobs-to-user-profile";

async function run() {
    try {
        const res = await matchJobsToUserProfile({
            resumeText: "Target Role: AI Intern\\nJob Description: N/A\\nATS Score: 85\\nFeedback: Good",
            targetRoles: ["AI Intern"],
            industryPreferences: [],
            experienceLevel: "Entry Level",
            jobTypePreferences: []
        });
        console.log("Success:", JSON.stringify(res, null, 2));
    } catch (err) {
        console.error("Failure:", err);
    }
}
run();
