
import { Language } from '../types';

export interface DiseaseInfo {
    name: string;
    crop: string;
    symptoms: string;
    organic: string;
    chemical: string;
    imageUrl: string;
}

const diseaseData: Record<Language, DiseaseInfo[]> = {
  [Language.EN]: [
    {
      name: 'Powdery Mildew',
      crop: 'Grapes, Mango, Peas',
      symptoms: 'Displays as white, powdery spots on leaves, stems, and sometimes flowers and fruit. Infected leaves may yellow, distort, and drop prematurely.',
      organic: 'Spray with a solution of neem oil or potassium bicarbonate. Improve air circulation by pruning.',
      chemical: 'Use fungicides containing sulfur, myclobutanil, or tebuconazole. Apply at first sign of disease.',
      imageUrl: 'https://live.staticflickr.com/5186/5684228999_7b12201e53_b.jpg'
    },
    {
      name: 'Early Blight',
      crop: 'Tomato, Potato',
      symptoms: 'Begins as small, dark brown to black spots on lower leaves, often with a "bulls-eye" pattern. Yellow tissue usually surrounds the spots.',
      organic: 'Remove and destroy affected leaves. Use organic fungicides with Bacillus subtilis. Practice crop rotation.',
      chemical: 'Apply fungicides containing chlorothalonil or mancozeb as a preventive measure, especially in humid weather.',
      imageUrl: 'https://tse2.mm.bing.net/th/id/OIP.fm32O9O4VAtELmUAdQFByAHaE6?cb=thfc1&rs=1&pid=ImgDetMain&o=7&rm=3'
    },
    {
      name: 'Rice Blast',
      crop: 'Rice',
      symptoms: 'Diamond-shaped lesions with gray or white centers and brown borders on leaves. Can also affect collar, neck, and panicles, causing significant yield loss.',
      organic: 'Use resistant rice varieties. Manage nitrogen fertilizer application to avoid excess. Maintain proper water levels.',
      chemical: 'Use fungicides like tricyclazole or isoprothiolane. Seed treatment can also be effective.',
      imageUrl: 'https://www.dpi.nsw.gov.au/__data/assets/image/0012/798762/RiceBlast4.jpg'
    },
    {
      name: 'Citrus Canker',
      crop: 'Citrus (Lemon, Orange)',
      symptoms: 'Raised, brownish, corky lesions on leaves, fruit, and stems. Lesions are often surrounded by a yellow halo.',
      organic: 'Prune and destroy infected branches. Use copper-based sprays as a protectant before rainy seasons.',
      chemical: 'Application of copper-based bactericides is the primary chemical control method.',
      imageUrl: 'https://morningchores.com/wp-content/uploads/2021/06/citrus-canker.jpg'
    }
  ],
  [Language.KN]: [
    {
      name: 'ಬೂದು ರೋಗ',
      crop: 'ದ್ರಾಕ್ಷಿ, ಮಾವು, ಬಟಾಣಿ',
      symptoms: 'ಎಲೆಗಳು, ಕಾಂಡಗಳು ಮತ್ತು ಕೆಲವೊಮ್ಮೆ ಹೂವು ಮತ್ತು ಹಣ್ಣುಗಳ ಮೇಲೆ ಬಿಳಿ, ಪುಡಿಯಂತಹ ಚುಕ್ಕೆಗಳಾಗಿ ಕಾಣಿಸಿಕೊಳ್ಳುತ್ತದೆ. ಸೋಂಕಿತ ಎಲೆಗಳು ಹಳದಿ ಬಣ್ಣಕ್ಕೆ ತಿರುಗಿ, ವಿರೂಪಗೊಂಡು, ಅಕಾಲಿಕವಾಗಿ ಉದುರಬಹುದು.',
      organic: 'ಬೇವಿನ ಎಣ್ಣೆ ಅಥವಾ ಪೊಟ್ಯಾಸಿಯಮ್ ಬೈಕಾರ್ಬನೇಟ್ ದ್ರಾವಣವನ್ನು ಸಿಂಪಡಿಸಿ. ಸಸ್ಯಗಳನ್ನು ಕತ್ತರಿಸುವ ಮೂಲಕ ಗಾಳಿಯ ಸಂಚಾರವನ್ನು ಸುಧಾರಿಸಿ.',
      chemical: 'ಸಲ್ಫರ್, ಮೈಕ್ಲೋಬ್ಯುಟಾನಿಲ್, ಅಥವಾ ಟೆಬುಕೊನಜೋಲ್ ಹೊಂದಿರುವ ಶಿಲೀಂಧ್ರನಾಶಕಗಳನ್ನು ಬಳಸಿ. ರೋಗದ ಮೊದಲ ಚಿಹ್ನೆಯಲ್ಲಿ ಅನ್ವಯಿಸಿ.',
      imageUrl: 'https://live.staticflickr.com/5186/5684228999_7b12201e53_b.jpg'
    },
    {
      name: 'ಮುಂಚಿತ ಅಂಗಮಾರಿ',
      crop: 'ಟೊಮ್ಯಾಟೊ, ಆಲೂಗಡ್ಡೆ',
      symptoms: 'ಕೆಳಗಿನ ಎಲೆಗಳ ಮೇಲೆ ಸಣ್ಣ, ಕಂದು ಬಣ್ಣದಿಂದ ಕಪ್ಪು ಚುಕ್ಕೆಗಳಾಗಿ ಪ್ರಾರಂಭವಾಗುತ್ತದೆ, ಸಾಮಾನ್ಯವಾಗಿ "ಬುಲ್ಸ್-ಐ" ಮಾದರಿಯನ್ನು ಹೊಂದಿರುತ್ತದೆ. ಹಳದಿ ಅಂಗಾಂಶವು ಸಾಮಾನ್ಯವಾಗಿ ಚುಕ್ಕೆಗಳನ್ನು ಸುತ್ತುವರೆದಿರುತ್ತದೆ.',
      organic: 'ಸೋಂಕಿತ ಎಲೆಗಳನ್ನು ತೆಗೆದು ನಾಶಮಾಡಿ. ಬ್ಯಾಸಿಲಸ್ ಸಬ್ಟಿಲಿಸ್ ಹೊಂದಿರುವ ಸಾವಯವ ಶಿಲೀಂಧ್ರನಾಶಕಗಳನ್ನು ಬಳಸಿ. ಬೆಳೆ ಸರದಿ ಪದ್ಧತಿಯನ್ನು ಅನುಸರಿಸಿ.',
      chemical: 'ಕ್ಲೋರೋಥಲೋನಿಲ್ ಅಥವಾ ಮ್ಯಾಂಕೋಜೆಬ್ ಹೊಂದಿರುವ ಶಿಲೀಂಧ್ರನಾಶಕಗಳನ್ನು ತಡೆಗಟ್ಟುವ ಕ್ರಮವಾಗಿ, ವಿಶೇಷವಾಗಿ ತೇವಾಂಶವುಳ್ಳ ವಾತಾವರಣದಲ್ಲಿ ಅನ್ವಯಿಸಿ.',
      imageUrl: 'https://tse2.mm.bing.net/th/id/OIP.fm32O9O4VAtELmUAdQFByAHaE6?cb=thfc1&rs=1&pid=ImgDetMain&o=7&rm=3'
    },
    {
      name: 'ಭತ್ತದ ಬೆಂಕಿ ರೋಗ',
      crop: 'ಭತ್ತ',
      symptoms: 'ಎಲೆಗಳ ಮೇಲೆ ಬೂದು ಅಥವಾ ಬಿಳಿ ಕೇಂದ್ರಗಳು ಮತ್ತು ಕಂದು ಅಂಚುಗಳೊಂದಿಗೆ ವಜ್ರಾಕಾರದ ಗಾಯಗಳು. ಇದು ಕಾಂಡ, ಕುತ್ತಿಗೆ ಮತ್ತು ತೆನೆಗಳ ಮೇಲೂ ಪರಿಣಾಮ ಬೀರಬಹುದು, ಇದರಿಂದ ಇಳುವರಿಯಲ್ಲಿ ಗಮನಾರ್ಹ ನಷ್ಟವಾಗುತ್ತದೆ.',
      organic: 'ರೋಗ ನಿರೋಧಕ ಭತ್ತದ ತಳಿಗಳನ್ನು ಬಳಸಿ. ಅಧಿಕ ಸಾರಜನಕ ಗೊಬ್ಬರದ ಬಳಕೆಯನ್ನು ತಪ್ಪಿಸಿ. ಸರಿಯಾದ ನೀರಿನ ಮಟ್ಟವನ್ನು ಕಾಪಾಡಿಕೊಳ್ಳಿ.',
      chemical: 'ಟ್ರೈಸೈಕ್ಲಾಝೋಲ್ ಅಥವಾ ಐಸೊಪ್ರೊಥಿಯೋಲೇನ್‌ನಂತಹ ಶಿಲೀಂಧ್ರನಾಶಕಗಳನ್ನು ಬಳಸಿ. ಬೀಜೋಪಚಾರವೂ ಪರಿಣಾಮಕಾರಿಯಾಗಿರಬಹುದು.',
      imageUrl: 'https://www.dpi.nsw.gov.au/__data/assets/image/0012/798762/RiceBlast4.jpg'
    },
    {
      name: 'ಸಿಟ್ರಸ್ ಕ್ಯಾಂಕರ್',
      crop: 'ಸಿಟ್ರಸ್ (ನಿಂಬೆ, ಕಿತ್ತಳೆ)',
      symptoms: 'ಎಲೆಗಳು, ಹಣ್ಣುಗಳು ಮತ್ತು ಕಾಂಡಗಳ ಮೇಲೆ ಉಬ್ಬಿದ, ಕಂದು ಬಣ್ಣದ, ಕಾರ್ಕ್‌ನಂತಹ ಗಾಯಗಳು. ಗಾಯಗಳು ಸಾಮಾನ್ಯವಾಗಿ ಹಳದಿ ವರ್ತುಲದಿಂದ ಸುತ್ತುವರೆದಿರುತ್ತವೆ.',
      organic: 'ಸೋಂಕಿತ ಕೊಂಬೆಗಳನ್ನು ಕತ್ತರಿಸಿ ನಾಶಮಾಡಿ. ಮಳೆಗಾಲದ ಮೊದಲು ರಕ್ಷಕವಾಗಿ ತಾಮ್ರ ಆಧಾರಿತ ಸಿಂಪರಣೆಗಳನ್ನು ಬಳಸಿ.',
      chemical: 'ತಾಮ್ರ ಆಧಾರಿತ ಬ್ಯಾಕ್ಟೀರಿಯಾನಾಶಕಗಳ ಅನ್ವಯವು ಪ್ರಾಥಮಿಕ ರಾಸಾಯನಿಕ ನಿಯಂತ್ರಣ ವಿಧಾನವಾಗಿದೆ.',
      imageUrl: 'https://morningchores.com/wp-content/uploads/2021/06/citrus-canker.jpg'
    }
  ]
};

export const getCommonDiseases = (language: Language): DiseaseInfo[] => {
    return diseaseData[language] || diseaseData[Language.EN];
};
