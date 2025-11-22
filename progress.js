// progress.js

/**
 * Retrieves the set of completed challenge IDs from localStorage.
 * @returns {Set<string>} A set of completed challenge IDs.
 */
function getCompletedChallenges() {
    const completed = localStorage.getItem('completedChallenges');
    if (completed) {
        try {
            const completedArray = JSON.parse(completed);
            return new Set(completedArray);
        } catch (e) {
            console.error("Error parsing completed challenges from localStorage", e);
            return new Set();
        }
    }
    return new Set();
}

/**
 * Marks a challenge as completed and saves it to localStorage.
 * @param {string} challengeId - The ID of the challenge to mark as complete.
 */
function markChallengeCompleted(challengeId) {
    if (!challengeId) return;
    const completed = getCompletedChallenges();
    completed.add(challengeId);
    localStorage.setItem('completedChallenges', JSON.stringify(Array.from(completed)));
}
