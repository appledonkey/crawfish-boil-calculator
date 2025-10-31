import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useLoadBoil(shareToken) {
  const [loading, setLoading] = useState(false);
  const [boilData, setBoilData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!shareToken) return;

    const loadBoil = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: loadError } = await supabase
          .from('saved_boils')
          .select('*')
          .eq('share_token', shareToken)
          .maybeSingle();

        if (loadError) throw loadError;

        if (data) {
          setBoilData({
            name: data.name,
            mode: data.mode,
            style: data.style,
            location: data.location,
            peopleCount: data.people_count,
            lbsPerPerson: parseFloat(data.lbs_per_person),
            spiceLevel: data.spice_level,
            totalCost: parseFloat(data.total_cost)
          });
        } else {
          setError('Boil not found');
        }

        setLoading(false);
      } catch (err) {
        console.error('Error loading boil:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadBoil();
  }, [shareToken]);

  return { loading, boilData, error };
}
