import { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  increment,
  setDoc,
  serverTimestamp,
  runTransaction,
  arrayUnion
} from 'firebase/firestore';
import { db, auth, handleFirestoreError } from '../lib/firebase';
import { ClassTeam, ResidueEntry, Mission, VisualLog, FoodWaste, Video } from '../types';

export function useEcoState() {
  const [classes, setClasses] = useState<ClassTeam[]>([]);
  const [entries, setEntries] = useState<ResidueEntry[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [logs, setLogs] = useState<VisualLog[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Classes Listener
    const qClasses = query(collection(db, 'classes'));
    const unsubClasses = onSnapshot(qClasses, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ClassTeam));
      setClasses(data);
    }, (error) => handleFirestoreError(error, 'list', 'classes'));

    // 2. Users Listener
    const qUsers = query(collection(db, 'users'));
    const unsubUsers = onSnapshot(qUsers, (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data());
      setUsers(data);
    });

    // 3. Entries Listener
    const qEntries = query(collection(db, 'entries'));
    const unsubEntries = onSnapshot(qEntries, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ResidueEntry));
      setEntries(data);
    }, (error) => handleFirestoreError(error, 'list', 'entries'));

    // 4. Missions Listener
    const qMissions = query(collection(db, 'missions'));
    const unsubMissions = onSnapshot(qMissions, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Mission));
      setMissions(data);
    }, (error) => handleFirestoreError(error, 'list', 'missions'));

    // 5. Logs Listener
    const qLogs = query(collection(db, 'logs'));
    const unsubLogs = onSnapshot(qLogs, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VisualLog));
      setLogs(data);
    }, (error) => handleFirestoreError(error, 'list', 'logs'));

    // 6. Videos Listener
    const qVideos = query(collection(db, 'videos'));
    const unsubVideos = onSnapshot(qVideos, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Video));
      setVideos(data);
      setLoading(false);
    }, (error) => handleFirestoreError(error, 'list', 'videos'));

    return () => {
      unsubClasses();
      unsubUsers();
      unsubEntries();
      unsubMissions();
      unsubLogs();
      unsubVideos();
    };
  }, []);

  const assignTeacher = async (classId: string, teacherId: string, teacherName: string) => {
    try {
      await updateDoc(doc(db, 'classes', classId), { teacherId, teacherName });
    } catch (e) { handleFirestoreError(e, 'update', 'classes'); }
  };

  const addClass = async (name: string, teamName: string, teacherId: string) => {
    if (!auth.currentUser) return;
    const id = crypto.randomUUID();
    
    // Find teacher name
    const teacher = users.find(u => u.id === teacherId);
    
    const newClass = {
      id,
      name,
      teamName,
      points: 0,
      teacherId,
      teacherName: teacher?.name || 'Não atribuído',
      createdAt: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'classes', id), newClass);
    } catch (e) { handleFirestoreError(e, 'create', 'classes'); }
  };

  const deleteClass = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'classes', id));
    } catch (e) { handleFirestoreError(e, 'delete', 'classes'); }
  };

  const addEntry = async (classId: string, type: ResidueEntry['type'], quantity: number, date: string) => {
    if (!auth.currentUser) return;
    const entryId = crypto.randomUUID();
    const newEntry = {
      id: entryId,
      classId,
      type,
      quantity,
      date,
      teacherId: auth.currentUser.uid
    };

    try {
      await runTransaction(db, async (transaction) => {
        const classRef = doc(db, 'classes', classId);
        const classDoc = await transaction.get(classRef);
        if (!classDoc.exists()) throw new Error("Classe não encontrada");
        
        transaction.set(doc(db, 'entries', entryId), newEntry);
        transaction.update(classRef, { points: increment(5) });
      });
    } catch (e) { handleFirestoreError(e, 'write', 'entries/classes'); }
  };

  const addManualPoints = async (classId: string, points: number) => {
    try {
      await updateDoc(doc(db, 'classes', classId), { points: increment(points) });
    } catch (e) { handleFirestoreError(e, 'update', 'classes'); }
  };

  const addGamePoints = async (classId: string, points: number) => {
    try {
      await runTransaction(db, async (transaction) => {
        const classRef = doc(db, 'classes', classId);
        const classDoc = await transaction.get(classRef);
        if (!classDoc.exists()) throw new Error("Classe não encontrada");
        
        const currentData = classDoc.data();
        const currentGamePoints = (currentData.gamePoints || 0) + points;
        
        const rankPointsToAdd = Math.floor(currentGamePoints / 100) * 5;
        const remainingGamePoints = currentGamePoints % 100;

        transaction.update(classRef, { 
          gamePoints: remainingGamePoints,
          points: increment(rankPointsToAdd)
        });
      });
    } catch (e) { handleFirestoreError(e, 'update', 'classes'); }
  };

  const addMission = async (title: string, description: string, points: number, difficulty: Mission['difficulty']) => {
    const id = crypto.randomUUID();
    const newMission = { id, title, description, points, active: false, difficulty };
    try {
      await setDoc(doc(db, 'missions', id), newMission);
    } catch (e) { handleFirestoreError(e, 'create', 'missions'); }
  };

  const toggleMission = async (id: string) => {
    const mission = missions.find(m => m.id === id);
    if (!mission) return;
    try {
      await updateDoc(doc(db, 'missions', id), { active: !mission.active });
    } catch (e) { handleFirestoreError(e, 'update', 'missions'); }
  };

  const deleteMission = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'missions', id));
    } catch (e) { handleFirestoreError(e, 'delete', 'missions'); }
  };

  const completeMission = async (classId: string, missionId: string) => {
    const mission = missions.find(m => m.id === missionId);
    if (mission) {
      await addManualPoints(classId, mission.points);
    }
  };

  const addLog = async (title: string, description: string, mediaUrl: string, mediaType: VisualLog['mediaType'], teacherId: string, teacherName: string) => {
    const id = crypto.randomUUID();
    const newLog = {
      id,
      date: new Date().toISOString(),
      title,
      description,
      mediaUrl,
      mediaType,
      teacherId,
      teacherName
    };
    try {
      await setDoc(doc(db, 'logs', id), newLog);
    } catch (e) { handleFirestoreError(e, 'create', 'logs'); }
  };

  const deleteLog = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'logs', id));
    } catch (e) { handleFirestoreError(e, 'delete', 'logs'); }
  };

  const supportLog = async (id: string) => {
    try {
      await updateDoc(doc(db, 'logs', id), {
        likes: increment(1)
      });
    } catch (e) { handleFirestoreError(e, 'update', 'logs'); }
  };

  const feedbackLog = async (id: string, text: string, userName: string) => {
    if (!text.trim()) return;
    const feedback = {
      id: crypto.randomUUID(),
      text,
      userName,
      date: new Date().toISOString()
    };
    try {
      await updateDoc(doc(db, 'logs', id), {
        feedbacks: arrayUnion(feedback)
      });
    } catch (e) { handleFirestoreError(e, 'update', 'logs'); }
  };

  const addVideo = async (title: string, youtubeId: string) => {
    const id = crypto.randomUUID();
    const newVideo = { id, title, youtubeId, addedAt: new Date().toISOString() };
    try {
      await setDoc(doc(db, 'videos', id), newVideo);
    } catch (e) { handleFirestoreError(e, 'create', 'videos'); }
  };

  const deleteVideo = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'videos', id));
    } catch (e) { handleFirestoreError(e, 'delete', 'videos'); }
  };

  return {
    classes,
    entries,
    missions,
    logs,
    videos,
    users,
    loading,
    addClass,
    assignTeacher,
    deleteClass,
    addEntry,
    addManualPoints,
    addGamePoints,
    addMission,
    toggleMission,
    deleteMission,
    completeMission,
    addLog,
    deleteLog,
    supportLog,
    feedbackLog,
    addVideo,
    deleteVideo
  };
}
