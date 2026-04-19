

import React, { useState, useCallback } from 'react';
import { getFertilizerRecommendation, FertilizerRecommendation } from '../services/geminiService';
import { useLanguage } from '../LanguageContext';
import Card from './common/Card';
import Button from './common/Button';
import Spinner from './common/Spinner';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { BeakerIcon } from './icons/BeakerIcon';
import { analyticsService } from '../services/analyticsService';
import { useAuth } from '../AuthContext';
import { Feature } from '../types';
import { ScienceIcon } from './icons/ScienceIcon';

const FertilizerInfoCard: React.FC<{ name: string, nutrients: string, description: string }> = ({ name, nutrients, description }) => (
    <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl shadow-lg dark:shadow-none border dark:border-slate-800 flex flex-col h-full card-enter">
        <h4 className="text-xl font-bold text-primary">{name}</h4>
        <p className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-2">{nutrients}</p>
        <p className="text-slate-600 dark:text-slate-300 text-base flex-grow">{description}</p>
    </div>
);

const CommonFertilizersInfo: React.FC = () => {
    const { translate } = useLanguage();

    const fertilizers = [
        { name: translate('ureaName'), nutrients: translate('ureaNutrients'), description: translate('ureaDescription') },
        { name: translate('dapName'), nutrients: translate('dapNutrients'), description: translate('dapDescription') },
        { name: translate('mopName'), nutrients: translate('mopNutrients'), description: translate('mopDescription') },
    ];

    return (
        <div className="mt-16 w-full max-w-4xl mx-auto">
            <div className="border-t border-slate-200 dark:border-slate-800 my-8"></div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-8 text-center flex items-center justify-center gap-3">
                <ScienceIcon className="w-7 h-7 text-primary"/>
                {translate('fertilizerInfoTitle')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {fertilizers.map((fert, index) => (
                    <FertilizerInfoCard key={index} name={fert.name} nutrients={fert.nutrients} description={fert.description} />
                ))}
            </div>
        </div>
    );
};

const FertilizerCalculator: React.FC = () => {
  const { language, translate } = useLanguage();
  const { user } = useAuth();
  const [crop, setCrop] = useState('');
  const [area, setArea] = useState('');
  const [unit, setUnit] = useState('acre');
  const [npk, setNpk] = useState({ n: '', p: '', k: '' });
  const [recommendation, setRecommendation] = useState<FertilizerRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCalculate = useCallback(async () => {
    if (!crop.trim() || !area.trim() || !user?.email) {
      setError(translate('calculationError'));
      return;
    }
    setIsLoading(true);
    setError('');
    setRecommendation(null);

    const areaNum = parseFloat(area);
    const npkData = (npk.n && npk.p && npk.k) 
      ? { n: parseFloat(npk.n), p: parseFloat(npk.p), k: parseFloat(npk.k) }
      : undefined;

    try {
      const resultJson = await getFertilizerRecommendation(crop, areaNum, unit, language, npkData);
      const result: FertilizerRecommendation = JSON.parse(resultJson);
      if (result.error) {
        setError(result.error);
      } else {
        setRecommendation(result);
        analyticsService.logFeatureUse(Feature.FERTILIZER_CALCULATOR, user.email);
      }
    } catch (err) {
      setError(translate('aiParsingError'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [crop, area, unit, npk, language, translate, user]);

  const handleNpkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNpk(prev => ({ ...prev, [name]: value }));
  };
  
  const inputClasses = "mt-1 block w-full px-3 py-2 text-base bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition";
  const labelClasses = "block text-sm font-medium text-slate-700 dark:text-slate-300";


  return (
    <>
        <Card>
          <h2 className="text-3xl font-bold text-primary mb-4 text-center">{translate('fertilizerCalculatorTitle')}</h2>
          <p className="text-center text-slate-500 dark:text-slate-400 mb-8 text-lg max-w-2xl mx-auto">{translate('fertilizerCalculatorDescription')}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 max-w-3xl mx-auto">
            {/* Left Column: Inputs */}
            <div className="space-y-4">
              <div>
                <label htmlFor="crop" className={labelClasses}>{translate('cropNameLabel')}</label>
                <input type="text" id="crop" value={crop} onChange={e => setCrop(e.target.value)} placeholder={translate('cropNamePlaceholder')} className={inputClasses} />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                    <label htmlFor="area" className={labelClasses}>{translate('landAreaLabel')}</label>
                    <input type="number" id="area" value={area} onChange={e => setArea(e.target.value)} placeholder={translate('landAreaPlaceholder')} className={inputClasses} />
                </div>
                <div>
                     <label htmlFor="unit" className={labelClasses}>{translate('unitLabel')}</label>
                     <select id="unit" value={unit} onChange={e => setUnit(e.target.value)} className={inputClasses}>
                        <option value="acre">Acre</option>
                        <option value="hectare">Hectare</option>
                     </select>
                </div>
              </div>
            </div>

            {/* Right Column: Optional Inputs */}
            <div className="bg-amber-50/60 dark:bg-slate-800/70 p-4 rounded-xl border border-amber-200 dark:border-amber-900/60">
                <h3 className="font-semibold text-amber-800 dark:text-amber-200">{translate('soilTestOptionalLabel')}</h3>
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                    <div>
                        <label htmlFor="n" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{translate('nLabel')}</label>
                        <input type="number" name="n" id="n" value={npk.n} onChange={handleNpkChange} className="mt-1 block w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-primary focus:border-primary text-sm transition" />
                    </div>
                     <div>
                        <label htmlFor="p" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{translate('pLabel')}</label>
                        <input type="number" name="p" id="p" value={npk.p} onChange={handleNpkChange} className="mt-1 block w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-primary focus:border-primary text-sm transition" />
                    </div>
                     <div>
                        <label htmlFor="k" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{translate('kLabel')}</label>
                        <input type="number" name="k" id="k" value={npk.k} onChange={handleNpkChange} className="mt-1 block w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-primary focus:border-primary text-sm transition" />
                    </div>
                 </div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Button onClick={handleCalculate} disabled={isLoading}>
              {isLoading ? <Spinner /> : translate('calculateButton')}
            </Button>
            {error && <p className="text-red-600 font-semibold mt-4">{error}</p>}
          </div>

          {recommendation && (
            <div className="mt-8 w-full bg-slate-100 dark:bg-slate-800/60 p-4 sm:p-6 rounded-xl shadow-inner border border-slate-200 dark:border-slate-700 space-y-6">
                <h3 className="text-lg sm:text-xl font-bold text-primary-dark dark:text-primary-light text-center">{translate('recommendationTitle')}</h3>

                <div className="bg-green-50 dark:bg-slate-800 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <h4 className="font-semibold text-green-800 dark:text-green-200 text-center mb-3">
                        {translate('totalNutrientsRequired').replace('{area}', String(recommendation.area)).replace('{unit}', recommendation.unit)}
                    </h4>
                    <div className="flex justify-around text-center">
                        <div>
                            <p className="text-sm text-slate-600 dark:text-slate-300">{translate('nitrogen')}</p>
                            <p className="font-bold text-xl sm:text-3xl text-primary-dark dark:text-green-300">{recommendation.recommendation.n.toFixed(2)} <span className="text-base font-normal">{translate('kgUnit')}</span></p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-600 dark:text-slate-300">{translate('phosphorus')}</p>
                            <p className="font-bold text-xl sm:text-3xl text-primary-dark dark:text-green-300">{recommendation.recommendation.p.toFixed(2)} <span className="text-base font-normal">{translate('kgUnit')}</span></p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-600 dark:text-slate-300">{translate('potassium')}</p>
                            <p className="font-bold text-xl sm:text-3xl text-primary-dark dark:text-green-300">{recommendation.recommendation.k.toFixed(2)} <span className="text-base font-normal">{translate('kgUnit')}</span></p>
                        </div>
                    </div>
                </div>

                <div className="bg-amber-50 dark:bg-slate-800 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                    <h4 className="font-semibold text-amber-800 dark:text-amber-200 flex items-center gap-2 mb-2">
                      <LightbulbIcon className="w-5 h-5" />
                      {translate('applicationNotes')}
                    </h4>
                    <p className="text-sm text-slate-700 dark:text-slate-300">{recommendation.applicationNotes}</p>
                </div>
                
                <div className="bg-blue-50 dark:bg-slate-800 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 flex items-center gap-2 mb-2">
                      <BeakerIcon className="w-5 h-5" />
                      {translate('commonFertilizers')}
                    </h4>
                    <p className="text-sm text-slate-700 dark:text-slate-300">{recommendation.commonFertilizers}</p>
                </div>
            </div>
          )}
        </Card>
        <CommonFertilizersInfo />
    </>
  );
};

export default FertilizerCalculator;