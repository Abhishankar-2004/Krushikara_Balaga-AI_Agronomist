
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  id: string;
  cropName: string;
  isHealthy: boolean;
  disease: string;
  remedies: Remedy;
  error?: string;
  fileName: string;
}

const DiseaseCard: React.FC<{ disease: DiseaseInfo }> = ({ disease }) => {
    const { translate } = useLanguage();
    const [activeTab, setActiveTab] = useState<'organic' | 'chemical'>('organic');

    return (
        <motion.div 
            whileHover={{ y: -5 }}
            className="flex-shrink-0 w-80 bg-white dark:bg-slate-900/80 rounded-2xl shadow-xl dark:shadow-none overflow-hidden snap-start border dark:border-slate-800 transition-all"
        >
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
                    
                    <div className="text-xs text-slate-700 dark:text-slate-300 overflow-auto h-24">
                        {disease[activeTab]}
                    </div>
                </div>
            </div>
        </motion.div>
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
            <div className="flex gap-6 pb-4 -mx-4 px-4 overflow-x-auto snap-x snap-mandatory no-scrollbar">
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
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setImageFiles(files);
      setPreviewUrls(files.map(file => URL.createObjectURL(file)));
      setAnalyses([]);
      setError('');
    }
  };

  const handleAnalyze = useCallback(async () => {
    if (imageFiles.length === 0 || !user?.email) {
      setError(translate('uploadError'));
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setAnalyses([]);
    setProgress({ current: 0, total: imageFiles.length });

    const results: AnalysisResult[] = [];

    for (let i = 0; i < imageFiles.length; i++) {
        setProgress(prev => ({ ...prev, current: i + 1 }));
        const file = imageFiles[i];
        try {
            const resultJson = await diagnoseCrop(file, language);
            const result = JSON.parse(resultJson);
            if (result.error) {
                results.push({ ...result, id: `${Date.now()}-${i}`, fileName: file.name, cropName: 'Unknown', isHealthy: false, disease: 'Error', remedies: { organic: [], chemical: [] } });
            } else {
                results.push({ ...result, id: `${Date.now()}-${i}`, fileName: file.name });
            }
        } catch (err) {
            console.error(err);
            results.push({ id: `${Date.now()}-${i}`, fileName: file.name, cropName: 'Error', isHealthy: false, disease: translate('aiParsingError'), remedies: { organic: [], chemical: [] } });
        }
    }

    setAnalyses(results);
    analyticsService.logFeatureUse(Feature.CROP_DOCTOR, user.email);
    setIsAnalyzing(false);
  }, [imageFiles, language, translate, user]);

  const renderRemedies = (remedies: Remedy) => (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
      {(remedies.organic?.length > 0) && (
        <div className="bg-green-50 dark:bg-slate-800 p-3 rounded-lg border border-green-200 dark:border-green-800">
          <h4 className="font-semibold text-green-700 dark:text-green-300 flex items-center gap-2 text-sm">
            <LeafIcon className="w-4 h-4" />
            {translate('remediesOrganic')}
          </h4>
          <ul className="mt-1 list-disc list-inside text-slate-700 dark:text-slate-300 pl-1 space-y-0.5 text-xs">
            {remedies.organic.map((item, i) => <li key={`org-${i}`}>{item}</li>)}
          </ul>
        </div>
      )}
      {(remedies.chemical?.length > 0) && (
        <div className="bg-amber-50 dark:bg-slate-800 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
          <h4 className="font-semibold text-amber-700 dark:text-amber-300 flex items-center gap-2 text-sm">
             <BeakerIcon className="w-4 h-4" />
             {translate('remediesChemical')}
          </h4>
          <ul className="mt-1 list-disc list-inside text-slate-700 dark:text-slate-300 pl-1 space-y-0.5 text-xs">
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
        <label htmlFor="file-upload" className="cursor-pointer w-full max-w-xl">
          <motion.div 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <UploadIcon className="mx-auto h-12 w-12 text-primary" />
            <p className="mt-2 font-bold text-primary-dark text-lg">
              {imageFiles.length > 0 ? `${imageFiles.length} ${translate('changeImage')}` : translate('clickToUpload')}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-widest">{translate('fileTypes')}</p>
          </motion.div>
          <input 
            id="file-upload" 
            name="file-upload" 
            type="file" 
            className="sr-only" 
            multiple 
            accept="image/png, image/jpeg" 
            onChange={handleFileChange} 
          />
        </label>

        <AnimatePresence>
            {previewUrls.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full overflow-hidden"
              >
                <div className="flex gap-4 overflow-x-auto py-4 no-scrollbar">
                    {previewUrls.map((url, idx) => (
                        <motion.div 
                            key={url}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-md relative group"
                        >
                            <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-white text-[10px] font-bold px-2 text-center truncate">{imageFiles[idx]?.name}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
              </motion.div>
            )}
        </AnimatePresence>

        <Button onClick={handleAnalyze} disabled={isAnalyzing || imageFiles.length === 0} className="min-w-[200px]">
          {isAnalyzing ? (
            <div className="flex items-center gap-3">
                <Spinner />
                <span>{progress.current} / {progress.total}</span>
            </div>
          ) : translate('analyzeButton')}
        </Button>

        {error && <p className="text-red-600 font-semibold text-center">{error}</p>}
        
        <div className="w-full space-y-6 mt-4">
            <AnimatePresence>
                {analyses.map((result, idx) => (
                    <motion.div 
                        key={result.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.15 }}
                        className="w-full bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl shadow-inner border border-slate-200 dark:border-slate-700"
                    >
                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="w-full sm:w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden shadow-md">
                                <img src={previewUrls[idx]} alt="Crop" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-grow">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                                        {translate('analysisFor').replace('{cropName}', result.cropName)}
                                    </h3>
                                    <span className="text-[10px] text-slate-400 font-mono">{result.fileName}</span>
                                </div>
                                
                                <div
                                className={`inline-block px-3 py-1 rounded-full font-bold text-xs mb-3 ${
                                    result.isHealthy
                                    ? 'bg-green-100 dark:bg-green-900/60 text-green-800 dark:text-green-200'
                                    : 'bg-red-100 dark:bg-red-900/60 text-red-800 dark:text-red-200'
                                }`}
                                >
                                {result.disease}
                                </div>

                                {!result.isHealthy && result.remedies && renderRemedies(result.remedies)}
                                {result.error && <p className="text-red-500 text-sm italic">{result.error}</p>}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
      </div>

      <CommonDiseasesSection />
    </Card>
  );
};

export default CropDoctor;
