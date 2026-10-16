import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { getRoutine, deleteRoutine } from "../api/routines";
import { useAuth } from "../auth/AuthContext";

import SetList from "../sets/setList";
import SetForm from "../sets/setForm";

export default function RoutineDetails() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [routine, setRoutine] = useState(null);
  const [error, setError] = useState(null);

  const syncRoutine = async () => {
    const data = await getRoutine(id);
    setRoutine(data);
  };

  useEffect(() => {
    syncRoutine();
  }, []);

  const tryDelete = async () => {
    setError(null);

    try {
      await deleteRoutine(token, id);
      navigate("/routines");
    } catch (e) {
      setError(e.message);
    }
  };

  if (!routine) return <p>Loading...</p>;

  return (
    <>
      <h1>{routine.name}</h1>
      <p>Created by {routine.creatorName}</p>
      <p>Goal: {routine.goal}</p>
      {token && <button onClick={tryDelete}>Delete routine</button>}
      {error && <p role="alert">{error}</p>}
      <h2>Sets</h2>
      <SetList sets={routine.sets} syncRoutine={syncRoutine} />
      {token && <SetForm routineId={routine.id} syncRoutine={syncRoutine} />}
    </>
  );
}
