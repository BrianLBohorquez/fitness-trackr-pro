import { useState, useEffect } from "react";
import { getActivities } from "../api/activities";
import { createSet } from "../api/sets";
import { useAuth } from "../auth/AuthContext";

export default function SetForm({ routineId, syncRoutine }) {
  const { token } = useAuth();

  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const syncActivities = async () => {
      const data = await getActivities();
      setActivities(data);
    };
    syncActivities();
  }, []);

  const tryCreateSet = async (formData) => {
    setError(null);

    const activityId = Number(formData.get("activityId"));
    const count = Number(formData.get("count"));

    try {
      await createSet(token, { activityId, routineId, count });
      syncRoutine();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <>
      <h2>Add a set</h2>
      <form action={tryCreateSet}>
        <label>
          Activity
          <select name="activityId">
            {activities.map((activity) => (
              <option key={activity.id} value={activity.id}>
                {activity.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Reps
          <input type="number" name="count" />
        </label>
        <button>Add set</button>
      </form>
      {error && <p role="alert">{error}</p>}
    </>
  );
}
