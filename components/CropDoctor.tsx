


import React, { useState, useCallback } from 'react';
import { diagnoseCrop } from '../services/geminiService';
import Card from './common/Card';
import Button from './common/Button';
import Spinner from './common/Spinner';
import { UploadIcon } from './icons/UploadIcon';
import { LeafIcon } from './icons/LeafIcon';
import { BeakerIcon } from './icons/BeakerIcon';
import { useLanguage } from '../LanguageContext';
import { analyticsService } from '../services/analyticsService';
import { useAuth } from '../AuthContext';
import { Feature } from '../types';
import { getCommonDiseases, DiseaseInfo } from '../services/diseaseService';


interface Remedy {
  organic: string[];
  chemical: string[];
}

interface AnalysisResult {
  cropName: string;
  isHealthy: boolean;
  disease: string;
  remedies: Remedy;
  error?: string;
}

const DiseaseCard: React.FC<{ disease: DiseaseInfo }> = ({ disease }) => {
    const { translate } = useLanguage();
    const [activeTab, setActiveTab] = useState<'organic' | 'chemical'>('organic');

    return (
        <div className="flex-shrink-0 w-80 bg-white dark:bg-slate-900/80 rounded-2xl shadow-xl dark:shadow-none overflow-hidden snap-start border dark:border-slate-800 transition-transform transform hover:-translate-y-1">
            <img src={disease.imageUrl} alt={disease.name} className="w-full h-40 object-cover" />
            <div className="p-4 flex flex-col h-[calc(100%-10rem)]">
                <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100">{disease.name}</h4>
                <p className="text-sm font-semibold text-primary mb-2">{disease.crop}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 text-ellipsis overflow-hidden mb-3" style={{ flexBasis: '5rem' }}>{disease.symptoms}</p>
                
                <div className="mt-auto">
                    <div className="mb-2 flex border-b border-slate-200 dark:border-slate-700">
                        <button 
                            onClick={() => setActiveTab('organic')} 
                            className={`px-3 py-2 text-sm font-semibold flex-1 transition-colors ${activeTab === 'organic' ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600' : 'text-slate-500 hover:text-green-500'}`}
                        >
                            {translate('remediesOrganic')}
                        </button>
                        <button 
                            onClick={() => setActiveTab('chemical')} 
                            className={`px-3 py-2 text-sm font-semibold flex-1 transition-colors ${activeTab === 'chemical' ? 'text-amber-600 dark:text-amber-400 border-b-2 border-amber-600' : 'text-slate-500 hover:text-amber-500'}`}
                        >
                            {translate('remediesChemical')}
                        </button>
                    </div>
                    
                    <div className="text-xs text-slate-700 dark:text-slate-300 overflow-auto" style={{ height: '6rem' }}>
                        {disease[activeTab]}
                    </div>
                </div>
            </div>
        </div>
    );
};

const CommonDiseasesSection: React.FC = () => {
    const { language, translate } = useLanguage();
    const commonDiseases = getCommonDiseases(language);
    const title = translate('commonDiseasesTitle');

    if (!Array.isArray(commonDiseases) || commonDiseases.length === 0) {
        return null;
    }

    return (
        <div className="mt-16">
            <div className="border-t border-slate-200 dark:border-slate-800 my-8"></div>
            <h3 className="text-2xl font-bold text-primary mb-6 text-center">{title}</h3>
            <div className="flex gap-6 pb-4 -mx-4 px-4 overflow-x-auto snap-x snap-mandatory">
                {commonDiseases.map((disease, index) => (
                    <DiseaseCard key={index} disease={disease} />
                ))}
            </div>
        </div>
    );
};

const CropDoctor: React.FC = () => {
  const { language, translate } = useLanguage();
  const { user } = useAuth();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setAnalysis(null);
      setError('');
    }
  };

  const handleAnalyze = useCallback(async () => {
    if (!imageFile || !user?.email) {
      setError(translate('uploadError'));
      return;
    }
    setIsLoading(true);
    setError('');
    setAnalysis(null);
    try {
      const resultJson = await diagnoseCrop(imageFile, language);
      const result: AnalysisResult = JSON.parse(resultJson);
      if (result.error) {
        setError(result.error);
      } else {
        setAnalysis(result);
        analyticsService.logFeatureUse(Feature.CROP_DOCTOR, user.email);
      }
    } catch (err) {
      setError(translate('aiParsingError'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [imageFile, language, translate, user]);

  const renderRemedies = (remedies: Remedy) => (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {(remedies.organic?.length > 0) && (
        <div className="bg-green-50 dark:bg-slate-800 p-4 rounded-lg border border-green-200 dark:border-green-800">
          <h4 className="font-semibold text-green-700 dark:text-green-300 flex items-center gap-2">
            <LeafIcon className="w-5 h-5" />
            {translate('remediesOrganic')}
          </h4>
          <ul className="mt-2 list-disc list-inside text-slate-700 dark:text-slate-300 pl-2 space-y-1">
            {remedies.organic.map((item, i) => <li key={`org-${i}`}>{item}</li>)}
          </ul>
        </div>
      )}
      {(remedies.chemical?.length > 0) && (
        <div className="bg-amber-50 dark:bg-slate-800 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
          <h4 className="font-semibold text-amber-700 dark:text-amber-300 flex items-center gap-2">
             <BeakerIcon className="w-5 h-5" />
             {translate('remediesChemical')}
          </h4>
          <ul className="mt-2 list-disc list-inside text-slate-700 dark:text-slate-300 pl-2 space-y-1">
            {remedies.chemical.map((item, i) => <li key={`chem-${i}`}>{item}</li>)}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <Card>
      <h2 className="text-3xl font-bold text-primary mb-4 text-center">{translate('cropDoctorTitle')}</h2>
      <p className="text-center text-slate-500 dark:text-slate-400 mb-8 text-lg">{translate('cropDoctorDescription')}</p>
      
      <div className="flex flex-col items-center gap-6">
        <label htmlFor="file-upload" className="cursor-pointer w-full max-w-md">
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 sm:p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <UploadIcon className="mx-auto h-12 w-12 text-primary" />
            <p className="mt-2 font-semibold text-primary-dark">
              {imageFile ? translate('changeImage') : translate('clickToUpload')}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{imageFile ? imageFile.name : translate('fileTypes')}</p>
          </div>
          <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/png, image/jpeg" onChange={handleFileChange} />
        </label>

        {previewUrl && (
          <div className="w-full max-w-sm rounded-lg overflow-hidden border-4 border-slate-200 dark:border-slate-700 shadow-lg">
            <img src={previewUrl} alt="Crop preview" className="w-full h-auto object-cover" />
          </div>
        )}

        <Button onClick={handleAnalyze} disabled={isLoading || !imageFile}>
          {isLoading ? <Spinner /> : translate('analyzeButton')}
        </Button>

        {error && <p className="text-red-600 font-semibold text-center">{error}</p>}
        
        {analysis && (
          <div className="mt-6 w-full bg-slate-100 dark:bg-slate-800/60 p-6 rounded-xl shadow-inner border border-slate-200 dark:border-slate-700">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4 text-center">{translate('analysisFor').replace('{cropName}', analysis.cropName)}</h3>
            <div
              className={`p-4 rounded-lg text-center font-bold text-lg ${
                analysis.isHealthy
                  ? 'bg-green-100 dark:bg-green-900/60 text-green-800 dark:text-green-200'
                  : 'bg-red-100 dark:bg-red-900/60 text-red-800 dark:text-red-200'
              }`}
            >
              {analysis.disease}
            </div>

            {!analysis.isHealthy && renderRemedies(analysis.remedies)}
          </div>
        )}
      </div>

      <CommonDiseasesSection />
    </Card>
  );
};

export default CropDoctor;