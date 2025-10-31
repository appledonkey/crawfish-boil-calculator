import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { CONFIG, SPICE_COLORS } from '../config/constants';
import { buildToupsBoilItems, buildAdvancedItems, formatQuantity } from '../utils/calculator';
import { getAmazonLink } from '../utils/amazon';
import { useSaveBoil } from '../hooks/useSaveBoil';
import { useLoadBoil } from '../hooks/useLoadBoil';

export function CrawfishCalculator() {
  const [mode, setMode] = useState('basic');
  const [style, setStyle] = useState('cajun');
  const [location, setLocation] = useState('louisiana');
  const [peopleCount, setPeopleCount] = useState(10);
  const [lbsPerPerson, setLbsPerPerson] = useState(3);
  const [spiceLevel, setSpiceLevel] = useState(2);
  const [totalCost, setTotalCost] = useState(0);
  const [shoppingList, setShoppingList] = useState([]);
  const [itemToggles, setItemToggles] = useState({});
  const [shareUrl, setShareUrl] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);

  const { saveBoil, saving } = useSaveBoil();

  const urlParams = new URLSearchParams(window.location.search);
  const shareToken = urlParams.get('share');
  const { boilData } = useLoadBoil(shareToken);

  useEffect(() => {
    document.documentElement.style.setProperty('--spice', SPICE_COLORS[spiceLevel]);
  }, [spiceLevel]);

  useEffect(() => {
    if (boilData) {
      setMode(boilData.mode);
      setStyle(boilData.style);
      setLocation(boilData.location);
      setPeopleCount(boilData.peopleCount);
      setLbsPerPerson(boilData.lbsPerPerson);
      setSpiceLevel(boilData.spiceLevel);
    }
  }, [boilData]);

  useEffect(() => {
    calculate();
  }, [mode, style, location, peopleCount, lbsPerPerson]);

  const calculate = () => {
    const params = { peopleCount, lbsPerPerson, location, style };

    if (mode === 'basic') {
      const result = buildToupsBoilItems(params);
      setShoppingList(result.items);
      setTotalCost(result.total);
    } else {
      const result = buildAdvancedItems(params);
      setShoppingList(result.items);
      setTotalCost(result.total);

      const toggles = {};
      result.items.forEach((item, idx) => {
        toggles[`${item.name}-${idx}`] = true;
      });
      setItemToggles(toggles);
    }
  };

  const toggleItem = (key) => {
    setItemToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getEnabledTotal = () => {
    if (mode === 'basic') return totalCost;

    return shoppingList.reduce((sum, item, idx) => {
      const key = `${item.name}-${idx}`;
      if (itemToggles[key]) {
        return sum + (item.qty * item.price);
      }
      return sum;
    }, 0);
  };

  const handleSaveAndShare = async () => {
    const result = await saveBoil({
      mode,
      style,
      location,
      peopleCount,
      lbsPerPerson,
      spiceLevel,
      totalCost: getEnabledTotal()
    });

    if (result.success) {
      const url = `${window.location.origin}${window.location.pathname}?share=${result.shareToken}`;
      setShareUrl(url);
      setShowShareModal(true);
    }
  };

  const copyShareUrl = () => {
    navigator.clipboard.writeText(shareUrl);
  };

  const crawfishLbs = peopleCount * lbsPerPerson;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-6xl ember-glow mb-4">
            Crawfish Boil Calculator
          </h1>
          <p className="text-gray-400 text-lg mb-4">
            Using Isaac Toups' Ratios - Plan your perfect Louisiana boil
          </p>
          <Button
            variant="primary"
            onClick={handleSaveAndShare}
            disabled={saving}
            className="mt-4"
          >
            {saving ? 'Saving...' : 'Save & Share This Boil'}
          </Button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent>
              <h3 className="font-display text-xl ember-text mb-4">Mode</h3>
              <div className="space-y-2">
                <Button
                  variant={mode === 'basic' ? 'primary' : 'default'}
                  onClick={() => setMode('basic')}
                  className="w-full"
                >
                  Basic Mode
                </Button>
                <Button
                  variant={mode === 'advanced' ? 'primary' : 'default'}
                  onClick={() => setMode('advanced')}
                  className="w-full"
                >
                  Advanced Mode
                </Button>
              </div>

              {mode === 'advanced' && (
                <div className="mt-4 space-y-2">
                  <Button
                    variant={style === 'cajun' ? 'primary' : 'default'}
                    onClick={() => setStyle('cajun')}
                    className="w-full"
                  >
                    Cajun Style
                  </Button>
                  <Button
                    variant={style === 'vietcajun' ? 'primary' : 'default'}
                    onClick={() => setStyle('vietcajun')}
                    className="w-full"
                  >
                    Viet-Cajun Style
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h3 className="font-display text-xl ember-text mb-4">Party Size</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Number of People: {peopleCount}
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    value={peopleCount}
                    onChange={(e) => setPeopleCount(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Pounds per Person: {lbsPerPerson}
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="5"
                    step="0.5"
                    value={lbsPerPerson}
                    onChange={(e) => setLbsPerPerson(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="pt-4 border-t border-gray-800">
                  <p className="text-center">
                    <span className="text-2xl font-bold ember-text">{crawfishLbs} lbs</span>
                    <br />
                    <span className="text-gray-400">Total Crawfish</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h3 className="font-display text-xl ember-text mb-4">Location & Spice</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Region</label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                  >
                    <option value="louisiana">Louisiana</option>
                    <option value="texas">Texas</option>
                    <option value="other">Other States</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Spice Level: {CONFIG.spiceLevels[spiceLevel].name}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="4"
                    value={spiceLevel}
                    onChange={(e) => setSpiceLevel(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="pt-4 border-t border-gray-800">
                  <p className="text-center">
                    <span className="text-3xl font-bold ember-text">
                      ${getEnabledTotal().toFixed(2)}
                    </span>
                    <br />
                    <span className="text-gray-400">Estimated Cost</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent>
            <h3 className="font-display text-2xl ember-text mb-6">Shopping List</h3>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    {mode === 'advanced' && <th className="text-left p-2">Select</th>}
                    <th className="text-left p-2">Item</th>
                    <th className="text-right p-2">Quantity</th>
                    <th className="text-right p-2">Unit Price</th>
                    <th className="text-right p-2">Total</th>
                    {mode === 'advanced' && <th className="text-center p-2">Buy</th>}
                  </tr>
                </thead>
                <tbody>
                  {shoppingList.map((item, idx) => {
                    const key = `${item.name}-${idx}`;
                    const enabled = mode === 'basic' || itemToggles[key];
                    const itemCost = item.qty * item.price;
                    const shouldShowAmazonLink = mode === 'advanced' &&
                      item.category &&
                      ['Cooking Gear & Setup', 'Serving & Cleanup', 'Entertainment & Comfort', 'Cleanup & Storage'].includes(item.category);

                    return (
                      <tr
                        key={key}
                        className={`border-b border-gray-800 ${!enabled ? 'opacity-50' : ''}`}
                      >
                        {mode === 'advanced' && (
                          <td className="p-2">
                            <input
                              type="checkbox"
                              checked={enabled}
                              onChange={() => toggleItem(key)}
                              className="w-4 h-4"
                            />
                          </td>
                        )}
                        <td className="p-2">{item.name}</td>
                        <td className="text-right p-2">
                          {formatQuantity(item.qty, item.unit)} {item.unit}
                        </td>
                        <td className="text-right p-2">${item.price.toFixed(2)}</td>
                        <td className="text-right p-2 font-bold">
                          ${itemCost.toFixed(2)}
                        </td>
                        {mode === 'advanced' && (
                          <td className="text-center p-2">
                            {shouldShowAmazonLink && (
                              <a
                                href={getAmazonLink(item.name)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ember-text hover:underline text-sm"
                              >
                                Buy
                              </a>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>
            As an Amazon Associate, we earn from qualifying purchases.
          </p>
          <p className="mt-2">
            Built with Isaac Toups' authentic Louisiana ratios
          </p>
        </footer>

        {showShareModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <Card className="max-w-md w-full">
              <CardContent>
                <h3 className="font-display text-2xl ember-text mb-4">Share Your Boil</h3>
                <p className="text-gray-400 mb-4">
                  Share this link with friends to show them your crawfish boil plan:
                </p>
                <div className="bg-gray-800 p-3 rounded mb-4 break-all text-sm">
                  {shareUrl}
                </div>
                <div className="flex gap-2">
                  <Button variant="primary" onClick={copyShareUrl} className="flex-1">
                    Copy Link
                  </Button>
                  <Button variant="outline" onClick={() => setShowShareModal(false)} className="flex-1">
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
