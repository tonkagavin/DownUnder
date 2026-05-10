import { useEffect, useState } from 'react';
import MedicationSearch from '../components/MedicationSearch';
import type { MedicationSearchResult, Profile } from '../lib/types';

type BirthControlMethod = {
  id: number;
  name: string;
  category: string;
};

type StoredMedication = {
  id: number;
  name: string;
  rxcui: string | null;
  className: string;
};

const defaultProfile: Profile = {
  name: '',
  age: 25,
  heightCm: 165,
  weightKg: 65,
  smoker: false,
  conditionsNotes: '',
  birthControlMethodId: null
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [methods, setMethods] = useState<BirthControlMethod[]>([]);
  const [medications, setMedications] = useState<StoredMedication[]>([]);
  const [message, setMessage] = useState('');

  const refresh = async () => {
    const [profileRes, methodsRes] = await Promise.all([fetch('/api/profile'), fetch('/api/catalog/birth-control')]);
    const profileData = await profileRes.json();
    const methodsData = await methodsRes.json();

    if (profileData.profile) setProfile(profileData.profile);
    setMedications(profileData.medications ?? []);
    setMethods(methodsData.methods ?? []);
  };

  useEffect(() => {
    void refresh();
  }, []);

  const saveProfile = async () => {
    const response = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    });
    if (response.ok) {
      setMessage('Profile saved.');
      return;
    }
    setMessage('Unable to save profile.');
  };

  const addMedication = async (medication: MedicationSearchResult) => {
    await fetch('/api/profile/medications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: medication.name, rxcui: medication.rxcui })
    });
    void refresh();
  };

  const removeMedication = async (id: number) => {
    await fetch(`/api/profile/medications/${id}`, { method: 'DELETE' });
    void refresh();
  };

  return (
    <section>
      <h2>Your Profile</h2>
      <p>Set your physical metrics, birth control method, and active medications.</p>
      <div>
        <label>
          Name
          <input value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} />
        </label>
        <label>
          Age
          <input
            type="number"
            value={profile.age}
            onChange={(event) => setProfile({ ...profile, age: Number(event.target.value) })}
          />
        </label>
        <label>
          Height (cm)
          <input
            type="number"
            value={profile.heightCm}
            onChange={(event) => setProfile({ ...profile, heightCm: Number(event.target.value) })}
          />
        </label>
        <label>
          Weight (kg)
          <input
            type="number"
            value={profile.weightKg}
            onChange={(event) => setProfile({ ...profile, weightKg: Number(event.target.value) })}
          />
        </label>
        <label>
          Smoker
          <input
            type="checkbox"
            checked={profile.smoker}
            onChange={(event) => setProfile({ ...profile, smoker: event.target.checked })}
          />
        </label>
        <label>
          Notes
          <textarea
            value={profile.conditionsNotes}
            onChange={(event) => setProfile({ ...profile, conditionsNotes: event.target.value })}
          />
        </label>
        <label>
          Birth control
          <select
            value={profile.birthControlMethodId ?? ''}
            onChange={(event) => setProfile({ ...profile, birthControlMethodId: Number(event.target.value) || null })}
          >
            <option value="">Select method</option>
            {methods.map((method) => (
              <option key={method.id} value={method.id}>
                {method.name}
              </option>
            ))}
          </select>
        </label>
        <button type="button" onClick={saveProfile}>
          Save Profile
        </button>
        <p>{message}</p>
      </div>

      <h3>Current Medications</h3>
      <MedicationSearch onSelect={addMedication} placeholder="Add medication to profile" />
      <ul>
        {medications.map((medication) => (
          <li key={medication.id}>
            {medication.name}{' '}
            <button type="button" onClick={() => removeMedication(medication.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
