import { Language } from '../types';

export interface TrendingScheme {
    name: string;
    description: string;
    benefit: string;
    imageUrl: string;
}

const trendingSchemeData: Record<Language, TrendingScheme[]> = {
  [Language.EN]: [
    {
      name: 'PM Kisan Drone Yojana',
      description: 'Promoting the use of agricultural drones for precision farming, crop assessment, and pesticide spraying.',
      benefit: 'Increased efficiency and reduced manual labor.',
      imageUrl: 'https://th.bing.com/th/id/R.d5139ba6aae6084fe26bb796ddf89e8f?rik=vMYrDjI0hZvw5g&riu=http%3a%2f%2fdroneconnection.com.au%2fwp-content%2fuploads%2f2022%2f05%2fspraydrone.jpg&ehk=WH7pWD87wCL%2b9LygwlBNgSJTT9665O5TBtK05CxUhAo%3d&risl=&pid=ImgRaw&r=0'
    },
    {
      name: 'Agri-Solar Pump Scheme (KUSUM)',
      description: 'Providing subsidies to farmers for installing solar-powered irrigation pumps to reduce dependency on grid electricity.',
      benefit: 'Lower electricity costs and reliable water supply.',
      imageUrl: 'https://tse3.mm.bing.net/th/id/OIP.CTdWHGsco12Ub6N5SzSWtAHaEc?cb=thfc1&pid=ImgDet&w=184&h=110&c=7&dpr=1.3&o=7&rm=3'
    },
    {
      name: 'Digital Fasal Bima Portal (DigiClaim)',
      description: 'A new digital platform for farmers to file crop insurance claims directly and receive payments in a timely manner.',
      benefit: 'Faster claim settlement and increased transparency.',
      imageUrl: 'https://kj1bcdn.b-cdn.net/media/77291/pmfby.jpg'
    },
  ],
  [Language.KN]: [
    {
      name: 'ಪಿಎಂ ಕಿಸಾನ್ ಡ್ರೋನ್ ಯೋಜನೆ',
      description: 'ನಿಖರ ಕೃಷಿ, ಬೆಳೆ ಮೌಲ್ಯಮಾಪನ, ಮತ್ತು ಕೀಟನಾಶಕ ಸಿಂಪಡಣೆಗಾಗಿ ಕೃಷಿ ಡ್ರೋನ್‌ಗಳ ಬಳಕೆಯನ್ನು ಉತ್ತೇಜಿಸುವುದು.',
      benefit: 'ಹೆಚ್ಚಿದ ದಕ್ಷತೆ ಮತ್ತು ಕಡಿಮೆ ಮಾನವ ಶ್ರಮ.',
      imageUrl: 'https://th.bing.com/th/id/R.d5139ba6aae6084fe26bb796ddf89e8f?rik=vMYrDjI0hZvw5g&riu=http%3a%2f%2fdroneconnection.com.au%2fwp-content%2fuploads%2f2022%2f05%2fspraydrone.jpg&ehk=WH7pWD87wCL%2b9LygwlBNgSJTT9665O5TBtK05CxUhAo%3d&risl=&pid=ImgRaw&r=0'
    },
    {
      name: 'ಕೃಷಿ-ಸೌರ ಪಂಪ್ ಯೋಜನೆ (ಕುಸುಮ್)',
      description: 'ಗ್ರಿಡ್ ವಿದ್ಯುತ್ ಮೇಲಿನ ಅವಲಂಬನೆಯನ್ನು ಕಡಿಮೆ ಮಾಡಲು ಸೌರಶಕ್ತಿ ಚಾಲಿತ ನೀರಾವರಿ ಪಂಪ್‌ಗಳನ್ನು ಸ್ಥಾಪಿಸಲು ರೈತರಿಗೆ ಸಬ್ಸಿಡಿ ನೀಡುವುದು.',
      benefit: 'ಕಡಿಮೆ ವಿದ್ಯುತ್ ವೆಚ್ಚ ಮತ್ತು ವಿಶ್ವಾಸಾರ್ಹ ನೀರು ಸರಬರಾಜು.',
      imageUrl: 'https://tse3.mm.bing.net/th/id/OIP.CTdWHGsco12Ub6N5SzSWtAHaEc?cb=thfc1&pid=ImgDet&w=184&h=110&c=7&dpr=1.3&o=7&rm=3'
    },
    {
      name: 'ಡಿಜಿಟಲ್ ಫಸಲ್ ಬಿಮಾ ಪೋರ್ಟಲ್ (ಡಿಜಿಕ್ಲೇಮ್)',
      description: 'ರೈತರು ನೇರವಾಗಿ ಬೆಳೆ ವಿಮೆ ಕ್ಲೇಮ್‌ಗಳನ್ನು ಸಲ್ಲಿಸಲು ಮತ್ತು ಸಕಾಲಿಕವಾಗಿ ಪಾವತಿಗಳನ್ನು ಸ್ವೀಕರಿಸಲು ಒಂದು ಹೊಸ ಡಿಜಿಟಲ್ ವೇದಿಕೆ.',
      benefit: 'ವೇಗದ ಕ್ಲೇಮ್ ಇತ್ಯರ್ಥ ಮತ್ತು ಹೆಚ್ಚಿದ ಪಾರದರ್ಶಕತೆ.',
      imageUrl: 'https://kj1bcdn.b-cdn.net/media/77291/pmfby.jpg'
    },
  ]
};

export const getTrendingSchemes = (language: Language): TrendingScheme[] => {
    return trendingSchemeData[language] || trendingSchemeData[Language.EN];
};