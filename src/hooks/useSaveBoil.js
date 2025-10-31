import { useState } from 'react';
import { supabase } from '../lib/supabase';

export function useSaveBoil() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const saveBoil = async (data) => {
    setSaving(true);
    setError(null);

    try {
      const { data: savedBoil, error: saveError } = await supabase
        .from('saved_boils')
        .insert([
          {
            name: data.name || 'My Crawfish Boil',
            mode: data.mode,
            style: data.style,
            location: data.location,
            people_count: data.peopleCount,
            lbs_per_person: data.lbsPerPerson,
            spice_level: data.spiceLevel,
            total_cost: data.totalCost
          }
        ])
        .select()
        .single();

      if (saveError) throw saveError;

      setSaving(false);
      return { success: true, shareToken: savedBoil.share_token, id: savedBoil.id };
    } catch (err) {
      console.error('Error saving boil:', err);
      setError(err.message);
      setSaving(false);
      return { success: false, error: err.message };
    }
  };

  return { saveBoil, saving, error };
}
